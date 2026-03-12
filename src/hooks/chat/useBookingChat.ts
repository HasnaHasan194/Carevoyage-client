import { useEffect, useMemo, useState } from "react";
import { getSocket } from "@/realtime/socket";
import { getBookingMessages, type ChatMessage } from "@/services/chat/chatService";

export function useBookingChat(bookingId: string | null) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const socket = useMemo(() => getSocket(), []);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      if (!bookingId) {
        setMessages([]);
        return;
      }
      setIsLoading(true);
      try {
        const history = await getBookingMessages({ bookingId, limit: 30 });
        if (!cancelled) setMessages(history);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [bookingId]);

  useEffect(() => {
    if (!bookingId) return;

    socket.auth = { token: localStorage.getItem("accessToken") ?? undefined };
    if (!socket.connected) socket.connect();

    socket.emit("chat:join", { bookingId });

    const onMessage = (msg: ChatMessage) => {
      if (msg.bookingId !== bookingId) return;
      setMessages((prev) => [...prev, msg]);
    };

    socket.on("chat:message", onMessage);
    return () => {
      socket.off("chat:message", onMessage);
    };
  }, [bookingId, socket]);

  async function sendMessage(text: string) {
    if (!bookingId) return;
    const trimmed = text.trim();
    if (!trimmed) return;

    await new Promise<void>((resolve, reject) => {
      socket.emit(
        "chat:send",
        { bookingId, text: trimmed },
        (ack: { ok: boolean; error?: string }) => {
          if (ack?.ok) resolve();
          else reject(new Error(ack?.error || "Failed to send"));
        }
      );
    });
  }

  return { messages, isLoading, sendMessage };
}

