import { CarDataInterface } from "../CarInterface";
import { ReviewDataInterface } from "../ReviewInterface";

export interface CarAuthResponse {
    status: number;
    data: {
        success: boolean;
        message?: string;
        data?: CarDataInterface | CarDataInterface[] | undefined,
        providerId?: string;
        page?: number,
        totalPage?: number,
        ratings?:number,
        review? :string[]

    };
}
