import { ROUTES } from "@/config/env";
import type { Role } from "@/types/role.types";

export const getDashboardRouteForRole = (role: Role): string => {
  const roleRedirectMap: Record<Role, string> = {
    admin: ROUTES.ADMIN_DASHBOARD,
    client: ROUTES.CLIENT_DASHBOARD,
    caretaker: ROUTES.CARETAKER_DASHBOARD,
    agency_owner: ROUTES.AGENCY_DASHBOARD,
  };

  return roleRedirectMap[role] ?? ROUTES.HOME;
};




