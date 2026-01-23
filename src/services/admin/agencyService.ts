import { CareVoyageBackend } from "../../api/instance";
import type { AxiosResponse } from "axios";

export interface Agency {
  id: string;
  userId: string;
  agencyName: string;
  address: string;
  registrationNumber: string;
  kycDocs: string[];
  verificationStatus: "pending" | "verified" | "rejected";
  description?: string;
  isBlocked: boolean;
  createdAt: string;
  updatedAt: string;
  ownerEmail?: string;
  ownerName?: string;
}

export interface PaginatedAgenciesResponse {
  agencies: Agency[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export type AgencyStatusFilter = "all" | "blocked" | "unblocked";
export type SortOrder = "asc" | "desc";

export interface GetAgenciesParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: AgencyStatusFilter;
  sort?: string;
  order?: SortOrder;
}

export const agencyApi = {
  getAgencies: async (params: GetAgenciesParams): Promise<PaginatedAgenciesResponse> => {
    const response: AxiosResponse<{
      success: boolean;
      message: string;
      data: PaginatedAgenciesResponse;
    }> = await CareVoyageBackend.get("/admin/agencies", { params });
    return response.data.data;
  },

  getAgencyDetails: async (agencyId: string): Promise<Agency> => {
    const response: AxiosResponse<{
      success: boolean;
      message: string;
      data: Agency;
    }> = await CareVoyageBackend.get(`/admin/agencies/${agencyId}`);
    return response.data.data;
  },

  blockAgency: async (agencyId: string): Promise<void> => {
    await CareVoyageBackend.patch(`/admin/agencies/${agencyId}/block`);
  },

  unblockAgency: async (agencyId: string): Promise<void> => {
    await CareVoyageBackend.patch(`/admin/agencies/${agencyId}/unblock`);
  },
};


