"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const providerProfileModel = new mongoose_1.default.Schema({
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
}, { timestamps: true });
const providerProfile = mongoose_1.default.model('providerAddress', providerProfileModel);
exports.default = providerProfile;
