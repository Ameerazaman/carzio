"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const profileSchema = new mongoose_1.default.Schema({
    userId: {
        type: String
    },
    name: {
        type: String
    },
    email: {
        type: String
    },
    phone: {
        type: Number
    },
    adharNo: {
        type: Number
    },
    gender: {
        type: String
    },
}, { timestamps: true });
const UserProfileModel = mongoose_1.default.model('UserProfileModel', profileSchema);
exports.default = UserProfileModel;
