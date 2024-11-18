import mongoose, { ObjectId } from "mongoose";


export interface UserInterface {
    id?: string | undefined;
    email: string; 
    password: string;
    data?: string;
    username?:string ;
    isBlocked?:boolean
}
