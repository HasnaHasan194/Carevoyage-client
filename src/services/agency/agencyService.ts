import { CareVoyageBackend } from "../../api/instance";

export interface InviteCaretakerPayload {
  email: string;
}

export interface InviteCaretakerResponse {
  success: boolean;
  message: string;
}

export type CaretakerAvailabilityStatus = "AVAILABLE" | "BUSY" | "INACTIVE";

export interface AgencyCaretaker {
  id: string;
  name?: string;
  email?: string;
  status: string;
  availabilityStatus: CaretakerAvailabilityStatus;
  verificationStatus?: string;
  pricePerDay: number;
  languages: string[];
  experienceYears: number;
  profileImage?: string;
}

export interface UpdateCaretakerAvailabilityPayload {
  caretakerId: string;
  status: Exclude<CaretakerAvailabilityStatus, "BUSY">; // AVAILABLE | INACTIVE
}

export interface UpdateCaretakerPricePayload {
  caretakerId: string;
  pricePerDay: number;
}

export const agencyApi = {
  inviteCaretaker: async (data: InviteCaretakerPayload): Promise<InviteCaretakerResponse> => {
    const response = await CareVoyageBackend.post("/agency/caretakers/invite", data);
    return response.data;
  },
  listCaretakers: async (): Promise<AgencyCaretaker[]> => {
    const response = await CareVoyageBackend.get("/agency/caretakers");
    return response.data.data as AgencyCaretaker[];
  },
  updateCaretakerAvailability: async (
    data: UpdateCaretakerAvailabilityPayload
  ): Promise<AgencyCaretaker> => {
    const response = await CareVoyageBackend.patch(
      `/agency/caretakers/${data.caretakerId}/status`,
      { status: data.status }
    );
    return response.data.data as AgencyCaretaker;
  },
  updateCaretakerPrice: async (
    data: UpdateCaretakerPricePayload
  ): Promise<AgencyCaretaker> => {
    const response = await CareVoyageBackend.patch(
      `/agency/caretakers/${data.caretakerId}/price`,
      { pricePerDay: data.pricePerDay }
    );
    return response.data.data as AgencyCaretaker;
  },
  deleteCaretaker: async (caretakerId: string): Promise<void> => {
    await CareVoyageBackend.delete(`/agency/caretakers/${caretakerId}`);
  },
  listCaretakerRequests: async (): Promise<CaretakerRequestItem[]> => {
    const response = await CareVoyageBackend.get("/agency/caretaker-requests");
    return response.data.data as CaretakerRequestItem[];
  },
  fulfillCaretakerRequest: async (
    requestId: string,
    payload: { noteToClient?: string; caretakerId?: string }
  ): Promise<void> => {
    await CareVoyageBackend.patch(
      `/agency/caretaker-requests/${requestId}/fulfill`,
      payload
    );
  },
};

export interface CaretakerRequestItem {
  id: string;
  clientId: string;
  clientName: string;
  clientEmail: string;
  packageId: string;
  packageName: string;
  agencyId: string;
  status: string;
  requestedAt: string;
  fulfilledAt?: string;
  agencyNoteToClient?: string;
}











