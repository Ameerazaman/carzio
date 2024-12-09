"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const socket_io_1 = require("socket.io");
const ChatModel_1 = __importDefault(require("./Model/User/ChatModel"));
const setupSocket = (httpServer) => {
    const io = new socket_io_1.Server(httpServer, {
        cors: {
            origin: ["http://localhost:3000", "https://carzio-frondend.vercel.app"], // Ensure your client origin is allowed
            methods: ["GET", "POST"],
            credentials: true,
        },
        transports: ["websocket", "polling"],
    });
    const userSockets = {};
    io.on("connection", (socket) => {
        socket.on("register", (userId) => {
            userSockets[userId] = socket.id;
        });
        socket.on("send_message", (data) => __awaiter(void 0, void 0, void 0, function* () {
            const { senderId, receiverId, message, username } = data;
            console.log(data, "data");
            const chat = new ChatModel_1.default({ senderId, receiverId, message, username });
            const savedChat = yield chat.save();
            console.log(savedChat, "chat");
            if (userSockets[receiverId]) {
                io.to(userSockets[receiverId]).emit("receive_message", data);
            }
            else {
                console.log("receiverId is not get");
            }
        }));
        socket.on("disconnect", () => {
            for (const [userId, socketId] of Object.entries(userSockets)) {
                if (socketId === socket.id) {
                    delete userSockets[userId];
                    break;
                }
            }
        });
    });
};
exports.default = setupSocket;
