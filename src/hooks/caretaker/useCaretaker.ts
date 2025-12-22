import { useMutation, useQuery } from "@tanstack/react-query";
import {
  caretakerApi,
  type CaretakerSignupPayload,
  type CaretakerLoginPayload,
} from "@/services/caretaker/caretakerService";

export const useVerifyInvite = (token: string | null) => {
  return useQuery({
    queryKey: ["verifyInvite", token],
    queryFn: () => caretakerApi.verifyInvite(token as string),
    enabled: !!token,
    retry: false,
  });
};

export const useCaretakerSignupMutation = () => {
  return useMutation({
    mutationFn: (data: CaretakerSignupPayload) => caretakerApi.signup(data),
  });
};

export const useCaretakerLoginMutation = () => {
  return useMutation({
    mutationFn: (data: CaretakerLoginPayload) => caretakerApi.login(data),
  });
};

