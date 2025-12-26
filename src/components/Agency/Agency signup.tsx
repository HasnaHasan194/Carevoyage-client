"use client";

import type React from "react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/User/button";
import { Input } from "@/components/User/input";
import { Label } from "@/components/User/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/User/card";

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

    console.log(result);

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

    sendOtp(
      { email, phone },
      {
        onSuccess: (response) => {
          toast.success(response.data?.message || "OTP sent successfully");

          setIsOtpModalOpen(true);
        },
        onError: (error: any) => {
          toast.error(error?.response?.data.message || "Failed to send otp");
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
    <div className="min-h-screen flex items-center justify-center bg-[#FAF7F2] px-4">
      <Card className="border-border shadow-lg max-w-2xl w-full">
        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-3xl font-bold">
            Create Your Agency Account
          </CardTitle>
          <CardDescription>
            Register your agency to join CareVoyage
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Label>Agency Name</Label>
            <Input
              value={agencyName}
              onChange={(e) => setAgencyName(e.target.value)}
            />
            {errors.agencyName && (
              <p className="text-red-500 text-sm">{errors.agencyName}</p>
            )}

            <Label>Description</Label>
            <Input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            {errors.description && (
              <p className="text-red-500 text-sm">{errors.description}</p>
            )}
            <Label>Address</Label>
            <Input
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
            {errors.address && (
              <p className="text-red-500 text-sm">{errors.address}</p>
            )}

            <Label>Registration Number</Label>
            <Input
              value={registrationNumber}
              onChange={(e) => setRegistrationNumber(e.target.value)}
            />
            {errors.registrationNumber && (
              <p className="text-red-500 text-sm">
                {errors.registrationNumber}
              </p>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Input
                  placeholder="First Name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
                {errors.firstName && (
                  <p className="text-red-500 text-sm">{errors.firstName}</p>
                )}
              </div>

              <div>
                <Input
                  placeholder="Last Name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
                {errors.lastName && (
                  <p className="text-red-500 text-sm">{errors.lastName}</p>
                )}
              </div>
            </div>

            <Input
              placeholder="Phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            {errors.phone && (
              <p className="text-red-500 text-sm">{errors.phone}</p>
            )}
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email}</p>
            )}

            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password}</p>
            )}
            <Input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm">{errors.confirmPassword}</p>
            )}

            <Button type="submit" className="w-full">
              Create Agency Account
            </Button>
          </form>
        </CardContent>

        <CardFooter className="text-center text-sm">
          Already registered?{" "}
          <a href="/agency/login" className="text-primary">
            Sign in
          </a>
        </CardFooter>
      </Card>

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
