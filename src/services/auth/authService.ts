import { CareVoyageBackend } from "../../api/instance";
import { API_ENDPOINTS } from "@/constants/apiEndpoints";
import type {
  RegisterPayload,
  LoginPayload,
  AgencyRegisterPayload,
  AgencyLoginPayload,
  AdminLoginPayload,
  User,
} from "../../types/auth.types";

export const authApi = {
  registerService: async (data: RegisterPayload) => {
    const response = await CareVoyageBackend.post(API_ENDPOINTS.AUTH.REGISTER, data);
    return response.data;
  },
  loginService: async (data: LoginPayload) => {
    const response = await CareVoyageBackend.post(API_ENDPOINTS.AUTH.LOGIN, data);
    return response.data;
  },
  Agencyservice: async (data: AgencyRegisterPayload) => {
    const response = await CareVoyageBackend.post(
      API_ENDPOINTS.AUTH.AGENCY_SIGNUP,
      data
    );
    return response.data;
  },
  AgencyloginService: async (data: AgencyLoginPayload) => {
    const response = await CareVoyageBackend.post(
      API_ENDPOINTS.AUTH.AGENCY_LOGIN,
      data
    );
    return response.data;
  },
  AdminloginService: async (data: AdminLoginPayload) => {
    const response = await CareVoyageBackend.post(
      API_ENDPOINTS.AUTH.ADMIN_LOGIN,
      data
    );
    return response.data;
  },

  //otp service
  sendOtp: async (data: { email: string; phone: string }) => {
    return CareVoyageBackend.post(API_ENDPOINTS.AUTH.SEND_OTP, data);
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
    return CareVoyageBackend.post(API_ENDPOINTS.AUTH.VERIFY_CREATE_USER, data);
  },

  resendOtp: async (email: string) => {
    return CareVoyageBackend.post(API_ENDPOINTS.AUTH.RESEND_OTP, { email });
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
    return CareVoyageBackend.post(API_ENDPOINTS.AUTH.VERIFY_CREATE_AGENCY, data);
  },

  logoutService: async () => {
    const response = await CareVoyageBackend.post(API_ENDPOINTS.AUTH.LOGOUT);
    return response.data;
  },

  me: async (): Promise<User> => {
    try {
      const response = await CareVoyageBackend.get(API_ENDPOINTS.AUTH.ME);
      return response.data.data as User;
    } catch (e) {
      throw e;
    }
  },

  forgotPassword: async (data: { email: string; role?: string }) => {
    const response = await CareVoyageBackend.post(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, data);
    return response.data;
  },

  resetPassword: async (data: {
    token: string;
    password: string;
    confirmPassword: string;
  }) => {
    const response = await CareVoyageBackend.post(API_ENDPOINTS.AUTH.RESET_PASSWORD, data);
    return response.data;
  },

  verifyResetToken: async (token: string) => {
    const response = await CareVoyageBackend.get(
      API_ENDPOINTS.AUTH.VERIFY_RESET_TOKEN(token)
    );
    return response.data;
  },

  verifyOldPassword: async (data: { oldPassword: string }) => {
    const response = await CareVoyageBackend.post(API_ENDPOINTS.AUTH.VERIFY_OLD_PASSWORD, data);
    return response.data;
  },

  changePassword: async (data: { newPassword: string; confirmPassword: string }) => {
    const response = await CareVoyageBackend.post(API_ENDPOINTS.AUTH.CHANGE_PASSWORD, data);
    return response.data;
  },

  googleAuth: async (data: { accessToken: string }) => {
    const response = await CareVoyageBackend.post(API_ENDPOINTS.AUTH.GOOGLE_AUTH, data);
    return response.data;
  },

};
