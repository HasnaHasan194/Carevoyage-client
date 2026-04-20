
"use client";

import type React from "react";
import { useState } from "react";
import toast from "react-hot-toast";

import { Button } from "@/components/User/button";
import { Input } from "@/components/User/input";
import { Label } from "@/components/User/label";
import { PasswordField } from "@/components/common/PasswordField";

import { useLoginMutation, useGoogleAuthMutation } from "@/hooks/auth/auth";
import { loginSchema } from "@/validations/login.schema";
import { useDispatch } from "react-redux";
import { loginUser } from "@/store/slices/userSlice";
import { useNavigate } from "react-router-dom";
import type { User } from "@/types/auth.types";
import { ForgotPasswordModal } from "@/components/ForgotPasswordModal";
import { useGoogleLogin } from "@react-oauth/google";
import { useQueryClient } from "@tanstack/react-query";


export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { mutate: login, isPending } = useLoginMutation();
  const { mutate: googleAuth, isPending: isGooglePending } =
    useGoogleAuthMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // -------------------------
  // Normal Email/Password Login
  // -------------------------
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const result = loginSchema.safeParse({
      email,
      password,
    });

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as string;
        fieldErrors[field] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setErrors({});

    login(
      { email, password },
      {
        onSuccess: (response) => {
          if (response.user) {
            const userData: User = {
              id: response.user.id,
              firstName: response.user.firstName,
              lastName: response.user.lastName,
              email: response.user.email,
              role: response.user.role as User["role"],
            };

            localStorage.setItem("authSession", JSON.stringify(userData));

            if (response.accessToken) {
              localStorage.setItem("accessToken", response.accessToken);
            }

            // Invalidate React Query cache to clear any stale role data from previous login
            queryClient.invalidateQueries({ queryKey: ["authMe"] });

            // Dispatch to Redux to keep state in sync
            dispatch(loginUser(userData));

            toast.success(response.message || "Login successful");
            navigate("/")
          }
        },
        onError: (error: unknown) => {
          const errorMessage =
            (error as { response?: { data?: { message?: string } } })?.response
              ?.data?.message || "Login failed";
          toast.error(errorMessage);
        },
      }
    );
  };

  // -------------------------
  // Google Login (USER ONLY)
  // -------------------------
  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      googleAuth(
        { accessToken: tokenResponse.access_token },
        {
          onSuccess: (response) => {
            if (response.user) {
              const userData: User = {
                id: response.user.id,
                firstName: response.user.firstName,
                lastName: response.user.lastName,
                email: response.user.email,
                role: response.user.role as User["role"],
                profileImage: response.user.profileImage,
              };

              // Save session to localStorage
              localStorage.setItem("authSession", JSON.stringify(userData));

              if (response.accessToken) {
                localStorage.setItem("accessToken", response.accessToken);
              }

              // Invalidate React Query cache to clear any stale role data from previous login
              queryClient.invalidateQueries({ queryKey: ["authMe"] });

              // Dispatch to Redux to keep state in sync and prevent stale role data
              dispatch(loginUser(userData));

              toast.success(response.message || "Login successful");
              navigate("/")
            }
          },
          onError: () => {
            toast.error("Google login failed");
          },
        }
      );
    },
    onError: () => {
      toast.error("Google authentication failed");
    },
  });

  return (
    <div className="min-h-screen flex" style={{ background: '#F5EDE4' }}>
      {/* Left Panel - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-10" style={{ background: 'linear-gradient(180deg, #FDF8F3 0%, #F5EDE4 100%)' }}>
        <div className="w-full max-w-md">
          {/* Logo and Brand */}
          <div className="flex items-center gap-3 mb-10">
            <img 
              src="/logo for CareVoyag.png" 
              alt="CareVoyage Logo"
              className="w-12 h-12 object-contain"
            />
            <h1 className="text-2xl font-bold" style={{ color: '#8B6914' }}>CareVoyage</h1>
          </div>

          {/* Welcome Section */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold mb-2" style={{ color: '#3D3329' }}>Welcome Back</h2>
            <p style={{ color: '#8B7355' }}>Sign in to continue your journey with CareVoyage</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div className="space-y-2">
              <Label className="font-medium" style={{ color: '#5D4E37' }}>Email</Label>
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-12 rounded-xl border-2 transition-all"
                style={{ 
                  borderColor: errors.email ? '#E57373' : '#E0D5C8',
                  background: '#FAF6F1'
                }}
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="font-medium" style={{ color: '#5D4E37' }}>Password</Label>
                <button
                  type="button"
                  onClick={() => setShowForgotPassword(true)}
                  className="text-sm font-medium hover:underline"
                  style={{ color: '#B8942F' }}
                >
                  Forgot Password?
                </button>
              </div>
              <PasswordField
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                error={errors.password}
                inputClassName="h-12 rounded-xl border-2 transition-all"
                inputStyle={{
                  borderColor: errors.password ? "#E57373" : "#E0D5C8",
                  background: "#FAF6F1",
                }}
              />
            </div>

            <Button
              type="submit"
              className="w-full h-12 rounded-xl text-base font-semibold text-white transition-all shadow-md hover:shadow-lg"
              style={{ background: 'linear-gradient(135deg, #C9A227 0%, #A6851A 100%)' }}
              disabled={isPending || isGooglePending}
            >
              {isPending ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          {/* Sign Up Link */}
          <div className="text-center mt-6">
            <span style={{ color: '#8B7355' }}>Don't have an account? </span>
            <a href="/signup" className="font-semibold hover:underline" style={{ color: '#B8942F' }}>
              Sign up
            </a>
          </div>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full" style={{ borderTop: '1px solid #E0D5C8' }} />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4" style={{ background: '#F8F2EB', color: '#A99B8A' }}>Or continue with</span>
            </div>
          </div>

          {/* Google Login */}
          <Button
            type="button"
            variant="outline"
            className="w-full h-12 rounded-xl font-medium border-2 transition-all"
            style={{ borderColor: '#E0D5C8', background: '#FAF6F1', color: '#5D4E37' }}
            onClick={() => googleLogin()}
            disabled={isPending || isGooglePending}
          >
            <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            {isGooglePending ? "Signing in..." : "Sign in with Google"}
          </Button>

          {/* Feature Badges */}
          <div className="flex justify-center gap-6 mt-8 pt-6" style={{ borderTop: '1px solid #E0D5C8' }}>
            <span className="text-xs font-medium" style={{ color: '#8B7355' }}>♿ 100% Accessible</span>
            <span className="text-xs font-medium" style={{ color: '#8B7355' }}>🛡️ 24/7 Support</span>
            <span className="text-xs font-medium" style={{ color: '#C9A227' }}>⭐ 5-Star Rated</span>
          </div>
        </div>
      </div>

      {/* Right Panel - Full Image */}
      <div className="hidden lg:block lg:w-1/2 relative">
        <img 
          src="/accessible-travel.jpg" 
          alt="Accessible travel - caretaker and wheelchair user enjoying mountain view"
          className="w-full h-full object-cover"
          style={{ filter: 'sepia(20%) saturate(90%)' }}
        />
        {/* Warm brownish overlay to match nude theme */}
        <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(139,99,69,0.3) 0%, rgba(166,133,26,0.2) 50%, rgba(201,162,39,0.15) 100%)' }} />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(61,51,41,0.7) 0%, rgba(93,78,55,0.3) 40%, transparent 70%)' }} />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, rgba(245,237,228,0.3) 0%, transparent 30%)' }} />
        
        {/* Overlay Text */}
        <div className="absolute bottom-10 left-10 right-10">
          <h3 className="text-3xl font-bold mb-2 drop-shadow-lg" style={{ color: '#FDF8F3' }}>Every Journey Begins with Care</h3>
          <p className="text-lg drop-shadow" style={{ color: '#F5EDE4', opacity: 0.95 }}>Experience accessible travel that opens the world to everyone.</p>
        </div>
      </div>

      {/* Forgot Password Modal */}
      <ForgotPasswordModal
        isOpen={showForgotPassword}
        onClose={() => setShowForgotPassword(false)}
        role="client"
      />
    </div>
  );
}
