import type { RootState } from "@/store/store";
import type { JSX } from "react";
import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";
import { ROUTES } from "../config/env";
import type { Role } from "@/types/role.types";
import type { User } from "@/types/auth.types";

interface ProtectedRouteProps {
  element: JSX.Element;
  allowedRoles: Role[];
}

export const ProtectedRoute = ({
  element,
  allowedRoles,
}: ProtectedRouteProps) => {
  const user = useSelector((state: RootState) => state.auth.user);
  const location = useLocation();


  let currentUser: User | null = user;
  if (!currentUser) {
    try {
      const stored = localStorage.getItem("authSession");
      if (stored) {
        const parsed = JSON.parse(stored) as User;
        if (parsed && parsed.id && parsed.email && parsed.role) {
          currentUser = parsed;
        }
      }
    } catch {
      
    }
  }

  //if not logged in the user
  if (!currentUser) {
    return (
      <Navigate
        to={ROUTES.LOGIN}
        state={{ from: location }}
        replace
      />
    );
  }

//role based access
  if (!allowedRoles.includes(currentUser.role)) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  return element;
};
