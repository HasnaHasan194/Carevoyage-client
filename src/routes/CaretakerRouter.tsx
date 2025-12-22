import { Route, Routes } from "react-router-dom";
import { CaretakerSignupForm } from "@/components/CaretakerSignup";
import { CaretakerLoginForm } from "@/components/CaretakerLogin";
import { UserHome } from "@/components/UserHome";
import { ProtectedRoute } from "@/protected/ProtectedRoute";
import { NoAuthRoute } from "@/protected/NoAuthRoute";
import {  ROLES } from "@/config/env";

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

      {/* Protected Caretaker Routes */}
      <Route
        path="dashboard"
        element={
          <ProtectedRoute
            element={<UserHome />}
            allowedRoles={[ROLES.CARETAKER]}
          />
        }
      />
    </Routes>
  );
};

