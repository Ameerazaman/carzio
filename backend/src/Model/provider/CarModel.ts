const mongoose = require('mongoose');

const carSchema = new mongoose.Schema({
    car_name: {
        type: String,
    },
    model: {
        type: String,

    },
    rentalPrice: {
        type: Number,

    },
    engineType: {
        type: String,
    },
    fuelType: {
        type: String,

    },
    color: {
        type: String,

    },
    images: {
        type: [String],

    },
    rcNumber: {
        type: String,

    },
    rcExpiry: {
        type: Date,

    },
    insurancePolicyNumber: {
        type: String,

    },
    insuranceExpiry: {
        type: Date,

    },
    pollutionCertificateNumber: {
        type: String,

    },
    pollutionExpiry: {
        type: Date,

    },
    isBlocked: {
        type: Boolean,
        default: false
    },
    providerId:{
        type:String
    }
});

const CarModel = mongoose.model('CarModel', carSchema);

export default CarModel;
