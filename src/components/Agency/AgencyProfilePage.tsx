import { useState, useRef, useEffect } from "react";
import { useAgencyProfileQuery } from "@/hooks/agency/useAgencyProfile";
import { useUpdateAgencyProfile } from "@/hooks/agency/useAgencyProfile";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/User/card";
import { Button } from "@/components/User/button";
import { Input } from "@/components/User/input";
import { Label } from "@/components/User/label";
import {
  Mail,
  Phone,
  MapPin,
  FileText,
  Edit2,
  X,
  Upload,
  Save,
  Lock,
  Loader2,
} from "lucide-react";
import { agencyProfileApi } from "@/services/agency/agencyProfileService";
import { ForgotPasswordModal } from "@/components/ForgotPasswordModal";
import toast from "react-hot-toast";
import {
  agencyProfileSchema,
  type AgencyProfileFormData,
} from "@/validations/agency-profile.schema";
import { ZodError } from "zod";

export function AgencyProfilePage() {
  const { data: profile, isLoading, error, refetch } = useAgencyProfileQuery();
  const updateProfile = useUpdateAgencyProfile();

  const [isEditMode, setIsEditMode] = useState(false);
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  const [formData, setFormData] = useState({
    agencyName: "",
    phone: "",
    address: "",
    description: "",
    profileImage: "",
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [validationErrors, setValidationErrors] = useState<{
    agencyName?: string;
    phone?: string;
    address?: string;
    description?: string;
  }>({});

  useEffect(() => {
    if (profile) {
      setFormData({
        agencyName: profile.agencyName || "",
        phone: profile.phone || "",
        address: profile.address || "",
        description: profile.description || "",
        profileImage: profile.profileImage || "",
      });
      setImagePreview(profile.profileImage || null);
    }
  }, [profile]);

  useEffect(() => {
    if (isEditMode && profile) {
      setImagePreview((prev) => {
        if (prev?.startsWith("blob:")) return prev;
        return profile.profileImage || null;
      });
    }
  }, [isEditMode, profile]);

  const validateForm = (data: typeof formData): boolean => {
    try {
      const validationData: AgencyProfileFormData = {
        agencyName: data.agencyName.trim(),
        phone: data.phone || "",
        address: data.address.trim(),
        description: data.description?.trim(),
        profileImage: data.profileImage || undefined,
      };
      agencyProfileSchema.parse(validationData);
      setValidationErrors({});
      return true;
    } catch (err) {
      if (err instanceof ZodError) {
        const errors: typeof validationErrors = {};
        err.issues.forEach((issue) => {
          const path = issue.path[0] as keyof typeof errors;
          if (path) errors[path] = issue.message;
        });
        setValidationErrors(errors);
        const firstError = err.issues[0];
        if (firstError) toast.error(firstError.message);
      }
      return false;
    }
  };

  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file (JPEG, PNG, WebP)");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be less than 5MB");
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);

    setIsUploadingImage(true);
    try {
      const s3Key = await agencyProfileApi.uploadProfileImage(file);
      setFormData((prev) => ({ ...prev, profileImage: s3Key }));
      toast.success("Profile image uploaded. Click 'Save Changes' to persist.");
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "Failed to upload image";
      toast.error(msg);
      setImagePreview(profile?.profileImage || null);
      setFormData((prev) => ({
        ...prev,
        profileImage: profile?.profileImage || "",
      }));
      URL.revokeObjectURL(previewUrl);
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleSave = async () => {
    if (!validateForm(formData)) return;

    updateProfile.mutate(
      {
        agencyName: formData.agencyName.trim(),
        phone: formData.phone.trim() || undefined,
        address: formData.address.trim(),
        description: formData.description?.trim() || undefined,
        profileImage: formData.profileImage || undefined,
      },
      {
        onSuccess: () => {
          toast.success("Profile updated successfully");
          setIsEditMode(false);
          refetch();
        },
        onError: (err: unknown) => {
          const msg =
            (err as { response?: { data?: { message?: string } } })?.response
              ?.data?.message || "Failed to update profile";
          toast.error(msg);
        },
      }
    );
  };

  const getInitials = () => {
    if (profile?.agencyName) {
      return profile.agencyName.substring(0, 2).toUpperCase();
    }
    return "AG";
  };

  if (isLoading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: "#FDFBF8" }}
      >
        <Loader2 className="w-12 h-12 animate-spin" style={{ color: "#7C5A3B" }} />
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="min-h-screen flex items-center justify-center p-6"
        style={{ backgroundColor: "#FDFBF8" }}
      >
        <Card className="max-w-md w-full">
          <CardContent className="pt-6">
            <p className="text-red-600 text-center">
              Failed to load profile. Please try again.
            </p>
            <Button
              onClick={() => refetch()}
              className="mt-4 w-full"
              style={{ backgroundColor: "#7C5A3B" }}
            >
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!profile) return null;

  return (
    <div
      className="min-h-screen p-6 sm:p-8 lg:p-10"
      style={{ backgroundColor: "#FDFBF8" }}
    >
      <div className="max-w-4xl mx-auto">
        <Card
          className="overflow-hidden rounded-2xl border-2 shadow-lg"
          style={{
            backgroundColor: "#FFFBF5",
            borderColor: "#E5DDD5",
            boxShadow: "0 4px 20px rgba(124, 90, 59, 0.08)",
          }}
        >
          <CardHeader className="pb-6 pt-8 px-8 sm:px-10">
            <div className="flex items-center justify-between">
              <CardTitle
                className="text-2xl sm:text-3xl font-bold"
                style={{ color: "#7C5A3B" }}
              >
                Agency Profile
              </CardTitle>
              {!isEditMode ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditMode(true)}
                  className="transition-all duration-200 hover:opacity-90 hover:scale-[1.02] focus:ring-2 focus:ring-offset-2 rounded-lg"
                  style={{
                    borderColor: "#7C5A3B",
                    color: "#7C5A3B",
                  }}
                >
                  <Edit2 className="w-4 h-4 mr-2" />
                  Edit Profile
                </Button>
              ) : (
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setIsEditMode(false);
                      setFormData({
                        agencyName: profile.agencyName || "",
                        phone: profile.phone || "",
                        address: profile.address || "",
                        description: profile.description || "",
                        profileImage: profile.profileImage || "",
                      });
                      setImagePreview(profile.profileImage || null);
                      setValidationErrors({});
                    }}
                    className="transition-all duration-200 hover:opacity-90 focus:ring-2 focus:ring-offset-2 rounded-lg"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleSave}
                    disabled={updateProfile.isPending || isUploadingImage}
                    className="transition-all duration-200 hover:opacity-90 hover:scale-[1.02] focus:ring-2 focus:ring-offset-2 rounded-lg"
                    style={{ backgroundColor: "#7C5A3B" }}
                  >
                    {updateProfile.isPending ? (
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    ) : (
                      <Save className="w-4 h-4 mr-2" />
                    )}
                    Save Changes
                  </Button>
                </div>
              )}
            </div>
          </CardHeader>

          <CardContent className="space-y-10 px-6 sm:px-10 pb-10">
            {/* Profile Image */}
            <div className="flex flex-col items-center py-4">
              <div className="relative group">
                <div
                  className="w-36 h-36 sm:w-44 sm:h-44 rounded-2xl flex items-center justify-center text-white font-bold text-4xl sm:text-5xl overflow-hidden object-cover"
                  style={{
                    backgroundColor: "#D4A574",
                    boxShadow: "0 8px 24px rgba(212, 165, 116, 0.25)",
                  }}
                >
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Agency"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="tracking-wider">{getInitials()}</span>
                  )}
                </div>
                {isEditMode && (
                  <>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/jpeg,image/jpg,image/png,image/webp"
                      className="hidden"
                      onChange={handleImageSelect}
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isUploadingImage}
                      className="absolute bottom-0 right-0 p-2.5 rounded-full shadow-lg transition-all hover:scale-105 focus:ring-2 focus:ring-offset-2"
                      style={{ backgroundColor: "#7C5A3B", color: "white" }}
                      aria-label="Upload profile image"
                    >
                      {isUploadingImage ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Upload className="w-4 h-4" />
                      )}
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Form Fields */}
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="sm:col-span-2 space-y-1">
                <Label className="text-base" style={{ color: "#8B6F47" }}>Company Name</Label>
                {isEditMode ? (
                  <>
                    <Input
                      value={formData.agencyName}
                      onChange={(e) => {
                        setFormData((p) => ({ ...p, agencyName: e.target.value }));
                        setValidationErrors((p) => ({ ...p, agencyName: undefined }));
                      }}
                      placeholder="Enter company name"
                      className={`mt-1 ${validationErrors.agencyName ? "border-red-500" : ""}`}
                      style={{ borderColor: "#E5DDD5" }}
                    />
                    {validationErrors.agencyName && (
                      <p className="text-sm text-red-500 mt-1">
                        {validationErrors.agencyName}
                      </p>
                    )}
                  </>
                ) : (
                  <p className="text-base sm:text-lg py-3 mt-1" style={{ color: "#7C5A3B" }}>
                    {profile.agencyName || "Not provided"}
                  </p>
                )}
              </div>

              <div className="space-y-1">
                <Label className="text-base" style={{ color: "#8B6F47" }}>
                  <Mail className="w-4 h-4 inline mr-2" />
                  Email
                </Label>
                <p className="text-base sm:text-lg py-3" style={{ color: "#7C5A3B" }}>
                  {profile.email}
                </p>
                <p className="text-xs sm:text-sm" style={{ color: "#8B6F47" }}>
                  Email cannot be changed
                </p>
              </div>

              <div className="space-y-1">
                <Label className="text-base" style={{ color: "#8B6F47" }}>
                  <Phone className="w-4 h-4 inline mr-2" />
                  Phone
                </Label>
                {isEditMode ? (
                  <>
                    <Input
                      value={formData.phone}
                      onChange={(e) => {
                        setFormData((p) => ({ ...p, phone: e.target.value }));
                        setValidationErrors((p) => ({ ...p, phone: undefined }));
                      }}
                      placeholder="10-15 digits"
                      className={`mt-1 ${validationErrors.phone ? "border-red-500" : ""}`}
                      style={{ borderColor: "#E5DDD5" }}
                    />
                    {validationErrors.phone && (
                      <p className="text-sm text-red-500 mt-1">
                        {validationErrors.phone}
                      </p>
                    )}
                  </>
                ) : (
                  <p className="text-base sm:text-lg py-3" style={{ color: "#7C5A3B" }}>
                    {profile.phone || "Not provided"}
                  </p>
                )}
              </div>

              <div className="sm:col-span-2 space-y-1">
                <Label className="text-base" style={{ color: "#8B6F47" }}>
                  <FileText className="w-4 h-4 inline mr-2" />
                  Registration Number
                </Label>
                <p className="text-base sm:text-lg py-3" style={{ color: "#7C5A3B" }}>
                  {profile.registrationNumber}
                </p>
                <p className="text-xs sm:text-sm" style={{ color: "#8B6F47" }}>
                  Registration number cannot be changed
                </p>
              </div>

              <div className="sm:col-span-2 space-y-1">
                <Label className="text-base" style={{ color: "#8B6F47" }}>
                  <MapPin className="w-4 h-4 inline mr-2" />
                  Address
                </Label>
                {isEditMode ? (
                  <>
                    <Input
                      value={formData.address}
                      onChange={(e) => {
                        setFormData((p) => ({ ...p, address: e.target.value }));
                        setValidationErrors((p) => ({ ...p, address: undefined }));
                      }}
                      placeholder="Enter address"
                      className={`mt-1 ${validationErrors.address ? "border-red-500" : ""}`}
                      style={{ borderColor: "#E5DDD5" }}
                    />
                    {validationErrors.address && (
                      <p className="text-sm text-red-500 mt-1">
                        {validationErrors.address}
                      </p>
                    )}
                  </>
                ) : (
                  <p className="text-base sm:text-lg py-3" style={{ color: "#7C5A3B" }}>
                    {profile.address || "Not provided"}
                  </p>
                )}
              </div>

              <div className="sm:col-span-2 space-y-1">
                <Label className="text-base" style={{ color: "#8B6F47" }}>Description</Label>
                {isEditMode ? (
                  <>
                    <textarea
                      value={formData.description}
                      onChange={(e) => {
                        setFormData((p) => ({ ...p, description: e.target.value }));
                        setValidationErrors((p) => ({ ...p, description: undefined }));
                      }}
                      placeholder="Brief description (optional)"
                      rows={4}
                      className={`w-full px-3 py-2.5 rounded-lg border mt-1 text-base ${
                        validationErrors.description ? "border-red-500" : ""
                      }`}
                      style={{ borderColor: "#E5DDD5" }}
                    />
                    {validationErrors.description && (
                      <p className="text-sm text-red-500 mt-1">
                        {validationErrors.description}
                      </p>
                    )}
                  </>
                ) : (
                  <p className="text-base sm:text-lg py-3" style={{ color: "#7C5A3B" }}>
                    {profile.description || "No description provided"}
                  </p>
                )}
              </div>
            </div>

            {/* Change Password */}
            <div className="pt-8 mt-2 border-t-2 rounded-b-lg px-4 py-6" style={{ borderColor: "#E5DDD5" }}>
              <Button
                variant="outline"
                onClick={() => setShowChangePasswordModal(true)}
                className="transition-all duration-200 hover:opacity-90 hover:scale-[1.02] focus:ring-2 focus:ring-offset-2 rounded-lg px-5 py-2.5"
                style={{
                  borderColor: "#7C5A3B",
                  color: "#7C5A3B",
                }}
              >
                <Lock className="w-4 h-4 mr-2" />
                Change Password
              </Button>
              <p className="text-sm sm:text-base mt-3" style={{ color: "#8B6F47" }}>
                We'll send a password reset link to your email.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <ForgotPasswordModal
        isOpen={showChangePasswordModal}
        onClose={() => setShowChangePasswordModal(false)}
        role="agency_owner"
        defaultEmail={profile.email}
      />
    </div>
  );
}
