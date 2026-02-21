import { CareVoyageBackend } from "@/api/instance";
import type { AxiosResponse } from "axios";

export interface CreateCheckoutPayload {
  packageId: string;
  caretakerFee?: number;
  specialNeedIds?: string[];
}

export interface CreateCheckoutResult {
  url: string;
  sessionId: string;
  bookingId: string;
}

export const bookingService = {
  /**
   * Create a Stripe checkout session for a package booking.
   * Returns the Stripe Checkout URL to redirect the user.
   */
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
};
