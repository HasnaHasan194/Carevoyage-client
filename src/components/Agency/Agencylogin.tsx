"use client";

import type React from "react";
import { useState } from "react";
import toast from "react-hot-toast";

import { Button } from "@/components/User/button";
import { Input } from "@/components/User/input";
import { Label } from "@/components/User/label";

import { useAgencyloginMutation } from "@/hooks/auth/auth";
import { loginSchema } from "@/validations/login.schema";
import { useDispatch } from "react-redux";
import { loginUser } from "@/store/slices/userSlice";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/config/env";
import type { User } from "@/types/auth.types";
import { ForgotPasswordModal } from "@/components/ForgotPasswordModal";

export function AgencyLoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { mutate: agencyLogin, isPending } = useAgencyloginMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

 
    const result = loginSchema.safeParse({
      email,
      password,
    });

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((err) => {
        const field = err.path[0] as string;
        fieldErrors[field] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setErrors({});

    
    agencyLogin(result.data, {
      onSuccess: (response) => {
        if (response.user && response.accessToken) {
          const userData: User = {
            id: response.user.id,
            firstName: response.user.firstName,
            lastName: response.user.lastName,
            email: response.user.email,
            role: response.user.role,
          };
          
          // Store access token in localStorage (required for API requests)
          localStorage.setItem("accessToken", response.accessToken);
          
          // Store user data in Redux and localStorage
          dispatch(loginUser(userData));
          
          toast.success(
            response.message || "Agency login successful"
          );
          navigate(ROUTES.AGENCY_DASHBOARD);
        }
      },
      onError: (error: unknown) => {
        const errorMessage = 
          (error as { response?: { data?: { message?: string } } })?.response?.data?.message ||
          "Agency login failed";
        toast.error(errorMessage);
      },
    });
  };

  return (
    <div 
      className="min-h-screen flex"
      style={{ backgroundColor: '#F0F7FF' }}
    >
      {/* Left Side - Login Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-6 sm:px-12 lg:px-16 py-12">
        <div className="w-full max-w-md mx-auto">
          {/* Logo and Badge */}
          <div className="flex items-center gap-3 mb-8">
            <img
              src="/logo for CareVoyag.png"
              alt="CareVoyage Logo"
              className="h-12 w-auto object-contain"
            />
            <span 
              className="px-3 py-1 rounded-md text-sm font-medium"
              style={{ 
                backgroundColor: '#E6F2FF',
                color: '#4A90D9'
              }}
            >
              Agency Portal
            </span>
          </div>

          {/* Title Section */}
          <div className="mb-8">
            <h1 
              className="text-3xl sm:text-4xl font-bold mb-2"
              style={{ color: '#2C5282' }}
            >
              Agency Login
            </h1>
            <p style={{ color: '#718096' }}>
              Sign in to manage your CareVoyage agency
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label 
                style={{ color: '#4A5568', fontWeight: 500 }}
              >
                Email Address
              </Label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isPending}
                placeholder="agency@carevoyage.com"
                style={{
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #CBD5E0',
                  borderRadius: '8px',
                  padding: '14px 16px',
                  color: '#2D3748',
                  fontSize: '15px'
                }}
              />
              {errors.email && (
                <p className="text-sm text-red-500">
                  {errors.email}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label style={{ color: '#4A5568', fontWeight: 500 }}>
                  Password
                </Label>
                <button
                  type="button"
                  onClick={() => setShowForgotPassword(true)}
                  className="text-sm hover:underline font-medium"
                  style={{ color: '#4A90D9' }}
                >
                  Forgot Password?
                </button>
              </div>
              <Input
                type="password"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                disabled={isPending}
                placeholder="Enter your password"
                style={{
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #CBD5E0',
                  borderRadius: '8px',
                  padding: '14px 16px',
                  color: '#2D3748',
                  fontSize: '15px'
                }}
              />
              {errors.password && (
                <p className="text-sm text-red-500">
                  {errors.password}
                </p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full text-white font-semibold transition-all duration-300 hover:opacity-90 hover:scale-[1.01]"
              disabled={isPending}
              style={{
                backgroundColor: '#4A90D9',
                borderRadius: '8px',
                padding: '14px',
                fontSize: '16px',
                boxShadow: '0 4px 15px rgba(74, 144, 217, 0.3)'
              }}
            >
              {isPending ? "Logging in..." : "Sign In to Agency"}
            </Button>
          </form>

          {/* Footer */}
          <div className="mt-6 flex items-center justify-center gap-2 text-sm" style={{ color: '#718096' }}>
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
            </svg>
            <span>Secure Agency Access • Protected Dashboard</span>
          </div>

          <p 
            className="text-center mt-4 text-sm"
            style={{ color: '#4A5568' }}
          >
            Don't have an agency account?{" "}
            <a
              href="/agency/signup"
              className="font-semibold hover:underline"
              style={{ color: '#4A90D9' }}
            >
              Register
            </a>
          </p>
        </div>
      </div>

      {/* Right Side - Hero Section */}
      <div 
        className="hidden lg:flex lg:w-1/2 flex-col justify-center items-center px-12 py-12"
        style={{ backgroundColor: '#E8F4FF' }}
      >
        {/* Agency Portal Badge */}
        <div className="w-full max-w-lg">
          <div className="flex justify-end mb-6">
            <span 
              className="px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2"
              style={{ 
                backgroundColor: '#4A90D9',
                color: '#FFFFFF'
              }}
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" />
              </svg>
              Agency Portal
            </span>
          </div>

          {/* Title & Description */}
          <h2 
            className="text-3xl font-bold mb-3"
            style={{ color: '#2C5282' }}
          >
            Manage Travel Dreams
          </h2>
          <p 
            className="text-lg mb-8"
            style={{ color: '#718096' }}
          >
            Empowering accessible adventures for everyone.
          </p>

          {/* Hero Image Card */}
          {/* <div 
            className="relative rounded-2xl overflow-hidden shadow-2xl"
            style={{ aspectRatio: '16/10' }}
          >
            <img
              src="/agency-travel-hero.jpg"
              alt="Accessible travel - Person in wheelchair enjoying mountain view"
              className="w-full h-full object-cover"
            />
          </div> */}
          <div 
  className="relative rounded-2xl overflow-hidden shadow-2xl"
  style={{ aspectRatio: '16/10' }}
>
  <img
    src="/agency-travel-hero.jpg"
    alt="Accessible travel - Person in wheelchair enjoying mountain view"
    className="w-full h-full object-cover"
  />

  {/* Dark gradient for text readability */}
  <div
    className="absolute inset-0 pointer-events-none"
    style={{
      background:
        "linear-gradient(to top, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.25) 35%, transparent 60%)",
    }}
  />

  {/* Overlay Text */}
  <div className="absolute bottom-6 left-6 right-6">
    <h3 className="text-2xl font-bold text-white drop-shadow-lg">
      Agency Dashboard
    </h3>
    <p className="mt-1 text-sm text-white/90 drop-shadow">
      Manage journeys, partners, and bookings with ease.
    </p>
  </div>
</div>
        </div>
      </div>

      <ForgotPasswordModal
        isOpen={showForgotPassword}
        onClose={() => setShowForgotPassword(false)}
        role="agency_owner"
      />
    </div>
  );
}
