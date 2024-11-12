import { adminInterface } from "../AdminInterface";

export interface adminAuthResponse {
    status: number;
    data: {
        success: boolean;
        message?: string;
        data?: adminInterface
        token?: string;
        refreshToken?: string;
        adminId?:string
    };
}