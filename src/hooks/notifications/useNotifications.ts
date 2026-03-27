import { useQuery } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { listMyNotifications } from "@/services/notifications/notificationService";
import { setNotifications } from "@/store/slices/notificationSlice";
import type { NotificationItem } from "@/types/notification.types";

function mapServerItems(items: Array<{
  _id: string;
  title: string;
  message: string;
  type: NotificationItem["type"];
  link?: string;
  metadata: NotificationItem["metadata"];
  readAt?: string | null;
  createdAt: string;
}>): NotificationItem[] {
  return items.map((x) => ({
    id: x._id,
    type: x.type,
    title: x.title,
    message: x.message,
    link: x.link,
    metadata: x.metadata,
    createdAt: x.createdAt,
    read: Boolean(x.readAt),
  }));
}

export function useNotifications(params?: {
  page?: number;
  limit?: number;
  unreadOnly?: boolean;
  enabled?: boolean;
}) {
  const dispatch = useDispatch();

  return useQuery({
    queryKey: ["notifications", params?.page ?? 1, params?.limit ?? 20, params?.unreadOnly ?? false],
    queryFn: async () => {
      const res = await listMyNotifications({
        page: params?.page,
        limit: params?.limit,
        unreadOnly: params?.unreadOnly,
      });
      const mapped = mapServerItems(res.items);
      dispatch(setNotifications({ items: mapped, unreadCount: res.unreadCount }));
      return res;
    },
    enabled: params?.enabled ?? true,
    refetchOnWindowFocus: false,
  });
}

