import { useEffect } from "react";
import { useSocketStore } from "@/store/useSocketStore";

export const useSocket = () => {
  const { socket, setSocket } = useSocketStore();

  useEffect(() => {
    if (!socket) {
      setSocket();
    }

    return () => {
      if (socket?.connected) {
        socket.disconnect();
      }
    };
  }, [socket, setSocket]);

  return { socket };
};
