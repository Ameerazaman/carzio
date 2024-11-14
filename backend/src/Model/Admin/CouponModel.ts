import mongoose from 'mongoose';

const couponSchema = new mongoose.Schema({
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
},{timestamps:true});

const Coupon = mongoose.model('Coupon', couponSchema);

export default Coupon;

