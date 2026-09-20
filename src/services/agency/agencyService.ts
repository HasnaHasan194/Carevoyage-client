import { CareVoyageBackend } from "../../api/instance";
import { API_ENDPOINTS } from "@/constants/apiEndpoints";

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

export interface GetSalesReportParams {
  startDate?: string;
  endDate?: string;
}

export const agencyApi = {
  inviteCaretaker: async (
    data: InviteCaretakerPayload
  ): Promise<InviteCaretakerResponse> => {
    const response = await CareVoyageBackend.post(
      API_ENDPOINTS.AGENCY.CARETAKERS_INVITE,
      data
    );
    return response.data;
  },
  listCaretakers: async (
    params?: { page?: number; limit?: number }
  ): Promise<PaginatedCaretakersResponse> => {
    const response = await CareVoyageBackend.get(API_ENDPOINTS.AGENCY.CARETAKERS_LIST, {
      params,
    });
    return response.data.data as PaginatedCaretakersResponse;
  },
  updateCaretakerAvailability: async (
    data: UpdateCaretakerAvailabilityPayload
  ): Promise<AgencyCaretaker> => {
    const response = await CareVoyageBackend.patch(
      API_ENDPOINTS.AGENCY.CARETAKER_STATUS(data.caretakerId),
      { status: data.status }
    );
    return response.data.data as AgencyCaretaker;
  },
  updateCaretakerPrice: async (
    data: UpdateCaretakerPricePayload
  ): Promise<AgencyCaretaker> => {
    const response = await CareVoyageBackend.patch(
      API_ENDPOINTS.AGENCY.CARETAKER_PRICE(data.caretakerId),
      { pricePerDay: data.pricePerDay }
    );
    return response.data.data as AgencyCaretaker;
  },
  deleteCaretaker: async (caretakerId: string): Promise<void> => {
    await CareVoyageBackend.delete(API_ENDPOINTS.AGENCY.CARETAKER_DELETE(caretakerId));
  },
  listCaretakerRequests: async (params?: {
    page?: number;
    limit?: number;
    status?: "PENDING" | "FULFILLED";
  }): Promise<PaginatedCaretakerRequestsResponse> => {
    const response = await CareVoyageBackend.get(API_ENDPOINTS.AGENCY.CARETAKER_REQUESTS, {
      params,
    });
    return response.data.data as PaginatedCaretakerRequestsResponse;
  },
  fulfillCaretakerRequest: async (
    requestId: string,
    payload: { noteToClient?: string; caretakerId?: string }
  ): Promise<void> => {
    await CareVoyageBackend.patch(
      API_ENDPOINTS.AGENCY.CARETAKER_REQUEST_FULFILL(requestId),
      payload
    );
  },
  listRefundRequests: async (params?: {
    page?: number;
    limit?: number;
  }): Promise<PaginatedAgencyRefundRequestsResponse> => {
    const response = await CareVoyageBackend.get(API_ENDPOINTS.AGENCY.REFUND_REQUESTS, {
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
      API_ENDPOINTS.AGENCY.REFUND_REQUEST_APPROVE(requestId)
    );
  },
  rejectRefundRequest: async (
    requestId: string,
    reason?: string
  ): Promise<void> => {
    await CareVoyageBackend.post(
      API_ENDPOINTS.AGENCY.REFUND_REQUEST_REJECT(requestId),
      { reason }
    );
  },
  listPackageBookings: async (
    packageId: string,
    params?: { page?: number; limit?: number }
  ): Promise<PaginatedAgencyBookingsResponse> => {
    const response = await CareVoyageBackend.get(
      API_ENDPOINTS.AGENCY.PACKAGE_BOOKINGS(packageId),
      { params }
    );
    return response.data.data as PaginatedAgencyBookingsResponse;
  },
  getAgencyBookingDetail: async (
    bookingId: string
  ): Promise<AgencyBookingDetail> => {
    const response = await CareVoyageBackend.get(
      API_ENDPOINTS.AGENCY.BOOKING_DETAIL(bookingId)
    );
    return response.data.data as AgencyBookingDetail;
  },

  getSalesReport: async (params?: GetSalesReportParams) => {
    const response = await CareVoyageBackend.get(API_ENDPOINTS.AGENCY.SALES_REPORT, {
      params,
    });
    return response.data.data;
  },

  exportSalesReportPdf: async (params?: GetSalesReportParams): Promise<Blob> => {
    const response = await CareVoyageBackend.get(API_ENDPOINTS.AGENCY.SALES_REPORT_PDF, {
      params,
      responseType: "blob",
    });
    return response.data as Blob;
  },

  exportSalesReportExcel: async (params?: GetSalesReportParams): Promise<Blob> => {
    const response = await CareVoyageBackend.get(API_ENDPOINTS.AGENCY.SALES_REPORT_EXCEL, {
      params,
      responseType: "blob",
    });
    return response.data as Blob;
  },
};