import { useMemo, useState } from "react";
import { useConversations } from "@/hooks/chat/useConversations";
import { useBookingChat } from "@/hooks/chat/useBookingChat";

export function MessagesPage() {
  const { data: conversations = [], isLoading } = useConversations();
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null);

  const selected = useMemo(
    () => conversations.find((c) => c.bookingId === selectedBookingId) ?? null,
    [conversations, selectedBookingId]
  );

  const { messages, sendMessage } = useBookingChat(selectedBookingId);
  const [draft, setDraft] = useState("");

  return (
    <div className="p-4 lg:p-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="border rounded-lg p-3">
          <div className="font-semibold mb-2">Conversations</div>
          {isLoading ? (
            <div className="text-sm text-gray-500">Loading…</div>
          ) : conversations.length === 0 ? (
            <div className="text-sm text-gray-500">No conversations yet.</div>
          ) : (
            <ul className="space-y-2">
              {conversations.map((c) => (
                <li key={c._id}>
                  <button
                    className={`w-full text-left p-2 rounded border ${
                      selectedBookingId === c.bookingId ? "bg-gray-50" : ""
                    }`}
                    onClick={() => setSelectedBookingId(c.bookingId)}
                  >
                    <div className="text-sm font-medium">
                      {c.otherPartyName ?? "Conversation"}
                    </div>
                    <div className="text-xs text-gray-500">
                      {c.packageName ? `${c.packageName} · ` : ""}
                      {c.lastMessagePreview ??
                        (c.chatEnabled ? "No messages yet" : "Chat disabled")}
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="lg:col-span-2 border rounded-lg p-3 min-h-[420px] flex flex-col">
          {!selected ? (
            <div className="text-sm text-gray-500">Select a conversation.</div>
          ) : (
            <>
              <div className="font-semibold mb-2">
                {selected.otherPartyName ?? "Conversation"}
                {selected.packageName ? ` – ${selected.packageName}` : ""}{" "}
                {!selected.chatEnabled && (
                  <span className="text-xs text-gray-500">(read-only)</span>
                )}
              </div>

              <div className="flex-1 overflow-auto border rounded p-2 space-y-2">
                {messages.length === 0 ? (
                  <div className="text-sm text-gray-500">No messages yet.</div>
                ) : (
                  messages.map((m) => (
                    <div key={m._id} className="text-sm">
                      <div className="text-xs text-gray-500">{m.senderRole}</div>
                      <div>{m.text}</div>
                    </div>
                  ))
                )}
              </div>

              <form
                className="mt-2 flex gap-2"
                onSubmit={async (e) => {
                  e.preventDefault();
                  if (!selected.chatEnabled) return;
                  await sendMessage(draft);
                  setDraft("");
                }}
              >
                <input
                  className="flex-1 border rounded px-3 py-2 text-sm"
                  placeholder={
                    selected.chatEnabled ? "Type a message…" : "Chat disabled for this booking"
                  }
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  disabled={!selected.chatEnabled}
                />
                <button
                  className="border rounded px-3 py-2 text-sm"
                  type="submit"
                  disabled={!selected.chatEnabled}
                >
                  Send
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

