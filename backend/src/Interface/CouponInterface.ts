import { Document } from "mongoose";
import { ObjectId } from "mongoose";


export interface CouponInterface {
    code: string;
    discountPercentage: number;
    minRentalAmount: number;
    startDate: string;
    endDate: string;
    isActive?: boolean;
    userId?: string[];
    id: string;
}

