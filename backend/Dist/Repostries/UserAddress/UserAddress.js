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
exports.UserAddressRepository = void 0;
const AddressModel_1 = __importDefault(require("../../Model/User/AddressModel"));
const BaseRepostry_1 = require("../BaseRepostry");
class UserAddressRepository extends BaseRepostry_1.BaseRepository {
    constructor() {
        super(AddressModel_1.default);
    }
    //******************** */ check Address**************************
    checkAddress(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const checkAddress = yield this.model.findOne({ userId: userId });
                if (checkAddress) {
                    return checkAddress;
                }
                return null;
            }
            catch (error) {
                return null;
            }
        });
    }
    // ***************save address*********************8
    saveAddress(addressData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const savedAddress = yield this.model.create(addressData);
                return savedAddress;
            }
            catch (error) {
                return null;
            }
        });
    }
    // *************************Edit Address************************
    editAddress(addressData, addressId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const updatedAddress = yield this.model.findOneAndUpdate({ _id: addressId }, addressData, { new: true });
                if (updatedAddress) {
                    return updatedAddress;
                }
                return null;
            }
            catch (error) {
                return null;
            }
        });
    }
}
exports.UserAddressRepository = UserAddressRepository;
