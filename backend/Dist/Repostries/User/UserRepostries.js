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
exports.UserRepository = void 0;
const UserModel_1 = __importDefault(require("../../Model/User/UserModel"));
const BaseRepostry_1 = require("../BaseRepostry");
class UserRepository extends BaseRepostry_1.BaseRepository {
    constructor() {
        super(UserModel_1.default);
    }
    // *************************email Exist**************************
    emailExistCheck(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log(email, "email");
                const existingUser = yield this.model.find({ email: email });
                console.log(existingUser, "existingUser");
                return existingUser[0];
            }
            catch (error) {
                console.log("Error checking email existence:", error);
                return null;
            }
        });
    }
    // ***************************fetch users*************************
    fetchUsers(page, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const skip = (page - 1) * limit;
                const data = yield this.model
                    .find()
                    .sort({ createdAt: -1 })
                    .skip(skip)
                    .limit(limit)
                    .lean();
                return data;
            }
            catch (error) {
                return null;
            }
        });
    }
    // **********************edit users***********************
    editUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let check = yield this.model.findById(userId);
                if (check) {
                    return {
                        _id: check._id.toString(),
                        username: check.username,
                        email: check.email,
                        password: check.password
                    };
                }
                return null;
            }
            catch (error) {
                return null;
            }
        });
    }
    // *************************update user************************
    updateUser(userData, id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const editUser = yield this.model.findByIdAndUpdate({ _id: id }, {
                    username: userData.username,
                    email: userData.email,
                }, { new: true });
                return editUser;
            }
            catch (error) {
                return null;
            }
        });
    }
    // *********************8update status*******************
    updateStatus(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let user = yield this.model.findById(userId);
                if (!user) {
                    return null;
                }
                const updateUser = yield this.model.findByIdAndUpdate({ _id: userId }, { isBlocked: !user.isBlocked }, { new: true });
                return updateUser;
            }
            catch (error) {
                return null;
            }
        });
    }
    // ***************************count users**********************
    countUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const countUsers = yield this.model.countDocuments();
                return countUsers;
            }
            catch (error) {
                return null;
            }
        });
    }
    // //*******This function creates or updates an OTP for a given email*************
    // async createOtp(otp: string, email: string): Promise<OtpDocument | null> {
    //     try {
    //         let existUserOtp = await Otp.findOne({ email });
    //         if (existUserOtp) {
    //             const updatedOtp = await Otp.findOneAndUpdate(
    //                 { email },
    //                 { otp },
    //                 { new: true }
    //             );
    //             return updatedOtp;
    //         } else {
    //             const newOtp = await Otp.create({ email, otp });
    //             return newOtp;
    //         }
    //     } catch (error) {
    //         return null;
    //     }
    // }
    // // ***************************Delete Otp***********************************
    // async deleteOtp(email: string): Promise<OtpDocument | null> {
    //     try {
    //         const result = await Otp.findOneAndDelete({ email });
    //         return result;
    //     } catch (error) {
    //         console.error("Error deleting OTP:", error);
    //         return null;
    //     }
    // }
    // // **************************Update otp*********************************
    // async updateOtp(email: string, otp: string): Promise<OtpDocument | null> {
    //     try {
    //         const result = await Otp.findOneAndUpdate(
    //             { email: email },
    //             { $set: { otp: otp } },
    //             { new: true }
    //         );
    //         return result;
    //     } catch (error) {
    //         console.error("Error updating OTP:", error);
    //         return null;
    //     }
    // }
    //********************** */ Save a new user***************************8
    saveUser(userData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const newUser = new UserModel_1.default(userData);
                yield newUser.save();
                return newUser;
            }
            catch (error) {
                console.log("Error saving user:", error);
                return null;
            }
        });
    }
    //****************Login logic (fetch the user by email)*****************
    userLogin(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const existingUser = yield this.model.findOne({ email });
                return existingUser ? { exists: true, userData: existingUser } : { exists: false };
            }
            catch (error) {
                console.error("Error in user login:", error);
                return { exists: false };
            }
        });
    }
    // **************************change password**********************
    changePassword(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const changeUserpassword = yield this.model.findOneAndUpdate({ email: email, password: password });
                return changeUserpassword;
            }
            catch (error) {
                return null;
            }
        });
    }
    // // ***********************find Otp*****************************88
    // async findOtp(email: string, otp: string): Promise<OtpDocument | null> {
    //     try {
    //         const existProviderOtp = await Otp.findOne({ email });
    //         if (existProviderOtp && existProviderOtp.otp.toString() === otp) {
    //             await Otp.deleteOne({ email })
    //             return existProviderOtp;
    //         }
    //         return null;
    //     } catch (error) {
    //         return null;
    //     }
    // }
    //*****************check user for tooken validation**********************
    getUserById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const existingUser = yield this.model.findById(id);
                return existingUser;
            }
            catch (error) {
                return null;
            }
        });
    }
}
exports.UserRepository = UserRepository;
