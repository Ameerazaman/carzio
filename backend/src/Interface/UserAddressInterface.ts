import { Document } from "mongoose";
import { ObjectId } from "mongoose";

export interface UserAddressInterface  {
    street: string | null | undefined;
    city: string | null | undefined;
    state: string | null | undefined;
    zip: string | null | undefined;
    houseName: string | null | undefined;
    district: string | null | undefined;
    userId?: string;
}
