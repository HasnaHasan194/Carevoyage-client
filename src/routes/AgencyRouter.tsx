import { Route, Routes } from "react-router-dom";
import { AgencySignupForm } from "@/components/Agency/Agency signup";
import { AgencyLoginForm } from "@/components/Agency/Agencylogin";
import AgencyReverifyPage from "@/components/Agency/AgencyReverifyPage";
import { AgencyHome } from "@/components/Agency/AgencyHome";
import { AgencyCaretakerManagement } from "@/components/Agency/AgencyCaretakerManagement";
import { AgencyPackageManagement } from "@/components/Agency/AgencyPackageManagement";
import { AgencyPackageDetailPage } from "@/components/Agency/AgencyPackageDetailPage";
import { AgencyPackageBookingsPage } from "@/components/Agency/AgencyPackageBookingsPage";
import { AgencyPackageForm } from "@/components/Agency/AgencyPackageForm";
import { AgencyCategoryManagement } from "@/components/Agency/AgencyCategoryManagement";
import { AgencySpecialNeedsManagement } from "@/components/Agency/AgencySpecialNeedsManagement";
import { AgencyProfilePage } from "@/components/Agency/AgencyProfilePage";
import { AgencyCaretakerRequestsPage } from "@/components/Agency/AgencyCaretakerRequestsPage";
import { AgencyRefundRequestsPage } from "@/components/Agency/AgencyRefundRequestsPage";
import { AgencyWalletPage } from "@/components/Agency/AgencyWalletPage";
import { AgencySalesReportPage } from "@/components/Agency/AgencySalesReportPage";
import { AgencyReviewsPage } from "@/components/Agency/AgencyReviewsPage";
import { ResetPassword } from "@/components/ResetPassword";
import { ProtectedRoute } from "@/protected/ProtectedRoute";
import { NoAuthRoute } from "@/protected/NoAuthRoute";
import { ROLES } from "@/types/role.types";
import { AgencyLayout } from "@/layouts/AgencyLayout";

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
      <Route path="reverify" element={<AgencyReverifyPage />} />

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
        <Route path="profile" element={<AgencyProfilePage />} />

        {/* Packages */}
        <Route path="packages" element={<AgencyPackageManagement />} />
        <Route path="packages/create" element={<AgencyPackageForm />} />
        <Route path="packages/edit/:packageId" element={<AgencyPackageForm />} />
        <Route path="packages/view/:packageId" element={<AgencyPackageDetailPage />} />
        <Route path="packages/bookings/:packageId" element={<AgencyPackageBookingsPage />} />

        {/* Caretakers */}
        <Route path="caretakers" element={<AgencyCaretakerManagement />} />

        {/* Caretaker requests */}
        <Route path="caretaker-requests" element={<AgencyCaretakerRequestsPage />} />

        {/* Refund requests */}
        <Route path="refund-requests" element={<AgencyRefundRequestsPage />} />

        {/* Categories */}
        <Route path="categories" element={<AgencyCategoryManagement />} />

        {/* Special Needs Pricing */}
        <Route
          path="special-needs-pricing"
          element={<AgencySpecialNeedsManagement />}
        />

        {/* Wallet */}
        <Route path="wallet" element={<AgencyWalletPage />} />

        {/* Sales report */}
        <Route path="sales-report" element={<AgencySalesReportPage />} />

        {/* Reviews */}
        <Route path="reviews" element={<AgencyReviewsPage />} />

        {/* Messages */}
        <Route path="messages" element={<AgencyMessages />} />
      </Route>
    </Routes>
  );
};

