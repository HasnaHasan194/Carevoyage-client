import { useState, useEffect,  } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  useCreatePackage,
  useUpdatePackage,
  useGetPackageById,
  useUpdatePackageBasic,
  useUpdatePackageImages,
  useUpdatePackageItinerary,
} from "@/hooks/agency/useAgencyPackages";
import { uploadApi } from "@/services/agency/uploadService";
import { Button } from "@/components/User/button";
import { Input } from "@/components/User/input";
import { ArrowLeft, Plus, X, Upload, Image as  Calendar, Clock,  Utensils, Hotel, Activity, Edit2, Loader2 } from "lucide-react";
import type { CreatePackageRequest, ActivityInput } from "@/services/agency/packageService";
import { ROUTES } from "@/config/env";
import toast from "react-hot-toast";

export function AgencyPackageForm() {
  const { packageId } = useParams<{ packageId: string }>();
  const navigate = useNavigate();
  const isEditMode = !!packageId;

  const createPackage = useCreatePackage();
  const updatePackage = useUpdatePackage();
  const updatePackageBasic = useUpdatePackageBasic();
  const updatePackageImages = useUpdatePackageImages();
  const updatePackageItinerary = useUpdatePackageItinerary();
  const { data: packageData, isLoading: isLoadingPackage } = useGetPackageById(packageId);

  const [formData, setFormData] = useState<CreatePackageRequest>({
    PackageName: "",
    description: "",
    category: "",
    tags: [],
    meetingPoint: "",
    images: [],
    maxGroupSize: 1,
    basePrice: 0,
    startDate: "",
    endDate: "",
    inclusions: [],
    exclusions: [],
    itineraryDays: [],
  });

  const [tagInput, setTagInput] = useState("");
  const [inclusionInput, setInclusionInput] = useState("");
  const [exclusionInput, setExclusionInput] = useState("");
  const [selectedImageFiles, setSelectedImageFiles] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]); // URLs from database
  const [newImagePreviews, setNewImagePreviews] = useState<string[]>([]); // Blob URLs only
  const [uploadingImages, setUploadingImages] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isFormDirty, setIsFormDirty] = useState(false);
  const [dateError, setDateError] = useState<string>("");
  
  // Activity form state for each day
  const [dayActivityForms, setDayActivityForms] = useState<{
    [dayIndex: number]: {
      name: string;
      description: string;
      duration: number;
      category: string;
      priceIncluded: boolean;
    };
  }>({});

  // Track which activity is being edited (dayIndex, activityIndex)
  const [editingActivity, setEditingActivity] = useState<{
    dayIndex: number;
    activityIndex: number;
  } | null>(null);

  // Warn before leaving page if form has unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isFormDirty) {
        e.preventDefault();
        e.returnValue = "";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isFormDirty]);

  // Prefetch package data when in edit mode
  useEffect(() => {
    if (isEditMode && packageData) {
      // Format dates for input fields (YYYY-MM-DD)
      const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toISOString().split('T')[0];
      };

      // Map itinerary days with proper activity handling
      const mappedItineraryDays = (packageData.itinerary?.days || []).map((day: any) => {
        // Map activities - backend returns ActivityResponseDTO[] with id field
        let mappedActivities: (ActivityInput & { id?: string })[] = [];
        
        // Ensure activities is an array and has items
        if (day.activities) {
          if (Array.isArray(day.activities) && day.activities.length > 0) {
            mappedActivities = day.activities.map((activity: any) => {
              // Handle ActivityResponseDTO structure from backend
              return {
                id: activity.id || activity._id || undefined,
                name: activity.name || "",
                description: activity.description || "",
                duration: Number(activity.duration) || 0,
                category: activity.category || "",
                priceIncluded: activity.priceIncluded !== undefined ? Boolean(activity.priceIncluded) : true,
              } as ActivityInput & { id?: string };
            });
          }
        }

        return {
          dayNumber: day.dayNumber || 0,
          title: day.title || "",
          description: day.description || "",
          activities: mappedActivities, // This should now contain all activities
          accommodation: day.accommodation || "",
          meals: day.meals || {
            breakfast: false,
            lunch: false,
            dinner: false,
          },
          transfers: day.transfers || [],
        };
      });

      setFormData({
        PackageName: packageData.PackageName,
        description: packageData.description,
        category: packageData.category,
        tags: packageData.tags || [],
        meetingPoint: packageData.meetingPoint,
        images: packageData.images || [],
        maxGroupSize: packageData.maxGroupSize,
        basePrice: packageData.basePrice,
        startDate: formatDate(packageData.startDate),
        endDate: formatDate(packageData.endDate),
        inclusions: packageData.inclusions || [],
        exclusions: packageData.exclusions || [],
        itineraryDays: mappedItineraryDays,
      });

      //  Separate existing images from new previews
      setExistingImages(packageData.images || []);
      setNewImagePreviews([]);
      setSelectedImageFiles([]);
    }
  }, [isEditMode, packageData]);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const fileArray = Array.from(files);
    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
    const validFiles: File[] = [];
    const invalidFiles: string[] = [];

    // Validate file size and type
    fileArray.forEach((file) => {
      if (file.size > MAX_FILE_SIZE) {
        invalidFiles.push(`${file.name} (exceeds 5MB limit)`);
        return;
      }
      if (!file.type.startsWith('image/')) {
        invalidFiles.push(`${file.name} (not an image)`);
        return;
      }
      validFiles.push(file);
    });

    // Show errors for invalid files
    if (invalidFiles.length > 0) {
      toast.error(`Invalid files: ${invalidFiles.join(', ')}`);
    }

    if (validFiles.length === 0) return;

    // Check for duplicates (by name and size)
    const existingFileNames = new Set(selectedImageFiles.map(f => `${f.name}-${f.size}`));
    const newValidFiles = validFiles.filter(f => !existingFileNames.has(`${f.name}-${f.size}`));
    
    if (newValidFiles.length < validFiles.length) {
      toast.error("Some images were skipped (duplicates)");
    }

    if (newValidFiles.length === 0) return;

    // Store File objects
    setSelectedImageFiles((prev) => [...prev, ...newValidFiles]);

    //  Only create blob URLs for new files, keep separate from existing images
    const newPreviews = newValidFiles.map((file) => URL.createObjectURL(file));
    setNewImagePreviews((prev) => [...prev, ...newPreviews]);
    setIsFormDirty(true);
  };

  const removeImage = (index: number) => {
    //  Remove from new image previews (blob URLs)
    const previewUrl = newImagePreviews[index];
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    
    //  Remove corresponding file - indices match since files and previews are added together
    setSelectedImageFiles((prev) => prev.filter((_, i) => i !== index));
    setNewImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const removeExistingImage = (index: number) => {
    // FIX: Remove from existing images
    const updatedImages = existingImages.filter((_, i) => i !== index);
    setExistingImages(updatedImages);
    setFormData({
      ...formData,
      images: updatedImages,
    });
    setIsFormDirty(true);
  };

  const editActivity = (dayIndex: number, activityIndex: number) => {
    const day = formData.itineraryDays[dayIndex];
    const activity = day.activities[activityIndex];
    
    if (activity) {
      // If editing a different activity, cancel the previous edit first
      if (editingActivity && (editingActivity.dayIndex !== dayIndex || editingActivity.activityIndex !== activityIndex)) {
        // Clear previous form
        const prevDayIndex = editingActivity.dayIndex;
        setDayActivityForms({
          ...dayActivityForms,
          [prevDayIndex]: {
            name: "",
            description: "",
            duration: 0,
            category: "",
            priceIncluded: true,
          },
        });
      }
      
      // Populate form with activity data
      setDayActivityForms({
        ...dayActivityForms,
        [dayIndex]: {
          name: activity.name || "",
          description: activity.description || "",
          duration: activity.duration || 0,
          category: activity.category || "",
          priceIncluded: activity.priceIncluded ?? true,
        },
      });
      
      // Set editing state
      setEditingActivity({ dayIndex, activityIndex });
      
      // Scroll to the form (optional - smooth scroll)
      setTimeout(() => {
        const formElement = document.getElementById(`activity-form-${dayIndex}`);
        if (formElement) {
          formElement.scrollIntoView({ behavior: "smooth", block: "nearest" });
        }
      }, 100);
    }
  };

  const cancelEditActivity = (dayIndex: number) => {
    // Clear form
    setDayActivityForms({
      ...dayActivityForms,
      [dayIndex]: {
        name: "",
        description: "",
        duration: 0,
        category: "",
        priceIncluded: true,
      },
    });
    
    // Clear editing state
    setEditingActivity(null);
  };

  const addActivityToDay = async (dayIndex: number) => {
    const form = dayActivityForms[dayIndex];
    if (!form?.name?.trim() || !form?.category?.trim() || !form?.duration || form.duration <= 0) {
      toast.error("Please fill all required activity fields (Name, Category, Duration > 0)");
      return;
    }

    const day = formData.itineraryDays[dayIndex];
    const activityData: ActivityInput & { id?: string } = {
      name: form.name.trim(),
      description: form.description?.trim() || "",
      duration: form.duration,
      category: form.category.trim(),
      priceIncluded: form.priceIncluded ?? true,
    };

    // Check if we're editing an existing activity
    if (editingActivity && editingActivity.dayIndex === dayIndex && editingActivity.activityIndex !== undefined) {
      // Update existing activity
      const updatedActivities = [...(day.activities || [])];
      const existingActivity = updatedActivities[editingActivity.activityIndex];
      
      // Preserve the ID if it exists (CRITICAL for edit mode)
      if (existingActivity && (existingActivity as ActivityInput & { id?: string }).id) {
        activityData.id = (existingActivity as ActivityInput & { id?: string }).id;
      }
      
      // Check if activity was removed
      if (!existingActivity) {
        toast.error("Activity not found. It may have been removed.");
        setEditingActivity(null);
        return;
      }
      
      updatedActivities[editingActivity.activityIndex] = activityData as ActivityInput & { id?: string };
      
      // Update local state first
      updateItineraryDay(dayIndex, "activities", updatedActivities);
      setIsFormDirty(true);
      
      // If in edit mode, save to backend immediately
      if (isEditMode && packageId) {
        try {
          // Use updated formData state
          const updatedItineraryDays = formData.itineraryDays.map((d, idx) => ({
            dayNumber: d.dayNumber,
            title: d.title,
            description: d.description,
            activities: idx === dayIndex 
              ? updatedActivities.map(activity => ({
                  ...activity,
                  id: (activity as ActivityInput & { id?: string }).id,
                }))
              : d.activities.map(activity => ({
                  ...activity,
                  id: (activity as ActivityInput & { id?: string }).id,
                })),
            accommodation: d.accommodation,
            meals: d.meals,
            transfers: d.transfers || [],
          }));
          
          await updatePackageItinerary.mutateAsync({
            packageId,
            itineraryDays: updatedItineraryDays,
          });
          toast.success("Activity updated successfully");
        } catch (error: any) {
          toast.error(error?.response?.data?.message || "Failed to update activity");
          // Revert local state on error
          updateItineraryDay(dayIndex, "activities", day.activities || []);
          return;
        }
      } else {
        toast.success("Activity updated successfully");
      }
      
      // Clear editing state
      setEditingActivity(null);
    } else {
      // Check for duplicate activities (same name and category)
      const isDuplicate = day.activities?.some(
        (act) => act.name.trim().toLowerCase() === activityData.name.trim().toLowerCase() &&
                 act.category.trim().toLowerCase() === activityData.category.trim().toLowerCase()
      );
      
      if (isDuplicate) {
        toast.error("An activity with the same name and category already exists for this day");
        return;
      }
      
      // Add new activity to local state
      const newActivities = [
        ...(day.activities || []),
        activityData,
      ];
      updateItineraryDay(dayIndex, "activities", newActivities);
      setIsFormDirty(true);
      
      // If in edit mode, save to backend immediately
      if (isEditMode && packageId) {
        try {
          // Use updated formData state
          const updatedItineraryDays = formData.itineraryDays.map((d, idx) => ({
            dayNumber: d.dayNumber,
            title: d.title,
            description: d.description,
            activities: idx === dayIndex 
              ? newActivities.map(activity => ({
                  ...activity,
                  id: (activity as ActivityInput & { id?: string }).id,
                }))
              : d.activities.map(activity => ({
                  ...activity,
                  id: (activity as ActivityInput & { id?: string }).id,
                })),
            accommodation: d.accommodation,
            meals: d.meals,
            transfers: d.transfers || [],
          }));
          
          await updatePackageItinerary.mutateAsync({
            packageId,
            itineraryDays: updatedItineraryDays,
          });
          toast.success("Activity added successfully");
        } catch (error: any) {
          toast.error(error?.response?.data?.message || "Failed to add activity");
          // Revert local state on error
          updateItineraryDay(dayIndex, "activities", day.activities || []);
          return;
        }
      } else {
        toast.success("Activity added successfully");
      }
    }

    // Clear form
    setDayActivityForms({
      ...dayActivityForms,
      [dayIndex]: {
        name: "",
        description: "",
        duration: 0,
        category: "",
        priceIncluded: true,
      },
    });
  };

  const removeActivityFromDay = async (dayIndex: number, activityIndex: number) => {
    const day = formData.itineraryDays[dayIndex];
    const updatedActivities = day.activities.filter((_, i) => i !== activityIndex);
    
    // Update local state first
    updateItineraryDay(dayIndex, "activities", updatedActivities);
    setIsFormDirty(true);
    
    // Clear editing state if the activity being edited is removed
    if (editingActivity && editingActivity.dayIndex === dayIndex && editingActivity.activityIndex === activityIndex) {
      setEditingActivity(null);
      setDayActivityForms({
        ...dayActivityForms,
        [dayIndex]: {
          name: "",
          description: "",
          duration: 0,
          category: "",
          priceIncluded: true,
        },
      });
    }

    // If in edit mode, save to backend immediately
    if (isEditMode && packageId) {
      try {
        // Build updated itinerary days array with the removed activity
        const updatedItineraryDays = formData.itineraryDays.map((d, idx) => ({
          dayNumber: d.dayNumber,
          title: d.title,
          description: d.description,
          activities: idx === dayIndex 
            ? updatedActivities.map(activity => ({
                ...activity,
                id: (activity as ActivityInput & { id?: string }).id,
              }))
            : d.activities.map(activity => ({
                ...activity,
                id: (activity as ActivityInput & { id?: string }).id,
              })),
          accommodation: d.accommodation,
          meals: d.meals,
          transfers: d.transfers || [],
        }));
        
        await updatePackageItinerary.mutateAsync({
          packageId,
          itineraryDays: updatedItineraryDays,
        });
        toast.success("Activity removed successfully");
      } catch (error: any) {
        toast.error(error?.response?.data?.message || "Failed to remove activity");
        // Revert local state on error
        updateItineraryDay(dayIndex, "activities", day.activities || []);
      }
    }
  };

  const updateDayActivityForm = (
    dayIndex: number,
    field: keyof ActivityInput,
    value: string | number | boolean
  ) => {
    setDayActivityForms({
      ...dayActivityForms,
      [dayIndex]: {
        ...(dayActivityForms[dayIndex] || {
          name: "",
          description: "",
          duration: 0,
          category: "",
          priceIncluded: true,
        }),
        [field]: value,
      },
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate dates before submission
    if (formData.startDate && formData.endDate && formData.endDate < formData.startDate) {
      toast.error("End date must be after start date");
      setDateError("End date must be after start date");
      return;
    }

    // Validate required fields
    if (!formData.PackageName?.trim()) {
      toast.error("Package name is required");
      return;
    }
    if (!formData.description?.trim()) {
      toast.error("Description is required");
      return;
    }
    if (!formData.category?.trim()) {
      toast.error("Category is required");
      return;
    }
    if (!formData.meetingPoint?.trim()) {
      toast.error("Meeting point is required");
      return;
    }
    if (formData.basePrice < 0) {
      toast.error("Base price cannot be negative");
      return;
    }
    if (formData.maxGroupSize < 1) {
      toast.error("Max group size must be at least 1");
      return;
    }
    if (!formData.startDate) {
      toast.error("Start date is required");
      return;
    }
    if (!formData.endDate) {
      toast.error("End date is required");
      return;
    }
    
    setIsLoading(true);
    setUploadingImages(true);
    
    try {
      if (isEditMode && packageId) {
        // Upload new images if any
        let imageUrls: string[] = [];
        if (selectedImageFiles.length > 0) {
          try {
            imageUrls = await uploadApi.uploadMultipleImages(selectedImageFiles);
            if (imageUrls.length > 0) {
              toast.success(`${imageUrls.length} image(s) uploaded successfully`);
            }
          } catch (uploadError: any) {
            const errorMsg = uploadError?.response?.data?.message || uploadError?.message || "Failed to upload images";
            toast.error(errorMsg);
            throw uploadError; // Re-throw to stop the submission
          }
        }
        
        // FIX: Combine existing images (from existingImages state) with newly uploaded ones
        const allImageUrls = [...existingImages, ...imageUrls];

        // Update basic details (including images)
        const updatedPackage = await updatePackageBasic.mutateAsync({
          packageId,
          data: {
            PackageName: formData.PackageName,
            description: formData.description,
            category: formData.category,
            tags: formData.tags,
            meetingPoint: formData.meetingPoint,
            maxGroupSize: formData.maxGroupSize,
            basePrice: formData.basePrice,
            startDate: formData.startDate,
            endDate: formData.endDate,
            inclusions: formData.inclusions,
            exclusions: formData.exclusions,
            images: allImageUrls, // Include images in basic update
          },
        });

        // FIX: Update state with response to prevent duplication
        setFormData({
          ...formData,
          images: updatedPackage.images || [],
        });
        setExistingImages(updatedPackage.images || []);
        setNewImagePreviews([]);
        setSelectedImageFiles([]);

        // Update itinerary if exists
        if (formData.itineraryDays.length > 0) {
          // Send activities as objects - backend will handle creating new ones or using existing IDs
          await updatePackageItinerary.mutateAsync({
            packageId,
            itineraryDays: formData.itineraryDays.map(day => ({
              dayNumber: day.dayNumber,
              title: day.title,
              description: day.description,
              activities: day.activities.map(activity => ({
                // Include ID if it exists (existing activity), otherwise send full object (new activity)
                ...activity,
                id: (activity as ActivityInput & { id?: string }).id,
              })),
              accommodation: day.accommodation,
              meals: day.meals,
              transfers: day.transfers || [],
            })),
          });
        }

        // FIX: Clean up blob URLs
        newImagePreviews.forEach((url) => {
          URL.revokeObjectURL(url);
        });
      } else {
        // Create new package
        let imageUrls: string[] = [];
        
        // Upload images first if there are any new files
        if (selectedImageFiles.length > 0) {
          try {
            imageUrls = await uploadApi.uploadMultipleImages(selectedImageFiles);
            toast.success(`${imageUrls.length} image(s) uploaded successfully`);
          } catch (uploadError: any) {
            const errorMsg = uploadError?.response?.data?.message || uploadError?.message || "Failed to upload images";
            toast.error(errorMsg);
            throw uploadError; // Re-throw to stop the submission
          }
        }
        
        // FIX: For create mode, only use uploaded image URLs (no existing images)
        const allImageUrls = imageUrls;

        // Prepare package data with image URLs
        const packageData: CreatePackageRequest = {
          ...formData,
          images: allImageUrls,
        };

        await createPackage.mutateAsync(packageData);

        // FIX: Clean up blob URLs
        newImagePreviews.forEach((url) => URL.revokeObjectURL(url));
      }
      
      setIsFormDirty(false);
      navigate(ROUTES.AGENCY_PACKAGES);
    } catch (error: any) {
      // Better error handling
      const errorMessage = error?.response?.data?.message || 
                          error?.message || 
                          (isEditMode ? "Failed to update package" : "Failed to create package");
      
      toast.error(errorMessage);
      
      // Handle specific error cases
      if (error?.response?.status === 401 || error?.response?.status === 403) {
        toast.error("Authentication failed. Please log in again.");
      } else if (error?.response?.status === 404) {
        toast.error("Package not found. It may have been deleted.");
        if (isEditMode) {
          setTimeout(() => navigate(ROUTES.AGENCY_PACKAGES), 2000);
        }
      } else if (error?.response?.status === 400) {
        // Validation errors are already shown by backend
        console.error("Validation error:", error?.response?.data);
      } else if (error?.response?.status >= 500) {
        toast.error("Server error. Please try again later.");
      }
    } finally {
      setUploadingImages(false);
      setIsLoading(false);
    }
  };

  const addTag = () => {
    if (tagInput.trim()) {
      // Check for duplicates
      if (formData.tags?.includes(tagInput.trim())) {
        toast.error("Tag already exists");
        return;
      }
      setFormData({
        ...formData,
        tags: [...(formData.tags || []), tagInput.trim()],
      });
      setTagInput("");
      setIsFormDirty(true);
    }
  };

  const removeTag = (index: number) => {
    setFormData({
      ...formData,
      tags: formData.tags?.filter((_, i) => i !== index) || [],
    });
    setIsFormDirty(true);
  };

  const addInclusion = () => {
    if (inclusionInput.trim()) {
      // Check for duplicates
      if (formData.inclusions?.includes(inclusionInput.trim())) {
        toast.error("Inclusion already exists");
        return;
      }
      setFormData({
        ...formData,
        inclusions: [...(formData.inclusions || []), inclusionInput.trim()],
      });
      setInclusionInput("");
      setIsFormDirty(true);
    }
  };

  const removeInclusion = (index: number) => {
    setFormData({
      ...formData,
      inclusions: formData.inclusions?.filter((_, i) => i !== index) || [],
    });
    setIsFormDirty(true);
  };

  const addExclusion = () => {
    if (exclusionInput.trim()) {
      // Check for duplicates
      if (formData.exclusions?.includes(exclusionInput.trim())) {
        toast.error("Exclusion already exists");
        return;
      }
      setFormData({
        ...formData,
        exclusions: [...(formData.exclusions || []), exclusionInput.trim()],
      });
      setExclusionInput("");
      setIsFormDirty(true);
    }
  };

  const removeExclusion = (index: number) => {
    setFormData({
      ...formData,
      exclusions: formData.exclusions?.filter((_, i) => i !== index) || [],
    });
    setIsFormDirty(true);
  };

  // Calculate number of days between start and end date
  const calculateDays = (startDate: string, endDate: string): number => {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1 to include both start and end day
    return diffDays > 0 ? diffDays : 0;
  };

  // Generate days automatically based on start and end date
  const generateDaysFromDates = (startDate: string, endDate: string, currentDays: typeof formData.itineraryDays) => {
    const daysCount = calculateDays(startDate, endDate);
    if (daysCount === 0) return [];

    const days = [];
    const start = new Date(startDate);
    
    for (let i = 0; i < daysCount; i++) {
      const currentDate = new Date(start);
      currentDate.setDate(start.getDate() + i);
      
      // Check if day already exists in itinerary
      const existingDay = currentDays.find(d => d.dayNumber === i + 1);
      
      days.push({
        dayNumber: i + 1,
        title: existingDay?.title || `Day ${i + 1}`,
        description: existingDay?.description || "",
        activities: existingDay?.activities || [],
        accommodation: existingDay?.accommodation || "",
        meals: existingDay?.meals || {
          breakfast: false,
          lunch: false,
          dinner: false,
        },
        transfers: existingDay?.transfers || [],
      });
    }
    
    return days;
  };

  // Auto-generate days when start/end dates change (ONLY in create mode)
  // In edit mode, days are loaded from packageData and should not be regenerated
  useEffect(() => {
    // Skip auto-generation entirely in edit mode - let prefetch handle it
    if (isEditMode) return;
    
    // Skip if package data is still loading
    if (isLoadingPackage) return;
    
    if (formData.startDate && formData.endDate) {
      const daysCount = calculateDays(formData.startDate, formData.endDate);
      const currentDaysCount = formData.itineraryDays.length;
      
      // Auto-generate if dates are valid and days count changed
      if (daysCount > 0 && daysCount !== currentDaysCount) {
        setFormData((prev) => {
          const generatedDays = generateDaysFromDates(prev.startDate, prev.endDate, prev.itineraryDays);
          return {
            ...prev,
            itineraryDays: generatedDays,
          };
        });
      }
    } else if (formData.itineraryDays.length > 0 && (!formData.startDate || !formData.endDate)) {
      // Clear days if dates are removed
      setFormData((prev) => ({
        ...prev,
        itineraryDays: [],
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.startDate, formData.endDate, isEditMode, isLoadingPackage]);

  const addItineraryDay = () => {
    setFormData({
      ...formData,
      itineraryDays: [
        ...formData.itineraryDays,
        {
          dayNumber: formData.itineraryDays.length + 1,
          title: "",
          description: "",
          activities: [],
          accommodation: "",
          meals: {
            breakfast: false,
            lunch: false,
            dinner: false,
          },
          transfers: [],
        },
      ],
    });
    setIsFormDirty(true);
  };

  const updateItineraryDay = (
    index: number,
    field: string,
    value: unknown
  ) => {
    const updatedDays = [...formData.itineraryDays];
    updatedDays[index] = {
      ...updatedDays[index],
      [field]: value,
    };
    setFormData({ ...formData, itineraryDays: updatedDays });
  };

  const removeItineraryDay = (index: number) => {
    setFormData({
      ...formData,
      itineraryDays: formData.itineraryDays.filter((_, i) => i !== index),
    });
  };

  // Show loading state while fetching package data
  if (isEditMode && isLoadingPackage) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#FAFAFA" }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#D4A574] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading package details...</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen p-4 sm:p-6 lg:p-8"
      style={{ backgroundColor: "#FAFAFA" }}
    >
      <div className="max-w-4xl mx-auto">
        <div
          className="rounded-xl shadow-lg overflow-hidden"
          style={{ backgroundColor: "#FFFFFF" }}
        >
          <div
            className="px-4 sm:px-6 py-5 border-b flex items-center gap-4"
            style={{ borderColor: "#E5E7EB" }}
          >
            <Button
              variant="ghost"
              onClick={() => {
                if (isFormDirty) {
                  if (window.confirm("You have unsaved changes. Are you sure you want to leave?")) {
                    navigate(ROUTES.AGENCY_PACKAGES);
                  }
                } else {
                  navigate(ROUTES.AGENCY_PACKAGES);
                }
              }}
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div className="flex items-center gap-2">
              <h1
                className="text-xl sm:text-2xl font-bold"
                style={{ color: "#7C5A3B" }}
              >
                {isEditMode ? "Edit Package" : "Create New Package"}
              </h1>
              {isFormDirty && (
                <span className="text-xs px-2 py-1 rounded-full bg-yellow-100 text-yellow-800">
                  Unsaved changes
                </span>
              )}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold" style={{ color: "#7C5A3B" }}>
                Basic Information
              </h2>

              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: "#8B6F47" }}>
                  Package Name *
                </label>
                <Input
                  required
                  value={formData.PackageName}
                  onChange={(e) => {
                    setFormData({ ...formData, PackageName: e.target.value });
                    setIsFormDirty(true);
                  }}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: "#8B6F47" }}>
                  Description *
                </label>
                <textarea
                  required
                  rows={4}
                  value={formData.description}
                  onChange={(e) => {
                    setFormData({ ...formData, description: e.target.value });
                    setIsFormDirty(true);
                  }}
                  className="w-full px-3 py-2 rounded-md border"
                  style={{
                    backgroundColor: "#F9FAFB",
                    borderColor: "#D1D5DB",
                    color: "#8B6F47",
                  }}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: "#8B6F47" }}>
                    Category *
                  </label>
                  <Input
                    required
                    value={formData.category}
                    onChange={(e) => {
                      setFormData({ ...formData, category: e.target.value });
                      setIsFormDirty(true);
                    }}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: "#8B6F47" }}>
                    Meeting Point *
                  </label>
                  <Input
                    required
                    value={formData.meetingPoint}
                    onChange={(e) => {
                      setFormData({ ...formData, meetingPoint: e.target.value });
                      setIsFormDirty(true);
                    }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: "#8B6F47" }}>
                    Base Price *
                  </label>
                  <Input
                    type="number"
                    required
                    min="0"
                    step="0.01"
                    value={formData.basePrice}
                    onChange={(e) => {
                      const value = Number(e.target.value);
                      if (value >= 0) {
                        setFormData({
                          ...formData,
                          basePrice: value,
                        });
                        setIsFormDirty(true);
                      }
                    }}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: "#8B6F47" }}>
                    Max Group Size *
                  </label>
                  <Input
                    type="number"
                    required
                    min="1"
                    value={formData.maxGroupSize}
                    onChange={(e) => {
                      const value = Number(e.target.value);
                      if (value >= 1) {
                        setFormData({
                          ...formData,
                          maxGroupSize: value,
                        });
                        setIsFormDirty(true);
                      }
                    }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: "#8B6F47" }}>
                    Start Date *
                  </label>
                  <Input
                    type="date"
                    required
                    min={new Date().toISOString().split('T')[0]} // Prevent past dates
                    value={formData.startDate}
                    onChange={(e) => {
                      const newStartDate = e.target.value;
                      setFormData({ ...formData, startDate: newStartDate });
                      setIsFormDirty(true);
                      
                      // Validate dates
                      if (formData.endDate && newStartDate > formData.endDate) {
                        setDateError("End date must be after start date");
                      } else {
                        setDateError("");
                      }
                    }}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: "#8B6F47" }}>
                    End Date *
                  </label>
                  <Input
                    type="date"
                    required
                    min={formData.startDate || new Date().toISOString().split('T')[0]}
                    value={formData.endDate}
                    onChange={(e) => {
                      const newEndDate = e.target.value;
                      setFormData({ ...formData, endDate: newEndDate });
                      setIsFormDirty(true);
                      
                      // Validate dates
                      if (formData.startDate && newEndDate < formData.startDate) {
                        setDateError("End date must be after start date");
                      } else {
                        setDateError("");
                      }
                    }}
                  />
                  {dateError && (
                    <p className="text-xs mt-1 text-red-500">{dateError}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Image Upload */}
            <div>
              <h2 className="text-lg font-semibold mb-3" style={{ color: "#7C5A3B" }}>
                Package Images
              </h2>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2" style={{ color: "#8B6F47" }}>
                  Select Images
                </label>
                <div className="flex items-center gap-2">
                  <label className="flex items-center gap-2 px-4 py-2 border rounded-md cursor-pointer hover:bg-gray-50">
                    <Upload className="w-4 h-4" />
                    <span>Choose Files</span>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageSelect}
                      className="hidden"
                      disabled={uploadingImages}
                    />
                  </label>
                  {uploadingImages && (
                    <span className="text-sm" style={{ color: "#6B7280" }}>
                      Uploading images...
                    </span>
                  )}
                </div>
              </div>
              
              {/* Show previews of selected files and existing images */}
              {(existingImages.length > 0 || newImagePreviews.length > 0) && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {/* FIX: Existing images (from database) */}
                  {existingImages.map((url, index) => (
                    <div key={`existing-${index}`} className="relative group">
                      <img
                        src={url}
                        alt={`Package ${index + 1}`}
                        className="w-full h-32 object-cover rounded-md"
                      />
                      <button
                        type="button"
                        onClick={() => removeExistingImage(index)}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  
                  {/* FIX: New selected files (blob previews) - index matches newImagePreviews array */}
                  {newImagePreviews.map((previewUrl, index) => (
                    <div key={`preview-${index}`} className="relative group">
                      <img
                        src={previewUrl}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-32 object-cover rounded-md"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-4 h-4" />
                      </button>
                      <div className="absolute bottom-2 left-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded">
                        Pending Upload
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              {selectedImageFiles.length > 0 && (
                <p className="text-sm mt-2" style={{ color: "#6B7280" }}>
                  {selectedImageFiles.length} image(s) selected. They will be uploaded when you submit the form.
                </p>
              )}
            </div>

            {/* Tags */}
            <div>
              <h2 className="text-lg font-semibold mb-3" style={{ color: "#7C5A3B" }}>
                Tags
              </h2>
              <div className="flex gap-2 mb-2">
                <Input
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addTag();
                    }
                  }}
                  placeholder="Add a tag"
                />
                <Button type="button" onClick={addTag}>
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.tags?.map((tag, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 rounded bg-blue-100 text-blue-800 text-sm flex items-center gap-1"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(index)}
                      className="ml-1"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Inclusions */}
            <div>
              <h2 className="text-lg font-semibold mb-3" style={{ color: "#7C5A3B" }}>
                Inclusions
              </h2>
              <div className="flex gap-2 mb-2">
                <Input
                  value={inclusionInput}
                  onChange={(e) => setInclusionInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addInclusion();
                    }
                  }}
                  placeholder="Add an inclusion"
                />
                <Button type="button" onClick={addInclusion}>
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <ul className="list-disc list-inside space-y-1">
                {formData.inclusions?.map((inc, index) => (
                  <li key={index} className="flex items-center justify-between">
                    <span style={{ color: "#8B6F47" }}>{inc}</span>
                    <button
                      type="button"
                      onClick={() => removeInclusion(index)}
                      className="ml-2"
                    >
                      <X className="w-4 h-4" style={{ color: "#DC2626" }} />
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Exclusions */}
            <div>
              <h2 className="text-lg font-semibold mb-3" style={{ color: "#7C5A3B" }}>
                Exclusions
              </h2>
              <div className="flex gap-2 mb-2">
                <Input
                  value={exclusionInput}
                  onChange={(e) => setExclusionInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addExclusion();
                    }
                  }}
                  placeholder="Add an exclusion"
                />
                <Button type="button" onClick={addExclusion}>
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <ul className="list-disc list-inside space-y-1">
                {formData.exclusions?.map((exc, index) => (
                  <li key={index} className="flex items-center justify-between">
                    <span style={{ color: "#8B6F47" }}>{exc}</span>
                    <button
                      type="button"
                      onClick={() => removeExclusion(index)}
                      className="ml-2"
                    >
                      <X className="w-4 h-4" style={{ color: "#DC2626" }} />
                    </button>
                  </li>
                ))}
              </ul>
            </div>


            {/* Itinerary */}
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold mb-1" style={{ color: "#7C5A3B" }}>
                    Itinerary
                  </h2>
                  <p className="text-sm" style={{ color: "#6B7280" }}>
                    {formData.startDate && formData.endDate
                      ? `${calculateDays(formData.startDate, formData.endDate)} days based on your selected dates`
                      : "Set start and end dates to automatically generate days"}
                  </p>
                </div>
                {(!formData.startDate || !formData.endDate) && (
                  <Button type="button" onClick={addItineraryDay} className="bg-[#D4A574] hover:bg-[#C89564] text-white">
                    <Plus className="w-4 h-4 mr-1" />
                    Add Day Manually
                  </Button>
                )}
              </div>

              {formData.itineraryDays.length === 0 && (
                <div className="text-center py-12 border-2 border-dashed rounded-lg" style={{ borderColor: "#E5E7EB" }}>
                  <Calendar className="w-12 h-12 mx-auto mb-3" style={{ color: "#9CA3AF" }} />
                  <p className="text-sm font-medium mb-1" style={{ color: "#8B6F47" }}>
                    No itinerary days yet
                  </p>
                  <p className="text-xs" style={{ color: "#6B7280" }}>
                    Set start and end dates to automatically generate days, or add manually
                  </p>
                </div>
              )}

              {formData.itineraryDays.map((day, index) => {
                const dayDate = formData.startDate
                  ? new Date(new Date(formData.startDate).getTime() + (day.dayNumber - 1) * 24 * 60 * 60 * 1000)
                  : null;
                const formattedDate = dayDate
                  ? dayDate.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })
                  : null;

                return (
                  <div
                    key={index}
                    className="border-2 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                    style={{ 
                      borderColor: "#E5E7EB",
                      backgroundColor: "#FFFFFF"
                    }}
                  >
                    {/* Day Header */}
                    <div
                      className="px-6 py-4 border-b flex items-center justify-between"
                      style={{ 
                        backgroundColor: "#F9FAFB",
                        borderColor: "#E5E7EB"
                      }}
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className="w-12 h-12 rounded-lg flex items-center justify-center font-bold text-lg"
                          style={{ 
                            backgroundColor: "#D4A574",
                            color: "#FFFFFF"
                          }}
                        >
                          {day.dayNumber}
                        </div>
                        <div>
                          <h3 className="font-bold text-lg" style={{ color: "#7C5A3B" }}>
                            {day.title || `Day ${day.dayNumber}`}
                          </h3>
                          {formattedDate && (
                            <p className="text-sm flex items-center gap-1 mt-0.5" style={{ color: "#6B7280" }}>
                              <Calendar className="w-3 h-3" />
                              {formattedDate}
                            </p>
                          )}
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() => removeItineraryDay(index)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <X className="w-5 h-5" />
                      </Button>
                    </div>

                    {/* Day Content */}
                    <div className="p-6 space-y-6">
                      {/* Day Title & Description */}
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-semibold mb-2 flex items-center gap-2" style={{ color: "#8B6F47" }}>
                            <span>Day Title</span>
                          </label>
                          <Input
                            placeholder="e.g., Arrival & Welcome"
                            value={day.title}
                            onChange={(e) =>
                              updateItineraryDay(index, "title", e.target.value)
                            }
                            className="text-base"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold mb-2" style={{ color: "#8B6F47" }}>
                            Day Description
                          </label>
                          <textarea
                            placeholder="Describe what happens on this day..."
                            rows={4}
                            value={day.description}
                            onChange={(e) =>
                              updateItineraryDay(index, "description", e.target.value)
                            }
                            className="w-full px-4 py-3 rounded-lg border text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#D4A574] focus:border-transparent transition-all"
                            style={{
                              backgroundColor: "#FFFFFF",
                              borderColor: "#D1D5DB",
                              color: "#8B6F47",
                            }}
                          />
                        </div>
                      </div>

                      {/* Activities Section */}
                      <div className="border-t pt-6" style={{ borderColor: "#E5E7EB" }}>
                        <div className="flex items-center justify-between mb-4">
                          <label className="text-base font-semibold flex items-center gap-2" style={{ color: "#7C5A3B" }}>
                            <Activity className="w-5 h-5" style={{ color: "#D4A574" }} />
                            Activities
                          </label>
                          <span className="text-xs px-2 py-1 rounded-full" style={{ backgroundColor: "#F3F4F6", color: "#6B7280" }}>
                            {day.activities?.length || 0} {day.activities?.length === 1 ? 'activity' : 'activities'}
                          </span>
                        </div>
                        
                        {/* Activities List */}
                        {day.activities && day.activities.length > 0 && (
                          <div className="mb-4 space-y-3">
                            {day.activities.map((activity, activityIndex) => (
                              <div
                                key={activityIndex}
                                className="flex items-start justify-between p-4 rounded-lg border group hover:shadow-sm transition-all"
                                style={{ 
                                  backgroundColor: "#F9FAFB",
                                  borderColor: "#E5E7EB"
                                }}
                              >
                                <div className="flex-1">
                                  <div className="flex items-center gap-3 mb-2">
                                    <div
                                      className="w-8 h-8 rounded-md flex items-center justify-center shrink-0"
                                      style={{ backgroundColor: "#D4A574" }}
                                    >
                                      <Activity className="w-4 h-4 text-white" />
                                    </div>
                                    <div>
                                      <h4 className="font-semibold text-sm" style={{ color: "#7C5A3B" }}>
                                        {activity.name}
                                      </h4>
                                      <div className="flex items-center gap-3 mt-1">
                                        <span className="text-xs flex items-center gap-1" style={{ color: "#6B7280" }}>
                                          <Clock className="w-3 h-3" />
                                          {activity.duration} min
                                        </span>
                                        <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: "#F5E6D3", color: "#8B6F47" }}>
                                          {activity.category}
                                        </span>
                                        {activity.priceIncluded && (
                                          <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: "#D1FAE5", color: "#065F46" }}>
                                            Included
                                          </span>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                  {activity.description && (
                                    <p className="text-xs mt-2 ml-11" style={{ color: "#6B7280" }}>
                                      {activity.description}
                                    </p>
                                  )}
                                </div>
                                <div className="ml-4 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <button
                                    type="button"
                                    onClick={() => editActivity(index, activityIndex)}
                                    className="p-1.5 rounded-md hover:bg-blue-50 text-blue-500"
                                    title="Edit activity"
                                  >
                                    <Edit2 className="w-4 h-4" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => removeActivityFromDay(index, activityIndex)}
                                    className="p-1.5 rounded-md hover:bg-red-50 text-red-500"
                                    title="Remove activity"
                                  >
                                    <X className="w-4 h-4" />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Add Activity Form */}
                        <div 
                          id={`activity-form-${index}`}
                          className={`border-2 border-dashed rounded-lg p-4 transition-all ${
                            editingActivity && editingActivity.dayIndex === index 
                              ? "border-[#D4A574] bg-[#FEF3E2]" 
                              : "border-[#D1D5DB] bg-[#FAFAFA]"
                          }`}
                        >
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="text-sm font-semibold flex items-center gap-2" style={{ color: "#8B6F47" }}>
                              {editingActivity && editingActivity.dayIndex === index ? (
                                <>
                                  <Edit2 className="w-4 h-4" style={{ color: "#D4A574" }} />
                                  Edit Activity
                                </>
                              ) : (
                                <>
                                  <Plus className="w-4 h-4" style={{ color: "#D4A574" }} />
                                  Add New Activity
                                </>
                              )}
                            </h4>
                            {editingActivity && editingActivity.dayIndex === index && (
                              <button
                                type="button"
                                onClick={() => cancelEditActivity(index)}
                                className="text-xs text-gray-500 hover:text-gray-700"
                              >
                                Cancel
                              </button>
                            )}
                          </div>
                          <div className="space-y-3">
                            <Input
                              placeholder="Activity Name *"
                              value={dayActivityForms[index]?.name || ""}
                              onChange={(e) =>
                                updateDayActivityForm(index, "name", e.target.value)
                              }
                            />
                            <textarea
                              placeholder="Activity Description"
                              rows={2}
                              value={dayActivityForms[index]?.description || ""}
                              onChange={(e) =>
                                updateDayActivityForm(index, "description", e.target.value)
                              }
                              className="w-full px-3 py-2 rounded-md border text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#D4A574] focus:border-transparent"
                              style={{
                                backgroundColor: "#FFFFFF",
                                borderColor: "#D1D5DB",
                                color: "#8B6F47",
                              }}
                            />
                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <label className="block text-xs font-medium mb-1" style={{ color: "#6B7280" }}>
                                  Duration (minutes) *
                                </label>
                                <Input
                                  type="number"
                                  placeholder="e.g., 120"
                                  value={dayActivityForms[index]?.duration || ""}
                                  onChange={(e) =>
                                    updateDayActivityForm(
                                      index,
                                      "duration",
                                      Number(e.target.value)
                                    )
                                  }
                                />
                              </div>
                              <div>
                                <label className="block text-xs font-medium mb-1" style={{ color: "#6B7280" }}>
                                  Category *
                                </label>
                                <Input
                                  placeholder="e.g., Sightseeing"
                                  value={dayActivityForms[index]?.category || ""}
                                  onChange={(e) =>
                                    updateDayActivityForm(index, "category", e.target.value)
                                  }
                                />
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                id={`price-included-${index}`}
                                checked={dayActivityForms[index]?.priceIncluded ?? true}
                                onChange={(e) =>
                                  updateDayActivityForm(
                                    index,
                                    "priceIncluded",
                                    e.target.checked
                                  )
                                }
                                className="w-4 h-4 rounded border-gray-300 text-[#D4A574] focus:ring-[#D4A574]"
                              />
                              <label htmlFor={`price-included-${index}`} className="text-sm cursor-pointer" style={{ color: "#8B6F47" }}>
                                Price included in package
                              </label>
                            </div>
                            <div className="flex gap-2">
                              {editingActivity && editingActivity.dayIndex === index && (
                                <Button
                                  type="button"
                                  onClick={() => cancelEditActivity(index)}
                                  variant="outline"
                                  className="flex-1"
                                >
                                  Cancel
                                </Button>
                              )}
                              <Button
                                type="button"
                                onClick={() => addActivityToDay(index)}
                                className={`flex-1 bg-[#D4A574] hover:bg-[#C89564] text-white`}
                              >
                                {editingActivity && editingActivity.dayIndex === index ? (
                                  <>
                                    <Edit2 className="w-4 h-4 mr-1" />
                                    Update Activity
                                  </>
                                ) : (
                                  <>
                                    <Plus className="w-4 h-4 mr-1" />
                                    Add Activity
                                  </>
                                )}
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Accommodation & Meals Section */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t pt-6" style={{ borderColor: "#E5E7EB" }}>
                        {/* Accommodation */}
                        <div>
                          <label className="block text-sm font-semibold mb-2 flex items-center gap-2" style={{ color: "#8B6F47" }}>
                            <Hotel className="w-4 h-4" style={{ color: "#D4A574" }} />
                            Accommodation
                          </label>
                          <Input
                            placeholder="e.g., Luxury Resort, Hotel Name"
                            value={day.accommodation}
                            onChange={(e) =>
                              updateItineraryDay(index, "accommodation", e.target.value)
                            }
                          />
                        </div>

                        {/* Meals */}
                        <div>
                          <label className="block text-sm font-semibold mb-2 flex items-center gap-2" style={{ color: "#8B6F47" }}>
                            <Utensils className="w-4 h-4" style={{ color: "#D4A574" }} />
                            Meals Included
                          </label>
                          <div className="flex flex-wrap gap-3">
                            <label className="flex items-center gap-2 px-3 py-2 rounded-lg border cursor-pointer hover:bg-gray-50 transition-colors" style={{ borderColor: day.meals.breakfast ? "#D4A574" : "#D1D5DB", backgroundColor: day.meals.breakfast ? "#FEF3E2" : "#FFFFFF" }}>
                              <input
                                type="checkbox"
                                checked={day.meals.breakfast}
                                onChange={(e) =>
                                  updateItineraryDay(index, "meals", {
                                    ...day.meals,
                                    breakfast: e.target.checked,
                                  })
                                }
                                className="w-4 h-4 rounded border-gray-300 text-[#D4A574] focus:ring-[#D4A574]"
                              />
                              <span className="text-sm font-medium" style={{ color: "#8B6F47" }}>
                                Breakfast
                              </span>
                            </label>
                            <label className="flex items-center gap-2 px-3 py-2 rounded-lg border cursor-pointer hover:bg-gray-50 transition-colors" style={{ borderColor: day.meals.lunch ? "#D4A574" : "#D1D5DB", backgroundColor: day.meals.lunch ? "#FEF3E2" : "#FFFFFF" }}>
                              <input
                                type="checkbox"
                                checked={day.meals.lunch}
                                onChange={(e) =>
                                  updateItineraryDay(index, "meals", {
                                    ...day.meals,
                                    lunch: e.target.checked,
                                  })
                                }
                                className="w-4 h-4 rounded border-gray-300 text-[#D4A574] focus:ring-[#D4A574]"
                              />
                              <span className="text-sm font-medium" style={{ color: "#8B6F47" }}>
                                Lunch
                              </span>
                            </label>
                            <label className="flex items-center gap-2 px-3 py-2 rounded-lg border cursor-pointer hover:bg-gray-50 transition-colors" style={{ borderColor: day.meals.dinner ? "#D4A574" : "#D1D5DB", backgroundColor: day.meals.dinner ? "#FEF3E2" : "#FFFFFF" }}>
                              <input
                                type="checkbox"
                                checked={day.meals.dinner}
                                onChange={(e) =>
                                  updateItineraryDay(index, "meals", {
                                    ...day.meals,
                                    dinner: e.target.checked,
                                  })
                                }
                                className="w-4 h-4 rounded border-gray-300 text-[#D4A574] focus:ring-[#D4A574]"
                              />
                              <span className="text-sm font-medium" style={{ color: "#8B6F47" }}>
                                Dinner
                              </span>
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(ROUTES.AGENCY_PACKAGES)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={
                  isLoading ||
                  createPackage.isPending ||
                  updatePackage.isPending ||
                  updatePackageBasic.isPending ||
                  updatePackageItinerary.isPending ||
                  formData.itineraryDays.length === 0 ||
                  uploadingImages ||
                  !!dateError
                }
                className="bg-[#D4A574] hover:bg-[#C89564] text-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {(isLoading || uploadingImages || createPackage.isPending || updatePackage.isPending || updatePackageBasic.isPending || updatePackageItinerary.isPending) ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    {uploadingImages ? "Uploading Images..." : isEditMode ? "Updating Package..." : "Creating Package..."}
                  </span>
                ) : (
                  isEditMode ? "Update Package" : "Create Package"
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
