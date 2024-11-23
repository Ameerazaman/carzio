import { CouponInterface } from "../CouponInterface";


export interface CouponAuthResponse {
    status: number;
    data: {
        success: boolean;
        message?: string;
        data?: CouponInterface | CouponInterface[] | undefined
        page?: number,
        totalPage?: number,
    };
}