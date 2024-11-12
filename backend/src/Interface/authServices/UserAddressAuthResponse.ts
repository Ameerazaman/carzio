import { UserAddressInterface } from "../UserAddressInterface";


export interface UserAddressAuthResponse {
    status: number;
    data: {
        success: boolean;
        message?: string;
        data?: UserAddressInterface,
        userId?: string;
     
    };
}