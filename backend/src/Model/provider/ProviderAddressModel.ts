
import mongoose from 'mongoose';

const providerAddressModel = new mongoose.Schema({
    providerId:{
        type:String
    },
    email: {
        type: String,
        
    },
    // password: {
    //     type: String,
    //     required: true
    // },
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
});

const providerAddress = mongoose.model('providerAddress', providerAddressModel);

export default providerAddress;
