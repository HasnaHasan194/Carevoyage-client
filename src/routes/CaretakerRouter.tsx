import { Route, Routes } from "react-router-dom";
import { CaretakerSignupForm } from "@/components/CaretakerSignup";
import { CaretakerLoginForm } from "@/components/CaretakerLogin";
import { CaretakerVerificationForm } from "@/components/CaretakerVerification";
import { UserHome } from "@/components/UserHome";
import { ResetPassword } from "@/components/ResetPassword";
import { ProtectedRoute } from "@/protected/ProtectedRoute";
import { NoAuthRoute } from "@/protected/NoAuthRoute";
import { ROLES } from "@/types/role.types";
import { CaretakerProfilePage } from "@/components/Caretaker/CaretakerProfilePage";
import { CaretakerLayout } from "@/layouts/CaretakerLayout";

// Placeholder components for future features
const CaretakerDashboard = () => (
  <div className="p-6 lg:p-8">
    <h1 className="text-2xl font-bold" style={{ color: "#7C5A3B" }}>Dashboard</h1>
    <p className="mt-2" style={{ color: "#8B6F47" }}>Welcome to your caretaker dashboard.</p>
  </div>
);

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

        {/* Profile */}
        <Route path="profile" element={<CaretakerProfilePage />} />
      </Route>
    </Routes>
  );
};

