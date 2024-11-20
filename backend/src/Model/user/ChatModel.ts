import mongoose, { Schema, Document } from "mongoose";

export interface IChat extends Document {
    userId: string;
    providerId: string;
    message: string;
    username: string;
    timestamp: Date;
}

const ChatSchema: Schema = new Schema(
    {
        userId: { type: String},
        providerId: { type: String},
        message: { type: String},
        username: { type: String },
        timestamp: { type: Date, default: Date.now },
    },
    { timestamps: true }
);

export default mongoose.model<IChat>("Chat", ChatSchema);
