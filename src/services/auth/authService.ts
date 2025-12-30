import { CareVoyageBackend } from "../../api/instance";
import { AUTH_CONFIG } from "../../config/env";
import type {
  RegisterPayload,
  LoginPayload,
  AgencyRegisterPayload,
  AgencyLoginPayload,
  AdminLoginPayload,
} from "../../types/auth.types";

export const authApi = {
  registerService: async (data: RegisterPayload) => {
    const response = await CareVoyageBackend.post(AUTH_CONFIG.REGISTER, data);
    return response.data;
  },
  loginService: async (data: LoginPayload) => {
    const response = await CareVoyageBackend.post(AUTH_CONFIG.LOGIN, data);
    return response.data;
  },
  Agencyservice: async (data: AgencyRegisterPayload) => {
    const response = await CareVoyageBackend.post(
      AUTH_CONFIG.AGENCY_REGISTER,
      data
    );
    return response.data;
  },
  AgencyloginService: async (data: AgencyLoginPayload) => {
    const response = await CareVoyageBackend.post(
      AUTH_CONFIG.AGENCY_LOGIN,
      data
    );
    return response.data;
  },
  AdminloginService: async (data: AdminLoginPayload) => {
    const response = await CareVoyageBackend.post(
      AUTH_CONFIG.ADMIN_LOGIN,
      data
    );
    return response.data;
  },

  //otp service
  sendOtp: async (data: { email: string; phone: string }) => {
    return CareVoyageBackend.post("/auth/send-otp", data);
  },

  verifyOtpAndCreateUser: async (data: {
    email: string;
    otp: string;
    userData: {
      firstName: string;
      lastName: string;
      email: string;
      password: string;
      phone: string;
      role: "client";
    };
  }) => {
    return CareVoyageBackend.post("/auth/verify-createuser", data);
  },

  resendOtp: async (email: string) => {
    return CareVoyageBackend.post("/auth/resend-otp", { email });
  },

  verifyOtpAndCreateAgency: async (data: {
    email: string;
    otp: string;
    agencyData: {
      userData: {
        firstName: string;
        lastName: string;
        email: string;
        phone: string;
        password: string;
        role: "agency_owner";
      };
      agencyName: string;
      address: string;
      registrationNumber: string;
      description?: string;
    };
  }) => {
    return CareVoyageBackend.post("/auth/verify-create-agency", data);
  },

  logoutService: async () => {
    const response = await CareVoyageBackend.post(AUTH_CONFIG.LOGOUT);
    return response.data;
  },

  forgotPassword: async (data: { email: string; role?: string }) => {
    const response = await CareVoyageBackend.post("/auth/forgot-password", data);
    return response.data;
  },

  resetPassword: async (data: {
    token: string;
    password: string;
    confirmPassword: string;
  }) => {
    const response = await CareVoyageBackend.post("/auth/reset-password", data);
    return response.data;
  },

  verifyResetToken: async (token: string) => {
    const response = await CareVoyageBackend.get(
      `/auth/verify-reset-token?token=${token}`
    );
    return response.data;
  },

googleAuth: async (data: { accessToken: string }) => {
  const response = await CareVoyageBackend.post("/auth/google", data);
  return response.data;
},

};
