import { Document } from "mongoose";
import { ObjectId } from "mongoose";

export interface OfferDataInterface {
    carName: string;
    offerTitle: string;
    startDate: Date;
    endDate: Date;
    discountPercentage: number;
    id: string;
    isActive:boolean 
}