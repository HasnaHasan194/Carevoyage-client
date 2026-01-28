import { CareVoyageBackend } from "../../api/instance";

export interface InviteCaretakerPayload {
  email: string;
}

export interface InviteCaretakerResponse {
  success: boolean;
  message: string;
}

export const agencyApi = {
  inviteCaretaker: async (data: InviteCaretakerPayload): Promise<InviteCaretakerResponse> => {
    const response = await CareVoyageBackend.post("/agency/caretakers/invite", data);
    return response.data;
  },
};











