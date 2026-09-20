import { CareVoyageBackend } from "@/api/instance";
import { API_ENDPOINTS } from "@/constants/apiEndpoints";

export interface AgencyProfile {
  id: string;
  userId: string;
  agencyName: string;
  email: string;
  phone: string | null;
  registrationNumber: string;
  address: string;
  profileImage: string | null;
  description?: string;
  verificationStatus: string;
  isBlocked: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateAgencyProfileRequest {
  agencyName?: string;
  phone?: string;
  address?: string;
  profileImage?: string;
  description?: string;
}

export const agencyProfileApi = {
  getProfile: async (): Promise<AgencyProfile> => {
    const response = await CareVoyageBackend.get(API_ENDPOINTS.AGENCY.PROFILE);
    return response.data.data;
  },

  updateProfile: async (
    data: UpdateAgencyProfileRequest
  ): Promise<AgencyProfile> => {
    const response = await CareVoyageBackend.put(API_ENDPOINTS.AGENCY.PROFILE, data);
    return response.data.data;
  },

  uploadProfileImage: async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("image", file);

    const response = await CareVoyageBackend.post(
      API_ENDPOINTS.AGENCY.UPLOAD_PROFILE_IMAGE,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data.data.s3Key;
  },
};
