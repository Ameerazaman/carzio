"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const adminSchema = new mongoose_1.default.Schema({
    email: {
        type: String
    },
    password: {
        type: String
    }
}, { timestamps: true });
const adminModel = mongoose_1.default.model('adminModel', adminSchema);
exports.default = adminModel;
