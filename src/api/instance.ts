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
}

// Request interceptor: Attach access token to requests
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
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    if (!originalRequest) {
      return Promise.reject(error);
    }

    const errorMessage = error.response?.data?.message || "";
    const status = error.response?.status;

    // Handle 401 Unauthorized - Access token expired or invalid
    if (status === 401) {
      // Skip refresh for login/refresh-token endpoints to avoid infinite loops
      if (
        originalRequest.url?.includes("/auth/login") ||
        originalRequest.url?.includes("/auth/refresh-token") ||
        originalRequest.url?.includes("/auth/logout")
      ) {
        // For login/refresh failures, clear auth and redirect
        if (originalRequest.url?.includes("/auth/refresh-token")) {
          clearAuthAndRedirect();
          toast.error("Session expired. Please login again.");
        }
        return Promise.reject(error);
      }

      // Check if this is an access token expiration/invalid error
      // Match exact error messages from verifyAuth middleware
      const isAccessTokenError =
        errorMessage === "Unauthorized access" ||
        errorMessage === "Access token expired" ||
        errorMessage === "Invalid token" ||
        errorMessage === "";

      if (isAccessTokenError && !originalRequest._retry) {
        // If already refreshing, queue this request
        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          })
            .then(() => {
              return CareVoyageBackend(originalRequest);
            })
            .catch((err) => {
              return Promise.reject(err);
            });
        }

        // Mark request as retried and start refresh
        originalRequest._retry = true;
        isRefreshing = true;

        try {
          // Call refresh token endpoint
          await CareVoyageBackend.post("/auth/refresh-token");

          // Process queued requests
          processQueue(null);

          // Retry original request
          return CareVoyageBackend(originalRequest);
        } catch (refreshError) {
          // Refresh failed - clear auth and redirect
          processQueue(refreshError);
          clearAuthAndRedirect();
          toast.error("Session expired. Please login again.");
          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      }

      // Other 401 errors (missing token, etc.) - clear auth
      clearAuthAndRedirect();
      toast.error("Please login again");
      return Promise.reject(error);
    }

    // Handle 403 Forbidden - Token blacklisted or access denied
    // Handle 403 Forbidden - Blocked user or token issues
    if (status === 403) {
      const errorMessage = error.response?.data?.message || "";

      // 1. Blocked user handling
      // if (errorMessage.toLowerCase().includes("blocked")) {
      //   clearAuthAndRedirect();
      //   toast.error("Your account has been blocked. Please contact support.");
      //   return Promise.reject(error);
      // }
      // Blocked user → DO NOT logout
      if (
        errorMessage.toLowerCase().includes("blocked") ||
        (error.response?.data as any)?.forceLogout
      ) {
        localStorage.removeItem("authSession");
        localStorage.removeItem("accessToken");

        toast.error("Your account has been blocked. Please contact support.");

        window.location.href = ROUTES.LOGIN;

        return Promise.reject(error);
      }

      // Token blacklisted / permission issue → logout
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
