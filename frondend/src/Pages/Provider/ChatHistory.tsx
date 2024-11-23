// import React, { useEffect, useState } from "react";
// import io from "socket.io-client";
// import { fetchChat, fetchUsersChat } from "../../Api/Provider";
// import { useSelector } from "react-redux";
// import { RootState } from "../../App/Store";
// import { User } from "../Common/Navbar";

// interface Message {
//     recieverId: string;
//     senderId: string;
//     message: string;
//     timestamp: Date;
//     username: string;
//     userId?: string; 
//     providerId?: string; 
// }

// interface SelectedUser {
//     userId: string;
//     username: string;
// }

// const ChatHistory: React.FC = () => {
//     const provider = useSelector((state: RootState) => state.provider.currentProvider) as User | null;
//     const [message, setMessage] = useState<string>(""); 
//     const [chatHistory, setChatHistory] = useState<Message[]>([]);
//     const [users, setUsers] = useState<SelectedUser[]>([]);
//     const [selectedUser, setSelectedUser] = useState<SelectedUser | null>(null);
//     const [socket, setSocket] = useState<any>(null);

//     const recieverId = selectedUser?.userId || "";
//     const username = selectedUser?.username || ""; 
//     const senderId = provider?._id || ""; 

//     useEffect(() => {
//         const newSocket = io("http://localhost:5000");
//         setSocket(newSocket);

//         const fetchUsers = async () => {
//             try {
//                 const result = await fetchUsersChat(senderId);
//                 const usersData = result.data as SelectedUser[];
//                 const uniqueUsers = Array.from(
//                     new Map(usersData.map((user: SelectedUser) => [user.userId, user])).values()
//                 );
//                 setUsers(uniqueUsers);
//             } catch (error) {
//                 console.error("Failed to fetch chat history:", error);
//             }
//         };

//         fetchUsers();

//         newSocket.on(`receive_message_${recieverId}`, (newMessage: Message) => {
//             setChatHistory((prev) => [...prev, newMessage]);
//         });

//         return () => {
//             newSocket.disconnect();
//         };
//     }, [recieverId, senderId]);

//     const sendMessage = async () => {
//         if (message.trim()) {
//             const chatData: Message = {
//                 recieverId: recieverId || "defaultSenderId",
//                 senderId: senderId || "defaultReceiverId",
//                 message,
//                 username,
//                 timestamp: new Date(),
//             };

//             if (socket) {
//                 socket.emit("send_message", chatData);
//             } else {
//                 console.error("Socket connection is not established.");
//             }

//             setChatHistory((prev) => [...prev, chatData]);
//             setMessage("");
//         } else {
//             console.log("Message is empty, cannot send.");
//         }
//     };

//     const selectUser = async (user: SelectedUser) => {
//         setSelectedUser(user);
//         const result = await fetchChat(senderId, user.userId);
//         const data: Message[] = await result.data;
//         setChatHistory(data);
//     };

//     return (
//         <div className="flex h-[80vh] bg-gray-100">
//             <div className="w-1/4 md:w-1/5 bg-white text-gray-800 p-3 border-r border-gray-300">
//                 <h2 className="text-sm font-semibold mb-3">Contacts</h2>
//                 <ul>
//                     {users.map((user) => (
//                         <li
//                             key={user.userId}
//                             className={`p-2 text-sm rounded cursor-pointer ${selectedUser?.userId === user.userId
//                                 ? "bg-gray-200 font-semibold"
//                                 : "hover:bg-gray-100"
//                                 }`}
//                             onClick={() => selectUser(user)}
//                         >
//                             {user.username}
//                         </li>
//                     ))}
//                 </ul>
//             </div>

//             <div className="flex-1 flex flex-col h-full">
//                 <div className="bg-gray-200 text-gray-800 p-3 border-b border-gray-300">
//                     <h3 className="text-sm font-semibold">
//                         {selectedUser?.username || "Select a Contact"}
//                     </h3>
//                 </div>

//                 <div className="flex-1 p-3 overflow-y-auto bg-gray-50 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
//                     {chatHistory
//                         .filter(
//                             (msg) =>
//                                 (msg.userId === recieverId && msg.providerId === senderId) ||
//                                 (msg.userId === senderId && msg.providerId === recieverId)
//                         )
//                         .map((msg, index) => (
//                             <div
//                                 key={index}
//                                 className={`mb-2 flex ${msg.userId === senderId ? "justify-end" : "justify-start"}`}
//                             >
//                                 <div
//                                     className={`p-2 rounded shadow-sm text-sm ${msg.userId === senderId
//                                         ? "bg-gray-800 text-white"
//                                         : "bg-gray-200 text-gray-800"
//                                         }`}
//                                 >
//                                     {msg.message}
//                                 </div>
//                             </div>
//                         ))}
//                 </div>

//                 <div className="p-3 bg-white border-t border-gray-300 flex items-center space-x-2">
//                     <input
//                         type="text"
//                         value={message}
//                         onChange={(e) => setMessage(e.target.value)}
//                         placeholder="Type a message..."
//                         className="flex-1 p-2 text-sm border border-gray-300 rounded shadow-sm focus:ring-2 focus:ring-gray-300"
//                     />
//                     <button
//                         onClick={sendMessage}
//                         className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-700 transition duration-200 shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
//                     >
//                         Send
//                     </button>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default ChatHistory;
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { fetchChat, fetchUsersChat } from "../../Api/Provider";
import { RootState } from "../../App/Store";
import { User } from "../Common/Navbar";
import { io, Socket } from "socket.io-client";

interface Message {
  receiverId: string;
  senderId: string;
  message: string;
  timestamp: Date;
  username: string;
  userId?: string;
  providerId?: string;
}

interface SelectedUser {
  userId: string;
  username: string;
}
const socket = io("http://localhost:3000")
  ;
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
          socket.emit("register", senderId); // Register the sender (provider) ID
        }
        socket.on("receive_message", (newMessage: Message) => {
          console.log("Message received:", newMessage);
          // if (newMessage.senderId === recieverId || newMessage.recieverId === recieverId) {
          setChatHistory((prev) => [...prev, newMessage]);
          // }
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
      console.log(result, "fetch chat histor")
      const data: Message[] = await result.data;
      setChatHistory(data);
    } catch (error) {
      console.error("Failed to fetch chat history:", error);
    }
  };

  const sendMessage = async () => {
    if (message.trim()) {
      console.log(selectedUser, "selectedUser")
      console.log(receiverId, senderId, "rciever and senderId")
      const chatData: Message = {
        receiverId: receiverId || "defaultReceiverId",
        senderId: senderId || "defaultSenderId",
        message,
        username,
        timestamp: new Date(),
      };

      // Emit socket event
      socket.emit("send_message", chatData);

      setChatHistory((prev) => [...prev, chatData]);
      setMessage("");
    } else {
      console.log("Message is empty, cannot send.");
    }
  };


  return (
    <div className="flex h-[80vh] bg-gray-100">
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

      <div className="flex-1 flex flex-col h-full">
        <div className="bg-gray-200 text-gray-800 p-3 border-b border-gray-300">
          <h3 className="text-sm font-semibold">{selectedUser?.username || "Select a Contact"}</h3>
        </div>

        <div className="flex-1 p-3 overflow-y-auto bg-gray-50 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
          {chatHistory
            .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
            .map((msg, index) => {
              const isSender = msg.senderId === senderId; // Check if the message is from the current provider
              return (
                <div
                  key={index}
                  className={`mb-2 flex ${isSender ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`p-2 rounded shadow-sm text-sm max-w-xs break-words ${isSender
                        ? "bg-gray-800 text-white" // Style for sender messages
                        : "bg-gray-200 text-gray-800" // Style for receiver messages
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
            })}
        </div>


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
