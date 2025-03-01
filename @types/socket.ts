import { Socket } from "socket.io-client";

export interface SocketState {
  socket: Socket | null;
  pubIp: string;
  setSocket: () => void;
  setPubIp: (ip: string) => void;
}
