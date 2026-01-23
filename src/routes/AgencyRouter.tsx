import { Route, Routes } from "react-router-dom";
import { AgencySignupForm } from "@/components/Agency/Agency signup";
import { AgencyLoginForm } from "@/components/Agency/Agencylogin";
import { AgencyHome } from "@/components/AgencyHome";
import { AgencyCaretakerManagement } from "@/components/AgencyCaretakerManagement";
import { AgencyPackageManagement } from "@/components/AgencyPackageManagement";
import { AgencyPackageForm } from "@/components/AgencyPackageForm";
import { ResetPassword } from "@/components/ResetPassword";
import { ProtectedRoute } from "@/protected/ProtectedRoute";
import { NoAuthRoute } from "@/protected/NoAuthRoute";
import { ROLES } from "@/types/role.types";

export const AgencyRouter = () => {
  return (
    <Routes>
      {/* Public Auth Routes */}
      <Route
        path="signup"
        element={<NoAuthRoute element={<AgencySignupForm />} />}
      />
      <Route
        path="login"
        element={<NoAuthRoute element={<AgencyLoginForm />} />}
      />
      <Route
        path="reset-password"
        element={<NoAuthRoute element={<ResetPassword />} />}
      />

      {/* Protected Agency Routes */}
      <Route
        path="dashboard"
        element={
          <ProtectedRoute
            element={<AgencyHome />}
            allowedRoles={[ROLES.AGENCY_OWNER]}
          />
        }
      />
      <Route
        path="caretakers"
        element={
          <ProtectedRoute
            element={<AgencyCaretakerManagement />}
            allowedRoles={[ROLES.AGENCY_OWNER]}
          />
        }
      />
      <Route
        path="packages"
        element={
          <ProtectedRoute
            element={<AgencyPackageManagement />}
            allowedRoles={[ROLES.AGENCY_OWNER]}
          />
        }
      />
      <Route
        path="packages/create"
        element={
          <ProtectedRoute
            element={<AgencyPackageForm />}
            allowedRoles={[ROLES.AGENCY_OWNER]}
          />
        }
      />
      <Route
        path="packages/edit/:packageId"
        element={
          <ProtectedRoute
            element={<AgencyPackageForm />}
            allowedRoles={[ROLES.AGENCY_OWNER]}
          />
        }
      />
    </Routes>
  );
};

