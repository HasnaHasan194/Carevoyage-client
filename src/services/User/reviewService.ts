import { CareVoyageBackend } from "@/api/instance";
import { API_ENDPOINTS } from "@/constants/apiEndpoints";

export interface SubmitAgencyReviewPayload {
  bookingId: string;
  rating: number;
  reviewText: string;
}

export const submitAgencyReview = async (
  payload: SubmitAgencyReviewPayload
): Promise<void> => {
  await CareVoyageBackend.post(API_ENDPOINTS.USER.AGENCY_REVIEWS, payload);
};

