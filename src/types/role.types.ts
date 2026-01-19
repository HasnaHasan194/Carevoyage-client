export const ROLES = {
  ADMIN: "admin",
  CLIENT: "client",
  CARETAKER: "caretaker",
  AGENCY_OWNER: "agency_owner",
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];