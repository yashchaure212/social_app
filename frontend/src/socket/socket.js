import { io } from "socket.io-client";

let socket = null;

export const connectSocket = (userId) => {
  if (!socket) {
    socket = io(import.meta.env.VITE_API_URL.replace("/api", ""), {
      query: {
        userId,
      },
      withCredentials: true,
    });
  }

  return socket;
};

export const getSocket = () => socket;