import { CareVoyageBackend } from "@/api/instance";
import type { Role } from "@/types/role.types";

export interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  gender?: "male" | "female" | "other";
  bio?: string;
  country?: string;
  role: Role;
  profileImage?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface UpdateUserProfileRequest {
  firstName?: string;
  lastName?: string;
  phone?: string;
  gender?: "male" | "female" | "other";
  bio?: string;
  profileImage?: string;
}

export const userApi = {
  getProfileService: async (): Promise<UserProfile> => {
    const response = await CareVoyageBackend.get("/user/profile");
    return response.data.data;
  },
  updateProfileService: async (
    data: UpdateUserProfileRequest
  ): Promise<UserProfile> => {
    const response = await CareVoyageBackend.put("/user/profile", data);
    return response.data.data;
  },
};
