import ChatModel, { IChat } from "../../Model/User/ChatModel";
import { BaseRepository } from "../BaseRepostry";
import { IChatRepository } from "./IChatRepository";

export class ChatRepository extends BaseRepository<typeof ChatModel> implements IChatRepository {
    constructor() {
        super(ChatModel);
    }

     // *****************************fetch users chat by provider*********************
     async fetchUsersChat(providerId: string): Promise<IChat[] | null> {
        try {
            const result = await this.model.find({
                receiverId: providerId
            })
                .sort({ timestamp: -1 });
            return result as IChat[];
        } catch (error) {
            return null;
        }
    }

    // *************************fetch chat History******************************
    async fetchChatHistory(recieverId: string, senderId: string): Promise<IChat[] | null> {
        try {
            let result = await this.model.find({
                $or: [
                    {
                        receiverId: senderId, senderId: recieverId
                    },
                    {
                        receiverId: recieverId, senderId: senderId
                    },
                ],
            });
            return result as IChat[];
        } catch (error) {
            return null;
        }
    }

    // *************************fetch chat History******************************
    async fetchChatHistoryForUser(userId: string, providerId: string): Promise<IChat[] | null> {
        try {
            let result = await this.model.find({
                $or: [
                    {
                        receiverId: userId, senderId: providerId
                    },
                    {
                        receiverId: providerId, senderId: userId
                    },
                ],
            });
            return result as IChat[]
        } catch (error) {
            return null;
        }
    }
}