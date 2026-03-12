import { useQuery } from "@tanstack/react-query";
import { listConversations, type ChatConversation } from "@/services/chat/chatService";

export function useConversations() {
  return useQuery<ChatConversation[]>({
    queryKey: ["chat", "conversations"],
    queryFn: () => listConversations(),
  });
}

