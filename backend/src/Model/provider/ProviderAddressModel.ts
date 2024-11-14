
import mongoose from 'mongoose';

const providerProfileModel = new mongoose.Schema({
    providerId: {
        type: String
    },
    email: {
        type: String,

    },
    image: {
        type: String
    },
    phone: {
        type: Number, // Keep as Number

    },
    city: {
        type: String,

    },
    name: {
        type: String,

    },
    state: {
        type: String,

    },
    pinNumber: {
        type: Number, // Keep as Number

    }
},{timestamps:true});

const providerProfile = mongoose.model('providerAddress', providerProfileModel);

export default providerProfile;
