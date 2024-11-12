import mongoose, { Schema, Model } from "mongoose";
import { OfferDataInterface } from "../../Interface/OfferInterface";
const offerSchema = new Schema<OfferDataInterface>({
    carName: { type: String, required: true },
    offerTitle: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    isActive:{type:Boolean,default:true},
    discountPercentage: { type: Number, required: true },
 
});

const Offer: Model<OfferDataInterface> = mongoose.model<OfferDataInterface>("Offer", offerSchema);

export default Offer;