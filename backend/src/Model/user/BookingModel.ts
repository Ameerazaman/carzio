import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
    IssueDate: { type: String, required: true },
    ReturnDate: { type: String, required: true },
    Amount: { type: Number, required: true },
    Payment: { type: String, required: true },
    AdhaarNo: { type: String, required: true },
    UserId: { type: String, required: true },
    CarsId: { type: String, required: true },
    UserAddressId: { type: String, required: true },
    Coupon: { type: String },
    PickUpTime: { type: String },
    TotalOffersDeduction: { type: Number },
    CouponDeduction: { type: Number },
    AmtOnDays: { type: Number, required: true },
    rentDays: { type: Number, required: true },
    total_Amt: { type: Number, required: true },
    offerAmt: { type: Number },
    providerId: { type: String, required: true },
    status: { type: String, required: true },
},{timestamps:true});

const BookingModel = mongoose.model('BookingModel', bookingSchema);

export default BookingModel;
