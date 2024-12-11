
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: {
    type: String
  },
  password: {
    type: String
  },
  isBlocked: {
    type: Boolean,
    default:false
  },
  username:{
    type:String
  }
},{timestamps:true});

const userModel = mongoose.model('userModel', userSchema);

export default userModel;
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
