import React, { useMemo, useState } from "react";
import { Bell } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import { useNavigate } from "react-router-dom";
import { markAllNotificationsRead, markNotificationRead } from "@/services/notifications/notificationService";
import { markAllReadLocally, markReadLocally } from "@/store/slices/notificationSlice";
import { useNotifications } from "@/hooks/notifications/useNotifications";

export const NotificationBell: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const unreadCount = useSelector((s: RootState) => s.notifications.unreadCount);
  const items = useSelector((s: RootState) => s.notifications.items);
  const user = useSelector((s: RootState) => s.auth.user);

  useNotifications({ page: 1, limit: 20, unreadOnly: false, enabled: open && Boolean(user) });

  const visible = useMemo(() => items.slice(0, 8), [items]);

  async function onMarkAllRead() {
    await markAllNotificationsRead();
    dispatch(markAllReadLocally());
  }

  async function onClickItem(id: string, link?: string) {
    await markNotificationRead(id);
    dispatch(markReadLocally(id));
    if (link) navigate(link);
    setOpen(false);
  }

  if (!user) return null;

  return (
    <div className="fixed top-4 right-4 z-50">
      <div className="relative">
        <button
          onClick={() => setOpen((v) => !v)}
          className="relative p-2.5 rounded-xl border shadow-sm hover:shadow-md transition"
          style={{ backgroundColor: "#FFFBF5", borderColor: "#E5DDD5" }}
          aria-label="Notifications"
        >
          <Bell className="w-5 h-5" style={{ color: "#7C5A3B" }} />
          {unreadCount > 0 && (
            <span
              className="absolute -top-1 -right-1 min-w-5 h-5 px-1 rounded-full text-xs font-semibold flex items-center justify-center"
              style={{ backgroundColor: "#DC2626", color: "white" }}
            >
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}
        </button>

        {open && (
          <div
            className="absolute right-0 mt-2 w-96 max-w-[92vw] rounded-2xl border shadow-xl overflow-hidden"
            style={{ backgroundColor: "#FFFBF5", borderColor: "#E5DDD5" }}
          >
            <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: "#E5DDD5" }}>
              <div className="font-semibold" style={{ color: "#7C5A3B" }}>
                Notifications
              </div>
              <button
                onClick={onMarkAllRead}
                className="text-sm font-medium hover:underline"
                style={{ color: "#8B6F47" }}
                disabled={items.length === 0 || unreadCount === 0}
              >
                Mark all read
              </button>
            </div>

            <div className="max-h-[60vh] overflow-y-auto">
              {visible.length === 0 ? (
                <div className="px-4 py-6 text-sm" style={{ color: "#8B6F47" }}>
                  No notifications yet.
                </div>
              ) : (
                visible.map((n) => (
                  <button
                    key={n.id}
                    onClick={() => onClickItem(n.id, n.link)}
                    className="w-full text-left px-4 py-3 border-b hover:bg-[#F5EDE3] transition"
                    style={{ borderColor: "#E5DDD5" }}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className="mt-1 w-2 h-2 rounded-full flex-shrink-0"
                        style={{ backgroundColor: n.read ? "transparent" : "#D4A574" }}
                      />
                      <div className="min-w-0">
                        <div className="text-sm font-semibold truncate" style={{ color: "#7C5A3B" }}>
                          {n.title}
                        </div>
                        <div className="text-sm line-clamp-2" style={{ color: "#8B6F47" }}>
                          {n.message}
                        </div>
                        <div className="text-xs mt-1" style={{ color: "#9A8462" }}>
                          {new Date(n.createdAt).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

