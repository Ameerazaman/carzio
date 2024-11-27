"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const couponSchema = new mongoose_1.default.Schema({
    code: {
        type: String,
    },
    discountPercentage: {
        type: Number,
    },
    minRentalAmount: {
        type: Number,
    },
    startDate: {
        type: Date,
    },
    endDate: {
        type: Date,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    userId: {
        type: [],
    },
    maxUsageLimit: {
        type: Number,
    }
}, { timestamps: true });
const Coupon = mongoose_1.default.model('Coupon', couponSchema);
exports.default = Coupon;
