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
exports.ProviderRepository = void 0;
const ProviderModel_1 = __importDefault(require("../../Model/Provider/ProviderModel"));
const BaseRepostry_1 = require("../BaseRepostry");
class ProviderRepository extends BaseRepostry_1.BaseRepository {
    constructor() {
        super(ProviderModel_1.default);
    }
    //*******************check provider for tooken validation*************
    getProviderById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const existingProvider = yield this.model.findById(id);
                return existingProvider;
            }
            catch (error) {
                return null;
            }
        });
    }
    //****This function checks if an email exists in the provider database********
    emailExistCheck(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const existingUser = yield this.model.findOne({ email });
                return existingUser;
            }
            catch (error) {
                return null;
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
    // ***************************fetch providers******************
    fetchProviders(page, limit) {
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
    // **********************edit provider*********************
    editProvider(providerId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let check = yield this.model.findById(providerId);
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
    // ***************************update provider************************
    updateProvider(providerData, id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const editProvider = yield this.model.findByIdAndUpdate({ _id: id }, {
                    username: providerData.username,
                    email: providerData.email,
                }, { new: true });
                return editProvider;
            }
            catch (error) {
                return null;
            }
        });
    }
    // *****************************update ststus provider**************
    updateStatusprovider(providerId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let provider = yield this.model.findById(providerId);
                if (!provider) {
                    return null;
                }
                const updateProvider = yield this.model.findByIdAndUpdate(providerId, { isBlocked: !provider.isBlocked }, { new: true });
                return updateProvider;
            }
            catch (error) {
                return null;
            }
        });
    }
    //**********************/ Count Providers*******************
    countProviders() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const countProviders = yield this.model.countDocuments();
                return countProviders;
            }
            catch (error) {
                return null;
            }
        });
    }
    // *************************Save provider***************************
    saveProvider(providerData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log(providerData, "providerdata");
                const newUser = new ProviderModel_1.default(providerData);
                yield newUser.save();
                return newUser;
            }
            catch (error) {
                return null;
            }
        });
    }
}
exports.ProviderRepository = ProviderRepository;
