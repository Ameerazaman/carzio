import mongoose, { Schema, Document, ObjectId } from 'mongoose';
export interface WalletInterface  extends Document {
    
    _id: string;
    UserId: string | null;
    Description: string | null;
    TransactionType: string | null;
    Amount: number | null;
    TotalAmt:number |null;
 
    
  }