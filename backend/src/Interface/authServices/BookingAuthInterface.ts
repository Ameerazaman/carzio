import { BookingInterface } from "../BookingInterface";

export interface BookingAuthResponse {
    status: number;
    data: {
        success: boolean;
        message: string;
        data?: BookingInterface | BookingInterface[] | undefined
     
    };
}