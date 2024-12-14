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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProviderProfileRepository = void 0;
const ProviderProfilel_1 = __importDefault(require("../../Model/Provider/ProviderProfilel"));
const BaseRepostry_1 = require("../BaseRepostry");
class ProviderProfileRepository extends BaseRepostry_1.BaseRepository {
    constructor() {
        super(ProviderProfilel_1.default);
    }
    // *******************************check provider Address********************
    checkProviderAddress(providerId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const check = yield this.model.findOne({ providerId });
                if (check) {
                    return {
                        _id: check._id.toString(),
                        name: check.name,
                        email: check.email,
                        phone: check.phone,
                        city: check.city,
                        state: check.state,
                        pinNumber: check.pinNumber,
                        image: check.image
                    };
                }
                return null;
            }
            catch (error) {
                return null;
            }
        });
    }
    // ***********************************save profile for provider*****************************
    saveProfile(providerData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const newUser = new ProviderProfilel_1.default({
                    name: providerData.name,
                    providerId: providerData.providerId,
                    email: providerData.email,
                    city: providerData.city,
                    state: providerData.state,
                    pinNumber: providerData.pinNumber,
                    phone: providerData.phone,
                });
                const savedUser = yield newUser.save();
                return {
                    _id: savedUser._id.toString(),
                    name: savedUser.name,
                    email: savedUser.email,
                    phone: savedUser.phone,
                    city: savedUser.city,
                    state: savedUser.state,
                    pinNumber: savedUser.pinNumber,
                };
            }
            catch (error) {
                ;
                return null;
            }
        });
    }
    // *********************************edit profile******************************
    editProfile(providerData, id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const editAddress = yield this.model.findByIdAndUpdate({ _id: id }, {
                    name: providerData.name,
                    providerId: providerData.providerId,
                    email: providerData.email,
                    city: providerData.city,
                    state: providerData.state,
                    pinNumber: providerData.pinNumber,
                    phone: providerData.phone,
                }, { new: true });
                return editAddress;
            }
            catch (error) {
                return null;
            }
        });
    }
    // *********************************update Image**********************
    updateprofileImage(images, id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const profile = yield this.model.findById(id);
                if (!profile) {
                    return null;
                }
                const updatedProfile = yield this.model.findByIdAndUpdate(id, { image: images }, { new: true });
                return updatedProfile;
            }
            catch (error) {
                return null;
            }
        });
    }
}
exports.ProviderProfileRepository = ProviderProfileRepository;
