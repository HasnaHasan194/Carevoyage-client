import { Route, Routes } from "react-router-dom";
import { UserSignupForm } from "@/components/Usersignup";
import { LoginForm } from "@/components/UserLogin";
import { UserHome } from "@/components/UserHome";
import { ProtectedRoute } from "@/protected/ProtectedRoute";
import { NoAuthRoute } from "@/protected/NoAuthRoute";
import { ROUTES, ROLES } from "@/config/env";

export const ClientRouter = () => {
  return (
    <Routes>
      {/* Public Auth Routes */}
      <Route
        path="/login"
        element={<NoAuthRoute element={<LoginForm />} />}
      />
      <Route
        path="/signup"
        element={<NoAuthRoute element={<UserSignupForm />} />}
      />

      {/* Protected Client Routes */}
      <Route
        path={ROUTES.CLIENT_DASHBOARD}
        element={
          <ProtectedRoute
            element={<UserHome />}
            allowedRoles={[ROLES.CLIENT]}
          />
        }
      />
    </Routes>
  );
};
