import mongoose, { Document } from 'mongoose';

export interface ReviewDataInterface extends Document {
  bookingId: string;
  rating: number;
  review: string;
  carId: string;
}
