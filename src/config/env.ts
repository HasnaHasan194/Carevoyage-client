export const ENV = {
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL as string,
};

export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",

  ADMIN_DASHBOARD: "/admin/dashboard",
  ADMIN_USERS: "/admin/users",
  CLIENT_DASHBOARD: "/client/dashboard",
  CARETAKER_DASHBOARD: "/caretaker/dashboard",
  AGENCY_DASHBOARD: "/agency/dashboard",
  AGENCY_CARETAKERS: "/agency/caretakers",
  CARETAKER_SIGNUP: "/caretaker/signup",
};

export const AUTH_CONFIG = {
  REGISTER: "/auth/register",
  LOGIN: "/auth/login",
  LOGOUT: "/auth/logout",
  REFRESH_TOKEN: "/auth/refresh-token",
  PROFILE: "/auth/profile",
  AGENCY_REGISTER:"/auth/agency/register",
  AGENCY_LOGIN:"/auth/agency/login",
  ADMIN_LOGIN:"/auth/admin/login",
  CARETAKER_LOGIN:"/auth/caretaker/login",
};

export const ROLES = {
  ADMIN: "admin",
  CLIENT: "client",
  CARETAKER: "caretaker",
  AGENCY_OWNER: "agency_owner",
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];
