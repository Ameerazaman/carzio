import mongoose, { ObjectId } from "mongoose";


export interface ProviderInterface {
    id?: string | undefined;
    email: string; // Should always be a string
    password: string; // Should always be a string
    data?: string;
    username?:string;
    isBlocked?:boolean ;
    image?:String// Optional field if needed
}





export interface ProviderAdressInterface {
    providerId?: string; // Use string to represent the _id
    name: string; // Required
    email: string; // Required
    password?: string; // Required
    phone: number | null; // Change to number
    city: string; // Required
    state: string; // Required
    pinNumber: number | null; // Change to number
    isBlocked?: boolean; 
    image?:string// Optional
}