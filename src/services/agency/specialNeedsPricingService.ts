import { CareVoyageBackend } from "../../api/instance";
import type { AxiosResponse } from "axios";
import { API_ENDPOINTS } from "@/constants/apiEndpoints";

export interface SpecialNeedsMaster {
  id: string;
  name: string;
  shortCode: string;
  category: string;
  description: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AgencySpecialNeed {
  id: string;
  agencyId: string;
  specialNeedId: string;
  specialNeed?: {
    id: string;
    name: string;
    shortCode?: string;
    category?: string;
    description?: string;
  };
  unit: "per_day" | "per_trip";
  price: number;
  isActive: boolean;
  isDeleted: boolean;
  deletedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface EnableSpecialNeedRequest {
  specialNeedId: string;
  unit: "per_day" | "per_trip";
  price: number;
}

export interface UpdateSpecialNeedRequest {
  unit?: "per_day" | "per_trip";
  price?: number;
}

export interface ToggleActiveStatusRequest {
  isActive: boolean;
}

export interface AgencySpecialNeedsMaster {
  id: string;
  agencyId: string;
  name: string;
  description?: string;
  isDeleted: boolean;
  deletedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAgencySpecialNeedsMasterRequest {
  name: string;
  description?: string;
  category?: string;
}

export interface UpdateAgencySpecialNeedsMasterRequest {
  name?: string;
  description?: string;
  category?: string;
}

export interface PaginatedAgencySpecialNeedsMasterResponse {
  specialNeeds: AgencySpecialNeedsMaster[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export const specialNeedsPricingApi = {
  // Agency Special Needs Master (CRUD)
  getAgencySpecialNeedsMaster: async (
    includeDeleted: boolean | undefined,
    page: number,
    limit: number
  ): Promise<PaginatedAgencySpecialNeedsMasterResponse> => {
    const params: Record<string, string | number | boolean> = {};
    if (includeDeleted !== undefined) {
      params.includeDeleted = includeDeleted.toString();
    }
    params.page = page;
    params.limit = limit;

    const response: AxiosResponse<{
      success: boolean;
      message: string;
      data: PaginatedAgencySpecialNeedsMasterResponse;
    }> = await CareVoyageBackend.get(API_ENDPOINTS.AGENCY.SPECIAL_NEEDS_MASTER, {
      params,
    });
    return response.data.data;
  },

  getActiveAgencySpecialNeedsMaster: async (): Promise<
    AgencySpecialNeedsMaster[]
  > => {
    const response: AxiosResponse<{
      success: boolean;
      message: string;
      data:
        | AgencySpecialNeedsMaster[]
        | PaginatedAgencySpecialNeedsMasterResponse;
    }> = await CareVoyageBackend.get(API_ENDPOINTS.AGENCY.SPECIAL_NEEDS_MASTER_ACTIVE);

    const payload = response.data.data;
    if (Array.isArray(payload)) {
      return payload;
    }
    return payload.specialNeeds;
  },

  createAgencySpecialNeedsMaster: async (
    data: CreateAgencySpecialNeedsMasterRequest
  ): Promise<AgencySpecialNeedsMaster> => {
    const response: AxiosResponse<{
      success: boolean;
      message: string;
      data: AgencySpecialNeedsMaster;
    }> = await CareVoyageBackend.post(
      API_ENDPOINTS.AGENCY.SPECIAL_NEEDS_MASTER,
      data
    );
    return response.data.data;
  },

  updateAgencySpecialNeedsMaster: async (
    id: string,
    data: UpdateAgencySpecialNeedsMasterRequest
  ): Promise<AgencySpecialNeedsMaster> => {
    const response: AxiosResponse<{
      success: boolean;
      message: string;
      data: AgencySpecialNeedsMaster;
    }> = await CareVoyageBackend.put(
      API_ENDPOINTS.AGENCY.SPECIAL_NEEDS_MASTER_DETAIL(id),
      data
    );
    return response.data.data;
  },

  deleteAgencySpecialNeedsMaster: async (id: string): Promise<void> => {
    await CareVoyageBackend.delete(API_ENDPOINTS.AGENCY.SPECIAL_NEEDS_MASTER_DETAIL(id));
  },

  // Agency special needs management
  getAgencySpecialNeeds: async (
    includeDeleted?: boolean
  ): Promise<AgencySpecialNeed[]> => {
    const params: Record<string, string> = {};
    if (includeDeleted !== undefined) {
      params.includeDeleted = includeDeleted.toString();
    }
    const response: AxiosResponse<{
      success: boolean;
      message: string;
      data: AgencySpecialNeed[];
    }> = await CareVoyageBackend.get(API_ENDPOINTS.AGENCY.SPECIAL_NEEDS, {
      params,
    });
    return response.data.data;
  },

  enableSpecialNeed: async (
    data: EnableSpecialNeedRequest
  ): Promise<AgencySpecialNeed> => {
    const response: AxiosResponse<{
      success: boolean;
      message: string;
      data: AgencySpecialNeed;
    }> = await CareVoyageBackend.post(API_ENDPOINTS.AGENCY.SPECIAL_NEEDS, data);
    return response.data.data;
  },

  updateSpecialNeed: async (
    id: string,
    data: UpdateSpecialNeedRequest
  ): Promise<AgencySpecialNeed> => {
    const response: AxiosResponse<{
      success: boolean;
      message: string;
      data: AgencySpecialNeed;
    }> = await CareVoyageBackend.put(API_ENDPOINTS.AGENCY.SPECIAL_NEEDS_DETAIL(id), data);
    return response.data.data;
  },

  toggleActiveStatus: async (
    id: string,
    data: ToggleActiveStatusRequest
  ): Promise<AgencySpecialNeed> => {
    const response: AxiosResponse<{
      success: boolean;
      message: string;
      data: AgencySpecialNeed;
    }> = await CareVoyageBackend.patch(
      API_ENDPOINTS.AGENCY.SPECIAL_NEEDS_TOGGLE_ACTIVE(id),
      data
    );
    return response.data.data;
  },

  deleteSpecialNeed: async (id: string): Promise<void> => {
    await CareVoyageBackend.delete(API_ENDPOINTS.AGENCY.SPECIAL_NEEDS_DETAIL(id));
  },
};
