import { create } from "zustand";
import { SocketState } from "../../@types/socket";
import { io } from "socket.io-client";
import { getIp } from "@/lib/getIP";
import { generateRandomAvatar, generateRandomUserName, getRandomColor, randomPositionOfUser } from "@/lib/utils";

const serverURL = import.meta.env.VITE_SERVER_URL;

export const useSocketStore = create<SocketState>((set, get) => ({
  socket: null,
  pubIp: "",
  setSocket: () => {
    if (!get().socket) {
      const newSocket = io(serverURL, { autoConnect: true });

      newSocket.on("connect", () => {
        console.log(`Socket connected`);
        getIp(get().setPubIp);
        const userAgent = navigator?.userAgent
        const fullName = generateRandomUserName()
        const image = generateRandomAvatar()
        const position = randomPositionOfUser()
        const color = getRandomColor()
        newSocket?.emit("userDetails", { userAgent, fullName, image, position, color });
      });

      set({ socket: newSocket });
    }
  },
  setPubIp: (ip) => set({ pubIp: ip }),
}));
