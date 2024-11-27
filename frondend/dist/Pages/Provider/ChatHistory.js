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
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { fetchChat, fetchUsersChat } from "../../Api/Provider";
import { io } from "socket.io-client";
import { motion } from "framer-motion"; // For animations
var ChatHistory = function () {
    var provider = useSelector(function (state) { return state.provider.currentProvider; });
    var _a = useState(""), message = _a[0], setMessage = _a[1];
    var _b = useState([]), chatHistory = _b[0], setChatHistory = _b[1];
    var _c = useState([]), users = _c[0], setUsers = _c[1];
    var _d = useState(null), selectedUser = _d[0], setSelectedUser = _d[1];
    var _e = useState(null), socket = _e[0], setSocket = _e[1];
    var receiverId = (selectedUser === null || selectedUser === void 0 ? void 0 : selectedUser.senderId) || "";
    var username = (selectedUser === null || selectedUser === void 0 ? void 0 : selectedUser.username) || "";
    var senderId = (provider === null || provider === void 0 ? void 0 : provider._id) || "";
    useEffect(function () {
        var socket = io("http://localhost:5000");
        setSocket(socket);
        var fetchUsers = function () { return __awaiter(void 0, void 0, void 0, function () {
            var result, usersData, uniqueUsers, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, fetchUsersChat(senderId)];
                    case 1:
                        result = _a.sent();
                        usersData = result.data;
                        uniqueUsers = Array.from(new Map(usersData.map(function (user) { return [user.senderId, user]; })).values());
                        setUsers(uniqueUsers);
                        if (senderId) {
                            socket.emit("register", senderId);
                        }
                        socket.on("receive_message", function (newMessage) {
                            setChatHistory(function (prev) { return __spreadArray(__spreadArray([], prev, true), [newMessage], false); });
                        });
                        return [2 /*return*/, function () {
                                socket.disconnect();
                            }];
                    case 2:
                        error_1 = _a.sent();
                        console.error("Error fetching users:", error_1);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); };
        fetchUsers();
    }, [senderId]);
    var selectUser = function (user) { return __awaiter(void 0, void 0, void 0, function () {
        var result, data, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setSelectedUser(user);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, , 5]);
                    return [4 /*yield*/, fetchChat(senderId, user.senderId)];
                case 2:
                    result = _a.sent();
                    return [4 /*yield*/, result.data];
                case 3:
                    data = _a.sent();
                    setChatHistory(data);
                    return [3 /*break*/, 5];
                case 4:
                    error_2 = _a.sent();
                    console.error("Failed to fetch chat history:", error_2);
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    var sendMessage = function () {
        if (message.trim()) {
            var chatData_1 = {
                receiverId: receiverId,
                senderId: senderId,
                message: message,
                username: username,
                timestamp: new Date(),
            };
            socket.emit("send_message", chatData_1);
            setChatHistory(function (prev) { return __spreadArray(__spreadArray([], prev, true), [chatData_1], false); });
            setMessage("");
        }
    };
    return (_jsxs("div", { className: "flex h-[80vh] bg-gray-100", children: [_jsxs("div", { className: "w-1/4 md:w-1/5 bg-white text-gray-800 p-3 border-r border-gray-300", children: [_jsx("h2", { className: "text-sm font-semibold mb-3", children: "Contacts" }), users.length === 0 ? (_jsx(motion.div, { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { duration: 0.5 }, className: "text-center text-gray-500 mt-5", children: "No users available" })) : (_jsx("ul", { children: users.map(function (user) { return (_jsx("li", { className: "p-2 text-sm rounded cursor-pointer ".concat((selectedUser === null || selectedUser === void 0 ? void 0 : selectedUser.userId) === user.userId
                                ? "bg-gray-200 font-semibold"
                                : "hover:bg-gray-100"), onClick: function () { return selectUser(user); }, children: user.username }, user.userId)); }) }))] }), _jsxs("div", { className: "flex-1 flex flex-col h-full", children: [_jsx("div", { className: "bg-gray-200 text-gray-800 p-3 border-b border-gray-300", children: _jsx("h3", { className: "text-sm font-semibold", children: (selectedUser === null || selectedUser === void 0 ? void 0 : selectedUser.username) || "Select a Contact" }) }), _jsx("div", { className: "flex-1 p-3 overflow-y-auto bg-gray-50 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100", children: chatHistory.length === 0 ? (_jsx(motion.div, { initial: { scale: 0.8, opacity: 0 }, animate: { scale: 1, opacity: 1 }, transition: { duration: 0.5 }, className: "text-center text-gray-500 mt-5", children: "No messages yet" })) : (chatHistory
                            .sort(function (a, b) { return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(); })
                            .map(function (msg, index) {
                            var isSender = msg.senderId === senderId;
                            return (_jsx("div", { className: "mb-2 flex ".concat(isSender ? "justify-end" : "justify-start"), children: _jsxs("div", { className: "p-2 rounded shadow-sm text-sm max-w-xs break-words ".concat(isSender
                                        ? "bg-gray-800 text-white"
                                        : "bg-gray-200 text-gray-800"), children: [_jsx("p", { children: msg.message }), _jsx("span", { className: "text-xs text-gray-500 block mt-1", children: new Date(msg.timestamp).toLocaleTimeString([], {
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            }) })] }) }, index));
                        })) }), _jsxs("div", { className: "p-3 bg-white border-t border-gray-300 flex items-center space-x-2", children: [_jsx("input", { type: "text", value: message, onChange: function (e) { return setMessage(e.target.value); }, placeholder: "Type a message...", className: "flex-1 p-2 text-sm border border-gray-300 rounded shadow-sm focus:ring-2 focus:ring-gray-300" }), _jsx("button", { onClick: sendMessage, className: "bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-700 transition duration-200 shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-gray-400", children: "Send" })] })] })] }));
};
export default ChatHistory;
