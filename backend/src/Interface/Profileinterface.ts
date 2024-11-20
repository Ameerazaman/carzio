import { Document } from "mongoose";
import { ObjectId } from "mongoose";

export interface ProfileInterface  {
    userId?: string;
    name: string | null | undefined;
    email: string | null | undefined;
    phone: number | null | undefined;
    adharNo: number | null | undefined;
    gender: string | null | undefined;
    
  }
  