
import { Server } from "socket.io";
import ChatModel from "./Model/User/ChatModel";
// import ChatModel from "./Model/User/ChatModel";


// const setupSocket = (httpServer: any) => {

//   const io = new Server(httpServer, {
//     cors: {
//       origin: "http://localhost:3000",
//       methods: ["GET", "POST"],
//     },
//   });

//   // Socket.IO Setup
//   // io.on("connection", (socket) => {
//   //   console.log(`User connected: ${socket.id}`);

//   //   // Listen for messages
//   //   socket.on("send_message", async (data) => {
//   //     try {
//   //       const { senderId, recieverId, message, username } = data;
//   //       console.log(data, "data")

//   //       // Save to database
//   //       const chat = new ChatModel({ userId, providerId, message, username });
//   //       const savedChat = await chat.save();

//   //       Emit message to user and provider
//   //       io.to(userId).emit("receive_message", savedChat);
//   //       io.to(providerId).emit("receive_message", savedChat);
//   //     } catch (err) {
//   //       console.error("Error handling message:", err);
//   //     }
//   //   });
//   const userSockets: { [userId: string]: string } = {};
//   io.on("connection", (socket) => {
//     console.log(`User connected: ${socket.id}`);

//     socket.on("send_message", async (data) => {
//         try {
//             const { senderId, recieverId, message } = data;

//             // Emit to receiver using socket ID stored in userSockets
//             io.to(userSockets[recieverId]).emit("receive_message", data);
//         } catch (err) {
//             console.error("Error handling message:", err);
//         }
//     });

//     socket.on("register", (userId) => {
//         userSockets[userId] = socket.id; // Save user socket ID
//     });


//     // // Listen for room joins
//     // socket.on("join_room", (roomId) => {
//     //   socket.join(roomId);
//     //   console.log(`User ${socket.id} joined room: ${roomId}`);
//     // });

//     // Handle disconnections
//     socket.on("disconnect", () => {
//       console.log(`User disconnected: ${socket.id}`);
//     });
//   });

// }

// export default setupSocket;


const setupSocket = (httpServer: any) => {
  const io = new Server(httpServer, {
    cors: {
      origin: "http://localhost:3000", // React frontend URL
      methods: ["GET", "POST"],
    },
  });

  // Create a map to store userId and corresponding socketId
  const userSockets: Record<string, string> = {}; // Dynamic map for userId to socketId
  // Dynamic map for userId to socketId

  io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);

    // Register user and map userId to socketId
    socket.on("register", (userId) => {
      userSockets[userId] = socket.id; // Store the userId and socketId
      console.log("Registered User:", userId, "with Socket ID:", socket.id);
    });

    // Listen for sending messages
    socket.on("send_message",async (data) => {
      const { senderId, receiverId, message, username } = data;
      const chat = new ChatModel({ senderId, receiverId, message, username });
      const savedChat = await chat.save();
      console.log("Message Data:", savedChat);
      console.log("Receiver ID:", savedChat);
      console.log("User Sockets:", userSockets);

      if (userSockets[receiverId]) {

        io.to(userSockets[receiverId]).emit("receive_message", data);
        console.log(`Message sent to receiver: ${receiverId}`);
      } else {
        console.error(`Receiver socket not found: ${receiverId}`);
      }
    });

    // Handle user disconnection
    socket.on("disconnect", () => {
      for (const [userId, socketId] of Object.entries(userSockets)) {
        if (socketId === socket.id) {
          console.log(`User disconnected: ${userId}`);
          delete userSockets[userId];
          break;
        }
      }
    });
  });
}
export default setupSocket;
