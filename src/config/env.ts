import { API_ENDPOINTS } from "@/constants/apiEndpoints";

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
  ADMIN_AGENCY_DETAILS: "/admin/agencies/:agencyId",
  ADMIN_WALLET_TRANSACTIONS: "/admin/wallet-transactions",
  ADMIN_SALES_REPORT: "/admin/sales-report",
  CLIENT_DASHBOARD: "/client/dashboard",
  CLIENT_PROFILE: "/client/profile",
  CLIENT_PACKAGES: "/client/packages",
  CLIENT_PACKAGE_DETAILS: "/client/packages/:id",
  CLIENT_PACKAGE_BOOKING: "/client/packages/:id/book",
  BOOKING_SUCCESS: "/booking/success",
  BOOKING_CANCEL: "/booking/cancel",
  CLIENT_BOOKINGS: "/client/bookings",
  CLIENT_BOOKING_DETAIL: "/client/bookings/:bookingId",
  CLIENT_REVIEW: "/client/bookings/:bookingId/review",
  CLIENT_WALLET: "/client/wallet",
  CLIENT_BUCKET_LIST: "/client/bucket-list",
  CLIENT_MESSAGES: "/client/messages",
  CLIENT_CARETAKER: "/client/caretaker",
  CARETAKER_DASHBOARD: "/caretaker/dashboard",
  CARETAKER_TRIPS: "/caretaker/trips",
  CARETAKER_VERIFICATION: "/caretaker/verification",
  CARETAKER_PROFILE: "/caretaker/profile",
  CARETAKER_MESSAGES: "/caretaker/messages",
  AGENCY_DASHBOARD: "/agency/dashboard",
  AGENCY_PROFILE: "/agency/profile",
  AGENCY_CARETAKERS: "/agency/caretakers",
  AGENCY_CARETAKER_REQUESTS: "/agency/caretaker-requests",
  AGENCY_REFUND_REQUESTS: "/agency/refund-requests",
  AGENCY_PACKAGES: "/agency/packages",
  AGENCY_CREATE_PACKAGE: "/agency/packages/create",
  AGENCY_EDIT_PACKAGE: "/agency/packages/edit",
  AGENCY_VIEW_PACKAGE: "/agency/packages/view",
  AGENCY_PACKAGE_BOOKINGS: "/agency/packages/bookings",
  AGENCY_CATEGORIES: "/agency/categories",
  AGENCY_SPECIAL_NEEDS_PRICING: "/agency/special-needs-pricing",
  AGENCY_REVIEWS: "/agency/reviews",
  AGENCY_WALLET: "/agency/wallet",
  AGENCY_SALES_REPORT: "/agency/sales-report",
  AGENCY_MESSAGES: "/agency/messages",
  CARETAKER_SIGNUP: "/caretaker/signup",
  AGENCY_SIGNUP: "/agency/signup",
};

export const AUTH_CONFIG = {
  REGISTER: API_ENDPOINTS.AUTH.REGISTER,
  LOGIN: API_ENDPOINTS.AUTH.LOGIN,
  LOGOUT: API_ENDPOINTS.AUTH.LOGOUT,
  REFRESH_TOKEN: API_ENDPOINTS.AUTH.REFRESH_TOKEN,
  PROFILE: "/auth/profile",
  ME: API_ENDPOINTS.AUTH.ME,
  AGENCY_REGISTER: API_ENDPOINTS.AUTH.AGENCY_SIGNUP,
  AGENCY_LOGIN: API_ENDPOINTS.AUTH.AGENCY_LOGIN,
  ADMIN_LOGIN: API_ENDPOINTS.AUTH.ADMIN_LOGIN,
  CARETAKER_LOGIN: API_ENDPOINTS.AUTH.CARETAKER_LOGIN,
};



