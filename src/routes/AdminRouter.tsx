import { Route, Routes } from "react-router-dom";
import { AdminLoginForm } from "@/components/Admin/Adminlogin";
import { AdminHome } from "@/components/AdminHome";
import { AdminUserManagement } from "@/components/AdminUserManagement";
import { AdminAgencyManagement } from "@/components/AdminAgencyManagement";
import { ResetPassword } from "@/components/ResetPassword";
import { ProtectedRoute } from "@/protected/ProtectedRoute";
import { NoAuthRoute } from "@/protected/NoAuthRoute";
import { ROLES } from "@/types/role.types";

export const AdminRouter = () => {
  return (
    <Routes>
      {/* Public Auth Routes */}
      <Route
        path="login"
        element={<NoAuthRoute element={<AdminLoginForm />} />}
      />
      <Route
        path="reset-password"
        element={<NoAuthRoute element={<ResetPassword />} />}
      />

      {/* Protected Admin Routes */}
      <Route
        path="dashboard"
        element={
          <ProtectedRoute
            element={<AdminHome />}
            allowedRoles={[ROLES.ADMIN]}
          />
        }
      />
      <Route
        path="users"
        element={
          <ProtectedRoute
            element={<AdminUserManagement />}
            allowedRoles={[ROLES.ADMIN]}
          />
        }
      />
      <Route
        path="agencies"
        element={
          <ProtectedRoute
            element={<AdminAgencyManagement />}
            allowedRoles={[ROLES.ADMIN]}
          />
        }
      />
    </Routes>
  );
};

