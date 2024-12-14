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
exports.CouponRepository = void 0;
const CouponModel_1 = __importDefault(require("../../Model/Admin/CouponModel"));
const BaseRepostry_1 = require("../BaseRepostry");
class CouponRepository extends BaseRepostry_1.BaseRepository {
    constructor() {
        super(CouponModel_1.default);
    }
    addCoupon(coupon) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d, _e;
            try {
                const newCoupon = new CouponModel_1.default({
                    discountPercentage: (_a = coupon.discountPercentage) !== null && _a !== void 0 ? _a : 0,
                    minRentalAmount: (_b = coupon.minRentalAmount) !== null && _b !== void 0 ? _b : 0,
                    startDate: new Date(coupon.startDate),
                    endDate: new Date(coupon.endDate),
                    isActive: (_c = coupon.isActive) !== null && _c !== void 0 ? _c : true,
                    userId: coupon.userId || [],
                    code: coupon.code
                });
                const savedCoupon = (yield newCoupon.save());
                console.log(savedCoupon);
                return {
                    code: (_d = savedCoupon.code) !== null && _d !== void 0 ? _d : "",
                    discountPercentage: savedCoupon.discountPercentage,
                    minRentalAmount: savedCoupon.minRentalAmount,
                    startDate: savedCoupon.startDate,
                    endDate: savedCoupon.endDate,
                    isActive: savedCoupon.isActive,
                    userId: savedCoupon.userId,
                    id: ((_e = savedCoupon.id) === null || _e === void 0 ? void 0 : _e.toString()) || "",
                };
            }
            catch (error) {
                return null;
            }
        });
    }
    // ********************************fetch coupon*********************
    fetchCoupon(page, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const skip = (page - 1) * limit;
                const data = yield this.model.find()
                    .sort({ createdAt: -1 })
                    .skip(skip)
                    .limit(limit)
                    .lean();
                const coupons = data.map((coupon) => {
                    var _a, _b, _c, _d, _e, _f, _g, _h;
                    return ({
                        code: (_a = coupon.code) !== null && _a !== void 0 ? _a : null,
                        discountPercentage: (_b = coupon.discountPercentage) !== null && _b !== void 0 ? _b : null,
                        startDate: (_c = coupon.startDate) !== null && _c !== void 0 ? _c : null,
                        endDate: (_d = coupon.endDate) !== null && _d !== void 0 ? _d : null,
                        isActive: (_e = coupon.isActive) !== null && _e !== void 0 ? _e : false,
                        minRentalAmount: (_f = coupon.minRentalAmount) !== null && _f !== void 0 ? _f : null,
                        userId: (_g = coupon.userId) !== null && _g !== void 0 ? _g : [],
                        id: ((_h = coupon._id) === null || _h === void 0 ? void 0 : _h.toString()) || "",
                    });
                });
                return coupons;
            }
            catch (error) {
                return null;
            }
        });
    }
    // **************************edit Offer*************************8
    editCoupon(couponId) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d, _e, _f, _g, _h;
            try {
                let coupon = yield this.model.findById(couponId);
                if (coupon) {
                    return {
                        code: (_a = coupon.code) !== null && _a !== void 0 ? _a : "",
                        discountPercentage: (_b = coupon.discountPercentage) !== null && _b !== void 0 ? _b : 0,
                        minRentalAmount: (_c = coupon.minRentalAmount) !== null && _c !== void 0 ? _c : 0,
                        startDate: (_d = coupon.startDate) !== null && _d !== void 0 ? _d : "",
                        endDate: (_e = coupon.endDate) !== null && _e !== void 0 ? _e : "",
                        isActive: (_f = coupon.isActive) !== null && _f !== void 0 ? _f : false,
                        userId: (_g = coupon.userId) !== null && _g !== void 0 ? _g : [],
                        id: ((_h = coupon.id) === null || _h === void 0 ? void 0 : _h.toString()) || "",
                    };
                }
                return null;
            }
            catch (error) {
                return null;
            }
        });
    }
    // *******************************update coupon********************
    updateCoupon(couponData, id) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d, _e, _f, _g;
            try {
                const updatedCoupon = yield CouponModel_1.default.findByIdAndUpdate(id, {
                    code: (_a = couponData.code) !== null && _a !== void 0 ? _a : "",
                    discountPercentage: (_b = couponData.discountPercentage) !== null && _b !== void 0 ? _b : 0,
                    minRentalAmount: (_c = couponData.minRentalAmount) !== null && _c !== void 0 ? _c : 0,
                    startDate: (_d = couponData.startDate) !== null && _d !== void 0 ? _d : "",
                    endDate: (_e = couponData.endDate) !== null && _e !== void 0 ? _e : "",
                    isActive: (_f = couponData.isActive) !== null && _f !== void 0 ? _f : false,
                    userId: (_g = couponData.userId) !== null && _g !== void 0 ? _g : [],
                }, { new: true }).lean();
                return updatedCoupon;
            }
            catch (error) {
                return null;
            }
        });
    }
    // ***********************updateStatus oupon********************88
    updateStatusCoupon(couponId) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d, _e, _f;
            try {
                let coupon = yield this.model.findById(couponId);
                if (!coupon) {
                    return null;
                }
                const updateCoupon = yield this.model.findByIdAndUpdate(couponId, { isActive: !coupon.isActive }, { new: true });
                if (updateCoupon) {
                    return {
                        code: (_a = updateCoupon.code) !== null && _a !== void 0 ? _a : "",
                        discountPercentage: (_b = updateCoupon.discountPercentage) !== null && _b !== void 0 ? _b : 0,
                        minRentalAmount: (_c = updateCoupon.minRentalAmount) !== null && _c !== void 0 ? _c : 0,
                        startDate: updateCoupon.startDate ? updateCoupon.startDate.toISOString() : "",
                        endDate: updateCoupon.endDate ? updateCoupon.endDate.toISOString() : "",
                        isActive: (_d = updateCoupon.isActive) !== null && _d !== void 0 ? _d : false,
                        userId: (_f = (_e = updateCoupon.userId) === null || _e === void 0 ? void 0 : _e.map((id) => id.toString())) !== null && _f !== void 0 ? _f : [],
                        id: updateCoupon._id.toString(),
                    };
                }
                return null;
            }
            catch (error) {
                return null;
            }
        });
    }
    // ***************************total Coupons*******************************
    countCoupon() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const countCoupon = yield this.model.countDocuments();
                return countCoupon;
            }
            catch (error) {
                return null;
            }
        });
    }
    // **************************fetch coupon************
    fetchCouponForUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const couponsWithoutUser = yield this.model.find({ userId: { $ne: userId } });
                if (couponsWithoutUser && couponsWithoutUser.length > 0) {
                    return couponsWithoutUser;
                }
                return null;
            }
            catch (error) {
                return null;
            }
        });
    }
    // // **********************update userid in coupon ***********************
    userIdInCoupon(couponCode, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const updatedCoupon = yield this.model.findOneAndUpdate({ code: couponCode }, { $push: { userId: userId } }, { new: true });
                if (updatedCoupon) {
                    return updatedCoupon;
                }
                return null;
            }
            catch (error) {
                return null;
            }
        });
    }
}
exports.CouponRepository = CouponRepository;
