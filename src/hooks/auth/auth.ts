import { authApi } from "@/services/auth/authService";
import { useMutation, useQuery } from "@tanstack/react-query";


export const useLoginMutation = () => {
  return useMutation({
    mutationFn: authApi.loginService,
  });
};

export const useSignupMutation = () => {
  return useMutation({
    mutationFn: authApi.registerService,
  });
};
export const useAgencyregisterMutation=()=>{
  return useMutation({
    mutationFn:authApi.Agencyservice
  })
};

export const useAgencyloginMutation=()=>{
  return useMutation({
    mutationFn:authApi.AgencyloginService
  });
};
export const useAdminloginMutation=()=>{
  return useMutation({
    mutationFn:authApi.AdminloginService
  });
};

export const useLogoutMutation = () => {
  return useMutation({
    mutationFn: authApi.logoutService,
  });
};

export const useForgotPasswordMutation = () => {
  return useMutation({
    mutationFn: authApi.forgotPassword,
  });
};

export const useResetPasswordMutation = () => {
  return useMutation({
    mutationFn: authApi.resetPassword,
  });
};

export const useVerifyResetTokenQuery = (token: string) => {
  return useQuery({
    queryKey: ["verifyResetToken", token],
    queryFn: () => authApi.verifyResetToken(token),
    enabled: !!token,
    retry: false,
  });
};

export const useGoogleAuthMutation = () => {
  return useMutation({
    mutationFn: authApi.googleAuth,
  });
};

