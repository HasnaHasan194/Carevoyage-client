import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { NotificationItem } from "@/types/notification.types";

interface NotificationsState {
  items: NotificationItem[];
  unreadCount: number;
}

const initialState: NotificationsState = {
  items: [],
  unreadCount: 0,
};

export const notificationSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    setNotifications(
      state,
      action: PayloadAction<{ items: NotificationItem[]; unreadCount: number }>
    ) {
      state.items = action.payload.items;
      state.unreadCount = action.payload.unreadCount;
    },
    prependNotification(state, action: PayloadAction<NotificationItem>) {
      const exists = state.items.some((n) => n.id === action.payload.id);
      if (!exists) state.items.unshift(action.payload);
      if (!action.payload.read) state.unreadCount += 1;
    },
    markReadLocally(state, action: PayloadAction<string>) {
      const n = state.items.find((x) => x.id === action.payload);
      if (n && !n.read) {
        n.read = true;
        state.unreadCount = Math.max(0, state.unreadCount - 1);
      }
    },
    markAllReadLocally(state) {
      state.items = state.items.map((n) => ({ ...n, read: true }));
      state.unreadCount = 0;
    },
    resetNotifications(state) {
      state.items = [];
      state.unreadCount = 0;
    },
  },
});

export const {
  setNotifications,
  prependNotification,
  markReadLocally,
  markAllReadLocally,
  resetNotifications,
} = notificationSlice.actions;

export default notificationSlice.reducer;

