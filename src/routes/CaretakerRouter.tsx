import { Route, Routes } from "react-router-dom";
import { CaretakerSignupForm } from "@/components/Caretaker/CaretakerSignup";
import { CaretakerLoginForm } from "@/components/Caretaker/CaretakerLogin";
import { CaretakerVerificationForm } from "@/components/Caretaker/CaretakerVerification";
import { ResetPassword } from "@/components/ResetPassword";
import { ProtectedRoute } from "@/protected/ProtectedRoute";
import { NoAuthRoute } from "@/protected/NoAuthRoute";
import { ROLES } from "@/types/role.types";
import { CaretakerProfilePage } from "@/components/Caretaker/CaretakerProfilePage";
import { CaretakerLayout } from "@/layouts/CaretakerLayout";
import { CaretakerDashboard } from "@/components/Caretaker/CaretakerDashboard";
import { CaretakerTripsPage } from "@/components/Caretaker/CaretakerTripsPage";
import { MessagesPage } from "@/components/Chat/MessagesPage";

import { CARETAKER_ROUTE_SEGMENTS } from "./frontendconstants";

export const CaretakerRouter = () => {
  return (
    <Routes>
      {/* Public Auth Routes */}
      <Route
        path={CARETAKER_ROUTE_SEGMENTS.LOGIN}
        element={<NoAuthRoute element={<CaretakerLoginForm />} />}
      />
      <Route
        path={CARETAKER_ROUTE_SEGMENTS.SIGNUP}
        element={<NoAuthRoute element={<CaretakerSignupForm />} />}
      />
      <Route
        path={CARETAKER_ROUTE_SEGMENTS.RESET_PASSWORD}
        element={<NoAuthRoute element={<ResetPassword />} />}
      />

      {/* Verification Route */}
      <Route
        path={CARETAKER_ROUTE_SEGMENTS.VERIFICATION}
        element={
          <ProtectedRoute
            element={<CaretakerVerificationForm />}
            allowedRoles={[ROLES.CARETAKER]}
          />
        }
      />

      {/* Protected Caretaker Routes with Sidebar Layout */}
      <Route
        element={
          <ProtectedRoute
            element={<CaretakerLayout />}
            allowedRoles={[ROLES.CARETAKER]}
          />
        }
      >
        {/* Dashboard */}
        <Route path={CARETAKER_ROUTE_SEGMENTS.DASHBOARD} element={<CaretakerDashboard />} />

        {/* Assigned trips */}
        <Route path={CARETAKER_ROUTE_SEGMENTS.TRIPS} element={<CaretakerTripsPage />} />

        {/* Messages */}
        <Route path={CARETAKER_ROUTE_SEGMENTS.MESSAGES} element={<MessagesPage />} />

        {/* Profile */}
        <Route path={CARETAKER_ROUTE_SEGMENTS.PROFILE} element={<CaretakerProfilePage />} />
      </Route>
    </Routes>
  );
};

