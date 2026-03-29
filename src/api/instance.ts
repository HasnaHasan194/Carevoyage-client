import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";
import toast from "react-hot-toast";
import { ROUTES } from "@/config/env";

const rawBase = import.meta.env.VITE_API_BASE_URL as string | undefined;
const baseURL =
  rawBase?.endsWith("/api/v1")
    ? rawBase
    : rawBase
      ? `${rawBase.replace(/\/$/, "")}/api/v1`
      : "http://localhost:3000/api/v1";

export const CareVoyageBackend = axios.create({
  baseURL,
  withCredentials: true,
});

interface QueuedRequest {
  resolve: (value?: unknown) => void;
  reject: (error: unknown) => void;
}

let isRefreshing = false;
let failedQueue: QueuedRequest[] = [];

const processQueue = (error: unknown): void => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve();
    }
  });
  failedQueue = [];
};

const clearAuthAndRedirect = (): void => {
  localStorage.removeItem("authSession");
  localStorage.removeItem("accessToken");
  window.location.href = ROUTES.LOGIN;
};

interface ErrorResponse {
  success?: boolean;
  message?: string;
  forceLogout?: boolean;
}

/**
 * Public package listing endpoints do not require auth. Sending a stale Bearer token
 * causes 401 → refresh → logout and breaks the landing guest experience.
 */
function getRequestPathname(config: InternalAxiosRequestConfig): string {
  let path = (config.url || "").split("?")[0];
  if (!path) return "";
  if (path.startsWith("http")) {
    try {
      return new URL(path).pathname;
    } catch {
      return "";
    }
  }
  const base = (config.baseURL || "").replace(/\/$/, "");
  if (base && path.startsWith(base)) {
    path = path.slice(base.length) || "/";
  }
  return path.startsWith("/") ? path : `/${path}`;
}

function isPublicPackageListingGet(config: InternalAxiosRequestConfig): boolean {
  const method = (config.method || "get").toLowerCase();
  if (method !== "get") return false;
  const path = getRequestPathname(config);
  if (!path) return false;
  if (path.includes("/packages/upcoming")) return true;
  return path === "/packages" || path === "/packages/";
}

/** GET /user/wishlist/:packageId/status — if refresh fails, do not send guests to /login from landing. */
function isWishlistStatusGet(config: InternalAxiosRequestConfig): boolean {
  const method = (config.method || "get").toLowerCase();
  if (method !== "get") return false;
  const path = getRequestPathname(config);
  return /\/user\/wishlist\/[^/]+\/status$/.test(path);
}

CareVoyageBackend.interceptors.request.use(
  (config) => {
    if (isPublicPackageListingGet(config)) {
      if (config.headers) {
        delete config.headers.Authorization;
      }
      return config;
    }
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken && config.headers) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

CareVoyageBackend.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ErrorResponse>) => {
    const responseData = error.response?.data as ErrorResponse | undefined;
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    if (!originalRequest) {
      return Promise.reject(error);
    }

    const errorMessage = error.response?.data?.message || "";
    const status = error.response?.status;

   
    if (status === 401) {
      if (
        originalRequest.url?.includes("/auth/login") ||
        originalRequest.url?.includes("/auth/refresh-token") ||
        originalRequest.url?.includes("/auth/logout")
      ) {
        // Refresh failure: handled once in the refresh retry catch below (avoids double toast).
        return Promise.reject(error);
      }

      if (isPublicPackageListingGet(originalRequest)) {
        return Promise.reject(error);
      }

      const isAccessTokenError =
        errorMessage === "Unauthorized access" ||
        errorMessage === "Access token expired" ||
        errorMessage === "Invalid token" ||
        errorMessage === "";

      
      if (isAccessTokenError && !originalRequest._retry) {
        if (isRefreshing) {
      
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          })
            .then(() => CareVoyageBackend(originalRequest))
            .catch((err) => Promise.reject(err));
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
          const refreshResponse = await CareVoyageBackend.post("/auth/refresh-token");
          const newAccessToken =
            (refreshResponse.data as { data?: { accessToken?: string } })?.data?.accessToken;
          if (newAccessToken) {
            localStorage.setItem("accessToken", newAccessToken);
          }

          processQueue(null);

          
          if (newAccessToken) {
            originalRequest.headers = originalRequest.headers || {};
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          }
          return CareVoyageBackend(originalRequest);
        } catch (refreshError) {
          processQueue(refreshError);
          if (!isWishlistStatusGet(originalRequest)) {
            clearAuthAndRedirect();
            toast.error("Session expired. Please login again.");
          }
          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      }

      if (!isWishlistStatusGet(originalRequest)) {
        clearAuthAndRedirect();
        toast.error("Please login again");
      }
      return Promise.reject(error);
    }

    
    if (status === 403) {
      const errorMessage = responseData?.message || "";

      if (responseData?.forceLogout) {
        localStorage.removeItem("authSession");
        localStorage.removeItem("accessToken");

        const isBlocked =
          errorMessage.toLowerCase().includes("blocked") ||
          errorMessage.toLowerCase().includes("account is blocked");
        toast.error(
          isBlocked
            ? "Your account has been blocked. Please contact support."
            : errorMessage || "Please sign in again."
        );
        window.location.href = ROUTES.LOGIN;
        return Promise.reject(error);
      }

      if (errorMessage.toLowerCase().includes("blocked")) {
        localStorage.removeItem("authSession");
        localStorage.removeItem("accessToken");
        toast.error("Your account has been blocked. Please contact support.");
        window.location.href = ROUTES.LOGIN;
        return Promise.reject(error);
      }

      
      const isTokenBlacklisted =
        errorMessage === "Token is blacklisted" ||
        errorMessage ===
          "Access denied. You do not have permission to access this resource.";

      if (isTokenBlacklisted) {
        clearAuthAndRedirect();
        toast.error("Session expired. Please login again.");
        return Promise.reject(error);
      }
    }
    return Promise.reject(error);
  }
);
