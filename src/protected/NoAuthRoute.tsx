import type { JSX } from "react";
import { Navigate } from "react-router-dom";
import { useAuthSession } from "@/hooks/auth/useAuthSession";
import { getDashboardRouteForRole } from "@/protected/roleRedirect";

interface NoAuthRouteProps {
  element: JSX.Element;
}

export const NoAuthRoute = ({ element }: NoAuthRouteProps) => {
  const { user, isValidating, isAuthenticated } = useAuthSession();

  if (isValidating) return null;

  // If authenticated, never allow access to login/signup/reset.
  if (isAuthenticated && user) {
    return <Navigate to={getDashboardRouteForRole(user.role)} replace />;
  }

  return element;
};
