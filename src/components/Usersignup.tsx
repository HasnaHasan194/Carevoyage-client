"use client";

import type React from "react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/User/button";
import { Input } from "@/components/User/input";
import { Label } from "@/components/User/label";

import { registerSchema } from "@/validations/register.schema";
import {
  useSendOtpMutation,
  useResendOtpMutation,
  useVerifyOtpMutation,
} from "@/hooks/auth/useOtp";

import { OTPModal } from "./OtpModal";
import { AxiosError } from "axios";

export function UserSignupForm() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);

  const navigate = useNavigate();

  const { mutate: sendOtp } = useSendOtpMutation();
  const { mutate: verifyOtp } = useVerifyOtpMutation();
  const { mutate: resendOtp } = useResendOtpMutation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const result = registerSchema.safeParse({
      firstName,
      lastName,
      email,
      phone,
      password,
      confirmPassword,
      role: "client",
    });

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((err) => {
        fieldErrors[err.path[0] as string] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    if (password !== confirmPassword) {
      setErrors({ confirmPassword: "Passwords do not match" });
      return;
    }

    setErrors({});

    sendOtp(
      { email, phone },
      {
        onSuccess: (response) => {
          toast.success(response.data?.message || "OTP sent successfully");
          setIsOtpModalOpen(true);
        },
        onError: (error: unknown) => {
          const message =
            (error as { response?: { data?: { message?: string } } })?.response
              ?.data?.message || "Failed to send OTP";
          toast.error(message);
        },
      }
    );
  };

  const handleVerifyOtp = (otp: string) => {
    verifyOtp(
      {
        email,
        otp,
        userData: {
          firstName,
          lastName,
          email,
          phone,
          password,
          role: "client",
        },
      },
      {
        onSuccess: (response) => {
          toast.success(
            response.data?.message || "Account created successfully"
          );
          setIsOtpModalOpen(false);
          navigate("/login");
        },
        onError: (error) => {
          if (error instanceof AxiosError) {
            toast.error(error.response?.data?.message || "Signup failed");
          } else {
            toast.error("Something went wrong");
          }
        },
      }
    );
  };

  return (
    <div className="min-h-screen flex bg-[#F5EDE4]">
      {/* LEFT – SIGNUP FORM */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-10 bg-linear-to-b from-[#FDF8F3] to-[#F5EDE4]">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-10">
            <img
              src="/logo for CareVoyag.png"
              alt="CareVoyage Logo"
              className="w-12 h-12 object-contain"
            />
            <h1 className="text-2xl font-bold text-[#8B6914]">CareVoyage</h1>
          </div>

          {/* Heading */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold mb-2 text-[#3D3329]">
              Create Account
            </h2>
            <p className="text-[#8B7355]">
              Join CareVoyage and start your journey
            </p>
          </div>

          {/* FORM */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label className="text-[#5D4E37]">First Name</Label>
                <Input
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
                {errors.firstName && (
                  <p className="text-sm text-red-500">{errors.firstName}</p>
                )}
              </div>

              <div>
                <Label className="text-[#5D4E37]">Last Name</Label>
                <Input
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
                {errors.lastName && (
                  <p className="text-sm text-red-500">{errors.lastName}</p>
                )}
              </div>
            </div>

            <div>
              <Label className="text-[#5D4E37]">Email</Label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email}</p>
              )}
            </div>

            <div>
              <Label className="text-[#5D4E37]">Phone</Label>
              <Input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
              {errors.phone && (
                <p className="text-sm text-red-500">{errors.phone}</p>
              )}
            </div>

            <div>
              <Label className="text-[#5D4E37]">Password</Label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {errors.password && (
                <p className="text-sm text-red-500">{errors.password}</p>
              )}
            </div>

            <div>
              <Label className="text-[#5D4E37]">Confirm Password</Label>
              <Input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              {errors.confirmPassword && (
                <p className="text-sm text-red-500">{errors.confirmPassword}</p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full h-12 rounded-xl text-white font-semibold shadow-md"
              style={{
                background: "linear-gradient(135deg, #C9A227 0%, #A6851A 100%)",
              }}
            >
              Create Account
            </Button>
          </form>

          {/* Footer */}
          <p className="text-center mt-6 text-sm text-[#8B7355]">
            Already have an account?{" "}
            <a
              href="/login"
              className="font-semibold hover:underline text-[#B8942F]"
            >
              Sign in
            </a>
          </p>
        </div>
      </div>

      {/* RIGHT – IMAGE (SAME AS LOGIN) */}
      <div className="hidden lg:block lg:w-1/2 relative">
        <img
          src="/accessible-travel.jpg"
          alt="Accessible travel"
          className="w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/30 to-transparent" />

        <div className="absolute bottom-10 left-10 right-10">
          <h3 className="text-3xl font-bold text-white drop-shadow-lg">
            Every Journey Begins with Care
          </h3>
          <p className="text-lg text-white/90 mt-2 drop-shadow">
            Accessible travel experiences made for everyone.
          </p>
        </div>
      </div>

      <OTPModal
        isOpen={isOtpModalOpen}
        email={email}
        onVerify={handleVerifyOtp}
        onResend={() => resendOtp(email)}
        onClose={() => setIsOtpModalOpen(false)}
      />
    </div>
  );
}
