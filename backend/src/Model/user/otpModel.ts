import mongoose, { Schema, Document } from 'mongoose';

export interface OtpDocument extends Document {
  email: string;
  otp: Number;
  createdAt: Date;
}

const otpSchema = new Schema<OtpDocument>({
  email: { type: String, required: true },
  otp: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now, index: { expires: '5m' } }, // TTL index for 5 minutes
});

export const Otp = mongoose.model<OtpDocument>('Otp', otpSchema);
