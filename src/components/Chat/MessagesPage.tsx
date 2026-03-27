import { useEffect, useMemo, useRef, useState } from "react";
import { useConversations } from "@/hooks/chat/useConversations";
import { useBookingChat } from "@/hooks/chat/useBookingChat";
import { uploadChatAttachment, type ChatConversation, type ChatMessage } from "@/services/chat/chatService";

function formatTime(iso: string | undefined | null): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export const MessagesPage = () => {
  const { data: conversations, isLoading: conversationsLoading } = useConversations();
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [draft, setDraft] = useState<string>("");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const effectiveConversations: ChatConversation[] = useMemo(
    () => conversations ?? [],
    [conversations]
  );

  useEffect(() => {
    if (!effectiveConversations.length) {
      setSelectedConversationId(null);
      return;
    }

    const stillExists = effectiveConversations.some(
      (c) => c._id === selectedConversationId
    );

    if (!stillExists) {
      setSelectedConversationId(effectiveConversations[0]._id);
    }
  }, [effectiveConversations, selectedConversationId]);

  const selectedConversation: ChatConversation | undefined =
    effectiveConversations.find((c) => c._id === selectedConversationId) ??
    effectiveConversations[0];

  const bookingId = selectedConversation?.bookingId ?? null;

  const {
    messages,
    isLoading: messagesLoading,
    sendMessage,
  } = useBookingChat(bookingId);

  const chatEnabled = selectedConversation?.chatEnabled ?? false;

  const handleSend = async () => {
    if (!chatEnabled || !selectedConversation) return;

    const trimmed = draft.trim();
    if (!trimmed && selectedFiles.length === 0) return;

    const bookingIdForUpload = selectedConversation?.bookingId;
    if (!bookingIdForUpload) return;

    try {
      setUploading(true);

      const attachmentsMeta =
        selectedFiles.length > 0
          ? await Promise.all(
              selectedFiles.map((file) =>
                uploadChatAttachment({
                  bookingId: bookingIdForUpload,
                  file,
                })
              )
            )
          : undefined;

      await sendMessage(trimmed, attachmentsMeta);
      setDraft("");
      setSelectedFiles([]);
    } catch {
      // In this first iteration we silently ignore send errors.
    }
    finally {
      setUploading(false);
    }
  };

  const handleKeyDown: React.KeyboardEventHandler<HTMLTextAreaElement> = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void handleSend();
    }
  };

  const isLoadingAny = conversationsLoading || messagesLoading;

  return (
    <div className="h-full min-h-[640px]">
      <div className="max-w-7xl mx-auto h-full min-h-[640px] flex flex-col">
        {/* Header */}
        <div className="flex flex-col gap-1 px-4 pt-4 sm:px-6 sm:pt-6">
          <h1 className="text-2xl font-semibold tracking-tight" style={{ color: "#7C5A3B" }}>
            Messages
          </h1>
          <p className="text-sm sm:text-base" style={{ color: "#8B6F47" }}>
            Chat with your caretaker in real-time while keeping all trip conversations organised.
          </p>
        </div>

        {/* Main content */}
        <div className="mt-4 flex-1 min-h-[720px] px-4 pb-4 sm:px-6 sm:pb-6">
          <div className="h-full rounded-2xl shadow-sm border border-[#E4D4C3] bg-gradient-to-br from-[#FFF8EC] via-[#FAF7F2] to-[#F3E6D8] flex overflow-hidden">
            {/* Conversations list */}
            <aside className="w-72 max-w-xs border-r border-[#E4D4C3] bg-gradient-to-b from-[#FFF5E5] to-[#F8EFE2] flex flex-col">
              <div className="px-4 py-3 border-b border-[#E4D4C3] flex items-center justify-between">
                <span className="font-semibold text-sm" style={{ color: "#7C5A3B" }}>
                  Conversations
                </span>
                {effectiveConversations.length > 0 && (
                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#F1E1CF] text-[#7C5A3B]">
                    {effectiveConversations.length} active
                  </span>
                )}
              </div>

              <div className="flex-1 overflow-y-auto">
                {conversationsLoading ? (
                  <div className="p-4 text-sm" style={{ color: "#8B6F47" }}>
                    Loading conversations…
                  </div>
                ) : effectiveConversations.length === 0 ? (
                  <div className="p-4 text-sm" style={{ color: "#8B6F47" }}>
                    No conversations yet. Messages will appear here once a trip is confirmed.
                  </div>
                ) : (
                  <ul className="divide-y divide-[#E4D4C3]/70">
                    {effectiveConversations.map((conv) => {
                      const isActive =
                        (selectedConversation?. _id ?? selectedConversationId) === conv._id;
                      return (
                        <li
                          key={conv._id}
                          className={[
                            "cursor-pointer px-4 py-3 text-sm transition-colors",
                            isActive
                              ? "bg-[#F3E2CB]/80"
                              : "hover:bg-[#F6EADB]",
                          ].join(" ")}
                          onClick={() => setSelectedConversationId(conv._id)}
                        >
                          <div className="flex justify-between items-start gap-2">
                            <div>
                              <div className="font-medium" style={{ color: "#5C432D" }}>
                                {conv.otherPartyName ?? "Conversation"}
                              </div>
                              {conv.packageName && (
                                <div className="text-[11px]" style={{ color: "#8B6F47" }}>
                                  {conv.packageName}
                                </div>
                              )}
                              {conv.lastMessagePreview && (
                                <div className="mt-1 text-[11px] line-clamp-1" style={{ color: "#A1865A" }}>
                                  {conv.lastMessagePreview}
                                </div>
                              )}
                            </div>
                            <div className="flex flex-col items-end gap-1">
                              {conv.lastMessageAt && (
                                <span className="text-[10px]" style={{ color: "#A1865A" }}>
                                  {formatTime(conv.lastMessageAt)}
                                </span>
                              )}
                              <span
                                className={[
                                  "text-[10px] px-2 py-0.5 rounded-full border",
                                  conv.chatEnabled
                                    ? "border-[#86A67B]/60 bg-[#F3FAF0] text-[#4D6B43]"
                                    : "border-[#C9B299]/70 bg-[#F4EBE2] text-[#8B6F47]",
                                ].join(" ")}
                              >
                                {conv.chatEnabled ? "Active" : "Read only"}
                              </span>
                            </div>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            </aside>

            {/* Message thread */}
            <section className="flex-1 flex flex-col">
              {/* Header for selected conversation */}
              <div className="px-5 py-4 border-b border-[#E4D4C3] bg-gradient-to-r from-[#FFF5E5] via-[#FAF1E4] to-[#F6E7D6] flex items-center justify-between">
                <div>
                  <div className="font-semibold text-sm sm:text-base" style={{ color: "#5C432D" }}>
                    {selectedConversation?.otherPartyName ?? "No conversation selected"}
                  </div>
                  {selectedConversation?.packageName && (
                    <div className="text-xs sm:text-[13px]" style={{ color: "#8B6F47" }}>
                      {selectedConversation.packageName}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={[
                      "text-[11px] px-2 py-0.5 rounded-full border",
                      chatEnabled
                        ? "border-[#86A67B]/60 bg-[#F3FAF0] text-[#4D6B43]"
                        : "border-[#C9B299]/70 bg-[#F4EBE2] text-[#8B6F47]",
                    ].join(" ")}
                  >
                    {chatEnabled ? "Chat enabled" : "Chat disabled"}
                  </span>
                </div>
              </div>

              {/* Messages list */}
              <div className="flex-1 overflow-y-auto px-4 py-4 sm:px-6 sm:py-5 space-y-3">
                {isLoadingAny && (
                  <div className="text-sm" style={{ color: "#8B6F47" }}>
                    Loading messages…
                  </div>
                )}

                {!isLoadingAny && (!messages || messages.length === 0) && (
                  <div className="text-sm" style={{ color: "#8B6F47" }}>
                    {selectedConversation
                      ? chatEnabled
                        ? "No messages yet. Say hello to start the conversation."
                        : "No messages for this trip."
                      : "Select a conversation on the left to view messages."}
                  </div>
                )}

                {messages.map((msg: ChatMessage) => {
                  const isMine = msg.senderRole === "client" || msg.senderRole === "caretaker";
                  const alignRight = isMine;
                  return (
                    <div
                      key={msg._id}
                      className={[
                        "flex",
                        alignRight ? "justify-end" : "justify-start",
                      ].join(" ")}
                    >
                      <div
                        className={[
                          "max-w-[80%] rounded-2xl px-3 py-2 text-sm shadow-sm",
                          alignRight
                            ? "bg-[#7C5A3B] text-white rounded-br-sm"
                            : "bg-white/90 text-[#4B3A29] border border-[#E4D4C3] rounded-bl-sm",
                        ].join(" ")}
                      >
                        {msg.text && msg.text.trim().length > 0 && (
                          <p className="whitespace-pre-wrap break-words">{msg.text}</p>
                        )}

                        {msg.attachments?.length ? (
                          <div className="mt-2 space-y-2">
                            {msg.attachments.map((att) => {
                              if (att.kind === "image") {
                                return (
                                  <img
                                    key={att.s3Key}
                                    src={att.url ?? ""}
                                    alt={att.originalName}
                                    className="max-w-[240px] rounded-lg border border-[#E4D4C3]"
                                  />
                                );
                              }
                              return (
                                <a
                                  key={att.s3Key}
                                  href={att.url ?? "#"}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="block max-w-[240px] rounded-lg border border-[#E4D4C3] px-3 py-2 text-xs hover:bg-white/60 transition-colors"
                                >
                                  <div className="font-medium truncate">{att.originalName}</div>
                                  <div className="text-[10px] opacity-80">
                                    {(att.sizeBytes / 1024 / 1024).toFixed(2)} MB
                                  </div>
                                </a>
                              );
                            })}
                          </div>
                        ) : null}
                        <div
                          className={[
                            "mt-1 text-[10px] flex justify-end",
                            alignRight ? "text-[#F3E2CB]" : "text-[#A1865A]",
                          ].join(" ")}
                        >
                          {formatTime(msg.createdAt)}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Composer */}
              <div className="border-t border-[#E4D4C3] bg-[#FFF8EF] px-4 py-3 sm:px-6 sm:py-4">
                <div className="flex items-end gap-3">
                  <div className="relative">
                    <button
                      type="button"
                      className="inline-flex items-center justify-center rounded-xl px-3 py-2 text-sm font-medium shadow-sm transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                      style={{
                        backgroundColor: chatEnabled ? "#F5EDE3" : "#C9B299",
                        color: "#7C5A3B",
                      }}
                      disabled={!chatEnabled || !selectedConversation}
                      onClick={() => setShowEmojiPicker((p) => !p)}
                    >
                      :)
                    </button>

                    {showEmojiPicker && (
                      <div
                        className="absolute bottom-[46px] left-0 z-10 w-56 rounded-xl border border-[#E4D4C3] bg-white/95 backdrop-blur px-3 py-2 shadow-sm"
                      >
                        <div className="text-[11px] opacity-80" style={{ color: "#8B6F47" }}>
                          Emojis
                        </div>
                        <div className="mt-2 grid grid-cols-8 gap-1">
                          {["😀","😂","😍","😎","🥳","😢","🔥","👍","🙏","🎉","💖","❤️","✨","🫶","👏","🤝"].map(
                            (e) => (
                              <button
                                key={e}
                                type="button"
                                className="h-7 w-7 rounded-lg hover:bg-[#F3E2CB]/60 transition-colors"
                                onClick={() => setDraft((d) => d + e)}
                              >
                                {e}
                              </button>
                            )
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  <textarea
                    className="flex-1 resize-none rounded-xl border border-[#E4D4C3] bg-white/90 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A57A] focus:border-[#C9A57A] disabled:bg-[#F3E7DA] disabled:text-[#A1865A]"
                    rows={2}
                    placeholder={
                      chatEnabled
                        ? "Type your message and press Enter to send…"
                        : "Chat is disabled for this trip. You can still read previous messages."
                    }
                    disabled={!chatEnabled || !selectedConversation}
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    onKeyDown={handleKeyDown}
                  />

                  <div className="flex flex-col items-end gap-2">
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      className="hidden"
                      onChange={(e) => {
                        const files = e.target.files ? Array.from(e.target.files) : [];
                        setSelectedFiles(files);
                      }}
                      disabled={!chatEnabled || !selectedConversation || uploading}
                    />
                    <button
                      type="button"
                      className="inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-medium shadow-sm transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                      style={{
                        backgroundColor: chatEnabled ? "#F5EDE3" : "#C9B299",
                        color: "#7C5A3B",
                      }}
                      disabled={!chatEnabled || !selectedConversation || uploading}
                      onClick={() => fileInputRef.current?.click()}
                    >
                      Attach
                    </button>

                    {selectedFiles.length > 0 && (
                      <div className="w-full max-w-[220px]">
                        <div className="flex flex-col gap-1 rounded-xl border border-[#E4D4C3] bg-white/70 px-3 py-2">
                          {selectedFiles.slice(0, 3).map((f) => (
                            <div key={f.name} className="text-[11px] truncate opacity-90" style={{ color: "#8B6F47" }}>
                              {f.name}
                            </div>
                          ))}
                          {selectedFiles.length > 3 && (
                            <div className="text-[11px] opacity-80" style={{ color: "#8B6F47" }}>
                              +{selectedFiles.length - 3} more
                            </div>
                          )}
                          <button
                            type="button"
                            className="text-[11px] mt-1 text-[#DC2626] hover:underline"
                            disabled={uploading}
                            onClick={() => setSelectedFiles([])}
                          >
                            Remove files
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  <button
                    type="button"
                    className="inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-medium shadow-sm transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                    style={{
                      backgroundColor: chatEnabled ? "#7C5A3B" : "#C9B299",
                      color: "#FFF8EF",
                    }}
                    disabled={
                      !chatEnabled ||
                      !selectedConversation ||
                      uploading ||
                      (!draft.trim() && selectedFiles.length === 0)
                    }
                    onClick={() => {
                      void handleSend();
                    }}
                  >
                    {uploading ? "Uploading..." : "Send"}
                  </button>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

