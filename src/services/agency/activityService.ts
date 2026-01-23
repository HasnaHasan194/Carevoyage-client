import { CareVoyageBackend } from "../../api/instance";
import type { AxiosResponse } from "axios";
import type { Activity } from "./packageService";

export interface CreateActivityRequest {
  name: string;
  description: string;
  duration: number;
  category: string;
  priceIncluded?: boolean;
}

export interface GetActivitiesParams {
  category?: string;
}

export const activityApi = {
  createActivity: async (data: CreateActivityRequest): Promise<Activity> => {
    const response: AxiosResponse<{
      success: boolean;
      message: string;
      data: Activity;
    }> = await CareVoyageBackend.post("/agency/activities", data);
    return response.data.data;
  },

  getActivities: async (params?: GetActivitiesParams): Promise<Activity[]> => {
    const response: AxiosResponse<{
      success: boolean;
      message: string;
      data: Activity[];
    }> = await CareVoyageBackend.get("/agency/activities", {
      params: params?.category ? { category: params.category } : {},
    });
    return response.data.data;
  },
};


