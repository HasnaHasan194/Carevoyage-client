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
import { AgencyLayout } from "@/layouts/AgencyLayout";

// Placeholder components for future features
const AgencyProfile = () => (
  <div className="p-6 lg:p-8">
    <h1 className="text-2xl font-bold" style={{ color: "#7C5A3B" }}>Agency Profile</h1>
    <p className="mt-2" style={{ color: "#8B6F47" }}>Manage your agency profile and settings.</p>
  </div>
);

const AgencyWallet = () => (
  <div className="p-6 lg:p-8">
    <h1 className="text-2xl font-bold" style={{ color: "#7C5A3B" }}>Wallet</h1>
    <p className="mt-2" style={{ color: "#8B6F47" }}>View your earnings and transactions.</p>
  </div>
);

const AgencyMessages = () => (
  <div className="p-6 lg:p-8">
    <h1 className="text-2xl font-bold" style={{ color: "#7C5A3B" }}>Messages</h1>
    <p className="mt-2" style={{ color: "#8B6F47" }}>Communicate with customers and caretakers.</p>
  </div>
);

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

      {/* Protected Agency Routes with Sidebar Layout */}
      <Route
        element={
          <ProtectedRoute
            element={<AgencyLayout />}
            allowedRoles={[ROLES.AGENCY_OWNER]}
          />
        }
      >
        {/* Dashboard */}
        <Route path="dashboard" element={<AgencyHome />} />

        {/* Profile */}
        <Route path="profile" element={<AgencyProfile />} />

        {/* Packages */}
        <Route path="packages" element={<AgencyPackageManagement />} />
        <Route path="packages/create" element={<AgencyPackageForm />} />
        <Route path="packages/edit/:packageId" element={<AgencyPackageForm />} />

        {/* Caretakers */}
        <Route path="caretakers" element={<AgencyCaretakerManagement />} />

        {/* Wallet */}
        <Route path="wallet" element={<AgencyWallet />} />

        {/* Messages */}
        <Route path="messages" element={<AgencyMessages />} />
      </Route>
    </Routes>
  );
};

