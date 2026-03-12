import { CareVoyageBackend } from "@/api/instance";

export interface CreateAgencyReviewPayload {
  bookingId: string;
  rating: number;
  reviewText: string;
}

export const reviewService = {
  submitAgencyReview: async (payload: CreateAgencyReviewPayload): Promise<void> => {
    await CareVoyageBackend.post("/user/agency-reviews", payload);
  },
};

