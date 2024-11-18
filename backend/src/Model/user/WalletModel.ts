import mongoose, { Schema, Document, ObjectId } from 'mongoose';
import { WalletInterface } from '../../Interface/WalletInterface';


const WalletSchema: Schema = new Schema({
    UserId: { type: String },
    Description: { type: String },
    TransactionType: { type: String },
    Amount: { type: Number },
    TotalAmt: { type: Number },
   
}, { timestamps: true });


const WalletModel = mongoose.model<WalletInterface>('WalletModel', WalletSchema);

export default WalletModel;