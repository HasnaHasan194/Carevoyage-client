import { CareVoyageBackend } from "../../api/instance";

export interface VerifyInviteResponse {
  success: boolean;
  data: {
    email: string;
    agencyName: string;
    agencyId: string;
    isValid: boolean;
  };
  message: string;
}

export interface CaretakerSignupPayload {
  token: string;
  firstName: string;
  lastName: string;
  password: string;
  phone: string;
}

export interface CaretakerSignupResponse {
  success: boolean;
  data: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
  };
  message: string;
  accessToken: string;
  refreshToken: string;
}

export interface CaretakerLoginPayload {
  email: string;
  password: string;
}

export interface CaretakerLoginResponse {
  success: boolean;
  message: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
  };
  accessToken: string;
  refreshToken: string;
}

export interface VerificationStatusResponse {
  success: boolean;
  data: {
    verificationStatus: "pending" | "verified" | "rejected" | null;
    isVerified: boolean;
  };
}

export interface PersonalInfoPayload {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  alternatePhone?: string;
  dob: string;
  gender: "male" | "female" | "other";
  nationality: string;
}

export interface AddressInfoPayload {
  street: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
}

export interface ProfessionalInfoPayload {
  experienceYears: number;
  languages: string[];
  professionalBio: string;
}

export interface DocumentsPayload {
  caretakerLicense: string;
  governmentIdProof: string;
  firstAidCertificate: string;
}

export interface VerificationPayload {
  personalInfo: PersonalInfoPayload;
  addressInfo: AddressInfoPayload;
  professionalInfo: ProfessionalInfoPayload;
  documents: DocumentsPayload;
}

export interface CaretakerProfileResponse {
  success: boolean;
  data: {
    userId: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    alternatePhone?: string;
    gender?: "male" | "female" | "other";
    dob?: string;
    nationality?: string;
    profileImage?: string;
    address?: {
      street: string;
      city: string;
      state: string;
      country: string;
      postalCode: string;
    };
    experienceYears: number;
    languages: string[];
    professionalBio?: string;
    documents: {
      caretakerLicense?: string;
      governmentIdProof?: string;
      firstAidCertificate?: string;
    };
    verificationStatus: "pending" | "verified" | "rejected";
    rating: number;
    reviewCount: number;
    joinedAt?: string;
  };
}

export const caretakerApi = {
  verifyInvite: async (token: string): Promise<VerifyInviteResponse> => {
    const response = await CareVoyageBackend.get("/auth/verify-caretaker-invite", {
      params: { token },
    });
    return response.data;
  },

  signup: async (data: CaretakerSignupPayload): Promise<CaretakerSignupResponse> => {
    const response = await CareVoyageBackend.post("/auth/caretaker/signup", data);
    return response.data;
  },

  login: async (data: CaretakerLoginPayload): Promise<CaretakerLoginResponse> => {
    const response = await CareVoyageBackend.post("/auth/caretaker/login", data);
    return response.data;
  },

  getVerificationStatus: async (): Promise<VerificationStatusResponse> => {
    const response = await CareVoyageBackend.get("/caretaker/verification/status");
    return response.data;
  },

  submitVerification: async (
    data: VerificationPayload
  ): Promise<{ success: boolean; message: string }> => {
    const response = await CareVoyageBackend.post("/caretaker/verification", data);
    return response.data;
  },

  uploadDocuments: async (
    files: File[],
    folder: string = "caretaker-docs"
  ): Promise<string[]> => {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append("documents", file);
    });

    const response = await CareVoyageBackend.post(
      `/caretaker/upload/documents?folder=${folder}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data.data.s3Keys;
  },

  getProfile: async (): Promise<CaretakerProfileResponse> => {
    const response = await CareVoyageBackend.get("/caretaker/profile");
    return response.data;
  },
};

