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

export const CaretakerRouter = () => {
  return (
    <Routes>
      {/* Public Auth Routes */}
      <Route
        path="login"
        element={<NoAuthRoute element={<CaretakerLoginForm />} />}
      />
      <Route
        path="signup"
        element={<NoAuthRoute element={<CaretakerSignupForm />} />}
      />
      <Route
        path="reset-password"
        element={<NoAuthRoute element={<ResetPassword />} />}
      />

      {/* Verification Route - Outside layout since it has its own UI */}
      <Route
        path="verification"
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
        <Route path="dashboard" element={<CaretakerDashboard />} />

        {/* Assigned trips */}
        <Route path="trips" element={<CaretakerTripsPage />} />

        {/* Messages */}
        <Route path="messages" element={<MessagesPage />} />

        {/* Profile */}
        <Route path="profile" element={<CaretakerProfilePage />} />
      </Route>
    </Routes>
  );
};

