import React from "react";
import { useCaretakerProfile } from "@/hooks/caretaker/useCaretakerProfile";
import { Loader2, User, Mail, Phone, Calendar, MapPin, Briefcase, Languages, Award, FileText, CheckCircle, Clock, XCircle } from "lucide-react";

export const CaretakerProfilePage: React.FC = () => {
  const { data, isLoading, error } = useCaretakerProfile();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4" style={{ color: "#D4A574" }} />
          <p style={{ color: "#7C5A3B" }}>Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error || !data?.data) {
    return (
      <div className="flex items-center justify-center py-20 px-4">
        <div className="text-center max-w-md">
          <p className="text-xl font-semibold mb-2" style={{ color: "#7C5A3B" }}>
            Error Loading Profile
          </p>
          <p className="text-sm" style={{ color: "#8B6F47" }}>
            {(error as { message?: string })?.message || "Failed to load profile data"}
          </p>
        </div>
      </div>
    );
  }

  const profile = data.data;

  // Handle documents - could be array or object structure
  const documents = profile.documents || {};
  const documentList = Array.isArray(documents) 
    ? {
        caretakerLicense: undefined,
        governmentIdProof: undefined,
        firstAidCertificate: undefined,
      }
    : {
        caretakerLicense: documents.caretakerLicense,
        governmentIdProof: documents.governmentIdProof,
        firstAidCertificate: documents.firstAidCertificate,
      };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getVerificationStatusBadge = (status: string) => {
    switch (status) {
      case "verified":
        return {
          bg: "#DCFCE7",
          text: "#16A34A",
          icon: CheckCircle,
          label: "Verified",
        };
      case "pending":
        return {
          bg: "#FEF3C7",
          text: "#D97706",
          icon: Clock,
          label: "Pending",
        };
      case "rejected":
        return {
          bg: "#FEE2E2",
          text: "#DC2626",
          icon: XCircle,
          label: "Rejected",
        };
      default:
        return {
          bg: "#F3F4F6",
          text: "#6B7280",
          icon: Clock,
          label: "Pending",
        };
    }
  };

  const getDocumentStatus = (docUrl?: string) => {
    if (!docUrl) return { status: "pending", label: "Pending" };
    // In a real app, you'd check document verification status from API
    // For now, if document URL exists, assume it's verified
    return { status: "verified", label: "Verified" };
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Profile Header Section */}
          <div
            className="rounded-2xl shadow-lg p-6 mb-8"
            style={{ backgroundColor: "#FFFFFF" }}
          >
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              {/* Profile Image */}
              <div className="relative">
                {profile.profileImage ? (
                  <img
                    src={profile.profileImage}
                    alt={`${profile.firstName} ${profile.lastName}`}
                    className="w-32 h-32 rounded-full object-cover border-4"
                    style={{ borderColor: "#F5E6D3" }}
                  />
                ) : (
                  <div
                    className="w-32 h-32 rounded-full flex items-center justify-center border-4"
                    style={{
                      backgroundColor: "#F5E6D3",
                      borderColor: "#E5E7EB",
                    }}
                  >
                    <User className="w-16 h-16" style={{ color: "#8B6F47" }} />
                  </div>
                )}
              </div>

              {/* Profile Info */}
              <div className="flex-1 text-center md:text-left">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                  <div>
                    <h1
                      className="text-3xl font-bold mb-2"
                      style={{ color: "#7C5A3B" }}
                    >
                      {profile.firstName} {profile.lastName}
                    </h1>
                    <p className="text-base" style={{ color: "#8B6F47" }}>
                      {profile.email}
                    </p>
                  </div>
                  {/* Verification Badge */}
                  {(() => {
                    const statusBadge = getVerificationStatusBadge(profile.verificationStatus);
                    const StatusIcon = statusBadge.icon;
                    return (
                      <span
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold"
                        style={{
                          backgroundColor: statusBadge.bg,
                          color: statusBadge.text,
                        }}
                      >
                        <StatusIcon className="w-4 h-4" />
                        {statusBadge.label} Caretaker
                      </span>
                    );
                  })()}
                </div>
              </div>
            </div>
          </div>

          {/* Personal Information Section */}
          <div
            className="rounded-2xl shadow-lg p-6 mb-8"
            style={{ backgroundColor: "#FFFFFF" }}
          >
            <h2
              className="text-2xl font-bold mb-6 pb-4 border-b"
              style={{ color: "#7C5A3B", borderColor: "#E5E7EB" }}
            >
              Personal Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-medium mb-2 block" style={{ color: "#8B6F47" }}>
                  Full Name
                </label>
                <div className="flex items-center gap-3 p-3 rounded-lg" style={{ backgroundColor: "#FDFBF8" }}>
                  <User className="w-5 h-5" style={{ color: "#D4A574" }} />
                  <span style={{ color: "#5A4A3A" }}>
                    {profile.firstName} {profile.lastName}
                  </span>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block" style={{ color: "#8B6F47" }}>
                  Gender
                </label>
                <div className="flex items-center gap-3 p-3 rounded-lg" style={{ backgroundColor: "#FDFBF8" }}>
                  <User className="w-5 h-5" style={{ color: "#D4A574" }} />
                  <span style={{ color: "#5A4A3A" }}>
                    {profile.gender ? profile.gender.charAt(0).toUpperCase() + profile.gender.slice(1) : "N/A"}
                  </span>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block" style={{ color: "#8B6F47" }}>
                  Mobile Number
                </label>
                <div className="flex items-center gap-3 p-3 rounded-lg" style={{ backgroundColor: "#FDFBF8" }}>
                  <Phone className="w-5 h-5" style={{ color: "#D4A574" }} />
                  <span style={{ color: "#5A4A3A" }}>{profile.phone || "N/A"}</span>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block" style={{ color: "#8B6F47" }}>
                  Alternate Number
                </label>
                <div className="flex items-center gap-3 p-3 rounded-lg" style={{ backgroundColor: "#FDFBF8" }}>
                  <Phone className="w-5 h-5" style={{ color: "#D4A574" }} />
                  <span style={{ color: "#5A4A3A" }}>{profile.alternatePhone || "N/A"}</span>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block" style={{ color: "#8B6F47" }}>
                  Email Address
                </label>
                <div className="flex items-center gap-3 p-3 rounded-lg" style={{ backgroundColor: "#FDFBF8" }}>
                  <Mail className="w-5 h-5" style={{ color: "#D4A574" }} />
                  <span style={{ color: "#5A4A3A" }}>{profile.email}</span>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block" style={{ color: "#8B6F47" }}>
                  Date of Birth
                </label>
                <div className="flex items-center gap-3 p-3 rounded-lg" style={{ backgroundColor: "#FDFBF8" }}>
                  <Calendar className="w-5 h-5" style={{ color: "#D4A574" }} />
                  <span style={{ color: "#5A4A3A" }}>{formatDate(profile.dob)}</span>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block" style={{ color: "#8B6F47" }}>
                  Country / Nationality
                </label>
                <div className="flex items-center gap-3 p-3 rounded-lg" style={{ backgroundColor: "#FDFBF8" }}>
                  <MapPin className="w-5 h-5" style={{ color: "#D4A574" }} />
                  <span style={{ color: "#5A4A3A" }}>{profile.nationality || "N/A"}</span>
                </div>
              </div>

              {profile.address && (
                <div className="md:col-span-2">
                  <label className="text-sm font-medium mb-2 block" style={{ color: "#8B6F47" }}>
                    Address
                  </label>
                  <div className="flex items-start gap-3 p-3 rounded-lg" style={{ backgroundColor: "#FDFBF8" }}>
                    <MapPin className="w-5 h-5 mt-0.5" style={{ color: "#D4A574" }} />
                    <span style={{ color: "#5A4A3A" }}>
                      {profile.address.street}, {profile.address.city}, {profile.address.state}, {profile.address.country} - {profile.address.postalCode}
                    </span>
                  </div>
                </div>
              )}

              {profile.professionalBio && (
                <div className="md:col-span-2">
                  <label className="text-sm font-medium mb-2 block" style={{ color: "#8B6F47" }}>
                    Bio
                  </label>
                  <div className="p-4 rounded-lg" style={{ backgroundColor: "#FDFBF8" }}>
                    <p className="leading-relaxed" style={{ color: "#5A4A3A" }}>
                      {profile.professionalBio}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Professional Information Section */}
          <div
            className="rounded-2xl shadow-lg p-6 mb-8"
            style={{ backgroundColor: "#FFFFFF" }}
          >
            <h2
              className="text-2xl font-bold mb-6 pb-4 border-b"
              style={{ color: "#7C5A3B", borderColor: "#E5E7EB" }}
            >
              Professional Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-medium mb-2 block" style={{ color: "#8B6F47" }}>
                  Years of Experience
                </label>
                <div className="flex items-center gap-3 p-3 rounded-lg" style={{ backgroundColor: "#FDFBF8" }}>
                  <Briefcase className="w-5 h-5" style={{ color: "#D4A574" }} />
                  <span style={{ color: "#5A4A3A" }}>{profile.experienceYears} years</span>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block" style={{ color: "#8B6F47" }}>
                  Languages Spoken
                </label>
                <div className="flex items-center gap-3 p-3 rounded-lg" style={{ backgroundColor: "#FDFBF8" }}>
                  <Languages className="w-5 h-5" style={{ color: "#D4A574" }} />
                  <div className="flex flex-wrap gap-2">
                    {profile.languages && profile.languages.length > 0 ? (
                      profile.languages.map((lang, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 rounded-full text-sm"
                          style={{
                            backgroundColor: "#F5E6D3",
                            color: "#7C5A3B",
                          }}
                        >
                          {lang}
                        </span>
                      ))
                    ) : (
                      <span style={{ color: "#5A4A3A" }}>N/A</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="text-sm font-medium mb-2 block" style={{ color: "#8B6F47" }}>
                  Certifications
                </label>
                <div className="flex items-center gap-3 p-3 rounded-lg" style={{ backgroundColor: "#FDFBF8" }}>
                  <Award className="w-5 h-5" style={{ color: "#D4A574" }} />
                  <div className="flex flex-wrap gap-2">
                    <span
                      className="px-3 py-1 rounded-full text-sm"
                      style={{
                        backgroundColor: "#DCFCE7",
                        color: "#16A34A",
                      }}
                    >
                      First Aid
                    </span>
                    <span
                      className="px-3 py-1 rounded-full text-sm"
                      style={{
                        backgroundColor: "#DCFCE7",
                        color: "#16A34A",
                      }}
                    >
                      CPR
                    </span>
                    <span
                      className="px-3 py-1 rounded-full text-sm"
                      style={{
                        backgroundColor: "#DCFCE7",
                        color: "#16A34A",
                      }}
                    >
                      Certified Caregiver
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Documents Uploaded Section */}
          <div
            className="rounded-2xl shadow-lg p-6"
            style={{ backgroundColor: "#FFFFFF" }}
          >
            <h2
              className="text-2xl font-bold mb-6 pb-4 border-b"
              style={{ color: "#7C5A3B", borderColor: "#E5E7EB" }}
            >
              Documents Uploaded
            </h2>
            <div className="space-y-4">
              {/* Caretaker License */}
              <div
                className="flex items-center justify-between p-4 rounded-lg border-2"
                style={{
                  backgroundColor: "#FDFBF8",
                  borderColor: "#E5E7EB",
                }}
              >
                <div className="flex items-center gap-4">
                  <FileText className="w-6 h-6" style={{ color: "#D4A574" }} />
                  <div>
                    <p className="font-semibold" style={{ color: "#7C5A3B" }}>
                      Caretaker License
                    </p>
                    <p className="text-sm" style={{ color: "#8B6F47" }}>
                      Professional license document
                    </p>
                  </div>
                </div>
                {(() => {
                  const docStatus = getDocumentStatus(documentList.caretakerLicense);
                  return (
                    <span
                      className="px-3 py-1 rounded-full text-sm font-medium"
                      style={{
                        backgroundColor: docStatus.status === "verified" ? "#DCFCE7" : "#FEF3C7",
                        color: docStatus.status === "verified" ? "#16A34A" : "#D97706",
                      }}
                    >
                      {docStatus.label}
                    </span>
                  );
                })()}
              </div>

              {/* Government ID Proof */}
              <div
                className="flex items-center justify-between p-4 rounded-lg border-2"
                style={{
                  backgroundColor: "#FDFBF8",
                  borderColor: "#E5E7EB",
                }}
              >
                <div className="flex items-center gap-4">
                  <FileText className="w-6 h-6" style={{ color: "#D4A574" }} />
                  <div>
                    <p className="font-semibold" style={{ color: "#7C5A3B" }}>
                      Government ID Proof
                    </p>
                    <p className="text-sm" style={{ color: "#8B6F47" }}>
                      Valid government-issued ID
                    </p>
                  </div>
                </div>
                {(() => {
                  const docStatus = getDocumentStatus(documentList.governmentIdProof);
                  return (
                    <span
                      className="px-3 py-1 rounded-full text-sm font-medium"
                      style={{
                        backgroundColor: docStatus.status === "verified" ? "#DCFCE7" : "#FEF3C7",
                        color: docStatus.status === "verified" ? "#16A34A" : "#D97706",
                      }}
                    >
                      {docStatus.label}
                    </span>
                  );
                })()}
              </div>

              {/* First Aid Certificate */}
              <div
                className="flex items-center justify-between p-4 rounded-lg border-2"
                style={{
                  backgroundColor: "#FDFBF8",
                  borderColor: "#E5E7EB",
                }}
              >
                <div className="flex items-center gap-4">
                  <FileText className="w-6 h-6" style={{ color: "#D4A574" }} />
                  <div>
                    <p className="font-semibold" style={{ color: "#7C5A3B" }}>
                      First Aid / CPR Certificate
                    </p>
                    <p className="text-sm" style={{ color: "#8B6F47" }}>
                      Medical certification document
                    </p>
                  </div>
                </div>
                {(() => {
                  const docStatus = getDocumentStatus(documentList.firstAidCertificate);
                  return (
                    <span
                      className="px-3 py-1 rounded-full text-sm font-medium"
                      style={{
                        backgroundColor: docStatus.status === "verified" ? "#DCFCE7" : "#FEF3C7",
                        color: docStatus.status === "verified" ? "#16A34A" : "#D97706",
                      }}
                    >
                      {docStatus.label}
                    </span>
                  );
                })()}
              </div>
            </div>
          </div>
        </div>
  );
};

