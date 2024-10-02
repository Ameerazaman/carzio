import mongoose, { ObjectId } from "mongoose";


export interface ProviderInterface {
    id?: string | undefined;
    email: string; // Should always be a string
    password: string; // Should always be a string
    data?: string; // Optional field if needed
}
