
import { Server } from "socket.io";
import ChatModel from "./Model/User/ChatModel";


const setupSocket = (httpServer: any) => {

  const io = new Server(httpServer, {
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    // Listen for messages
    socket.on("send_message", async (data) => {
      console.log(data, "data in chat")
      const { userId, providerId, message, username } = data;

      // Save to database
      const chat = new ChatModel({ userId, providerId, message, username });
      const result = await chat.save();
      console.log(result, "afters ave chat")
      // Emit to receiver
      io.emit(`receive_message_${providerId}`, chat);
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });

  return io;
};

export default setupSocket;
