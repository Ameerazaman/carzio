"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const userSchema = new mongoose_1.default.Schema({
    email: {
        type: String
    },
    password: {
        type: String
    },
    isBlocked: {
        type: Boolean,
        default: false
    },
    username: {
        type: String
    }
}, { timestamps: true });
const userModel = mongoose_1.default.model('userModel', userSchema);
exports.default = userModel;
// import mongoose, { Document, Types } from 'mongoose';
// import { Model } from 'mongoose';
// import { Schema } from 'mongoose';
// export interface UserDocument extends Document {
//   _id: Types.ObjectId; // Explicitly define the _id type
//   email?: string;
//   password?: string;
//   username?: string;
//   isBlocked?: boolean;
// }
// Define the schema
// const userSchema = new Schema({
//     email: {
//         type: String,
//         required: false,
//     },
//     password: {
//         type: String,
//         required: false,
//     },
//     username: {
//         type: String,
//         required: false,
//     },
//     isBlocked: {
//         type: Boolean,
//         default: false,
//     },
// }, { timestamps: true });
// // Create the model
// const userModel: Model<UserDocument> = mongoose.model<UserDocument>('User', userSchema);
// export default userModel;
