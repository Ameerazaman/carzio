"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const providerSchema = new mongoose_1.default.Schema({
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
    token: {
        type: String
    },
    username: {
        type: String
    },
    image: {
        type: String
    }
}, { timestamps: true });
const providerModel = mongoose_1.default.model('providerModel', providerSchema);
exports.default = providerModel;
