import { CareVoyageBackend } from "../../api/instance";

export interface VerifyInviteResponse {
  success: boolean;
  data: {
    email: string;
    agencyName: string;
    agencyId: string;
    isValid: boolean;
  };
  message: string;
}

export interface CaretakerSignupPayload {
  token: string;
  firstName: string;
  lastName: string;
  password: string;
  phone: string;
}

export interface CaretakerSignupResponse {
  success: boolean;
  data: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
  };
  message: string;
  accessToken: string;
  refreshToken: string;
}

export interface CaretakerLoginPayload {
  email: string;
  password: string;
}

export interface CaretakerLoginResponse {
  success: boolean;
  message: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
  };
  accessToken: string;
  refreshToken: string;
}

export const caretakerApi = {
  verifyInvite: async (token: string): Promise<VerifyInviteResponse> => {
    const response = await CareVoyageBackend.get("/auth/verify-caretaker-invite", {
      params: { token },
    });
    return response.data;
  },

  signup: async (data: CaretakerSignupPayload): Promise<CaretakerSignupResponse> => {
    const response = await CareVoyageBackend.post("/auth/caretaker/signup", data);
    return response.data;
  },

  login: async (data: CaretakerLoginPayload): Promise<CaretakerLoginResponse> => {
    const response = await CareVoyageBackend.post("/auth/caretaker/login", data);
    return response.data;
  },
};

