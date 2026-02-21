import { useMutation } from "@tanstack/react-query";
import { bookingService, type CreateCheckoutPayload } from "@/services/User/bookingService";
import toast from "react-hot-toast";

/**
 * Creates a booking checkout session and redirects to Stripe.
 * On success, redirects the user to the returned URL.
 */
export const useCreateBookingCheckout = () => {
  return useMutation({
    mutationFn: (payload: CreateCheckoutPayload) =>
      bookingService.createCheckout(payload),
    onSuccess: (data) => {
      if (data?.url) {
        toast.success("Redirecting to payment...");
        window.location.href = data.url;
      } else {
        toast.error("Invalid checkout response");
      }
    },
    onError: (error: unknown) => {
      const errorMessage =
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message || "Failed to start checkout";
      toast.error(errorMessage);
    },
  });
};
