"use client";

import type React from "react";
import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/User/card";
import { Button } from "@/components/User/button";
import { Input } from "@/components/User/input";
import { Label } from "@/components/User/label";
import {
  useChangePasswordMutation,
  useVerifyOldPasswordMutation,
} from "@/hooks/auth/auth";
import {
  changePasswordSchema,
  verifyOldPasswordSchema,
} from "@/validations/change-password.schema";

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type Step = "verifyOld" | "setNew";

export function ChangePasswordModal({ isOpen, onClose }: ChangePasswordModalProps) {
  const [step, setStep] = useState<Step>("verifyOld");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { mutate: verifyOld, isPending: isVerifying } = useVerifyOldPasswordMutation();
  const { mutate: changePassword, isPending: isChanging } = useChangePasswordMutation();

  const busy = isVerifying || isChanging;

  const title = useMemo(() => (step === "verifyOld" ? "Verify Old Password" : "Set New Password"), [step]);

  const resetState = () => {
    setStep("verifyOld");
    setOldPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setErrors({});
  };

  const handleClose = () => {
    if (busy) return;
    resetState();
    onClose();
  };

  if (!isOpen) return null;

  const handleVerifyOld = (e: React.FormEvent) => {
    e.preventDefault();
    const result = verifyOldPasswordSchema.safeParse({ oldPassword });
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((i) => {
        fieldErrors[i.path[0] as string] = i.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    verifyOld(
      { oldPassword },
      {
        onSuccess: () => {
          setStep("setNew");
          setErrors({});
        },
        onError: (error: unknown) => {
          const msg =
            (error as { response?: { data?: { message?: string } } })?.response?.data?.message ||
            "Old password is incorrect";
          toast.error(msg);
        },
      },
    );
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    const result = changePasswordSchema.safeParse({ newPassword, confirmPassword });
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((i) => {
        fieldErrors[i.path[0] as string] = i.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    changePassword(
      { newPassword, confirmPassword },
      {
        onSuccess: () => {
          toast.success("Password changed successfully");
          handleClose();
        },
        onError: (error: unknown) => {
          const msg =
            (error as { response?: { data?: { message?: string } } })?.response?.data?.message ||
            "Failed to change password";
          toast.error(msg);
        },
      },
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <Card className="w-full max-w-md border-border shadow-lg">
        <CardHeader className="space-y-2 text-center">
          <CardTitle className="text-2xl font-bold">{title}</CardTitle>
          <CardDescription>
            {step === "verifyOld"
              ? "Enter your current password to continue."
              : "Enter and confirm your new password."}
          </CardDescription>
        </CardHeader>

        <CardContent>
          {step === "verifyOld" ? (
            <form onSubmit={handleVerifyOld} className="space-y-4">
              <div className="space-y-2">
                <Label>Old Password</Label>
                <Input
                  type="password"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  className={errors.oldPassword ? "border-red-500" : ""}
                  disabled={busy}
                />
                {errors.oldPassword && <p className="text-sm text-red-500">{errors.oldPassword}</p>}
              </div>

              <div className="flex gap-2">
                <Button type="button" variant="outline" className="flex-1" onClick={handleClose} disabled={busy}>
                  Cancel
                </Button>
                <Button type="submit" className="flex-1" disabled={busy}>
                  {isVerifying ? "Verifying..." : "Continue"}
                </Button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleChangePassword} className="space-y-4">
              <div className="space-y-2">
                <Label>New Password</Label>
                <Input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className={errors.newPassword ? "border-red-500" : ""}
                  disabled={busy}
                />
                {errors.newPassword && <p className="text-sm text-red-500">{errors.newPassword}</p>}
              </div>

              <div className="space-y-2">
                <Label>Confirm Password</Label>
                <Input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={errors.confirmPassword ? "border-red-500" : ""}
                  disabled={busy}
                />
                {errors.confirmPassword && (
                  <p className="text-sm text-red-500">{errors.confirmPassword}</p>
                )}
              </div>

              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    if (busy) return;
                    setStep("verifyOld");
                    setErrors({});
                  }}
                  disabled={busy}
                >
                  Back
                </Button>
                <Button type="submit" className="flex-1" disabled={busy}>
                  {isChanging ? "Saving..." : "Change Password"}
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

