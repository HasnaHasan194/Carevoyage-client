import { CareVoyageBackend } from "../../api/instance";
import type { AxiosResponse } from "axios";

export const userUploadApi = {
  uploadProfileImage: async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("image", file);

    const response: AxiosResponse<{
      success: boolean;
      message: string;
      data: { s3Key: string };
    }> = await CareVoyageBackend.post("/user/upload/profile-image", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data.data.s3Key;
  },
};
