import mongoose, { ObjectId } from "mongoose";


export interface adminInterface {
    id?: string | undefined;
    email: string; 
    password: string; 
   
}
