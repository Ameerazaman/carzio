import { Document } from "mongoose";
import { ObjectId } from "mongoose";

export interface OfferDataInterface extends Document {
    carName: string;
    offerTitle: string;
    startDate: Date;
    endDate: Date;
    discountPercentage: number;
}

export interface OfferReturnData {
    carName: string;
    offerTitle: string;
    startDate: Date;
    endDate: Date;
    discountPercentage: number;
    id: string; // Represent `_id` as `id`
}