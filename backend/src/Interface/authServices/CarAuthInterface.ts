import { CarDataInterface } from "../CarInterface";

export interface CarAuthResponse {
    status: number;
    data: {
        success: boolean;
        message: string;
        data?: CarDataInterface | CarDataInterface[] |undefined,
        providerId?: string;
     
    };
}