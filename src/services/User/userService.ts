import { CareVoyageBackend } from "@/api/instance";
import type { Role } from "@/types/role.types";

export interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  role: Role;
  profileImage?: string;
  createdAt: string;
  updatedAt: string;
}
export const userApi={
    getProfileService : async ():Promise<UserProfile>=>{
        const response=await CareVoyageBackend.get("/user/profile");
        return response.data.data
    }
}
