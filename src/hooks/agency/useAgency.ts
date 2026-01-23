import { useMutation } from "@tanstack/react-query";
import { agencyApi, type InviteCaretakerPayload } from "@/services/agency/agencyService";

export const useInviteCaretakerMutation = () => {
  return useMutation({
    mutationFn: (data: InviteCaretakerPayload) => agencyApi.inviteCaretaker(data),
  });
};








