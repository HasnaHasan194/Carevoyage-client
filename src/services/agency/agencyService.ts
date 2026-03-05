import { CareVoyageBackend } from "../../api/instance";

export interface InviteCaretakerPayload {
  email: string;
}

export interface InviteCaretakerResponse {
  success: boolean;
  message: string;
}

export type CaretakerAvailabilityStatus = "AVAILABLE" | "BUSY" | "INACTIVE";

export interface AgencyCaretaker {
  id: string;
  name?: string;
  email?: string;
  status: string;
  availabilityStatus: CaretakerAvailabilityStatus;
  verificationStatus?: string;
  pricePerDay: number;
  languages: string[];
  experienceYears: number;
  profileImage?: string;
}

export interface UpdateCaretakerAvailabilityPayload {
  caretakerId: string;
  status: Exclude<CaretakerAvailabilityStatus, "BUSY">; // AVAILABLE | INACTIVE
}

export interface UpdateCaretakerPricePayload {
  caretakerId: string;
  pricePerDay: number;
}

export interface CaretakerRequestItem {
  id: string;
  clientId: string;
  clientName: string;
  clientEmail: string;
  packageId: string;
  packageName: string;
  agencyId: string;
  status: string;
  requestedAt: string;
  fulfilledAt?: string;
  agencyNoteToClient?: string;
}

export interface RefundRequestItem {
  id: string;
  bookingId: string;
  userId: string;
  agencyId: string;
  refundAmount: number;
  status: string;
  reason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AgencyBookingSummary {
  id: string;
  bookingId: string;
  packageId: string;
  packageName: string;
  clientId: string;
  clientName?: string;
  status: string;
  statusLabel: string;
  totalAmount: number;
  currency: string;
  startDate?: string;
  endDate?: string;
  createdAt: string;
}

export interface AgencyBookingDetail extends AgencyBookingSummary {
  basePrice: number;
  caretakerFee: number;
  specialNeedsFee: number;
  specialNeedIds?: string[];
  caretakerName?: string;
  caretakerProfileImage?: string;
  caretakerVerificationStatus?: string;
  packageDescription?: string;
  packageImages?: string[];
  meetingPoint?: string;
  cancellationReason?: string;
}

export interface PaginatedAgencyBookingsResponse {
  bookings: AgencyBookingSummary[];
  total: number;
  page: number;
  limit: number;
}

export interface PaginatedCaretakersResponse {
  caretakers: AgencyCaretaker[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PaginatedCaretakerRequestsResponse {
  requests: CaretakerRequestItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PaginatedAgencyRefundRequestsResponse {
  requests: RefundRequestItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export const agencyApi = {
  inviteCaretaker: async (
    data: InviteCaretakerPayload
  ): Promise<InviteCaretakerResponse> => {
    const response = await CareVoyageBackend.post(
      "/agency/caretakers/invite",
      data
    );
    return response.data;
  },
  listCaretakers: async (
    params?: { page?: number; limit?: number }
  ): Promise<PaginatedCaretakersResponse> => {
    const response = await CareVoyageBackend.get("/agency/caretakers", {
      params,
    });
    return response.data.data as PaginatedCaretakersResponse;
  },
  updateCaretakerAvailability: async (
    data: UpdateCaretakerAvailabilityPayload
  ): Promise<AgencyCaretaker> => {
    const response = await CareVoyageBackend.patch(
      `/agency/caretakers/${data.caretakerId}/status`,
      { status: data.status }
    );
    return response.data.data as AgencyCaretaker;
  },
  updateCaretakerPrice: async (
    data: UpdateCaretakerPricePayload
  ): Promise<AgencyCaretaker> => {
    const response = await CareVoyageBackend.patch(
      `/agency/caretakers/${data.caretakerId}/price`,
      { pricePerDay: data.pricePerDay }
    );
    return response.data.data as AgencyCaretaker;
  },
  deleteCaretaker: async (caretakerId: string): Promise<void> => {
    await CareVoyageBackend.delete(`/agency/caretakers/${caretakerId}`);
  },
  listCaretakerRequests: async (params?: {
    page?: number;
    limit?: number;
    status?: "PENDING" | "FULFILLED";
  }): Promise<PaginatedCaretakerRequestsResponse> => {
    const response = await CareVoyageBackend.get("/agency/caretaker-requests", {
      params,
    });
    return response.data.data as PaginatedCaretakerRequestsResponse;
  },
  fulfillCaretakerRequest: async (
    requestId: string,
    payload: { noteToClient?: string; caretakerId?: string }
  ): Promise<void> => {
    await CareVoyageBackend.patch(
      `/agency/caretaker-requests/${requestId}/fulfill`,
      payload
    );
  },
  listRefundRequests: async (params?: {
    page?: number;
    limit?: number;
  }): Promise<PaginatedAgencyRefundRequestsResponse> => {
    const response = await CareVoyageBackend.get("/agency/refund-requests", {
      params,
    });
    const payload = response.data.data as {
      requests: any[];
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };

    return {
      requests: payload.requests.map((item) => ({
        id: item._id as string,
        bookingId: item.bookingId as string,
        userId: item.userId as string,
        agencyId: item.agencyId as string,
        refundAmount: item.refundAmount as number,
        status: item.status as string,
        reason: item.reason as string | undefined,
        createdAt: String(item.createdAt),
        updatedAt: String(item.updatedAt),
      })),
      total: payload.total,
      page: payload.page,
      limit: payload.limit,
      totalPages: payload.totalPages,
    };
  },
  approveRefundRequest: async (requestId: string): Promise<void> => {
    await CareVoyageBackend.post(
      `/agency/refund-requests/${requestId}/approve`
    );
  },
  rejectRefundRequest: async (
    requestId: string,
    reason?: string
  ): Promise<void> => {
    await CareVoyageBackend.post(
      `/agency/refund-requests/${requestId}/reject`,
      { reason }
    );
  },
  listPackageBookings: async (
    packageId: string,
    params?: { page?: number; limit?: number }
  ): Promise<PaginatedAgencyBookingsResponse> => {
    const response = await CareVoyageBackend.get(
      `/agency/packages/${packageId}/bookings`,
      { params }
    );
    return response.data.data as PaginatedAgencyBookingsResponse;
  },
  getAgencyBookingDetail: async (
    bookingId: string
  ): Promise<AgencyBookingDetail> => {
    const response = await CareVoyageBackend.get(
      `/agency/bookings/${bookingId}`
    );
    return response.data.data as AgencyBookingDetail;
  },
};