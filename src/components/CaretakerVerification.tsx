"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  personalInfoSchema,
  addressInfoSchema,
  professionalInfoSchema,
  documentsSchema,
  type PersonalInfoFormData,
  type AddressInfoFormData,
  type ProfessionalInfoFormData,
  type DocumentsFormData,
} from "@/validations/caretaker-verification.schema";
import { useSubmitVerification } from "@/hooks/caretaker/useVerification";
import { caretakerApi } from "@/services/caretaker/caretakerService";
import { Button } from "@/components/User/button";
import { Input } from "@/components/User/input";
import { Label } from "@/components/User/label";
import { ROUTES } from "@/config/env";
import { ChevronLeft, ChevronRight, Upload, X } from "lucide-react";
import toast from "react-hot-toast";
import type { RootState } from "@/store/store";

type Step = 1 | 2 | 3 | 4;

function LanguagesInput({
  value,
  onChange,
  error,
}: {
  value: string[];
  onChange: (languages: string[]) => void;
  error?: string;
}) {
  const [input, setInput] = useState("");

  const addLanguage = () => {
    if (input.trim() && !value.includes(input.trim())) {
      onChange([...value, input.trim()]);
      setInput("");
    }
  };

  const removeLanguage = (lang: string) => {
    onChange(value.filter((l) => l !== lang));
  };

  return (
    <div>
      <div className="flex gap-2 mb-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addLanguage();
            }
          }}
          placeholder="Type and press Enter"
        />
        <Button type="button" onClick={addLanguage}>
          Add
        </Button>
      </div>
      <div className="flex flex-wrap gap-2">
        {value.map((lang) => (
          <span
            key={lang}
            className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full flex items-center gap-2"
          >
            {lang}
            <button
              type="button"
              onClick={() => removeLanguage(lang)}
              className="text-blue-600 hover:text-blue-800"
            >
              <X className="w-4 h-4" />
            </button>
          </span>
        ))}
      </div>
      {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
    </div>
  );
}

function DocumentUpload({
  label,
  file,
  onFileChange,
  error,
}: {
  label: string;
  file: File | null;
  onFileChange: (file: File | null) => void;
  error?: string;
}) {
  return (
    <div>
      <Label>{label}</Label>
      <div className="mt-2">
        {file ? (
          <div className="flex items-center justify-between p-4 border rounded-md">
            <span className="text-sm">{file.name}</span>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => onFileChange(null)}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        ) : (
          <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-50">
            <Upload className="w-8 h-8 text-gray-400 mb-2" />
            <span className="text-sm text-gray-500">Click to upload</span>
            <span className="text-xs text-gray-400">
              PDF, JPG, PNG (Max 5MB)
            </span>
            <input
              type="file"
              className="hidden"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={(e) => {
                const selectedFile = e.target.files?.[0];
                if (selectedFile) {
                  onFileChange(selectedFile);
                }
              }}
            />
          </label>
        )}
      </div>
      {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
    </div>
  );
}

export function CaretakerVerificationForm() {
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.auth.user);
  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [uploading, setUploading] = useState(false);

  const { mutate: submitVerification, isPending } = useSubmitVerification();

  const personalForm = useForm<PersonalInfoFormData>({
    resolver: zodResolver(personalInfoSchema),
    mode: "onChange",
    defaultValues: {
      email: user?.email || "",
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      phone: user?.phone || "",
    },
  });

  useEffect(() => {
    if (user?.email) {
      personalForm.setValue("email", user.email);
    }
    if (user?.firstName) {
      personalForm.setValue("firstName", user.firstName);
    }
    if (user?.lastName) {
      personalForm.setValue("lastName", user.lastName);
    }
    if (user?.phone) {
      personalForm.setValue("phone", user.phone);
    }
  }, [user, personalForm]);

  const addressForm = useForm<AddressInfoFormData>({
    resolver: zodResolver(addressInfoSchema),
    mode: "onChange",
  });

  const professionalForm = useForm<ProfessionalInfoFormData>({
    resolver: zodResolver(professionalInfoSchema),
    mode: "onChange",
    defaultValues: {
      languages: [],
      experienceYears: 0,
    },
  });

  const documentsForm = useForm<DocumentsFormData>({
    resolver: zodResolver(documentsSchema),
    mode: "onChange",
  });

  const [documentFiles, setDocumentFiles] = useState<{
    caretakerLicense: File | null;
    governmentIdProof: File | null;
    firstAidCertificate: File | null;
  }>({
    caretakerLicense: null,
    governmentIdProof: null,
    firstAidCertificate: null,
  });

  const handleFileChange = (
    field: keyof typeof documentFiles,
    file: File | null
  ) => {
    setDocumentFiles((prev) => ({ ...prev, [field]: file }));
    if (file) {
      documentsForm.setValue(field, file, { shouldValidate: true });
    } else {
      documentsForm.setValue(field, null as any, { shouldValidate: true });
    }
  };

  const handleNext = async () => {
    let isValid = false;

    switch (currentStep) {
      case 1:
        isValid = await personalForm.trigger();
        break;
      case 2:
        isValid = await addressForm.trigger();
        break;
      case 3:
        isValid = await professionalForm.trigger();
        break;
      case 4:
        isValid = await documentsForm.trigger();
        break;
    }

    if (isValid && currentStep < 4) {
      setCurrentStep((prev) => (prev + 1) as Step);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => (prev - 1) as Step);
    }
  };

  const handleSubmit = async () => {
    // Validate all forms before submission
    const isPersonalValid = await personalForm.trigger();
    const isAddressValid = await addressForm.trigger();
    const isProfessionalValid = await professionalForm.trigger();
    const isDocumentsValid = await documentsForm.trigger();

    if (!isPersonalValid || !isAddressValid || !isProfessionalValid) {
      toast.error("Please complete all required fields");
      return;
    }

    if (!isDocumentsValid) {
      toast.error("Please upload all required documents");
      return;
    }

    // Double-check languages array
    const languages = professionalForm.getValues("languages");
    if (!languages || languages.length === 0) {
      toast.error("Please add at least one language");
      setCurrentStep(3); // Go back to step 3
      return;
    }

    setUploading(true);
    try {
      const uploadPromises = [
        caretakerApi.uploadDocuments(
          [documentFiles.caretakerLicense!],
          "caretaker-docs"
        ),
        caretakerApi.uploadDocuments(
          [documentFiles.governmentIdProof!],
          "caretaker-docs"
        ),
        caretakerApi.uploadDocuments(
          [documentFiles.firstAidCertificate!],
          "caretaker-docs"
        ),
      ];

      const [licenseKey, idKey, certificateKey] = await Promise.all(
        uploadPromises
      );

      // Get all form values
      const personalInfo = personalForm.getValues();
      const addressInfo = addressForm.getValues();
      const professionalInfo = professionalForm.getValues();
      
      // Ensure languages array is not empty
      if (!professionalInfo.languages || professionalInfo.languages.length === 0) {
        toast.error("Please add at least one language");
        setCurrentStep(3);
        setUploading(false);
        return;
      }

      submitVerification(
        {
          personalInfo,
          addressInfo,
          professionalInfo,
          documents: {
            caretakerLicense: licenseKey[0],
            governmentIdProof: idKey[0],
            firstAidCertificate: certificateKey[0],
          },
        },
        {
          onSuccess: () => {
            navigate(ROUTES.CARETAKER_DASHBOARD);
          },
        }
      );
    } catch (error) {
      toast.error("Failed to upload documents");
    } finally {
      setUploading(false);
    }
  };

  const steps = [
    { number: 1, title: "Personal Info", key: "personalInfo" },
    { number: 2, title: "Address", key: "addressInfo" },
    { number: 3, title: "Professional", key: "professionalInfo" },
    { number: 4, title: "Documents", key: "documents" },
  ];

  return (
    <div className="min-h-screen bg-[#FAFAFA] py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-1">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                      currentStep >= step.number
                        ? "bg-[#D4A574] text-white"
                        : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {step.number}
                  </div>
                  <span className="mt-2 text-sm text-gray-600">
                    {step.title}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`flex-1 h-1 mx-2 ${
                      currentStep > step.number ? "bg-[#D4A574]" : "bg-gray-200"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-6 text-[#374151]">
            Step {currentStep} of 4: {steps[currentStep - 1].title}
          </h2>

          {currentStep === 1 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>First Name *</Label>
                  <Input
                    {...personalForm.register("firstName")}
                    className={
                      personalForm.formState.errors.firstName
                        ? "border-red-500"
                        : ""
                    }
                  />
                  {personalForm.formState.errors.firstName && (
                    <p className="text-sm text-red-500 mt-1">
                      {personalForm.formState.errors.firstName.message}
                    </p>
                  )}
                </div>
                <div>
                  <Label>Last Name *</Label>
                  <Input
                    {...personalForm.register("lastName")}
                    className={
                      personalForm.formState.errors.lastName
                        ? "border-red-500"
                        : ""
                    }
                  />
                  {personalForm.formState.errors.lastName && (
                    <p className="text-sm text-red-500 mt-1">
                      {personalForm.formState.errors.lastName.message}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <Label>Email *</Label>
                <Input
                  type="email"
                  {...personalForm.register("email")}
                  disabled
                  className="bg-gray-100"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Phone Number *</Label>
                  <Input
                    type="tel"
                    {...personalForm.register("phone")}
                    className={
                      personalForm.formState.errors.phone
                        ? "border-red-500"
                        : ""
                    }
                  />
                  {personalForm.formState.errors.phone && (
                    <p className="text-sm text-red-500 mt-1">
                      {personalForm.formState.errors.phone.message}
                    </p>
                  )}
                </div>
                <div>
                  <Label>Alternate Phone</Label>
                  <Input
                    type="tel"
                    {...personalForm.register("alternatePhone")}
                    className={
                      personalForm.formState.errors.alternatePhone
                        ? "border-red-500"
                        : ""
                    }
                  />
                  {personalForm.formState.errors.alternatePhone && (
                    <p className="text-sm text-red-500 mt-1">
                      {personalForm.formState.errors.alternatePhone.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Date of Birth *</Label>
                  <Input
                    type="date"
                    {...personalForm.register("dob")}
                    className={
                      personalForm.formState.errors.dob ? "border-red-500" : ""
                    }
                  />
                  {personalForm.formState.errors.dob && (
                    <p className="text-sm text-red-500 mt-1">
                      {personalForm.formState.errors.dob.message}
                    </p>
                  )}
                </div>
                <div>
                  <Label>Gender *</Label>
                  <select
                    {...personalForm.register("gender")}
                    className={`w-full px-3 py-2 border rounded-md ${
                      personalForm.formState.errors.gender
                        ? "border-red-500"
                        : ""
                    }`}
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                  {personalForm.formState.errors.gender && (
                    <p className="text-sm text-red-500 mt-1">
                      {personalForm.formState.errors.gender.message}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <Label>Nationality *</Label>
                <Input
                  {...personalForm.register("nationality")}
                  className={
                    personalForm.formState.errors.nationality
                      ? "border-red-500"
                      : ""
                  }
                />
                {personalForm.formState.errors.nationality && (
                  <p className="text-sm text-red-500 mt-1">
                    {personalForm.formState.errors.nationality.message}
                  </p>
                )}
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-4">
              <div>
                <Label>Street Address *</Label>
                <Input
                  {...addressForm.register("street")}
                  className={
                    addressForm.formState.errors.street ? "border-red-500" : ""
                  }
                />
                {addressForm.formState.errors.street && (
                  <p className="text-sm text-red-500 mt-1">
                    {addressForm.formState.errors.street.message}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>City *</Label>
                  <Input
                    {...addressForm.register("city")}
                    className={
                      addressForm.formState.errors.city ? "border-red-500" : ""
                    }
                  />
                  {addressForm.formState.errors.city && (
                    <p className="text-sm text-red-500 mt-1">
                      {addressForm.formState.errors.city.message}
                    </p>
                  )}
                </div>
                <div>
                  <Label>State *</Label>
                  <Input
                    {...addressForm.register("state")}
                    className={
                      addressForm.formState.errors.state ? "border-red-500" : ""
                    }
                  />
                  {addressForm.formState.errors.state && (
                    <p className="text-sm text-red-500 mt-1">
                      {addressForm.formState.errors.state.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Country *</Label>
                  <Input
                    {...addressForm.register("country")}
                    className={
                      addressForm.formState.errors.country
                        ? "border-red-500"
                        : ""
                    }
                  />
                  {addressForm.formState.errors.country && (
                    <p className="text-sm text-red-500 mt-1">
                      {addressForm.formState.errors.country.message}
                    </p>
                  )}
                </div>
                <div>
                  <Label>Pin Code *</Label>
                  <Input
                    {...addressForm.register("postalCode")}
                    className={
                      addressForm.formState.errors.postalCode
                        ? "border-red-500"
                        : ""
                    }
                  />
                  {addressForm.formState.errors.postalCode && (
                    <p className="text-sm text-red-500 mt-1">
                      {addressForm.formState.errors.postalCode.message}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-4">
              <div>
                <Label>Years of Experience *</Label>
                <Input
                  type="number"
                  min="0"
                  max="50"
                  {...professionalForm.register("experienceYears", {
                    valueAsNumber: true,
                  })}
                  className={
                    professionalForm.formState.errors.experienceYears
                      ? "border-red-500"
                      : ""
                  }
                />
                {professionalForm.formState.errors.experienceYears && (
                  <p className="text-sm text-red-500 mt-1">
                    {professionalForm.formState.errors.experienceYears.message}
                  </p>
                )}
              </div>

              <div>
                <Label>Languages Spoken *</Label>
                <LanguagesInput
                  value={professionalForm.watch("languages") || []}
                  onChange={(languages) => {
                    professionalForm.setValue("languages", languages, {
                      shouldValidate: true,
                      shouldDirty: true,
                      shouldTouch: true,
                    });
                  }}
                  error={
                    professionalForm.formState.errors.languages?.message
                  }
                />
                {/* Hidden input to register the field */}
                <input
                  type="hidden"
                  {...professionalForm.register("languages", {
                    validate: (value) => {
                      if (!value || value.length === 0) {
                        return "At least one language is required";
                      }
                      return true;
                    },
                  })}
                />
              </div>

              <div>
                <Label>Professional Bio *</Label>
                <textarea
                  rows={6}
                  {...professionalForm.register("professionalBio")}
                  className={`w-full px-3 py-2 border rounded-md ${
                    professionalForm.formState.errors.professionalBio
                      ? "border-red-500"
                      : ""
                  }`}
                />
                <p className="text-sm text-gray-500 mt-1">
                  {professionalForm.watch("professionalBio")?.length || 0}/500
                  characters
                </p>
                {professionalForm.formState.errors.professionalBio && (
                  <p className="text-sm text-red-500 mt-1">
                    {
                      professionalForm.formState.errors.professionalBio
                        .message
                    }
                  </p>
                )}
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className="space-y-6">
              <DocumentUpload
                label="Caretaker License *"
                file={documentFiles.caretakerLicense}
                onFileChange={(file) =>
                  handleFileChange("caretakerLicense", file)
                }
                error={
                  documentsForm.formState.errors.caretakerLicense?.message
                }
              />
              <DocumentUpload
                label="Government ID Proof *"
                file={documentFiles.governmentIdProof}
                onFileChange={(file) =>
                  handleFileChange("governmentIdProof", file)
                }
                error={
                  documentsForm.formState.errors.governmentIdProof?.message
                }
              />
              <DocumentUpload
                label="First Aid Certificate *"
                file={documentFiles.firstAidCertificate}
                onFileChange={(file) =>
                  handleFileChange("firstAidCertificate", file)
                }
                error={
                  documentsForm.formState.errors.firstAidCertificate?.message
                }
              />
            </div>
          )}

          <div className="flex justify-between mt-8">
            <Button
              type="button"
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 1}
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>

            {currentStep < 4 ? (
              <Button
                type="button"
                onClick={handleNext}
                disabled={
                  (currentStep === 1 &&
                    !personalForm.formState.isValid) ||
                  (currentStep === 2 && !addressForm.formState.isValid) ||
                  (currentStep === 3 && !professionalForm.formState.isValid)
                }
              >
                Next
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button
                type="button"
                onClick={handleSubmit}
                disabled={
                  isPending ||
                  uploading ||
                  !documentsForm.formState.isValid
                }
              >
                {uploading || isPending
                  ? "Submitting..."
                  : "Submit Verification"}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

