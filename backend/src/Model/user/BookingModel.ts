
import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
    IssueDate: { type: String },
    ReturnDate: { type: String },
    Amount: { type: Number},
    Payment: { type: String},
    AdhaarNo: { type: String},
    UserId: { type: String},
    CarsId: { type: String},
    UserAddressId: { type: String },
    Coupon: { type: String},
    PickUpTime: { type: String},
    TotalOffersDeduction: { type: Number},
    CouponDeduction: { type: Number},
    AmtOnDays: { type: Number },
    status: { type: String },
});

const BookingModel = mongoose.model('BookingModel', bookingSchema);

export default BookingModel;