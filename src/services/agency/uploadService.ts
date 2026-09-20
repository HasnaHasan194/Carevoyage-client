import { CareVoyageBackend } from "../../api/instance";
import type { AxiosResponse } from "axios";
import { API_ENDPOINTS } from "@/constants/apiEndpoints";

export const uploadApi = {
  uploadImage: async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("image", file);

    const response: AxiosResponse<{
      success: boolean;
      message: string;
      data: { url: string };
    }> = await CareVoyageBackend.post(API_ENDPOINTS.AGENCY.UPLOAD_IMAGE, formData, {
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
    }> = await CareVoyageBackend.post(API_ENDPOINTS.AGENCY.UPLOAD_IMAGES, formData, {
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
    }> = await CareVoyageBackend.post(API_ENDPOINTS.AGENCY.UPLOAD_IMAGES, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data.data.urls;
  },
};





