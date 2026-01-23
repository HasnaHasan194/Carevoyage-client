import { Route, Routes } from "react-router-dom";
import { CaretakerSignupForm } from "@/components/CaretakerSignup";
import { CaretakerLoginForm } from "@/components/CaretakerLogin";
import { CaretakerVerificationForm } from "@/components/CaretakerVerification";
import { UserHome } from "@/components/UserHome";
import { ResetPassword } from "@/components/ResetPassword";
import { ProtectedRoute } from "@/protected/ProtectedRoute";
import { NoAuthRoute } from "@/protected/NoAuthRoute";
import { ROLES } from "@/types/role.types";
import { ROUTES } from "@/config/env";
import { CaretakerProfilePage } from "@/components/Caretaker/CaretakerProfilePage";

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

      {/* Protected Caretaker Routes */}
      <Route
        path="verification"
        element={
          <ProtectedRoute
            element={<CaretakerVerificationForm />}
            allowedRoles={[ROLES.CARETAKER]}
          />
        }
      />
      <Route
        path="dashboard"
        element={
          <ProtectedRoute
            element={<UserHome />}
            allowedRoles={[ROLES.CARETAKER]}
          />
        }
      />
      <Route
        path="profile"
        element={
          <ProtectedRoute
            element={<CaretakerProfilePage />}
            allowedRoles={[ROLES.CARETAKER]}
          />
        }
      />
    </Routes>
  );
};

