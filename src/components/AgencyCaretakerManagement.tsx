import { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Button } from "@/components/User/button";
import { Input } from "@/components/User/input";
import { Label } from "@/components/User/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/User/card";
import { useInviteCaretakerMutation } from "@/hooks/agency/useAgency";
import { useLogoutMutation } from "@/hooks/auth/auth";
import { logoutUser } from "@/store/slices/userSlice";
import { useDispatch } from "react-redux";
import { ROUTES } from "@/config/env";
import type { RootState } from "@/store/store";
import { Loader2, Mail, UserPlus, ArrowLeft, Send } from "lucide-react";

export function AgencyCaretakerManagement() {
  const user = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { mutate: logout, isPending: isLoggingOut } = useLogoutMutation();

  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { mutate: inviteCaretaker, isPending: isInviting } = useInviteCaretakerMutation();

  const validateEmail = (emailValue: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(emailValue);
  };

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: Record<string, string> = {};

    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(email.trim())) {
      newErrors.email = "Please enter a valid email address";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      return;
    }

    inviteCaretaker(
      { email: email.trim() },
      {
        onSuccess: () => {
          toast.success(`Invitation sent successfully to ${email.trim()}`);
          setEmail("");
          setErrors({});
        },
        onError: (error: unknown) => {
          const errorMessage =
            (error as { response?: { data?: { message?: string } } })?.response?.data?.message ||
            "Failed to send invitation. Please try again.";
          toast.error(errorMessage);
        },
      }
    );
  };

  const handleLogout = () => {
    logout(undefined, {
      onSuccess: () => {
        dispatch(logoutUser());
        toast.success("Logged out successfully");
        navigate(ROUTES.LOGIN);
      },
      onError: (error: unknown) => {
        const errorMessage =
          (error as { response?: { data?: { message?: string } } })?.response?.data?.message ||
          "Logout failed";
        toast.error(errorMessage);
        dispatch(logoutUser());
        navigate(ROUTES.LOGIN);
      },
    });
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#FAF7F2] px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header Card */}
        <Card className="border-border shadow-lg bg-white">
          <CardHeader>
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-[#F5E6D3] p-2">
                  <UserPlus className="h-5 w-5 text-[#D4A574]" />
                </div>
                <div>
                  <CardTitle className="text-2xl font-bold text-[#8B6F47]">
                    Caretaker Management
                  </CardTitle>
                  <CardDescription className="text-sm">
                    Invite caretakers to join your agency
                  </CardDescription>
                </div>
              </div>
              <Button
                variant="outline"
                onClick={() => navigate(ROUTES.AGENCY_DASHBOARD)}
                className="border-[#D4A574] text-[#8B6F47] hover:bg-[#F5E6D3]"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Dashboard
              </Button>
            </div>
          </CardHeader>
        </Card>

        {/* Invite Form Card */}
        <Card className="border-border shadow-lg bg-white">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-[#8B6F47] flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Send Caretaker Invitation
            </CardTitle>
            <CardDescription>
              Enter the email address of the caretaker you want to invite. They will receive an
              invitation link to complete their registration.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleInvite} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-[#8B6F47]">
                  Caretaker Email Address
                </Label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
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
                      className={`pl-10 ${errors.email ? "border-red-500" : ""}`}
                      disabled={isInviting}
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={isInviting}
                    className="bg-[#D4A574] hover:bg-[#C49664] text-white px-6"
                  >
                    {isInviting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="mr-2 h-4 w-4" />
                        Send Invite
                      </>
                    )}
                  </Button>
                </div>
                {errors.email && (
                  <p className="text-xs text-red-500 mt-1">{errors.email}</p>
                )}
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Info Card */}
        <Card className="border-border shadow-lg bg-[#F5E6D3] border-[#D4A574]">
          <CardContent className="pt-6">
            <div className="space-y-2 text-sm text-[#8B6F47]">
              <p className="font-semibold">How it works:</p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Enter the caretaker's email address and click "Send Invite"</li>
                <li>An invitation email will be sent with a secure registration link</li>
                <li>The invitation link is valid for 48 hours</li>
                <li>Once the caretaker completes registration, they'll be added to your agency</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* User Info & Logout */}
        <Card className="border-border shadow-lg bg-white">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">
                  <strong>Logged in as:</strong> {user.firstName} {user.lastName}
                </p>
                <p className="text-sm text-muted-foreground">
                  <strong>Email:</strong> {user.email}
                </p>
              </div>
              <Button
                onClick={handleLogout}
                disabled={isLoggingOut}
                variant="destructive"
                className="min-w-[120px]"
              >
                {isLoggingOut ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Logging out...
                  </>
                ) : (
                  "Logout"
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

