import { IChat } from "../../Model/User/ChatModel";


export interface chatAuthInterface {
    status: number;
    data: {
        success: boolean;
        message?: string;
        data?: IChat |IChat[] | undefined,
        page?: number,
        totalPage?: number,
        totalAmount?:number
    };
}