import { CareVoyageBackend } from "@/api/instance";
import type { ListNotificationsResponse } from "@/types/notification.types";

export async function listMyNotifications(params?: {
  page?: number;
  limit?: number;
  unreadOnly?: boolean;
}): Promise<ListNotificationsResponse> {
  const res = await CareVoyageBackend.get("/notifications", {
    params: {
      page: params?.page ?? 1,
      limit: params?.limit ?? 20,
      unreadOnly: params?.unreadOnly ?? false,
    },
  });
  return res.data.data as ListNotificationsResponse;
}

export async function markNotificationRead(id: string): Promise<{ ok: boolean }> {
  const res = await CareVoyageBackend.patch(`/notifications/${id}/read`);
  return res.data.data as { ok: boolean };
}

export async function markAllNotificationsRead(): Promise<{ updated: number }> {
  const res = await CareVoyageBackend.patch("/notifications/read-all");
  return res.data.data as { updated: number };
}

