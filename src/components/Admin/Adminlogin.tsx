"use client";

import type React from "react";
import { useState } from "react";
import toast from "react-hot-toast";

import { Button } from "../User/button";
import { Input } from "../User/input";
import { Label } from "../User/label";

import { useAdminloginMutation } from "@/hooks/auth/auth";
import { loginSchema } from "@/validations/login.schema";
import { useDispatch } from "react-redux";
import { loginUser } from "@/store/slices/userSlice";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/config/env";
import type { User } from "@/types/auth.types";
import { ForgotPasswordModal } from "@/components/ForgotPasswordModal";

export function AdminLoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { mutate: adminLogin, isPending } = useAdminloginMutation();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const result = loginSchema.safeParse({ email, password });

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((err) => {
        fieldErrors[err.path[0] as string] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setErrors({});

    adminLogin(result.data, {
      onSuccess: (response) => {
        if (response.user && response.accessToken) {
          const adminData: User = {
            id: response.user.id,
            firstName: response.user.firstName,
            lastName: response.user.lastName,
            email: response.user.email,
            role: response.user.role,
          };

          dispatch(loginUser(adminData));

          localStorage.setItem("accessToken", response.accessToken);
          localStorage.setItem("authSession", JSON.stringify(adminData));

          toast.success(response.message || "Admin login successful");
          navigate(ROUTES.ADMIN_DASHBOARD);
        }
      },
      onError: (error: unknown) => {
        const errorMessage =
          (error as { response?: { data?: { message?: string } } })?.response
            ?.data?.message || "Admin login failed";
        toast.error(errorMessage);
      },
    });
  };

  return (
    <div className="min-h-screen flex" style={{ background: "#F5EDE4" }}>
      {/* Left Panel - Login Form */}
      <div
        className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-10"
        style={{ background: "linear-gradient(180deg, #FDF8F3 0%, #F5EDE4 100%)" }}
      >
        <div className="w-full max-w-md">
          {/* Logo and Brand */}
          <div className="flex items-center gap-3 mb-10">
            <img
              src="/logo for CareVoyag.png"
              alt="CareVoyage Logo"
              className="w-12 h-12 object-contain"
            />
            <div>
              <h1 className="text-2xl font-bold" style={{ color: "#8B6914" }}>
                CareVoyage
              </h1>
              <span
                className="text-xs font-medium px-2 py-0.5 rounded"
                style={{ background: "#E8DFD5", color: "#6B5D4D" }}
              >
                Admin Portal
              </span>
            </div>
          </div>

          {/* Welcome Section */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold mb-2" style={{ color: "#3D3329" }}>
              Admin Login
            </h2>
            <p style={{ color: "#8B7355" }}>
              Sign in to manage the CareVoyage platform
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div className="space-y-2">
              <Label className="font-medium" style={{ color: "#5D4E37" }}>
                Email Address
              </Label>
              <Input
                type="email"
                placeholder="admin@carevoyage.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isPending}
                className="h-12 rounded-xl border-2 transition-all"
                style={{
                  borderColor: errors.email ? "#E57373" : "#E0D5C8",
                  background: "#FAF6F1",
                }}
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="font-medium" style={{ color: "#5D4E37" }}>
                  Password
                </Label>
                <button
                  type="button"
                  onClick={() => setShowForgotPassword(true)}
                  className="text-sm font-medium hover:underline"
                  style={{ color: "#B8942F" }}
                >
                  Forgot Password?
                </button>
              </div>
              <Input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isPending}
                className="h-12 rounded-xl border-2 transition-all"
                style={{
                  borderColor: errors.password ? "#E57373" : "#E0D5C8",
                  background: "#FAF6F1",
                }}
              />
              {errors.password && (
                <p className="text-sm text-red-500">{errors.password}</p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full h-12 rounded-xl text-base font-semibold text-white transition-all shadow-md hover:shadow-lg"
              style={{
                background: "linear-gradient(135deg, #8B6914 0%, #6B5010 100%)",
              }}
              disabled={isPending}
            >
              {isPending ? "Signing in..." : "Sign In to Admin"}
            </Button>
          </form>

          {/* Admin Info */}
          <div className="mt-8 pt-6" style={{ borderTop: "1px solid #E0D5C8" }}>
            <div
              className="flex items-center justify-center gap-2 text-xs"
              style={{ color: "#A99B8A" }}
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span>Secure Admin Access • Protected Dashboard</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Branding with Medium Image */}
      <div
        className="hidden lg:flex lg:w-1/2 flex-col justify-center items-center p-8"
        style={{ background: "linear-gradient(180deg, #FDF8F3 0%, #F0E6DA 100%)" }}
      >
        <div className="w-full max-w-lg">
          {/* Admin Badge */}
          <div className="flex justify-end mb-6">
            <div
              className="px-3 py-1.5 rounded-full shadow-md"
              style={{ background: "#E8DFD5" }}
            >
              <span className="text-sm font-semibold" style={{ color: "#8B6914" }}>
                🔐 Admin Portal
              </span>
            </div>
          </div>

          {/* Welcome Text */}
          <div className="mb-6">
            <h2 className="text-xl font-bold mb-1" style={{ color: "#3D3329" }}>
              Manage Travel Dreams
            </h2>
            <p className="text-sm" style={{ color: "#6B5D4D" }}>
              Empowering accessible adventures for everyone.
            </p>
          </div>

          {/* Image Card - Medium Size */}
          <div className="relative rounded-2xl overflow-hidden shadow-xl" style={{ height: "400px", background: "#E8DFD5" }}>
            <img
              src="/admin-travel.jpg"
              alt="Travel destination - Egypt pyramids"
              className="w-full h-full object-cover object-center"
              style={{ filter: "sepia(15%) saturate(95%)" }}
            />

            {/* Overlays */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "linear-gradient(135deg, rgba(139,105,20,0.15) 0%, rgba(166,133,26,0.1) 100%)",
              }}
            />
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "linear-gradient(to top, rgba(61,51,41,0.6) 0%, rgba(93,78,55,0.2) 30%, transparent 55%)",
              }}
            />

            {/* Overlay Text */}
            <div className="absolute bottom-5 left-5 right-5">
              <h3 className="text-2xl font-bold mb-1 drop-shadow-lg text-white">
                Admin Dashboard
              </h3>
              <p className="text-sm drop-shadow text-white/90">
                Control and manage the platform
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      <ForgotPasswordModal
        isOpen={showForgotPassword}
        onClose={() => setShowForgotPassword(false)}
        role="admin"
      />
    </div>
  );
}