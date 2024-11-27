import { io } from "socket.io-client";
var socket = io("http://localhost:5000", {
    transports: ["websocket"], // Enforce websocket connection for better real-time experience
});
export default socket;
