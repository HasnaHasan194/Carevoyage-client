import { CareVoyageBackend } from "@/api/instance";
import { API_ENDPOINTS } from "@/constants/apiEndpoints";
import type { ListNotificationsResponse } from "@/types/notification.types";

export async function listMyNotifications(params?: {
  page?: number;
  limit?: number;
  unreadOnly?: boolean;
}): Promise<ListNotificationsResponse> {
  const res = await CareVoyageBackend.get(API_ENDPOINTS.NOTIFICATIONS.LIST, {
    params: {
      page: params?.page ?? 1,
      limit: params?.limit ?? 20,
      unreadOnly: params?.unreadOnly ?? false,
    },
  });
  return res.data.data as ListNotificationsResponse;
}

export async function markNotificationRead(id: string): Promise<{ ok: boolean }> {
  const res = await CareVoyageBackend.patch(API_ENDPOINTS.NOTIFICATIONS.MARK_READ(id));
  return res.data.data as { ok: boolean };
}

export async function markAllNotificationsRead(): Promise<{ updated: number }> {
  const res = await CareVoyageBackend.patch(API_ENDPOINTS.NOTIFICATIONS.MARK_ALL_READ);
  return res.data.data as { updated: number };
}

