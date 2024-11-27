"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const userSchema = new mongoose_1.default.Schema({
    email: {
        type: String
    },
    password: {
        type: String
    },
    isBlocked: {
        type: Boolean,
        default: false
    },
    username: {
        type: String
    }
}, { timestamps: true });
const userModel = mongoose_1.default.model('userModel', userSchema);
exports.default = userModel;
