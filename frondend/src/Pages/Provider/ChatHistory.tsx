import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import { fetchChat, fetchUsersChat } from "../../Api/Provider";
import { useSelector } from "react-redux";
import { RootState } from "../../App/Store";
import { User } from "../Common/Navbar";

interface Message {
    userId: string;
    providerId: string;
    message: string;
    timestamp: Date;
    username: string;
}

interface SelectedUser {
    username: string;
    userId: string;
    providerId: string;
    timestamp: string;
    message: string;
    _id: string;
}

const ChatHistory: React.FC = () => {
    const provider = useSelector((state: RootState) => state.provider.currentProvider) as User | null;
    const [message, setMessage] = useState<string>("");
    const [chatHistory, setChatHistory] = useState<Message[]>([]);
    const [users, setUsers] = useState<SelectedUser[]>([]);
    const [selectedUser, setSelectedUser] = useState<SelectedUser | null>(null);
    const [socket, setSocket] = useState<any>(null);

    // Default to empty strings or other valid values when selectedUser is null
    const userId = selectedUser?.userId || ""; // Default to an empty string if undefined
    const username = selectedUser?.username || ""; // Default to an empty string if undefined
    const providerId = provider?._id || ""; // Dynamically update receiver based on selected user.

    useEffect(() => {
        // Initialize socket connection
        const newSocket = io("http://localhost:5000");
        setSocket(newSocket);

        // Fetch users chat history
        const fetchUsers = async () => {
            try {
                const result = await fetchUsersChat(providerId);
                const usersData = result.data as SelectedUser[];  // Type assertion

                const uniqueUsers = Array.from(
                    new Map(usersData.map((user: SelectedUser) => [user.userId, user])).values()
                );
                setUsers(uniqueUsers);
            } catch (error) {
                console.error("Failed to fetch chat history:", error);
            }
        };

        fetchUsers();

        // Listen for incoming messages
        newSocket.on(`receive_message_${userId}`, (newMessage: Message) => {
            setChatHistory((prev) => [...prev, newMessage]);
        });

        return () => {
            newSocket.disconnect();
        };
    }, [userId, providerId]);


    const sendMessage = async () => {

        if (message.trim()) {
            // Ensure senderId and receiverId are valid
            const chatData: Message = {
                userId: userId || "defaultSenderId",  // Fallback if userId is undefined
                providerId: providerId || "defaultReceiverId", // Fallback if selectedUser or receiverId is undefined
                message,
                username,
                timestamp: new Date(),
            };
            // Debugging output

            if (socket) {
                socket.emit("send_message", chatData);
            } else {
                console.error("Socket connection is not established.");
            }
         
            setChatHistory((prev) => [...prev, chatData]);
            setMessage("");
        } else {
            console.log("Message is empty, cannot send.");
        }
    };

    const selectUser = async (user: SelectedUser) => {
        setSelectedUser(user);
        console.log("Selected user:", user);
        console.log("Provider ID:", providerId, "User ID:", user.userId);
        const result = await fetchChat(providerId, user.userId);
        const data: Message[] = await result.data
        setChatHistory(data);
    };
    
    return (
        <div className="flex h-[80vh] bg-gray-100">
            {/* Sidebar for Contacts */}
            <div className="w-1/4 md:w-1/5 bg-white text-gray-800 p-3 border-r border-gray-300">
                <h2 className="text-sm font-semibold mb-3">Contacts</h2>
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
            </div>

            {/* Chat Space */}
            <div className="flex-1 flex flex-col h-full">
                {/* Chat Header */}
                <div className="bg-gray-200 text-gray-800 p-3 border-b border-gray-300">
                    <h3 className="text-sm font-semibold">
                        {selectedUser?.username || "Select a Contact"}
                    </h3>
                </div>

                {/* Chat Messages */}
                <div className="flex-1 p-3 overflow-y-auto bg-gray-50 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">

                    {chatHistory
                        .filter(
                            (msg) =>
                                (msg.userId === userId && msg.providerId === providerId) ||
                                (msg.userId === providerId && msg.providerId === userId)
                        )
                        .map((msg, index) => (
                            <div
                                key={index}
                                className={`mb-2 flex ${msg.userId === userId ? "justify-end" : "justify-start"
                                    }`}
                            >
                                <p
                                    className={`p-2 rounded shadow-sm text-sm ${msg.userId === userId
                                        ? "bg-gray-800 text-white"
                                        : "bg-gray-200 text-gray-800"
                                        }`}
                                >
                                    {msg.message}
                                </p>
                            </div>
                        ))}
                </div>

                {/* Chat Input */}
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
