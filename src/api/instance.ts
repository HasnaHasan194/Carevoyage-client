import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";
import toast from "react-hot-toast";
import { ROUTES } from "@/config/env";

export const CareVoyageBackend = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
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


CareVoyageBackend.interceptors.request.use(
  (config) => {
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
      // Never retry auth endpoints (login, refresh, logout)
      if (
        originalRequest.url?.includes("/auth/login") ||
        originalRequest.url?.includes("/auth/refresh-token") ||
        originalRequest.url?.includes("/auth/logout")
      ) {
        if (originalRequest.url?.includes("/auth/refresh-token")) {
          clearAuthAndRedirect();
          toast.error("Session expired. Please login again.");
        }
        return Promise.reject(error);
      }

      // Only attempt refresh for token-related 401s (expired, invalid, missing)
      const isAccessTokenError =
        errorMessage === "Unauthorized access" ||
        errorMessage === "Access token expired" ||
        errorMessage === "Invalid token" ||
        errorMessage === "";

      // Guard: prevent infinite retry loop - only retry once per request
      if (isAccessTokenError && !originalRequest._retry) {
        if (isRefreshing) {
          // Queue this request to retry after current refresh completes
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

          // Explicitly attach new token to retry - originalRequest may have stale Authorization header
          if (newAccessToken) {
            originalRequest.headers = originalRequest.headers || {};
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          }
          return CareVoyageBackend(originalRequest);
        } catch (refreshError) {
          processQueue(refreshError);
          clearAuthAndRedirect();
          toast.error("Session expired. Please login again.");
          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      }

      // 401 but not token-related, or retry already failed - logout
      clearAuthAndRedirect();
      toast.error("Please login again");
      return Promise.reject(error);
    }

    
    if (status === 403) {
      
      const errorMessage=responseData?.message || "";

      if (
        errorMessage.toLowerCase().includes("blocked") ||
        
          responseData?.forceLogout
      ) {
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
