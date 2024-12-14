import { IChat } from "../../Model/User/ChatModel";

export interface IChatRepository {
   
    fetchUsersChat(providerId: string): Promise<IChat[] | null>,
   
    fetchChatHistory(recieverId: string, senderId: string): Promise<IChat[] | null>,

    fetchChatHistoryForUser(userId: string, providerId: string): Promise<IChat[] | null>

}