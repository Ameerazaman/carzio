import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import { FaPaperPlane } from 'react-icons/fa'; // Import icons
import { fetchChat } from '../../../Api/User';

interface Message {
    userId: string;
    providerId: string;
    message: string;
    timestamp: Date;
    username: string
}

interface ChatProps {
    userId: string;
    providerId: string;
    username: string
}

const ChatPage: React.FC<ChatProps> = ({ userId, providerId, username }) => {
    const [message, setMessage] = useState<string>("");
    const [chatHistory, setChatHistory] = useState<Message[]>([]);

    useEffect(() => {
        // Fetch chat history (optional, add a backend route for this)
        const fetchChatHistory = async () => {
            const response = await fetchChat(userId, providerId);
            console.log(response, "response chat history")
            const data: Message[] = await response.data
            setChatHistory(data);
        };

        fetchChatHistory();

        // Listen for new messages
        const socket = io("http://localhost:5000");
        socket.on(`receive_message_${userId}`, (newMessage: Message) => {
            setChatHistory((prev) => [...prev, newMessage]);
        });

        return () => {
            socket.off(`receive_message_${userId}`);
        };
    }, [userId, providerId]);

    const sendMessage = () => {
        if (message.trim()) {
            const chatData = {
                userId: userId,
                providerId,
                message,
                username,
                timestamp: new Date(),
            };
            console.log(chatData, "chat data")
            const socket = io("http://localhost:5000");
            socket.emit("send_message", chatData);
            setChatHistory((prev) => [...prev, chatData]);
            setMessage("");
        }
    };

    return (
        <div className="chat-container max-w-2xl mx-auto mt-10 p-6 bg-gradient-to-t from-grey-100 via-indigo-100 to-purple-100 rounded-lg shadow-xl">
            <div
                className="chat-history overflow-y-auto h-96 mb-6 p-4 space-y-4 bg-cover bg-center rounded-lg shadow-md"

            >
                {chatHistory.map((chat, index) => (
                    <div
                        key={index}
                        className={`chat-bubble p-3 rounded-lg max-w-xl text-sm ${chat.userId === userId
                            ? "bg-blue-500 text-white self-end"
                            : "bg-gray-200 text-gray-800 self-start"
                            }`}
                    >
                        <p>{chat.message}</p>
                        <span className="text-xs text-gray-500">
                            {new Date(chat.timestamp).toLocaleTimeString()}
                        </span>
                    </div>
                ))}

            </div>

            <div className="chat-input flex items-center space-x-4 pt-4">
                <input
                    type="text"
                    className="flex-1 p-3 text-base border rounded-full shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-300"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type a message..."
                />
                <button
                    onClick={sendMessage}
                    className="p-4 text-base rounded-full bg-blue-500 text-white hover:bg-blue-600 transition-colors"
                >
                    <FaPaperPlane size={20} />
                </button>
            </div>
        </div>
    );
};

export default ChatPage;
