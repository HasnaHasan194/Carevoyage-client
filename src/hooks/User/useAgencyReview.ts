import { useMutation } from "@tanstack/react-query";
import { reviewService, type CreateAgencyReviewPayload } from "@/services/User/reviewService";

export const useSubmitAgencyReview = () => {
  return useMutation({
    mutationFn: (payload: CreateAgencyReviewPayload) =>
      reviewService.submitAgencyReview(payload),
  });
};

