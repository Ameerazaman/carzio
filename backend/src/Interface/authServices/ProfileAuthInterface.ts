
import { ProfileInterface } from "../Profileinterface";

export interface ProfileAuthResponse {
    status: number;
    data: {
        success: boolean;
        message?: string;
        data?: ProfileInterface,
        userId?: string;
     
    };
}