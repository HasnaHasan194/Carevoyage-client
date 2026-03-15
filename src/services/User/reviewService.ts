import { CareVoyageBackend } from "@/api/instance";

export interface SubmitAgencyReviewPayload {
  bookingId: string;
  rating: number;
  reviewText: string;
}

export const submitAgencyReview = async (
  payload: SubmitAgencyReviewPayload
): Promise<void> => {
  await CareVoyageBackend.post("/user/agency-reviews", payload);
};

