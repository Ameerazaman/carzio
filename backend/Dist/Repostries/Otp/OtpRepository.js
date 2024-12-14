"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OtpRepository = void 0;
const OtpModel_1 = require("../../Model/User/OtpModel");
const BaseRepostry_1 = require("../BaseRepostry");
class OtpRepository extends BaseRepostry_1.BaseRepository {
    constructor() {
        super(OtpModel_1.Otp);
    }
    //*******This function creates or updates an OTP for a given email*************
    createOtp(otp, email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let existUserOtp = yield this.model.findOne({ email });
                if (existUserOtp) {
                    const updatedOtp = yield this.model.findOneAndUpdate({ email }, { otp }, { new: true });
                    return updatedOtp;
                }
                else {
                    const newOtp = yield this.model.create({ email, otp });
                    return newOtp;
                }
            }
            catch (error) {
                return null;
            }
        });
    }
    // ***********************find Otp*****************************88
    findOtp(email, otp) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const existProviderOtp = yield this.model.findOne({ email });
                if (existProviderOtp && existProviderOtp.otp.toString() === otp) {
                    yield OtpModel_1.Otp.deleteOne({ email });
                    return existProviderOtp;
                }
                return null;
            }
            catch (error) {
                return null;
            }
        });
    }
    // ***************************Delete Otp***********************************
    deleteOtp(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.model.findOneAndDelete({ email });
                return result;
            }
            catch (error) {
                console.error("Error deleting OTP:", error);
                return null;
            }
        });
    }
    // **************************Update otp*********************************
    updateOtp(email, otp) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.model.findOneAndUpdate({ email: email }, { $set: { otp: otp } }, { new: true });
                return result;
            }
            catch (error) {
                console.error("Error updating OTP:", error);
                return null;
            }
        });
    }
}
exports.OtpRepository = OtpRepository;
