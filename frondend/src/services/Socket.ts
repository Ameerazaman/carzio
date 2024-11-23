import { io, Socket } from "socket.io-client";

const socket: Socket = io("http://localhost:5000", {
  transports: ["websocket"], // Enforce websocket connection for better real-time experience
});

export default socket;
