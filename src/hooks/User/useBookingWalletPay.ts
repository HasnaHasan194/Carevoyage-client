import { useMutation } from "@tanstack/react-query";
import { bookingService } from "@/services/User/bookingService";
import toast from "react-hot-toast";
import { ROUTES } from "@/config/env";

export const useBookingWalletPay = () => {
  return useMutation({
    mutationFn: (payload: {
      packageId: string;
      caretakerId?: string;
      specialNeedIds?: string[];
    }) => bookingService.walletPay(payload),
    onSuccess: () => {
      toast.success("Payment successful");
      // BookingSuccessPage already renders fine without session_id.
      window.location.href = ROUTES.BOOKING_SUCCESS;
    },
    onError: (error: unknown) => {
      const errorMessage =
        (error as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "Wallet payment failed";
      toast.error(errorMessage);
    },
  });
};

