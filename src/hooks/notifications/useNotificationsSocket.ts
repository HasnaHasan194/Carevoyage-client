import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import { getSocket } from "@/realtime/socket";
import type { NotificationItem } from "@/types/notification.types";
import { prependNotification, resetNotifications } from "@/store/slices/notificationSlice";

type NotificationPushDTO = NotificationItem;

export function useNotificationsSocket() {
  const dispatch = useDispatch();
  const user = useSelector((s: RootState) => s.auth.user);
  const socket = useMemo(() => getSocket(), []);

  useEffect(() => {
    if (!user) {
      dispatch(resetNotifications());
      try {
        socket.off("notification:new");
        if (socket.connected) socket.disconnect();
      } catch {
        // ignore
      }
      return;
    }

    socket.auth = { token: localStorage.getItem("accessToken") ?? undefined };
    if (!socket.connected) socket.connect();

    const onNew = (payload: NotificationPushDTO) => {
      dispatch(prependNotification(payload));
    };

    socket.on("notification:new", onNew);
    return () => {
      socket.off("notification:new", onNew);
    };
  }, [dispatch, socket, user]);
}

