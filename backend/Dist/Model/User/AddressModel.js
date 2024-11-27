"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const addressSchema = new mongoose_1.default.Schema({
    userId: {
        type: String
    },
    houseName: {
        type: String
    },
    street: {
        type: String
    },
    city: {
        type: String
    },
    state: {
        type: String
    },
    district: {
        type: String
    },
    zip: {
        type: String
    }
}, { timestamps: true });
const UserAddressModel = mongoose_1.default.model('UserAddressModel', addressSchema);
exports.default = UserAddressModel;
