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
exports.ProfileUserRepository = void 0;
const ProfileModel_1 = __importDefault(require("../../Model/User/ProfileModel"));
const BaseRepostry_1 = require("../BaseRepostry");
class ProfileUserRepository extends BaseRepostry_1.BaseRepository {
    constructor() {
        super(ProfileModel_1.default);
    }
    // ***********************check profile******************
    checkProfile(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d, _e, _f;
            const data = yield this.model.findOne({ userId: userId });
            if (data) {
                return {
                    _id: data._id,
                    userId: (_a = data.userId) !== null && _a !== void 0 ? _a : undefined,
                    name: (_b = data.name) !== null && _b !== void 0 ? _b : undefined,
                    email: (_c = data.email) !== null && _c !== void 0 ? _c : undefined,
                    phone: (_d = data.phone) !== null && _d !== void 0 ? _d : undefined,
                    adharNo: (_e = data.adharNo) !== null && _e !== void 0 ? _e : undefined,
                    gender: (_f = data.gender) !== null && _f !== void 0 ? _f : undefined
                };
            }
            return null;
        });
    }
    // **********************88save profile********************
    saveProfile(profileData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const savedProfile = yield this.model.create(profileData);
                return savedProfile;
            }
            catch (error) {
                return null;
            }
        });
    }
    // *************************Edit profile************************
    editProfile(profileData, profileId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const updatedProfile = yield this.model.findOneAndUpdate({ _id: profileId }, profileData, { new: true });
                if (updatedProfile) {
                    return updatedProfile;
                }
                return null;
            }
            catch (error) {
                return null;
            }
        });
    }
}
exports.ProfileUserRepository = ProfileUserRepository;
