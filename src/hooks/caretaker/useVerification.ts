import { useMutation, useQuery } from "@tanstack/react-query";
import {
  caretakerApi,
  type VerificationPayload,
} from "@/services/caretaker/caretakerService";
import toast from "react-hot-toast";

export const useSubmitVerification = () => {
  return useMutation({
    mutationFn: (data: VerificationPayload) =>
      caretakerApi.submitVerification(data),
    onSuccess: () => {
      toast.success("Verification submitted successfully!");
    },
    onError: (error: unknown) => {
      const errorMessage =
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message || "Failed to submit verification";
      toast.error(errorMessage);
    },
  });
};

export const useVerificationStatus = () => {
  return useQuery({
    queryKey: ["caretakerVerificationStatus"],
    queryFn: () => caretakerApi.getVerificationStatus(),
  });
};


