import { CareVoyageBackend } from "../../api/instance";
import type { AxiosResponse } from "axios";
import { API_ENDPOINTS } from "@/constants/apiEndpoints";

export interface Agency {
  id: string;
  userId: string;
  agencyName: string;
  address: string;
  registrationNumber: string;
  kycDocs: string[];
  verificationStatus: "pending" | "verified" | "rejected";
  rejectionReason?: string;
  description?: string;
  isBlocked: boolean;
  createdAt: string;
  updatedAt: string;
  ownerEmail?: string;
  ownerName?: string;
  ownerPhone?: string;
  ownerProfileImage?: string;
}

export interface PaginatedAgenciesResponse {
  agencies: Agency[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export type AgencyStatusFilter = "all" | "blocked" | "unblocked";
export type AgencyVerificationStatusFilter = "all" | "pending" | "verified" | "rejected";
export type SortOrder = "asc" | "desc";

export interface GetAgenciesParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: AgencyStatusFilter;
  verificationStatus?: AgencyVerificationStatusFilter;
  sort?: string;
  order?: SortOrder;
}

export const agencyApi = {
  getAgencies: async (params: GetAgenciesParams): Promise<PaginatedAgenciesResponse> => {
    const response: AxiosResponse<{
      success: boolean;
      message: string;
      data: PaginatedAgenciesResponse;
    }> = await CareVoyageBackend.get(API_ENDPOINTS.ADMIN.AGENCIES, { params });
    return response.data.data;
  },

  getAgencyDetails: async (agencyId: string): Promise<Agency> => {
    const response: AxiosResponse<{
      success: boolean;
      message: string;
      data: Agency;
    }> = await CareVoyageBackend.get(API_ENDPOINTS.ADMIN.AGENCY_DETAIL(agencyId));
    return response.data.data;
  },

  blockAgency: async (agencyId: string): Promise<void> => {
    await CareVoyageBackend.patch(API_ENDPOINTS.ADMIN.AGENCY_BLOCK(agencyId));
  },

  unblockAgency: async (agencyId: string): Promise<void> => {
    await CareVoyageBackend.patch(API_ENDPOINTS.ADMIN.AGENCY_UNBLOCK(agencyId));
  },

  verifyAgency: async (agencyId: string): Promise<void> => {
    await CareVoyageBackend.patch(API_ENDPOINTS.ADMIN.AGENCY_VERIFY(agencyId));
  },

  rejectAgency: async (
    agencyId: string,
    payload: { reason: string }
  ): Promise<void> => {
    await CareVoyageBackend.patch(
      API_ENDPOINTS.ADMIN.AGENCY_REJECT(agencyId),
      payload
    );
  },
};





