
import { Server } from "socket.io";
import ChatModel from "./Model/User/ChatModel";

const setupSocket = (httpServer: any) => {
  const io = new Server(httpServer, {
    cors: {
      origin: ["http://localhost:3000", "https://carzio-frondend.vercel.app"], // Ensure your client origin is allowed
      methods: ["GET", "POST"],
      credentials: true,
    },
    transports: ["websocket", "polling"],
  });

  const userSockets: Record<string, string> = {};

  io.on("connection", (socket) => {

    socket.on("register", (userId) => {
      userSockets[userId] = socket.id;

    });

    socket.on("send_message", async (data) => {
      const { senderId, receiverId, message, username } = data;
      console.log(data, "data")
      const chat = new ChatModel({ senderId, receiverId, message, username });
      const savedChat = await chat.save();
      console.log(savedChat, "chat")


      if (userSockets[receiverId]) {

        io.to(userSockets[receiverId]).emit("receive_message", data);

      } else {
        console.log("receiverId is not get")
      }
    });

    socket.on("disconnect", () => {
      for (const [userId, socketId] of Object.entries(userSockets)) {
        if (socketId === socket.id) {

          delete userSockets[userId];
          break;
        }
      }
    });
  });
}
export default setupSocket;
