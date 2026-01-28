export const ENV = {
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL as string,
};

export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/signup",

  ADMIN_DASHBOARD: "/admin/dashboard",
  ADMIN_USERS: "/admin/users",
  ADMIN_AGENCIES: "/admin/agencies",
  CLIENT_DASHBOARD: "/client/dashboard",
  CLIENT_PROFILE: "/client/profile",
  CLIENT_PACKAGES: "/client/packages",
  CLIENT_PACKAGE_DETAILS: "/client/packages/:id",
  CLIENT_BOOKINGS: "/client/bookings",
  CLIENT_WALLET: "/client/wallet",
  CLIENT_BUCKET_LIST: "/client/bucket-list",
  CLIENT_MESSAGES: "/client/messages",
  CLIENT_CARETAKER: "/client/caretaker",
  CARETAKER_DASHBOARD: "/caretaker/dashboard",
  CARETAKER_VERIFICATION: "/caretaker/verification",
  CARETAKER_PROFILE: "/caretaker/profile",
  AGENCY_DASHBOARD: "/agency/dashboard",
  AGENCY_PROFILE: "/agency/profile",
  AGENCY_CARETAKERS: "/agency/caretakers",
  AGENCY_PACKAGES: "/agency/packages",
  AGENCY_CREATE_PACKAGE: "/agency/packages/create",
  AGENCY_EDIT_PACKAGE: "/agency/packages/edit",
  AGENCY_WALLET: "/agency/wallet",
  AGENCY_MESSAGES: "/agency/messages",
  CARETAKER_SIGNUP: "/caretaker/signup",
};

export const AUTH_CONFIG = {
  REGISTER: "/auth/signup",
  LOGIN: "/auth/login",
  LOGOUT: "/auth/logout",
  REFRESH_TOKEN: "/auth/refresh-token",
  PROFILE: "/auth/profile",
  ME: "/auth/me",
  AGENCY_REGISTER:"/auth/agency/register",
  AGENCY_LOGIN:"/auth/agency/login",
  ADMIN_LOGIN:"/auth/admin/login",
  CARETAKER_LOGIN:"/auth/caretaker/login",
};


