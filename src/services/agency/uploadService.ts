import { CareVoyageBackend } from "../../api/instance";
import type { AxiosResponse } from "axios";

export const uploadApi = {
  uploadImage: async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("image", file);

    const response: AxiosResponse<{
      success: boolean;
      message: string;
      data: { url: string };
    }> = await CareVoyageBackend.post("/agency/upload/image", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data.data.url;
  },

  uploadMultipleImages: async (files: File[]): Promise<string[]> => {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append("images", file);
    });

    const response: AxiosResponse<{
      success: boolean;
      message: string;
      data: { urls: string[] };
    }> = await CareVoyageBackend.post("/agency/upload/images", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data.data.urls;
  },

  uploadDocuments: async (files: File[], folder: string): Promise<string[]> => {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append("images", file);
    });
    formData.append("folder", folder);

    const response: AxiosResponse<{
      success: boolean;
      message: string;
      data: { urls: string[] };
    }> = await CareVoyageBackend.post("/agency/upload/images", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data.data.urls;
  },
};


