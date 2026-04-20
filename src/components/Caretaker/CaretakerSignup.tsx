

"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import type { Role } from "@/types/role.types";
import toast from "react-hot-toast";

import { Button } from "@/components/User/button";
import { Input } from "@/components/User/input";
import { Label } from "@/components/User/label";
import { PasswordField } from "@/components/common/PasswordField";

import {
  useVerifyInvite,
  useCaretakerSignupMutation,
} from "@/hooks/caretaker/useCaretaker";
import { ROUTES } from "@/config/env";
import { useDispatch } from "react-redux";
import { loginUser } from "@/store/slices/userSlice";
import { Loader2, Heart } from "lucide-react";
import { caretakerSignupSchema } from "@/validations/caretaker-signup.schema";

export function CaretakerSignupForm() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const token = searchParams.get("token");

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { data: inviteData, isLoading, error } = useVerifyInvite(token);
  const { mutate: signup, isPending } = useCaretakerSignupMutation();

  useEffect(() => {
    if (error) {
      toast.error("Invalid or expired invitation link");
      navigate(ROUTES.LOGIN);
    }
  }, [error, navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) {
      toast.error("Invalid invitation link");
      return;
    }

    const result = caretakerSignupSchema.safeParse({
      token,
      firstName,
      lastName,
      phone,
      password,
      confirmPassword,
    });

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        const key = issue.path[0] as string;
        fieldErrors[key] = fieldErrors[key]
          ? `${fieldErrors[key]} ${issue.message}`
          : issue.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setErrors({});

    signup(
      {
        token: result.data.token,
        firstName: result.data.firstName,
        lastName: result.data.lastName,
        phone: result.data.phone,
        password: result.data.password,
      },
      {
        onSuccess: (res) => {
          if (res.data) {
            const user = {
              id: res.data.id,
              firstName: res.data.firstName,
              lastName: res.data.lastName,
              email: res.data.email,
              role: res.data.role as Role,
            };

            if (res.accessToken) {
              localStorage.setItem("accessToken", res.accessToken);
            }

            dispatch(loginUser(user));
            toast.success("Account created successfully");
            // Always redirect to verification after signup
            navigate(ROUTES.CARETAKER_VERIFICATION);
          }
        },
        onError: () => toast.error("Signup failed"),
      }
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAF7F2]">
        <Loader2 className="h-8 w-8 animate-spin text-[#D4A574]" />
      </div>
    );
  }

  if (!inviteData?.data) return null;

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* LEFT – HERO (SAME AS LOGIN) */}
      <div className="w-full lg:w-1/2 flex flex-col justify-between px-8 lg:px-12 py-10 lg:py-16 bg-[#FAF7F2]">
        <div>
          <h1 className="text-3xl lg:text-4xl font-bold mb-2 text-[#D4A574]">
            CareVoyage
          </h1>
          <div className="flex items-center gap-2 mb-6">
            <Heart className="h-4 w-4 text-[#D4A574]" />
            <span className="text-sm text-[#8B6F47]">
              Caretaker Portal
            </span>
          </div>

          <p className="text-base lg:text-lg max-w-md text-[#6B5B4F]">
            You’ve been invited to join{" "}
            <span className="font-semibold">
              {inviteData.data.agencyName}
            </span>{" "}
            as a caretaker.
          </p>
        </div>

        <div className="mt-10">
          <div className="relative rounded-2xl overflow-hidden shadow-xl aspect-16/10">
            <img
              src="/caretaker-login-hero.jpg"
              alt="Caretaker journey"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/30 to-transparent" />
            <div className="absolute bottom-5 left-5 right-5">
              <h3 className="text-xl lg:text-2xl font-bold text-white">
                Start Your Journey
              </h3>
              <p className="text-sm text-white/90">
                Compassion begins with you
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT – SIGNUP FORM */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12 bg-white">
        <div className="w-full max-w-md">
          <h2 className="text-2xl lg:text-3xl font-bold text-center mb-2 text-[#8B6F47]">
            Complete Registration
          </h2>
          <p className="text-center text-sm mb-8 text-[#A89880]">
            Create your caretaker account
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-[#6B5B4F]">First Name</Label>
                <Input value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                {errors.firstName && <p className="text-xs text-red-500">{errors.firstName}</p>}
              </div>

              <div>
                <Label className="text-[#6B5B4F]">Last Name</Label>
                <Input value={lastName} onChange={(e) => setLastName(e.target.value)} />
                {errors.lastName && <p className="text-xs text-red-500">{errors.lastName}</p>}
              </div>
            </div>

            <div>
              <Label className="text-[#6B5B4F]">Phone</Label>
              <Input value={phone} onChange={(e) => setPhone(e.target.value)} />
              {errors.phone && <p className="text-xs text-red-500">{errors.phone}</p>}
            </div>

            <PasswordField
              label="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={errors.password}
              labelClassName="text-[#6B5B4F]"
            />

            <PasswordField
              label="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              error={errors.confirmPassword}
              labelClassName="text-[#6B5B4F]"
            />

            <Button
              type="submit"
              disabled={isPending}
              className="w-full bg-[#D4A574] hover:bg-[#C49664] text-white"
            >
              {isPending ? "Creating Account..." : "Create Account"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
