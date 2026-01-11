import { Route, Routes } from "react-router-dom";
import { UserSignupForm } from "@/components/Usersignup";
import { LoginForm } from "@/components/UserLogin";
import { UserHome } from "@/components/UserHome";
import { ResetPassword } from "@/components/ResetPassword";
import { ProtectedRoute } from "@/protected/ProtectedRoute";
import { NoAuthRoute } from "@/protected/NoAuthRoute";
import { ROUTES } from "@/config/env";
import { ROLES } from "@/types/role.types";
import { UserProfile } from "@/components/User/UserProfile";
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
      <Route
        path="/reset-password"
        element={<NoAuthRoute element={<ResetPassword />} />}
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

      {/* Profile Route */}
      <Route 
      path={ROUTES.CLIENT_PROFILE}
      element={
        <ProtectedRoute
        element={<UserProfile/>}
        allowedRoles={[ROLES.CLIENT]}
        />
      }
      />
    </Routes>
  );
};
