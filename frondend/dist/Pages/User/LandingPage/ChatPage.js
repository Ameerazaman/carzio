var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { FaPaperPlane } from 'react-icons/fa'; // Import icons
import { fetchChat } from '../../../Api/User';
var ChatPage = function (_a) {
    var senderId = _a.senderId, receiverId = _a.receiverId, username = _a.username;
    var _b = useState(""), message = _b[0], setMessage = _b[1];
    var _c = useState([]), chatHistory = _c[0], setChatHistory = _c[1];
    var _d = useState(null), socket = _d[0], setSocket = _d[1];
    var chatEndRef = useRef(null); // Reference to the chat end
    useEffect(function () {
        // Initialize socket connection once
        var socket = io("http://localhost:5000");
        // Fetch chat history
        var fetchChatHistory = function () { return __awaiter(void 0, void 0, void 0, function () {
            var response, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, fetchChat(senderId, receiverId)];
                    case 1:
                        response = _a.sent();
                        return [4 /*yield*/, response.data];
                    case 2:
                        data = _a.sent();
                        setChatHistory(data.reverse()); // Reverse to show latest at the bottom
                        return [2 /*return*/];
                }
            });
        }); };
        fetchChatHistory();
        setSocket(socket);
        if (senderId) {
            socket.emit("register", senderId); // Register the sender (provider) ID
        }
        // Listen for new messages
        socket.on("receive_message", function (newMessage) {
            if (newMessage.senderId === receiverId || newMessage.receiverId === receiverId) {
                setChatHistory(function (prev) { return __spreadArray(__spreadArray([], prev, true), [newMessage], false); });
            }
        });
        // Clean up on unmount
        return function () {
            socket.off("receive_message");
            socket.disconnect();
        };
    }, [senderId, receiverId]);
    useEffect(function () {
        // Scroll to the bottom when new messages are added
        if (chatEndRef.current) {
            chatEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [chatHistory]); // Trigger when the chatHistory changes
    var sendMessage = function () {
        if (message.trim() && socket) {
            var chatData_1 = {
                senderId: senderId,
                receiverId: receiverId,
                message: message,
                username: username,
                timestamp: new Date(),
            };
            socket.emit("send_message", chatData_1);
            setChatHistory(function (prev) { return __spreadArray([chatData_1], prev, true); }); // Add the message at the top
            setMessage("");
        }
    };
    return (_jsxs("div", { className: "chat-container max-w-2xl mx-auto mt-10 p-6 bg-gradient-to-t from-grey-100 via-indigo-100 to-purple-100 rounded-lg shadow-xl", children: [_jsxs("div", { className: "chat-history overflow-y-auto h-96 mb-6 p-4 space-y-4 bg-cover bg-center rounded-lg shadow-md", children: [chatHistory.map(function (chat, index) { return (_jsxs("div", { className: "chat-bubble py-2 px-3 rounded-lg text-sm  shadow-md leading-tight ".concat(chat.senderId === senderId
                            ? "bg-gray-600 text-white justify-end" // Sender's message: dark grey background, white text
                            : "bg-gray-300 text-gray-800 justify-start" // Receiver's message: light grey background, dark text
                        ), style: {
                            alignSelf: chat.senderId === senderId ? "flex-end" : "flex-start", // Align messages appropriately
                            marginBottom: "0.5rem", // Add spacing between each message
                        }, children: [_jsx("p", { className: "mb-1", children: chat.message }), _jsx("span", { className: "text-xs text-gray-500", children: new Date(chat.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) })] }, index)); }), _jsx("div", { ref: chatEndRef })] }), _jsxs("div", { className: "chat-input flex items-center space-x-4 pt-4", children: [_jsx("input", { type: "text", className: "flex-1 p-3 text-base border rounded-full shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-300", value: message, onChange: function (e) { return setMessage(e.target.value); }, placeholder: "Type a message..." }), _jsx("button", { onClick: sendMessage, className: "p-4 text-base rounded-full bg-blue-500 text-white hover:bg-blue-600 transition-colors", children: _jsx(FaPaperPlane, { size: 20 }) })] })] }));
};
export default ChatPage;
