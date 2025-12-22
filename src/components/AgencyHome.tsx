import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/User/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/User/card";
import { logoutUser } from "@/store/slices/userSlice";
import { useLogoutMutation } from "@/hooks/auth/auth";
import { ROUTES } from "@/config/env";
import type { RootState } from "@/store/store";
import toast from "react-hot-toast";
import { UserPlus } from "lucide-react";

export function AgencyHome() {
  const user = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { mutate: logout, isPending } = useLogoutMutation();

  const handleLogout = () => {
    logout(undefined, {
      onSuccess: () => {
        dispatch(logoutUser());
        toast.success("Logged out successfully");
        navigate(ROUTES.LOGIN);
      },
      onError: (error: unknown) => {
        const errorMessage =
          (error as { response?: { data?: { message?: string } } })?.response
            ?.data?.message || "Logout failed";
        toast.error(errorMessage);
        // Even if API fails, clear local state
        dispatch(logoutUser());
        navigate(ROUTES.LOGIN);
      },
    });
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAF7F2] px-4">
      <Card className="w-full max-w-2xl border-border shadow-lg">
        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-3xl font-bold">
            Welcome, {user.firstName} {user.lastName}!
          </CardTitle>
          <CardDescription className="text-lg">
            Agency Owner Dashboard
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              <strong>Email:</strong> {user.email}
            </p>
            <p className="text-sm text-muted-foreground">
              <strong>Role:</strong> {user.role}
            </p>
          </div>

          <div className="pt-4 border-t space-y-3">
            <Button
              onClick={() => navigate(ROUTES.AGENCY_CARETAKERS)}
              className="w-full bg-[#D4A574] hover:bg-[#C49664] text-white"
            >
              <UserPlus className="w-4 h-4 mr-2" />
              Manage Caretakers
            </Button>
            <Button
              onClick={handleLogout}
              disabled={isPending}
              className="w-full"
              variant="destructive"
            >
              {isPending ? "Logging out..." : "Logout"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

