import { authApi } from "@/services/auth/authService";
import { useMutation } from "@tanstack/react-query";


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

