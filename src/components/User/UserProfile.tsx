import { useUserProfileQuery } from "@/hooks/User/useUserProfile";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/User/card";
import { Button } from "@/components/User/button";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/config/env";
import { Loader2, User, Mail, Phone, Calendar } from "lucide-react";

export function UserProfile() {
  const { data: profile, isLoading, error } = useUserProfileQuery();
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAF7F2]">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-gray-400" />
          <p className="text-gray-500">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    const status = (error as { response?: { status?: number } })?.response?.status;
    
    // If 403 (blocked), show blocked message (axios interceptor should redirect)
    if (status === 403) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-[#FAF7F2] px-4">
          <Card className="w-full max-w-md border-red-200 bg-red-50">
            <CardHeader>
              <CardTitle className="text-red-600">Account Blocked</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-red-700 mb-4">
                Your account has been blocked. Please contact support for assistance.
              </p>
              <Button
                onClick={() => navigate(ROUTES.LOGIN)}
                variant="outline"
                className="w-full"
              >
                Go to Login
              </Button>
            </CardContent>
          </Card>
        </div>
      );
    }

    // Other errors
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAF7F2] px-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Error Loading Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-red-500 mb-4">
              {(error as { message?: string })?.message || "Failed to load profile"}
            </p>
            <Button onClick={() => navigate(ROUTES.CLIENT_DASHBOARD)} variant="outline">
              Go Back
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!profile) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#FAF7F2] p-6">
      <div className="max-w-4xl mx-auto">
        <Card className="bg-white/80 backdrop-blur-sm border-cream-200 shadow-lg">
          <CardHeader className="border-b border-cream-200">
            <CardTitle className="text-2xl font-bold text-gray-800">
              My Profile
            </CardTitle>
          </CardHeader>

          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Profile Image */}
              <div className="flex flex-col items-center md:items-start">
                {profile.profileImage ? (
                  <img
                    src={profile.profileImage}
                    alt={`${profile.firstName} ${profile.lastName}`}
                    className="w-32 h-32 rounded-full object-cover border-4 border-cream-300"
                  />
                ) : (
                  <div className="w-32 h-32 rounded-full bg-cream-200 flex items-center justify-center">
                    <User className="w-16 h-16 text-cream-600" />
                  </div>
                )}
              </div>

              {/* Profile Details */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <User className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Full Name</p>
                    <p className="font-semibold text-gray-800">
                      {profile.firstName} {profile.lastName}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-semibold text-gray-800">{profile.email}</p>
                  </div>
                </div>

                {profile.phone && (
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Phone</p>
                      <p className="font-semibold text-gray-800">{profile.phone}</p>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Member Since</p>
                    <p className="font-semibold text-gray-800">
                      {new Date(profile.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <p className="text-sm text-gray-500 mb-2">Role</p>
                  <span className="inline-block px-3 py-1 bg-cream-100 text-cream-800 rounded-full text-sm font-medium">
                    {profile.role}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t flex gap-4">
              <Button
                onClick={() => navigate(ROUTES.CLIENT_DASHBOARD)}
                variant="outline"
              >
                Back to Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}