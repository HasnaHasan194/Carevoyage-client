import { CareVoyageBackend } from "@/api/instance";

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
    const response = await CareVoyageBackend.get("/agency/profile");
    return response.data.data;
  },

  updateProfile: async (
    data: UpdateAgencyProfileRequest
  ): Promise<AgencyProfile> => {
    const response = await CareVoyageBackend.put("/agency/profile", data);
    return response.data.data;
  },

  uploadProfileImage: async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("image", file);

    const response = await CareVoyageBackend.post(
      "/agency/upload/profile-image",
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
