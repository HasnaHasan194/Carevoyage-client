export const APP_ROUTE_PATHS = {
  HOME: "/",
  CARETAKER_ROOT: "/caretaker/*",
  ADMIN_ROOT: "/admin/*",
  AGENCY_ROOT: "/agency/*",
  CLIENT_ROOT: "/*",
} as const;

export const CLIENT_ROUTE_PATHS = {
  RESET_PASSWORD: "/reset-password",
  PACKAGE_DETAILS: "/client/packages/:id",
} as const;

export const AGENCY_ROUTE_SEGMENTS = {
  SIGNUP: "signup",
  LOGIN: "login",
  RESET_PASSWORD: "reset-password",
  REVERIFY: "reverify",
  DASHBOARD: "dashboard",
  PROFILE: "profile",
  PACKAGES: "packages",
  PACKAGE_CREATE: "packages/create",
  PACKAGE_EDIT: "packages/edit/:packageId",
  PACKAGE_VIEW: "packages/view/:packageId",
  PACKAGE_BOOKINGS: "packages/bookings/:packageId",
  CARETAKERS: "caretakers",
  CARETAKER_REQUESTS: "caretaker-requests",
  REFUND_REQUESTS: "refund-requests",
  CATEGORIES: "categories",
  SPECIAL_NEEDS_PRICING: "special-needs-pricing",
  WALLET: "wallet",
  SALES_REPORT: "sales-report",
  REVIEWS: "reviews",
  MESSAGES: "messages",
} as const;

export const ADMIN_ROUTE_SEGMENTS = {
  LOGIN: "login",
  RESET_PASSWORD: "reset-password",
  DASHBOARD: "dashboard",
  USERS: "users",
  AGENCIES: "agencies",
  AGENCY_DETAILS: "agencies/:agencyId",
  WALLET_TRANSACTIONS: "wallet-transactions",
  SALES_REPORT: "sales-report",
} as const;

export const CARETAKER_ROUTE_SEGMENTS = {
  LOGIN: "login",
  SIGNUP: "signup",
  RESET_PASSWORD: "reset-password",
  VERIFICATION: "verification",
  DASHBOARD: "dashboard",
  TRIPS: "trips",
  MESSAGES: "messages",
  PROFILE: "profile",
} as const;