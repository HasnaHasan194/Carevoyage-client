import { Route, Routes } from "react-router-dom";
import { AgencySignupForm } from "@/components/Agency/Agency signup";
import { AgencyLoginForm } from "@/components/Agency/Agencylogin";
import { AgencyHome } from "@/components/AgencyHome";
import { AgencyCaretakerManagement } from "@/components/AgencyCaretakerManagement";
import { ProtectedRoute } from "@/protected/ProtectedRoute";
import { NoAuthRoute } from "@/protected/NoAuthRoute";
import {  ROLES } from "@/config/env";

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
    </Routes>
  );
};

