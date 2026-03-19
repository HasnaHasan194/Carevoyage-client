import { ENV } from "@/config/env";
import { io, type Socket } from "socket.io-client";

let socketSingleton: Socket | null = null;

function getSocketBaseUrl(): string {
  const rawBase = ENV.API_BASE_URL;
  const base =
    rawBase?.endsWith("/api/v1")
      ? rawBase.slice(0, -"/api/v1".length)
      : rawBase
        ? rawBase.replace(/\/$/, "")
        : "http://localhost:3000";
  return base;
}

export function getSocket(): Socket {
  if (socketSingleton) return socketSingleton;

  const baseUrl = getSocketBaseUrl();
  socketSingleton = io(baseUrl, {
    autoConnect: false,
    withCredentials: true,
    auth: {
      token: localStorage.getItem("accessToken") ?? undefined,
    },
  });

  socketSingleton.on("connect_error", () => {
    // If token rotated after refresh, updating auth before next connect
    socketSingleton!.auth = {
      token: localStorage.getItem("accessToken") ?? undefined,
    };
  });

  return socketSingleton;
}

