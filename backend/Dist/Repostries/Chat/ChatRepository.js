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
exports.ChatRepository = void 0;
const ChatModel_1 = __importDefault(require("../../Model/User/ChatModel"));
const BaseRepostry_1 = require("../BaseRepostry");
class ChatRepository extends BaseRepostry_1.BaseRepository {
    constructor() {
        super(ChatModel_1.default);
    }
    // *****************************fetch users chat by provider*********************
    fetchUsersChat(providerId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.model.find({
                    receiverId: providerId
                })
                    .sort({ timestamp: -1 });
                return result;
            }
            catch (error) {
                return null;
            }
        });
    }
    // *************************fetch chat History******************************
    fetchChatHistory(recieverId, senderId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let result = yield this.model.find({
                    $or: [
                        {
                            receiverId: senderId, senderId: recieverId
                        },
                        {
                            receiverId: recieverId, senderId: senderId
                        },
                    ],
                });
                return result;
            }
            catch (error) {
                return null;
            }
        });
    }
    // *************************fetch chat History******************************
    fetchChatHistoryForUser(userId, providerId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let result = yield this.model.find({
                    $or: [
                        {
                            receiverId: userId, senderId: providerId
                        },
                        {
                            receiverId: providerId, senderId: userId
                        },
                    ],
                });
                return result;
            }
            catch (error) {
                return null;
            }
        });
    }
}
exports.ChatRepository = ChatRepository;
