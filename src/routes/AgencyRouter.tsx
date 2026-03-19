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

import { AGENCY_ROUTE_SEGMENTS } from "./frontendconstants";

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
        path={AGENCY_ROUTE_SEGMENTS.SIGNUP}
        element={<NoAuthRoute element={<AgencySignupForm />} />}
      />
      <Route
        path={AGENCY_ROUTE_SEGMENTS.LOGIN}
        element={<NoAuthRoute element={<AgencyLoginForm />} />}
      />
      <Route
        path={AGENCY_ROUTE_SEGMENTS.RESET_PASSWORD}
        element={<NoAuthRoute element={<ResetPassword />} />}
      />
      <Route path={AGENCY_ROUTE_SEGMENTS.REVERIFY} element={<AgencyReverifyPage />} />

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
        <Route path={AGENCY_ROUTE_SEGMENTS.DASHBOARD} element={<AgencyHome />} />

        {/* Profile */}
        <Route path={AGENCY_ROUTE_SEGMENTS.PROFILE} element={<AgencyProfilePage />} />

        {/* Packages */}
        <Route path={AGENCY_ROUTE_SEGMENTS.PACKAGES} element={<AgencyPackageManagement />} />
        <Route path={AGENCY_ROUTE_SEGMENTS.PACKAGE_CREATE} element={<AgencyPackageForm />} />
        <Route path={AGENCY_ROUTE_SEGMENTS.PACKAGE_EDIT} element={<AgencyPackageForm />} />
        <Route path={AGENCY_ROUTE_SEGMENTS.PACKAGE_VIEW} element={<AgencyPackageDetailPage />} />
        <Route path={AGENCY_ROUTE_SEGMENTS.PACKAGE_BOOKINGS} element={<AgencyPackageBookingsPage />} />

        {/* Caretakers */}
        <Route path={AGENCY_ROUTE_SEGMENTS.CARETAKERS} element={<AgencyCaretakerManagement />} />

        {/* Caretaker requests */}
        <Route
          path={AGENCY_ROUTE_SEGMENTS.CARETAKER_REQUESTS}
          element={<AgencyCaretakerRequestsPage />}
        />

        {/* Refund requests */}
        <Route
          path={AGENCY_ROUTE_SEGMENTS.REFUND_REQUESTS}
          element={<AgencyRefundRequestsPage />}
        />

        {/* Categories */}
        <Route path={AGENCY_ROUTE_SEGMENTS.CATEGORIES} element={<AgencyCategoryManagement />} />

        {/* Special Needs Pricing */}
        <Route
          path={AGENCY_ROUTE_SEGMENTS.SPECIAL_NEEDS_PRICING}
          element={<AgencySpecialNeedsManagement />}
        />

        {/* Wallet */}
        <Route path={AGENCY_ROUTE_SEGMENTS.WALLET} element={<AgencyWalletPage />} />

        {/* Sales report */}
        <Route
          path={AGENCY_ROUTE_SEGMENTS.SALES_REPORT}
          element={<AgencySalesReportPage />}
        />

        {/* Reviews */}
        <Route path={AGENCY_ROUTE_SEGMENTS.REVIEWS} element={<AgencyReviewsPage />} />

        {/* Messages */}
        <Route path={AGENCY_ROUTE_SEGMENTS.MESSAGES} element={<AgencyMessages />} />
      </Route>
    </Routes>
  );
};

