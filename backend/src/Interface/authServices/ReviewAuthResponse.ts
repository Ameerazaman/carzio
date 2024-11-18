import { ReviewDataInterface } from "../ReviewInterface";


export interface ReviewAuthInterface {
    status: number;
    data: {
        success: boolean;
        message?: string;
        data?: ReviewDataInterface
        page?: number,
        totalPage?: number,
        totalAmount?:number
    };
}