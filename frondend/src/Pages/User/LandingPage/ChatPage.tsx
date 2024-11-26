
import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { FaPaperPlane } from 'react-icons/fa'; // Import icons
import { fetchChat } from '../../../Api/User';

interface Message {
    senderId: string;
    receiverId: string;
    message: string;
    timestamp: Date;
    username: string;
}

interface ChatProps {
    senderId: string;
    receiverId: string;
    username: string;
}

const ChatPage: React.FC<ChatProps> = ({ senderId, receiverId, username }) => {
    const [message, setMessage] = useState<string>("");
    const [chatHistory, setChatHistory] = useState<Message[]>([]);
    const [socket, setSocket] = useState<any>(null);
    const chatEndRef = useRef<HTMLDivElement>(null); // Reference to the chat end

    useEffect(() => {
        // Initialize socket connection once
        const socket = io("http://localhost:5000");

        // Fetch chat history
        const fetchChatHistory = async () => {
            const response = await fetchChat(senderId, receiverId);
            const data: Message[] = await response.data;
            setChatHistory(data.reverse()); // Reverse to show latest at the bottom
        };

        fetchChatHistory();

        setSocket(socket);
        if (senderId) {
            socket.emit("register", senderId); // Register the sender (provider) ID
        }
        // Listen for new messages
        socket.on("receive_message", (newMessage: Message) => {
            if (newMessage.senderId === receiverId || newMessage.receiverId === receiverId) {
                setChatHistory((prev) => [...prev, newMessage]);
            }
        });

        // Clean up on unmount
        return () => {
            socket.off("receive_message");
            socket.disconnect();
        };
    }, [senderId, receiverId]);

    useEffect(() => {
        // Scroll to the bottom when new messages are added
        if (chatEndRef.current) {
            chatEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [chatHistory]); // Trigger when the chatHistory changes

    const sendMessage = () => {
        if (message.trim() && socket) {
            const chatData = {
                senderId: senderId,
                receiverId,
                message,
                username,
                timestamp: new Date(),
            };
            socket.emit("send_message", chatData);
            setChatHistory((prev) => [chatData, ...prev]); // Add the message at the top
            setMessage("");
        }
    };

    return (
        <div className="chat-container max-w-2xl mx-auto mt-10 p-6 bg-gradient-to-t from-grey-100 via-indigo-100 to-purple-100 rounded-lg shadow-xl">
            <div className="chat-history overflow-y-auto h-96 mb-6 p-4 space-y-4 bg-cover bg-center rounded-lg shadow-md">
                {chatHistory.map((chat, index) => (
                    <div
                        key={index}
                        className={`chat-bubble py-2 px-3 rounded-lg text-sm  shadow-md leading-tight ${chat.senderId === senderId
                            ? "bg-gray-600 text-white justify-end" // Sender's message: dark grey background, white text
                            : "bg-gray-300 text-gray-800 justify-start" // Receiver's message: light grey background, dark text
                            }`}
                        style={{
                            alignSelf: chat.senderId === senderId ? "flex-end" : "flex-start", // Align messages appropriately
                            marginBottom: "0.5rem", // Add spacing between each message
                        }}
                    >
                        <p className="mb-1">{chat.message}</p>
                        <span className="text-xs text-gray-500">
                            {new Date(chat.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                    </div>
                ))}
                {/* Scroll target at the bottom */}
                <div ref={chatEndRef}></div>
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
