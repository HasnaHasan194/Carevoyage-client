"use client";

import type React from "react";
import { useState } from "react";
import toast from "react-hot-toast";

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

import { useAgencyloginMutation } from "@/hooks/auth/auth";
import { loginSchema } from "@/validations/login.schema";
import { useDispatch } from "react-redux";
import { loginUser } from "@/store/slices/userSlice";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/config/env";
import type { User } from "@/types/auth.types";

export function AgencyLoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
        if (response.user) {
          const userData: User = {
            id: response.user.id,
            firstName: response.user.firstName,
            lastName: response.user.lastName,
            email: response.user.email,
            role: response.user.role,
          };
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
    <div className="min-h-screen flex items-center justify-center bg-[#FAF7F2] px-4">
      <Card className="w-full max-w-md border-border shadow-lg">
        <CardHeader className="space-y-2 text-center">
          <CardTitle className="text-2xl font-bold">
            Agency Login
          </CardTitle>
          <CardDescription>
            Sign in to manage your agency
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <Label>Email</Label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isPending}
              />
              {errors.email && (
                <p className="text-sm text-red-500">
                  {errors.email}
                </p>
              )}
            </div>

            <div className="space-y-1">
              <Label>Password</Label>
              <Input
                type="password"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                disabled={isPending}
              />
              {errors.password && (
                <p className="text-sm text-red-500">
                  {errors.password}
                </p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isPending}
            >
              {isPending ? "Logging in..." : "Login"}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="text-center text-sm text-muted-foreground">
          Don’t have an agency account?{" "}
          <a
            href="/agency/signup"
            className="text-primary hover:underline"
          >
            Register
          </a>
        </CardFooter>
      </Card>
    </div>
  );
}
