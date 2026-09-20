import { CareVoyageBackend } from "@/api/instance";
import type { AxiosResponse } from "axios";
import { API_ENDPOINTS } from "@/constants/apiEndpoints";

export interface CreateCheckoutPayload {
  packageId: string;
  caretakerFee?: number;
  caretakerId?: string;
  specialNeedIds?: string[];
}

export interface CreateCheckoutResult {
  url: string;
  sessionId: string;
  checkoutDraftId: string;
}

export interface WalletPayResult {
  bookingId: string;
}

export interface ClientSpecialNeedOption {
  id: string;
  specialNeedId: string;
  name: string;
  unit: "per_day" | "per_trip";
  price: number;
}

export interface AvailableCaretaker {
  id: string;
  name: string;
  profileImage?: string;
  languages: string[];
  experienceYears: number;
  pricePerDay: number;
  status: string;
  verificationStatus?: string;
}

export interface SpecialNeedLineItem {
  id: string;
  name: string;
  unit: "per_day" | "per_trip";
  unitPrice: number;
  total: number;
}

export interface CaretakerLineItem {
  id: string;
  name: string;
  profileImage?: string;
  pricePerDay: number;
  total: number;
}

export interface PreviewBookingPriceResult {
  basePrice: number;
  tripDays: number;
  specialNeeds: SpecialNeedLineItem[];
  specialNeedsTotal: number;
  caretaker?: CaretakerLineItem;
  caretakerTotal: number;
  totalAmount: number;
  currency: string;
}

export interface ClientBookingSummary {
  id: string;
  bookingId?: string;
  packageId: string;
  packageName: string;
  status: string;
  statusLabel: string;
  totalAmount: number;
  currency: string;
  startDate?: string;
  endDate?: string;
  createdAt: string;
}

/** Payment breakdown filter: all, normal (package + caretaker), or special (special needs only). */
export type PaymentBreakdownFilter = "all" | "normal" | "special";

export interface PaymentBreakdownLineItem {
  label: string;
  amount: number;
}

export interface PaymentBreakdownItem {
  type: "NORMAL" | "SPECIAL_NEEDS";
  label: string;
  amount: number;
  items: PaymentBreakdownLineItem[];
}

export interface CaretakerSummaryInBooking {
  id: string;
  name: string;
  profileImage?: string;
  verificationStatus?: "pending" | "verified" | "rejected";
  languages: string[];
  experienceYears: number;
  rating: number;
  reviewCount: number;
  pricePerDay?: number;
  availabilityStatus: "AVAILABLE" | "BUSY" | "INACTIVE";
}

export interface ClientBookingDetail extends ClientBookingSummary {
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
  canCancel: boolean;
  cancellationReason?: string;
  paymentBreakdown: PaymentBreakdownItem[];
  caretaker?: CaretakerSummaryInBooking;
}

export const bookingService = {
  createCheckout: async (
    payload: CreateCheckoutPayload
  ): Promise<CreateCheckoutResult> => {
    const response: AxiosResponse<{
      success: boolean;
      data: CreateCheckoutResult;
      message?: string;
    }> = await CareVoyageBackend.post(API_ENDPOINTS.BOOKING.CHECKOUT, payload);
    return response.data.data;
  },

  walletPay: async (payload: {
    packageId: string;
    caretakerId?: string;
    specialNeedIds?: string[];
  }): Promise<WalletPayResult> => {
    const response: AxiosResponse<{
      success: boolean;
      data: WalletPayResult;
      message?: string;
    }> = await CareVoyageBackend.post(API_ENDPOINTS.BOOKING.WALLET_PAY, payload);
    return response.data.data;
  },

  getPackageSpecialNeeds: async (
    packageId: string
  ): Promise<ClientSpecialNeedOption[]> => {
    const response: AxiosResponse<{
      success: boolean;
      data: ClientSpecialNeedOption[];
      message?: string;
    }> = await CareVoyageBackend.get(
      API_ENDPOINTS.BOOKING.PACKAGE_SPECIAL_NEEDS(packageId)
    );
    return response.data.data;
  },

  previewPrice: async (payload: {
    packageId: string;
    specialNeedIds?: string[];
    caretakerId?: string;
  }): Promise<PreviewBookingPriceResult> => {
    const response: AxiosResponse<{
      success: boolean;
      data: PreviewBookingPriceResult;
      message?: string;
    }> = await CareVoyageBackend.post(API_ENDPOINTS.BOOKING.PRICE_PREVIEW, payload);
    return response.data.data;
  },

  getAvailableCaretakers: async (
    packageId: string
  ): Promise<AvailableCaretaker[]> => {
    const response: AxiosResponse<{
      success: boolean;
      data: AvailableCaretaker[];
      message?: string;
    }> = await CareVoyageBackend.get(
      API_ENDPOINTS.BOOKING.PACKAGE_CARETAKERS(packageId)
    );
    return response.data.data;
  },

  confirmBookingSuccess: async (sessionId: string): Promise<void> => {
    await CareVoyageBackend.post(API_ENDPOINTS.BOOKING.CONFIRM_SUCCESS, { sessionId });
  },

  requestCaretaker: async (packageId: string): Promise<void> => {
    await CareVoyageBackend.post(API_ENDPOINTS.BOOKING.CARETAKER_REQUEST, { packageId });
  },

  getMyBookings: async (
    paymentType?: PaymentBreakdownFilter
  ): Promise<ClientBookingSummary[]> => {
    const params =
      paymentType && paymentType !== "all" ? { paymentType } : undefined;
    const response: AxiosResponse<{
      success: boolean;
      data: ClientBookingSummary[];
      message?: string;
    }> = await CareVoyageBackend.get(API_ENDPOINTS.BOOKING.MY_BOOKINGS, { params });
    return response.data.data;
  },

  getBookingDetail: async (
    bookingId: string,
    paymentType?: PaymentBreakdownFilter
  ): Promise<ClientBookingDetail> => {
    const params =
      paymentType && paymentType !== "all"
        ? { paymentType }
        : undefined;
    const response: AxiosResponse<{
      success: boolean;
      data: ClientBookingDetail;
      message?: string;
    }> = await CareVoyageBackend.get(API_ENDPOINTS.BOOKING.DETAIL(bookingId), { params });
    return response.data.data;
  },

  cancelBooking: async (
    bookingId: string,
    reason?: string
  ): Promise<void> => {
    await CareVoyageBackend.post(API_ENDPOINTS.BOOKING.CANCEL(bookingId), {
      reason: reason?.trim() || undefined,
    });
  },

  requestRefund: async (bookingId: string): Promise<void> => {
    await CareVoyageBackend.post(API_ENDPOINTS.BOOKING.REFUND_REQUEST(bookingId));
  },
};
