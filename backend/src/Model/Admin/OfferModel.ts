import mongoose, { Schema, Model } from "mongoose";
import { OfferDataInterface } from "../../Interface/OfferInterface";
const offerSchema = new Schema<OfferDataInterface>({
    carName: { type: String },
    offerTitle: { type: String },
    startDate: { type: Date },
    endDate: { type: Date },
    isActive: { type: Boolean },
    discountPercentage: { type: Number },
}, { timestamps: true });

const Offer: Model<OfferDataInterface> = mongoose.model<OfferDataInterface>("Offer", offerSchema);

export default Offer;