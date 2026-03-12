import { CareVoyageBackend } from "@/api/instance";

export interface ChatConversation {
  _id: string;
  bookingId: string;
  participants: { clientUserId: string; caretakerUserId: string };
  chatEnabled: boolean;
  lastMessageAt?: string | null;
  lastMessagePreview?: string | null;
  createdAt: string;
  updatedAt: string;
  otherPartyName?: string;
  packageName?: string;
}

export interface ChatMessage {
  _id: string;
  conversationId: string;
  bookingId: string;
  senderUserId: string;
  senderRole: "client" | "caretaker";
  text: string;
  createdAt: string;
}

export async function listConversations(limit?: number): Promise<ChatConversation[]> {
  const res = await CareVoyageBackend.get("/chat/conversations", {
    params: limit ? { limit } : undefined,
  });
  return (res.data as any).data ?? [];
}

export async function getBookingMessages(params: {
  bookingId: string;
  cursor?: string;
  limit?: number;
}): Promise<ChatMessage[]> {
  const res = await CareVoyageBackend.get(
    `/chat/bookings/${params.bookingId}/messages`,
    {
      params: {
        cursor: params.cursor,
        limit: params.limit,
      },
    }
  );
  return (res.data as any).data ?? [];
}

