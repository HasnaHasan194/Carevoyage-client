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
import { PackagesPage } from "@/components/User/Packages/PackagesPage";
import { PackageDetailsPage } from "@/components/User/Packages/PackageDetails/PackageDetailsPage";
import { BucketListPage } from "@/components/User/BucketList/BucketListPage";
import { BookingSuccessPage } from "@/components/User/Booking/BookingSuccessPage";
import { BookingCancelPage } from "@/components/User/Booking/BookingCancelPage";
import { UserLayout } from "@/layouts/UserLayout";

// Placeholder components for future features
const MyBookings = () => (
  <div className="p-6 lg:p-8">
    <h1 className="text-2xl font-bold" style={{ color: "#7C5A3B" }}>My Bookings</h1>
    <p className="mt-2" style={{ color: "#8B6F47" }}>Your bookings will appear here.</p>
  </div>
);

const Wallet = () => (
  <div className="p-6 lg:p-8">
    <h1 className="text-2xl font-bold" style={{ color: "#7C5A3B" }}>Wallet</h1>
    <p className="mt-2" style={{ color: "#8B6F47" }}>Your wallet balance and transactions will appear here.</p>
  </div>
);

const Messages = () => (
  <div className="p-6 lg:p-8">
    <h1 className="text-2xl font-bold" style={{ color: "#7C5A3B" }}>Messages</h1>
    <p className="mt-2" style={{ color: "#8B6F47" }}>Your messages will appear here.</p>
  </div>
);

const ClientCaretaker = () => (
  <div className="p-6 lg:p-8">
    <h1 className="text-2xl font-bold" style={{ color: "#7C5A3B" }}>Caretaker</h1>
    <p className="mt-2" style={{ color: "#8B6F47" }}>Manage your caretaker preferences here.</p>
  </div>
);

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

      {/* Protected Client Routes without sidebar */}
      <Route
        path={ROUTES.CLIENT_DASHBOARD}
        element={
          <ProtectedRoute
            element={<UserHome />}
            allowedRoles={[ROLES.CLIENT]}
          />
        }
      />

      {/* Packages Route (without sidebar - browsing experience) */}
      <Route
        path={ROUTES.CLIENT_PACKAGES}
        element={
          <ProtectedRoute
            element={<PackagesPage />}
            allowedRoles={[ROLES.CLIENT]}
          />
        }
      />

      {/* Package Details Route (without sidebar) */}
      <Route
        path="/client/packages/:id"
        element={
          <ProtectedRoute
            element={<PackageDetailsPage />}
            allowedRoles={[ROLES.CLIENT]}
          />
        }
      />

      {/* Booking success/cancel (Stripe redirect targets) */}
      <Route
        path={ROUTES.BOOKING_SUCCESS}
        element={
          <ProtectedRoute
            element={<BookingSuccessPage />}
            allowedRoles={[ROLES.CLIENT]}
          />
        }
      />
      <Route
        path={ROUTES.BOOKING_CANCEL}
        element={
          <ProtectedRoute
            element={<BookingCancelPage />}
            allowedRoles={[ROLES.CLIENT]}
          />
        }
      />

      {/* Protected Routes with Sidebar Layout */}
      <Route
        element={
          <ProtectedRoute
            element={<UserLayout />}
            allowedRoles={[ROLES.CLIENT]}
          />
        }
      >
        {/* Profile Route */}
        <Route path={ROUTES.CLIENT_PROFILE} element={<UserProfile />} />

        {/* My Bookings Route */}
        <Route path={ROUTES.CLIENT_BOOKINGS} element={<MyBookings />} />

        {/* Wallet Route */}
        <Route path={ROUTES.CLIENT_WALLET} element={<Wallet />} />

        {/* Bucket List Route */}
        <Route path={ROUTES.CLIENT_BUCKET_LIST} element={<BucketListPage />} />

        {/* Messages Route */}
        <Route path={ROUTES.CLIENT_MESSAGES} element={<Messages />} />

        {/* Caretaker Route */}
        <Route path={ROUTES.CLIENT_CARETAKER} element={<ClientCaretaker />} />
      </Route>
    </Routes>
  );
};
