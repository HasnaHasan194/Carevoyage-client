import { useState, useRef, useEffect } from "react";
import { useUserProfileQuery } from "@/hooks/User/useUserProfile";
import { useUpdateUserProfile } from "@/hooks/User/useUpdateUserProfile";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/User/card";
import { Button } from "@/components/User/button";
import { Input } from "@/components/User/input";
import { Label } from "@/components/User/label";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/config/env";
import {
  Loader2,
  User,
  Mail,
  Phone,
  Calendar,
  Edit2,
  X,
  Upload,
  Save,
  Lock,
} from "lucide-react";
import { userUploadApi } from "@/services/User/uploadService";
import { ForgotPasswordModal } from "@/components/ForgotPasswordModal";
import toast from "react-hot-toast";
import { userProfileSchema, type UserProfileFormData } from "@/validations/user-profile.schema";
import { ZodError } from "zod";

export function UserProfile() {
  const { data: profile, isLoading, error, refetch } = useUserProfileQuery();
  const updateProfile = useUpdateUserProfile();
  const navigate = useNavigate();

  const [isEditMode, setIsEditMode] = useState(false);
  const [showResetPasswordModal, setShowResetPasswordModal] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    gender: "" as "male" | "female" | "other" | "",
    bio: "",
    profileImage: "",
  });

  // Preview state for image
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Validation errors state
  const [validationErrors, setValidationErrors] = useState<{
    firstName?: string;
    lastName?: string;
    phone?: string;
    gender?: string;
    bio?: string;
  }>({});

  // Initialize form data when profile loads
  useEffect(() => {
  
    fetch('http://127.0.0.1:7242/ingest/789d46c6-007a-4f0b-95d7-2eaa9740c6d4',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'UserProfile.tsx:useEffect',message:'Profile data received',data:{hasProfile:!!profile,profileImage:profile?.profileImage?.substring(0,50),isEditMode},timestamp:Date.now(),sessionId:'debug-session',hypothesisId:'D'})}).catch(()=>{});
   
    if (profile) {
      // In edit mode, preserve formData.profileImage if it's an S3 key (new upload)
      // This prevents React Query refetch from overwriting the uploaded S3 key
      setFormData((prevFormData) => {
        const shouldPreserveProfileImage = isEditMode && prevFormData.profileImage && !prevFormData.profileImage.startsWith("http");
      
        fetch('http://127.0.0.1:7242/ingest/789d46c6-007a-4f0b-95d7-2eaa9740c6d4',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'UserProfile.tsx:useEffect-setFormData',message:'Setting formData',data:{isEditMode,prevProfileImage:prevFormData.profileImage?.substring(0,50),newProfileImage:profile.profileImage?.substring(0,50),shouldPreserveProfileImage},timestamp:Date.now(),sessionId:'debug-session',hypothesisId:'F'})}).catch(()=>{});
        
        return {
          firstName: profile.firstName || "",
          lastName: profile.lastName || "",
          phone: profile.phone || "",
          gender: (profile.gender as "male" | "female" | "other") || "",
          bio: profile.bio || "",
          profileImage: shouldPreserveProfileImage ? prevFormData.profileImage : (profile.profileImage || ""),
        };
      });
      
      // Update imagePreview:
      // - In view mode: always use the profile image (signed URL from backend)
      // - In edit mode: only update if we don't have an active blob URL (preserves upload preview)
      if (!isEditMode) {
        // View mode: always sync with profile image from backend
        
        fetch('http://127.0.0.1:7242/ingest/789d46c6-007a-4f0b-95d7-2eaa9740c6d4',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'UserProfile.tsx:useEffect-viewMode',message:'Setting imagePreview in view mode',data:{profileImage:profile.profileImage?.substring(0,50)},timestamp:Date.now(),sessionId:'debug-session',hypothesisId:'D'})}).catch(()=>{});
     
        setImagePreview(profile.profileImage || null);
      } else {
        // Edit mode: update only if current preview is not a blob URL
        // This preserves the blob preview during image upload
        setImagePreview((prev) => {
          if (!prev || !prev.startsWith("blob:")) {
            return profile.profileImage || null;
          }
          return prev; // Keep blob URL during upload
        });
      }
    }
  }, [profile, isEditMode]);

  // Validate form data using Zod
  const validateForm = (data: typeof formData): boolean => {
    try {
      // Prepare data for validation (all fields are now required)
      const validationData: UserProfileFormData = {
        firstName: data.firstName.trim(),
        lastName: data.lastName.trim(),
        phone: data.phone.trim(),
        gender: data.gender as "male" | "female" | "other",
        bio: data.bio.trim(),
        profileImage: data.profileImage || undefined,
      };

      userProfileSchema.parse(validationData);
      setValidationErrors({});
      return true;
    } catch (error) {
      if (error instanceof ZodError) {
        const errors: typeof validationErrors = {};
        error.issues.forEach((issue) => {
          const path = issue.path[0] as keyof typeof errors;
          if (path) {
            errors[path] = issue.message;
          }
        });
        setValidationErrors(errors);
      
        const hasRequiredFieldError = !!(errors.firstName || errors.lastName || errors.phone || errors.gender || errors.bio);
        if (hasRequiredFieldError) {
          toast.error("Please fill in all required fields.");
        } else {
          const firstError = error.issues[0];
          if (firstError) {
            toast.error(firstError.message);
          }
        }
      }
      return false;
    }
  };

  // Validate individual field
  const validateField = (fieldName: keyof typeof validationErrors, value: string) => {
    try {
      // Create test data with updated field value
      const testData = { ...formData, [fieldName]: value };
      const validationData: UserProfileFormData = {
        firstName: testData.firstName.trim(),
        lastName: testData.lastName.trim(),
        phone: testData.phone.trim(),
        gender: testData.gender as "male" | "female" | "other",
        bio: testData.bio.trim(),
        profileImage: testData.profileImage || undefined,
      };

      // Validate the entire schema but only extract error for this field
      userProfileSchema.parse(validationData);
      // If validation passes, clear error for this field
      setValidationErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[fieldName];
        return newErrors;
      });
    } catch (error) {
      if (error instanceof ZodError) {
        // Find error for this specific field
        const fieldError = error.issues.find((issue) => issue.path[0] === fieldName);
        if (fieldError) {
          setValidationErrors((prev) => ({
            ...prev,
            [fieldName]: fieldError.message,
          }));
        } else {
          // If no error for this field, clear it (might be error in another field)
          setValidationErrors((prev) => {
            const newErrors = { ...prev };
            delete newErrors[fieldName];
            return newErrors;
          });
        }
      }
    }
  };

  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be less than 5MB");
      return;
    }

    // Show preview immediately
    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);

    // Upload to S3
    setIsUploadingImage(true);
    try {
      const s3Key = await userUploadApi.uploadProfileImage(file);
  
      fetch('http://127.0.0.1:7242/ingest/789d46c6-007a-4f0b-95d7-2eaa9740c6d4',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'UserProfile.tsx:handleImageSelect',message:'S3 upload complete',data:{s3Key:s3Key?.substring(0,60),startsWithHttp:s3Key?.startsWith('http')},timestamp:Date.now(),sessionId:'debug-session',hypothesisId:'A3'})}).catch(()=>{});
   
      // Store S3 key in formData for saving
      setFormData((prev) => ({ ...prev, profileImage: s3Key }));
      
      // Keep the blob preview for immediate display in edit mode
      // The preview will be replaced with the signed URL after save
      // Don't revoke the blob URL yet - keep it until save completes
      
      toast.success("Profile image uploaded successfully. Click 'Save Changes' to persist it.");
    } catch (error: unknown) {
      const errorMessage =
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message || "Failed to upload image";
      toast.error(errorMessage);
      // Revert to original profile image on error
      setImagePreview(profile?.profileImage || null);
      setFormData((prev) => ({ 
        ...prev, 
        profileImage: profile?.profileImage || "" 
      }));
      // Clean up the failed preview URL
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleSave = async () => {
  
    fetch('http://127.0.0.1:7242/ingest/789d46c6-007a-4f0b-95d7-2eaa9740c6d4',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'UserProfile.tsx:handleSave-entry',message:'handleSave called',data:{formDataProfileImage:formData.profileImage?.substring(0,60),profileProfileImage:profile?.profileImage?.substring(0,60),startsWithHttp:formData.profileImage?.startsWith('http')},timestamp:Date.now(),sessionId:'debug-session',hypothesisId:'A1'})}).catch(()=>{});
    
    
    // Frontend Zod validation
    if (!validateForm(formData)) {
      // Validation errors are set and displayed inline
      return;
    }

    const updateData: {
      firstName?: string;
      lastName?: string;
      phone?: string;
      gender?: "male" | "female" | "other";
      bio?: string;
      profileImage?: string;
    } = {};

    if (formData.firstName.trim() !== profile?.firstName) {
      updateData.firstName = formData.firstName.trim();
    }
    if (formData.lastName.trim() !== profile?.lastName) {
      updateData.lastName = formData.lastName.trim();
    }
    if (formData.phone.trim() !== (profile?.phone || "")) {
      updateData.phone = formData.phone.trim() || undefined;
    }
    if (formData.gender !== (profile?.gender || "")) {
      updateData.gender = formData.gender || undefined;
    }
    if (formData.bio.trim() !== (profile?.bio || "")) {
      updateData.bio = formData.bio.trim() || undefined;
    }
    // Save profileImage if it's an S3 key (new upload)
    // S3 keys don't start with "http", signed URLs from backend do
    // This ensures we only save when a new image was actually uploaded
    if (formData.profileImage && !formData.profileImage.startsWith("http")) {
      // This is an S3 key from a new upload, save it
      updateData.profileImage = formData.profileImage;
    } else if (formData.profileImage !== (profile?.profileImage || "")) {
      // Fallback: if it's different (shouldn't happen for signed URLs, but handle it)
      updateData.profileImage = formData.profileImage || undefined;
    }

    // Only update if there are changes
    if (Object.keys(updateData).length === 0) {
      
      fetch('http://127.0.0.1:7242/ingest/789d46c6-007a-4f0b-95d7-2eaa9740c6d4',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'UserProfile.tsx:handleSave-noChanges',message:'No changes detected - early return',data:{formDataProfileImage:formData.profileImage?.substring(0,60),profileProfileImage:profile?.profileImage?.substring(0,60)},timestamp:Date.now(),sessionId:'debug-session',hypothesisId:'A2'})}).catch(()=>{});
     
      toast("No changes to save", { icon: "ℹ️" });
      setIsEditMode(false);
      return;
    }

    
    fetch('http://127.0.0.1:7242/ingest/789d46c6-007a-4f0b-95d7-2eaa9740c6d4',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'UserProfile.tsx:handleSave',message:'Sending update to backend',data:{updateDataKeys:Object.keys(updateData),hasProfileImage:'profileImage' in updateData,profileImageValue:updateData.profileImage?.substring(0,50),formDataProfileImage:formData.profileImage?.substring(0,50)},timestamp:Date.now(),sessionId:'debug-session',hypothesisId:'A'})}).catch(()=>{});
    

    updateProfile.mutate(updateData, {
      onSuccess: async () => {
        // Clean up any blob URLs before switching modes
        if (imagePreview && imagePreview.startsWith("blob:")) {
          URL.revokeObjectURL(imagePreview);
        }
        
        setIsEditMode(false);
        
        // Refetch profile to get the updated signed URL
        await refetch();
        
        // The useEffect will update imagePreview with the new profile.profileImage
        // which contains the signed URL from the backend
      },
      onError: (error: unknown) => {
        // Handle phone uniqueness error from backend
        const errorMessage =
          (error as { response?: { data?: { message?: string } } })?.response
            ?.data?.message || "";
        
        if (errorMessage.toLowerCase().includes("phone") && errorMessage.toLowerCase().includes("already")) {
          setValidationErrors((prev) => ({
            ...prev,
            phone: "Phone number is already in use",
          }));
        }
      },
    });
  };

  const handleCancel = () => {
    
    fetch('http://127.0.0.1:7242/ingest/789d46c6-007a-4f0b-95d7-2eaa9740c6d4',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'UserProfile.tsx:handleCancel',message:'Cancel clicked',data:{hadBlobUrl:imagePreview?.startsWith('blob:'),formDataProfileImage:formData.profileImage?.substring(0,50)},timestamp:Date.now(),sessionId:'debug-session',hypothesisId:'G'})}).catch(()=>{});
   
    // Clean up any blob URLs
    if (imagePreview && imagePreview.startsWith("blob:")) {
      URL.revokeObjectURL(imagePreview);
    }
    
    // Clear validation errors
    setValidationErrors({});
    
    // Reset form to original profile data
    if (profile) {
      setFormData({
        firstName: profile.firstName || "",
        lastName: profile.lastName || "",
        phone: profile.phone || "",
        gender: (profile.gender as "male" | "female" | "other") || "",
        bio: profile.bio || "",
        profileImage: profile.profileImage || "",
      });
      setImagePreview(profile.profileImage || null);
    }
    setIsEditMode(false);
  };

  const handleResetPassword = () => {
    if (!profile?.email) {
      toast.error("Email not found");
      return;
    }
    setShowResetPasswordModal(true);
  };

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
    const status = (error as { response?: { status?: number } })?.response
      ?.status;

    if (status === 403) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-[#FAF7F2] px-4">
          <Card className="w-full max-w-md border-red-200 bg-red-50">
            <CardHeader>
              <CardTitle className="text-red-600">Account Blocked</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-red-700 mb-4">
                Your account has been blocked. Please contact support for
                assistance.
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

    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAF7F2] px-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Error Loading Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-red-500 mb-4">
              {(error as { message?: string })?.message ||
                "Failed to load profile"}
            </p>
            <Button
              onClick={() => navigate(ROUTES.CLIENT_DASHBOARD)}
              variant="outline"
            >
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
    <div className="min-h-screen bg-[#FAF7F2] p-4 sm:p-6">
      <div className="max-w-4xl mx-auto">
        <Card className="bg-white/80 backdrop-blur-sm border-cream-200 shadow-lg">
          <CardHeader className="border-b border-cream-200">
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl font-bold text-gray-800">
                My Profile
              </CardTitle>
              {!isEditMode && (
                <Button
                  onClick={() => {
                    setValidationErrors({});
                    setIsEditMode(true);
                  }}
                  variant="outline"
                  className="flex items-center gap-2"
                  style={{
                    borderColor: "#D4A574",
                    color: "#7C5A3B",
                  }}
                >
                  <Edit2 className="w-4 h-4" />
                  Edit Profile
                </Button>
              )}
            </div>
          </CardHeader>

          <CardContent className="p-6">
            {isEditMode ? (
              // Edit Mode
              <div className="space-y-6">
                {/* Profile Image Upload */}
                <div className="flex flex-col items-center md:items-start gap-4">
                  <div className="relative">
                    {imagePreview ? (
                      <img
                        src={imagePreview}
                        alt="Profile preview"
                        className="w-32 h-32 rounded-full object-cover border-4 border-cream-300"
                      />
                    ) : (
                      <div className="w-32 h-32 rounded-full bg-cream-200 flex items-center justify-center">
                        <User className="w-16 h-16 text-cream-600" />
                      </div>
                    )}
                    {isUploadingImage && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full">
                        <Loader2 className="w-6 h-6 animate-spin text-white" />
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col gap-2">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageSelect}
                      className="hidden"
                      disabled={isUploadingImage}
                    />
                    <Button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      variant="outline"
                      disabled={isUploadingImage}
                      className="flex items-center gap-2"
                      style={{
                        borderColor: "#D4A574",
                        color: "#7C5A3B",
                      }}
                    >
                      <Upload className="w-4 h-4" />
                      {imagePreview ? "Change Image" : "Upload Image"}
                    </Button>
                    {imagePreview && (
                      <Button
                        type="button"
                        onClick={() => {
                          setImagePreview(profile.profileImage || null);
                          setFormData((prev) => ({
                            ...prev,
                            profileImage: profile.profileImage || "",
                          }));
                        }}
                        variant="ghost"
                        size="sm"
                        className="text-red-500 hover:text-red-700"
                      >
                        Remove
                      </Button>
                    )}
                  </div>
                </div>

                {/* Basic Information */}
                <div className="space-y-4">
                  <h3
                    className="text-lg font-semibold"
                    style={{ color: "#7C5A3B" }}
                  >
                    Basic Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name *</Label>
                      <Input
                        id="firstName"
                        value={formData.firstName}
                        onChange={(e) => {
                          setFormData({ ...formData, firstName: e.target.value });
                          // Clear error when user starts typing
                          if (validationErrors.firstName) {
                            setValidationErrors((prev) => {
                              const newErrors = { ...prev };
                              delete newErrors.firstName;
                              return newErrors;
                            });
                          }
                        }}
                        onBlur={(e) => validateField("firstName", e.target.value)}
                        required
                        className={validationErrors.firstName ? "border-red-500" : ""}
                      />
                      {validationErrors.firstName && (
                        <p className="text-sm text-red-500 mt-1">
                          {validationErrors.firstName}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name *</Label>
                      <Input
                        id="lastName"
                        value={formData.lastName}
                        onChange={(e) => {
                          setFormData({ ...formData, lastName: e.target.value });
                          // Clear error when user starts typing
                          if (validationErrors.lastName) {
                            setValidationErrors((prev) => {
                              const newErrors = { ...prev };
                              delete newErrors.lastName;
                              return newErrors;
                            });
                          }
                        }}
                        onBlur={(e) => validateField("lastName", e.target.value)}
                        required
                        className={validationErrors.lastName ? "border-red-500" : ""}
                      />
                      {validationErrors.lastName && (
                        <p className="text-sm text-red-500 mt-1">
                          {validationErrors.lastName}
                        </p>
                      )}
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      value={profile.email}
                      disabled
                      className="bg-gray-100"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Email cannot be changed
                    </p>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="space-y-4">
                  <h3
                    className="text-lg font-semibold"
                    style={{ color: "#7C5A3B" }}
                  >
                    Contact Information
                  </h3>
                  <div>
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => {
                        // Only allow digits
                        const value = e.target.value.replace(/\D/g, "");
                        setFormData({ ...formData, phone: value });
                        // Clear error when user starts typing
                        if (validationErrors.phone) {
                          setValidationErrors((prev) => {
                            const newErrors = { ...prev };
                            delete newErrors.phone;
                            return newErrors;
                          });
                        }
                      }}
                      onBlur={(e) => {
                        validateField("phone", e.target.value);
                      }}
                      placeholder="10 digits"
                      maxLength={10}
                      required
                      className={validationErrors.phone ? "border-red-500" : ""}
                    />
                    {validationErrors.phone && (
                      <p className="text-sm text-red-500 mt-1">
                        {validationErrors.phone}
                      </p>
                    )}
                  </div>
                </div>

                {/* Personal Information */}
                <div className="space-y-4">
                  <h3
                    className="text-lg font-semibold"
                    style={{ color: "#7C5A3B" }}
                  >
                    Personal Information
                  </h3>
                  <div>
                    <Label htmlFor="gender">Gender *</Label>
                    <select
                      id="gender"
                      value={formData.gender}
                      onChange={(e) => {
                        setFormData({
                          ...formData,
                          gender: e.target.value as "male" | "female" | "other" | "",
                        });
                        // Clear error when user selects a value
                        if (validationErrors.gender) {
                          setValidationErrors((prev) => {
                            const newErrors = { ...prev };
                            delete newErrors.gender;
                            return newErrors;
                          });
                        }
                      }}
                      onBlur={(e) => {
                        validateField("gender", e.target.value);
                      }}
                      required
                      className={`w-full px-3 py-2 rounded-md border ${
                        validationErrors.gender ? "border-red-500" : ""
                      }`}
                      style={{
                        backgroundColor: "#FFFFFF",
                        borderColor: validationErrors.gender ? "#EF4444" : "#E5E7EB",
                        color: "#7C5A3B",
                      }}
                    >
                      <option value="">Select Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                    {validationErrors.gender && (
                      <p className="text-sm text-red-500 mt-1">
                        {validationErrors.gender}
                      </p>
                    )}
                  </div>
                </div>

                {/* About Me */}
                <div className="space-y-4">
                  <h3
                    className="text-lg font-semibold"
                    style={{ color: "#7C5A3B" }}
                  >
                    About Me
                  </h3>
                  <div>
                    <Label htmlFor="bio">Bio / About Me *</Label>
                    <textarea
                      id="bio"
                      value={formData.bio}
                      onChange={(e) => {
                        const value = e.target.value;
                        // Enforce max length
                        if (value.length <= 500) {
                          setFormData({ ...formData, bio: value });
                          // Clear error when user starts typing
                          if (validationErrors.bio) {
                            setValidationErrors((prev) => {
                              const newErrors = { ...prev };
                              delete newErrors.bio;
                              return newErrors;
                            });
                          }
                        }
                      }}
                      onBlur={(e) => {
                        validateField("bio", e.target.value);
                      }}
                      rows={4}
                      maxLength={500}
                      required
                      placeholder="Tell us about yourself (minimum 10 characters)..."
                      className={`w-full px-3 py-2 rounded-md border resize-none ${
                        validationErrors.bio ? "border-red-500" : ""
                      }`}
                      style={{
                        backgroundColor: "#FFFFFF",
                        borderColor: validationErrors.bio ? "#EF4444" : "#E5E7EB",
                        color: "#7C5A3B",
                      }}
                    />
                    <div className="flex items-center justify-between mt-1">
                      <p className="text-xs text-gray-500">
                        {formData.bio.length}/500 characters (minimum 10 required)
                      </p>
                      {validationErrors.bio && (
                        <p className="text-sm text-red-500">
                          {validationErrors.bio}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t">
                  <Button
                    onClick={handleSave}
                    disabled={updateProfile.isPending || isUploadingImage}
                    className="flex-1 flex items-center justify-center gap-2"
                    style={{
                      backgroundColor: "#D4A574",
                      color: "#FFFFFF",
                    }}
                  >
                    {updateProfile.isPending ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        Save Changes
                      </>
                    )}
                  </Button>
                  <Button
                    onClick={handleCancel}
                    variant="outline"
                    disabled={updateProfile.isPending || isUploadingImage}
                    className="flex-1 flex items-center justify-center gap-2"
                    style={{
                      borderColor: "#D4A574",
                      color: "#7C5A3B",
                    }}
                  >
                    <X className="w-4 h-4" />
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              // View Mode
              <div className="space-y-6">
                {/* Profile Image */}
                <div className="flex flex-col items-center md:items-start gap-4">
                  {profile.profileImage ? (
                    <img
                      src={profile.profileImage}
                      alt={`${profile.firstName} ${profile.lastName}`}
                      className="w-32 h-32 rounded-full object-cover border-4 border-cream-300 shadow-md"
                    />
                  ) : (
                    <div className="w-32 h-32 rounded-full bg-cream-200 flex items-center justify-center border-4 border-cream-300 shadow-md">
                      <User className="w-16 h-16 text-cream-600" />
                    </div>
                  )}
                </div>

                {/* Basic Information */}
                <div className="space-y-4">
                  <h3
                    className="text-lg font-semibold"
                    style={{ color: "#7C5A3B" }}
                  >
                    Basic Information
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <User className="w-5 h-5 text-gray-400 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm text-gray-500 mb-1">Full Name</p>
                        <p className="font-semibold text-gray-800 text-base">
                          {profile.firstName} {profile.lastName}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Mail className="w-5 h-5 text-gray-400 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm text-gray-500 mb-1">Email</p>
                        <p className="font-semibold text-gray-800 text-base">
                          {profile.email}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="space-y-4">
                  <h3
                    className="text-lg font-semibold"
                    style={{ color: "#7C5A3B" }}
                  >
                    Contact Information
                  </h3>
                  <div className="flex items-start gap-3">
                    <Phone className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm text-gray-500 mb-1">Phone Number</p>
                      <p className="font-semibold text-gray-800 text-base">
                        {profile.phone || (
                          <span className="text-gray-400 italic font-normal">
                            Not provided
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Personal Information */}
                <div className="space-y-4">
                  <h3
                    className="text-lg font-semibold"
                    style={{ color: "#7C5A3B" }}
                  >
                    Personal Information
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Gender</p>
                      <p className="font-semibold text-gray-800 text-base capitalize">
                        {profile.gender ? (
                          profile.gender
                        ) : (
                          <span className="text-gray-400 italic font-normal">
                            Not specified
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                </div>

                {/* About Me */}
                <div className="space-y-4">
                  <h3
                    className="text-lg font-semibold"
                    style={{ color: "#7C5A3B" }}
                  >
                    About Me
                  </h3>
                  <div>
                    <p className="text-sm text-gray-500 mb-2">Bio / About Me</p>
                    <div
                      className="p-4 rounded-md border min-h-[100px]"
                      style={{
                        backgroundColor: "#FAF7F2",
                        borderColor: "#E5E7EB",
                      }}
                    >
                      <p className="text-gray-800 whitespace-pre-wrap leading-relaxed">
                        {profile.bio || (
                          <span className="text-gray-400 italic">
                            No bio provided. Tell others about yourself!
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Account Metadata */}
                <div className="space-y-4 pt-4 border-t">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Member Since</p>
                      <p className="font-semibold text-gray-800">
                        {new Date(profile.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500 mb-2">Role</p>
                    <span className="inline-block px-3 py-1 bg-cream-100 text-cream-800 rounded-full text-sm font-medium">
                      {profile.role}
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t">
                  <Button
                    onClick={() => navigate(ROUTES.CLIENT_DASHBOARD)}
                    variant="outline"
                    className="flex-1"
                    style={{
                      borderColor: "#D4A574",
                      color: "#7C5A3B",
                    }}
                  >
                    Back to Dashboard
                  </Button>
                  <Button
                    onClick={handleResetPassword}
                    variant="outline"
                    className="flex-1 flex items-center justify-center gap-2"
                    style={{
                      borderColor: "#D4A574",
                      color: "#7C5A3B",
                    }}
                  >
                    <Lock className="w-4 h-4" />
                    Reset Password
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Reset Password Modal */}
      {showResetPasswordModal && (
        <ForgotPasswordModal
          isOpen={showResetPasswordModal}
          onClose={() => setShowResetPasswordModal(false)}
          role="client"
        />
      )}
    </div>
  );
}
