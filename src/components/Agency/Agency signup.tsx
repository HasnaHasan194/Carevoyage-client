"use client";

import type React from "react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/User/button";
import { Input } from "@/components/User/input";

import { agencyRegisterSchema } from "@/validations/agency.schema";
import {
  useSendOtpMutation,
  useResendOtpMutation,
  useVerifyOtpAndCreateAgencyMutation,
} from "@/hooks/auth/useOtp";

import { OTPModal } from "../OtpModal";
import { AxiosError } from "axios";


export function AgencySignupForm() {
  const [agencyName, setAgencyName] = useState("");
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");
  const [registrationNumber, setRegistrationNumber] = useState("");

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
  const { mutate: resendOtp } = useResendOtpMutation();
  const { mutate: verifyCreateAgency } = useVerifyOtpAndCreateAgencyMutation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const result = agencyRegisterSchema.safeParse({
      firstName,
      lastName,
      email,
      phone,
      password,
      confirmPassword,
      role: "agency_owner",
      agencyName,
      address,
      registrationNumber,
      description,
    });

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((err) => {
        fieldErrors[err.path[0] as string] = err.message;
      });
      setErrors(fieldErrors);
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
        onError: (error) => {
          if(error instanceof AxiosError){
          toast.error(error?.response?.data?.message || "Failed to send OTP");
          }else{
            toast.error("something went wrong ")
          }
          
        },
      }
    );
  };

  const handleVerifyOtp = (otp: string) => {
    verifyCreateAgency(
      {
        email,
        otp,
        agencyData: {
          agencyName,
          address,
          registrationNumber,
          description,
          userData: {
            firstName,
            lastName,
            email,
            phone,
            password,
            role: "agency_owner",
          },
        },
      },
      {
        onSuccess: () => {
          toast.success("Agency created successfully");
          setIsOtpModalOpen(false);
          navigate("/agency/dashboard");
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
    <div className="min-h-screen flex bg-[#F0F7FF]">
      {/* LEFT – SIGNUP FORM */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-6 sm:px-12 lg:px-16 py-12">
        <div className="w-full max-w-xl mx-auto">
          {/* Logo + Badge */}
          <div className="flex items-center gap-3 mb-8">
            <img
              src="/logo for CareVoyag.png"
              alt="CareVoyage Logo"
              className="h-12 w-auto object-contain"
            />
            <span className="px-3 py-1 rounded-md text-sm font-medium bg-[#E6F2FF] text-[#4A90D9]">
              Agency Registration
            </span>
          </div>

          {/* Title */}
          <div className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold mb-2 text-[#2C5282]">
              Create Agency Account
            </h1>
            <p className="text-[#718096]">
              Register your agency to partner with CareVoyage
            </p>
          </div>

          {/* FORM */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              placeholder="Agency Name"
              value={agencyName}
              onChange={(e) => setAgencyName(e.target.value)}
            />
            {errors.agencyName && (
              <p className="text-sm text-red-500">{errors.agencyName}</p>
            )}

            <Input
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            {errors.description && (
              <p className="text-sm text-red-500">{errors.description}</p>
            )}

            <Input
              placeholder="Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
            {errors.address && (
              <p className="text-sm text-red-500">{errors.address}</p>
            )}

            <Input
              placeholder="Registration Number"
              value={registrationNumber}
              onChange={(e) => setRegistrationNumber(e.target.value)}
            />
            {errors.registrationNumber && (
              <p className="text-sm text-red-500">
                {errors.registrationNumber}
              </p>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                placeholder="First Name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
              <Input
                placeholder="Last Name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>

            <Input
              placeholder="Phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />

            <Button className="w-full bg-[#4A90D9] hover:opacity-90 text-white font-semibold">
              Create Agency Account
            </Button>
          </form>

          <p className="text-center mt-6 text-sm text-[#4A5568]">
            Already registered?{" "}
            <a
              href="/agency/login"
              className="font-semibold text-[#4A90D9] hover:underline"
            >
              Sign in
            </a>
          </p>
        </div>
      </div>

      {/* RIGHT – HERO (SAME AS LOGIN) */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-center items-center px-12 py-12 bg-[#E8F4FF]">
        <div className="w-full max-w-lg">
          <div className="flex justify-end mb-6">
            <span className="px-4 py-2 rounded-full text-sm font-medium bg-[#4A90D9] text-white">
              Agency Portal
            </span>
          </div>

          <h2 className="text-3xl font-bold mb-3 text-[#2C5282]">
            Build Accessible Journeys
          </h2>
          <p className="text-lg mb-8 text-[#718096]">
            Partner with CareVoyage to create inclusive travel experiences.
          </p>

          <div className="relative rounded-2xl overflow-hidden shadow-2xl aspect-16/10">
            <img
              src="/agency-travel-hero.jpg"
              alt="Accessible travel"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/30 to-transparent" />

            <div className="absolute bottom-6 left-6 right-6">
              <h3 className="text-2xl font-bold text-white">
                Agency Dashboard
              </h3>
              <p className="text-sm text-white/90">
                Manage trips, partners & bookings
              </p>
            </div>
          </div>
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
