import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { fetchChat, fetchUsersChat } from "../../Api/Provider";
import { RootState } from "../../App/Store";
import { User } from "../Common/Navbar";
import { io } from "socket.io-client";
import { motion } from "framer-motion"; // For animations

interface Message {
  receiverId: string;
  senderId: string;
  message: string;
  timestamp: Date;
  username: string;
  userId?: string;
  providerId?: string;
}

const ChatHistory: React.FC = () => {
  const provider = useSelector((state: RootState) => state.provider.currentProvider) as User | null;
  const [message, setMessage] = useState<string>("");
  const [chatHistory, setChatHistory] = useState<Message[]>([]);
  const [users, setUsers] = useState<Message[]>([]);
  const [selectedUser, setSelectedUser] = useState<Message | null>(null);
  const [socket, setSocket] = useState<any>(null);

  const receiverId = selectedUser?.senderId || "";
  const username = selectedUser?.username || "";
  const senderId = provider?._id || "";

  useEffect(() => {
    const socket = io("http://localhost:5000");
    setSocket(socket);

    const fetchUsers = async () => {
      try {
        const result = await fetchUsersChat(senderId);
        const usersData = result.data as Message[];
        const uniqueUsers = Array.from(new Map(usersData.map((user: Message) => [user.senderId, user])).values());
        setUsers(uniqueUsers);

        if (senderId) {
          socket.emit("register", senderId);
        }
        socket.on("receive_message", (newMessage: Message) => {
          setChatHistory((prev) => [...prev, newMessage]);
        });
        return () => {
          socket.disconnect();
        };
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, [senderId]);

  const selectUser = async (user: Message) => {
    setSelectedUser(user);
    try {
      const result = await fetchChat(senderId, user.senderId);
      const data: Message[] = await result.data;
      setChatHistory(data);
    } catch (error) {
      console.error("Failed to fetch chat history:", error);
    }
  };

  const sendMessage = () => {
    if (message.trim()) {
      const chatData: Message = {
        receiverId,
        senderId,
        message,
        username,
        timestamp: new Date(),
      };

      socket.emit("send_message", chatData);

      setChatHistory((prev) => [...prev, chatData]);
      setMessage("");
    }
  };

  return (
    <div className="flex h-[80vh] bg-gray-100">
      {/* Contacts Section */}
      <div className="w-1/4 md:w-1/5 bg-white text-gray-800 p-3 border-r border-gray-300">
        <h2 className="text-sm font-semibold mb-3">Contacts</h2>
        {users.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center text-gray-500 mt-5"
          >
            No users available
          </motion.div>
        ) : (
          <ul>
            {users.map((user) => (
              <li
                key={user.userId}
                className={`p-2 text-sm rounded cursor-pointer ${selectedUser?.userId === user.userId
                  ? "bg-gray-200 font-semibold"
                  : "hover:bg-gray-100"
                  }`}
                onClick={() => selectUser(user)}
              >
                {user.username}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Chat Section */}
      <div className="flex-1 flex flex-col h-full">
        {/* Chat Header */}
        <div className="bg-gray-200 text-gray-800 p-3 border-b border-gray-300">
          <h3 className="text-sm font-semibold">{selectedUser?.username || "Select a Contact"}</h3>
        </div>

        {/* Chat History */}
        <div className="flex-1 p-3 overflow-y-auto bg-gray-50 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
          {chatHistory.length === 0 ? (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="text-center text-gray-500 mt-5"
            >
              No messages yet
            </motion.div>
          ) : (
            chatHistory
              .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
              .map((msg, index) => {
                const isSender = msg.senderId === senderId;
                return (
                  <div
                    key={index}
                    className={`mb-2 flex ${isSender ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`p-2 rounded shadow-sm text-sm max-w-xs break-words ${isSender
                          ? "bg-gray-800 text-white"
                          : "bg-gray-200 text-gray-800"
                        }`}
                    >
                      <p>{msg.message}</p>
                      <span className="text-xs text-gray-500 block mt-1">
                        {new Date(msg.timestamp).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  </div>
                );
              })
          )}
        </div>

        {/* Message Input */}
        <div className="p-3 bg-white border-t border-gray-300 flex items-center space-x-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 p-2 text-sm border border-gray-300 rounded shadow-sm focus:ring-2 focus:ring-gray-300"
          />
          <button
            onClick={sendMessage}
            className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-700 transition duration-200 shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatHistory;
