import { CareVoyageBackend } from "@/api/instance";
import type { AxiosResponse } from "axios";

export interface CreateCheckoutPayload {
  packageId: string;
  caretakerFee?: number;
  caretakerId?: string;
  specialNeedIds?: string[];
}

export interface CreateCheckoutResult {
  url: string;
  sessionId: string;
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

export const bookingService = {
  createCheckout: async (
    payload: CreateCheckoutPayload
  ): Promise<CreateCheckoutResult> => {
    const response: AxiosResponse<{
      success: boolean;
      data: CreateCheckoutResult;
      message?: string;
    }> = await CareVoyageBackend.post("/booking/checkout", payload);
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
      `/booking/package/${packageId}/special-needs`
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
    }> = await CareVoyageBackend.post("/booking/price-preview", payload);
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
      `/booking/package/${packageId}/caretakers`
    );
    return response.data.data;
  },

  confirmBookingSuccess: async (sessionId: string): Promise<void> => {
    await CareVoyageBackend.post("/booking/confirm-success", { sessionId });
  },

  requestCaretaker: async (packageId: string): Promise<void> => {
    await CareVoyageBackend.post("/booking/caretaker-request", { packageId });
  },
};
