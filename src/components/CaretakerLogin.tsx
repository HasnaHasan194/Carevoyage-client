import type React from "react";
import { useState } from "react";
import toast from "react-hot-toast";
import { Button } from "@/components/User/button";
import { Input } from "@/components/User/input";
import { Label } from "@/components/User/label";
import { useCaretakerLoginMutation } from "@/hooks/caretaker/useCaretaker";
import { loginSchema } from "@/validations/login.schema";
import { useDispatch } from "react-redux";
import { loginUser } from "@/store/slices/userSlice";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/config/env";
import type { User } from "@/types/auth.types";
import { Loader2, Heart } from "lucide-react";
import { ForgotPasswordModal } from "@/components/ForgotPasswordModal";
import { caretakerApi } from "@/services/caretaker/caretakerService";

export function CaretakerLoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { mutate: login, isPending } = useCaretakerLoginMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
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
        onSuccess: async (response) => {
          if (response.user) {
            const userData: User = {
              id: response.user.id,
              firstName: response.user.firstName,
              lastName: response.user.lastName,
              email: response.user.email,
              role: response.user.role as User["role"],
            };

            // Store access token in localStorage
            if (response.accessToken) {
              localStorage.setItem("accessToken", response.accessToken);
            }

            dispatch(loginUser(userData));
            toast.success(response.message || "Login successful");
            
            // Check verification status
            try {
              const statusResponse = await caretakerApi.getVerificationStatus();
              const verificationStatus = statusResponse.data.verificationStatus;
              
              // Redirect based on verification status
              if (!verificationStatus || verificationStatus !== "verified") {
                // Not verified - redirect to verification page
                navigate(ROUTES.CARETAKER_VERIFICATION);
              } else {
                // Verified - go to profile page
                navigate(ROUTES.CARETAKER_PROFILE);
              }
            } catch {
              // If status check fails, redirect to verification to be safe
              navigate(ROUTES.CARETAKER_VERIFICATION);
            }
          }
        },
        onError: (error: unknown) => {
          const errorMessage =
            (error as { response?: { data?: { message?: string } } })?.response
              ?.data?.message || "Invalid email or password";
          toast.error(errorMessage);
        },
      }
    );
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left Side - Hero Section */}
      <div
        className="w-full lg:w-1/2 flex flex-col justify-between px-8 lg:px-12 py-10 lg:py-16"
        style={{ backgroundColor: "#FAF7F2" }}
      >
        <div>
          {/* Logo and Title */}
          <h1
            className="text-3xl lg:text-4xl font-bold mb-2"
            style={{ color: "#D4A574" }}
          >
            CareVoyage
          </h1>
          <div className="flex items-center gap-2 mb-6">
            <Heart className="h-4 w-4" style={{ color: "#D4A574" }} />
            <span className="text-sm" style={{ color: "#8B6F47" }}>
              Caretaker Portal
            </span>
          </div>

          <p
            className="text-base lg:text-lg leading-relaxed max-w-md"
            style={{ color: "#6B5B4F" }}
          >
            Welcome back, caretaker! Continue providing compassionate care and
            support to those who need it most.
          </p>
        </div>

        {/* Hero Image Card */}
        <div className="mt-8 lg:mt-0">
          <div
            className="relative rounded-2xl overflow-hidden shadow-xl"
            style={{ aspectRatio: "16/10" }}
          >
            <img
              src="/caretaker-login-hero.jpg"
              alt="Caretaker with elderly person in autumn park"
              className="w-full h-full object-cover"
            />

            {/* Gradient Overlay */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "linear-gradient(to top, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.2) 40%, transparent 70%)",
              }}
            />

            {/* Text Overlay */}
            <div className="absolute bottom-5 left-5 right-5">
              <h3
                className="text-xl lg:text-2xl font-bold text-white drop-shadow-lg"
              >
                Continue Your Journey
              </h3>
              <p className="mt-1 text-sm text-white/90 drop-shadow">
                Your care makes a difference every day
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="flex justify-between mt-6 px-2">
            <div className="text-center">
              <p
                className="text-2xl font-bold"
                style={{ color: "#D4A574" }}
              >
                24/7
              </p>
              <p className="text-xs" style={{ color: "#8B6F47" }}>
                Support
              </p>
            </div>
            <div className="text-center">
              <p
                className="text-2xl font-bold"
                style={{ color: "#D4A574" }}
              >
                100%
              </p>
              <p className="text-xs" style={{ color: "#8B6F47" }}>
                Secure
              </p>
            </div>
            <div className="text-center">
              <p
                className="text-2xl font-bold"
                style={{ color: "#D4A574" }}
              >
                5★
              </p>
              <p className="text-xs" style={{ color: "#8B6F47" }}>
                Rated Service
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div
        className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12 lg:py-0"
        style={{ backgroundColor: "#FFFFFF" }}
      >
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <img
              src="/logo for CareVoyag.png"
              alt="CareVoyage Logo"
              className="h-16 w-auto object-contain"
            />
          </div>

          {/* Title */}
          <h2
            className="text-2xl lg:text-3xl font-bold text-center mb-2"
            style={{ color: "#8B6F47" }}
          >
            Welcome Back
          </h2>
          <p
            className="text-center text-sm mb-8"
            style={{ color: "#A89880" }}
          >
            Sign in to continue your caregiving journey
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label
                htmlFor="email"
                style={{ color: "#6B5B4F", fontWeight: 500 }}
              >
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) {
                    setErrors({ ...errors, email: "" });
                  }
                }}
                className={errors.email ? "border-red-500" : ""}
                disabled={isPending}
                style={{
                  backgroundColor: "#FAFAFA",
                  border: "1px solid #E5DDD3",
                  borderRadius: "8px",
                  padding: "14px 16px",
                  color: "#5C4D3C",
                }}
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email}</p>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label
                  htmlFor="password"
                  style={{ color: "#6B5B4F", fontWeight: 500 }}
                >
                  Password
                </Label>
                <button
                  type="button"
                  onClick={() => setShowForgotPassword(true)}
                  className="text-sm hover:underline"
                  style={{ color: "#D4A574" }}
                >
                  Forgot Password?
                </button>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errors.password) {
                    setErrors({ ...errors, password: "" });
                  }
                }}
                className={errors.password ? "border-red-500" : ""}
                disabled={isPending}
                style={{
                  backgroundColor: "#FAFAFA",
                  border: "1px solid #E5DDD3",
                  borderRadius: "8px",
                  padding: "14px 16px",
                  color: "#5C4D3C",
                }}
              />
              {errors.password && (
                <p className="text-sm text-red-500">{errors.password}</p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full text-white font-semibold transition-all duration-300 hover:opacity-90"
              disabled={isPending}
              style={{
                backgroundColor: "#D4A574",
                borderRadius: "8px",
                padding: "14px",
                fontSize: "16px",
                boxShadow: "0 4px 15px rgba(212, 165, 116, 0.3)",
              }}
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>

          {/* Footer */}
          <p
            className="text-center mt-6 text-sm"
            style={{ color: "#A89880" }}
          >
            Don't have an account? Contact your agency to receive an invitation.
          </p>
        </div>
      </div>

      <ForgotPasswordModal
        isOpen={showForgotPassword}
        onClose={() => setShowForgotPassword(false)}
        role="caretaker"
      />
    </div>
  );
}
