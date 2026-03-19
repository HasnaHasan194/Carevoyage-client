import { Route, Routes } from "react-router-dom";
import { AdminLoginForm } from "@/components/Admin/Adminlogin";
import { AdminHome } from "@/components/Admin/AdminHome";
import { AdminUserManagement } from "@/components/Admin/AdminUserManagement";
import { AdminAgencyManagement } from "@/components/Admin/AdminAgencyManagement";
import { AdminAgencyDetailsPage } from "@/components/Admin/AdminAgencyDetailsPage";
import { AdminWalletTransactionsPage } from "@/components/Admin/AdminWalletTransactionsPage";
import { AdminSalesReportPage } from "@/components/Admin/AdminSalesReportPage";
import { ResetPassword } from "@/components/ResetPassword";
import { ProtectedRoute } from "@/protected/ProtectedRoute";
import { NoAuthRoute } from "@/protected/NoAuthRoute";
import { AdminLayout } from "@/layouts/AdminLayout";
import { ROLES } from "@/types/role.types";

import { ADMIN_ROUTE_SEGMENTS } from "./frontendconstants";

export const AdminRouter = () => {
  return (
    <Routes>
      {/* Public Auth Routes */}
      <Route
        path={ADMIN_ROUTE_SEGMENTS.LOGIN}
        element={<NoAuthRoute element={<AdminLoginForm />} />}
      />
      <Route
        path={ADMIN_ROUTE_SEGMENTS.RESET_PASSWORD}
        element={<NoAuthRoute element={<ResetPassword />} />}
      />

      {/* Protected Admin Routes with Layout */}
      <Route
        element={
          <ProtectedRoute
            element={<AdminLayout />}
            allowedRoles={[ROLES.ADMIN]}
          />
        }
      >
        <Route path={ADMIN_ROUTE_SEGMENTS.DASHBOARD} element={<AdminHome />} />
        <Route path={ADMIN_ROUTE_SEGMENTS.USERS} element={<AdminUserManagement />} />
        <Route path={ADMIN_ROUTE_SEGMENTS.AGENCIES} element={<AdminAgencyManagement />} />
        <Route
          path={ADMIN_ROUTE_SEGMENTS.AGENCY_DETAILS}
          element={<AdminAgencyDetailsPage />}
        />
        <Route
          path={ADMIN_ROUTE_SEGMENTS.WALLET_TRANSACTIONS}
          element={<AdminWalletTransactionsPage />}
        />
        <Route
          path={ADMIN_ROUTE_SEGMENTS.SALES_REPORT}
          element={<AdminSalesReportPage />}
        />
      </Route>
    </Routes>
  );
};

