"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const bookingSchema = new mongoose_1.default.Schema({
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
}, { timestamps: true });
const BookingModel = mongoose_1.default.model('BookingModel', bookingSchema);
exports.default = BookingModel;
