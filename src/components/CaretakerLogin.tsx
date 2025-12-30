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
import { useCaretakerLoginMutation } from "@/hooks/caretaker/useCaretaker";
import { loginSchema } from "@/validations/login.schema";
import { useDispatch } from "react-redux";
import { loginUser } from "@/store/slices/userSlice";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/config/env";
import type { User } from "@/types/auth.types";
import { Loader2, Heart } from "lucide-react";
import { ForgotPasswordModal } from "@/components/ForgotPasswordModal";

export function CaretakerLoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { mutate: login, isPending } = useCaretakerLoginMutation();
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

            // Store access token in localStorage
            if (response.accessToken) {
              localStorage.setItem("accessToken", response.accessToken);
            }

            dispatch(loginUser(userData));
            toast.success(response.message || "Login successful");
            navigate(ROUTES.CARETAKER_DASHBOARD);
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
    <div className="min-h-screen flex items-center justify-center bg-[#FAF7F2] px-4">
      <Card className="w-full max-w-md border-border shadow-lg bg-white">
        <CardHeader className="space-y-4 text-center">
          <div className="flex justify-center mb-2">
            <div className="rounded-full bg-[#F5E6D3] p-3">
              <Heart className="h-6 w-6 text-[#D4A574]" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-[#8B6F47]">
            Caretaker Login
          </CardTitle>
          <CardDescription className="text-sm text-muted-foreground">
            Sign in to access your caretaker dashboard
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-[#8B6F47]">
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="caretaker@example.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) {
                    setErrors({ ...errors, email: "" });
                  }
                }}
                className={errors.email ? "border-red-500" : ""}
                disabled={isPending}
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email}</p>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-[#8B6F47]">
                  Password
                </Label>
                <button
                  type="button"
                  onClick={() => setShowForgotPassword(true)}
                  className="text-sm text-primary hover:underline"
                >
                  Forgot Password?
                </button>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errors.password) {
                    setErrors({ ...errors, password: "" });
                  }
                }}
                className={errors.password ? "border-red-500" : ""}
                disabled={isPending}
              />
              {errors.password && (
                <p className="text-sm text-red-500">{errors.password}</p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full bg-[#D4A574] hover:bg-[#C49664] text-white"
              disabled={isPending}
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
        </CardContent>

        <CardFooter className="text-center text-sm text-muted-foreground flex flex-col space-y-2">
          <p>
            Don't have an account? Contact your agency to receive an invitation.
          </p>
        </CardFooter>
      </Card>

      <ForgotPasswordModal
        isOpen={showForgotPassword}
        onClose={() => setShowForgotPassword(false)}
        role="caretaker"
      />
    </div>
  );
}
