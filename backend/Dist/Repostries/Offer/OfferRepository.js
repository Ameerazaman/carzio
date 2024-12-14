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
exports.OfferRepository = void 0;
const OfferModel_1 = __importDefault(require("../../Model/Admin/OfferModel"));
const BaseRepostry_1 = require("../BaseRepostry");
class OfferRepository extends BaseRepostry_1.BaseRepository {
    constructor() {
        super(OfferModel_1.default);
    }
    // *******************************Add Offer******************
    addOffer(offer) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const newOffer = new OfferModel_1.default({
                    carName: offer.carName,
                    offerTitle: offer.offerTitle,
                    startDate: new Date(offer.startDate),
                    endDate: new Date(offer.endDate),
                    discountPercentage: offer.discountPercentage,
                });
                const savedOffer = (yield newOffer.save());
                console.log(savedOffer);
                return {
                    carName: savedOffer.carName,
                    offerTitle: savedOffer.offerTitle,
                    startDate: savedOffer.startDate,
                    endDate: savedOffer.endDate,
                    discountPercentage: savedOffer.discountPercentage,
                    id: ((_a = savedOffer.id) === null || _a === void 0 ? void 0 : _a.toString()) || "",
                    isActive: savedOffer === null || savedOffer === void 0 ? void 0 : savedOffer.isActive
                };
            }
            catch (error) {
                return null;
            }
        });
    }
    // ********************************fetch offers*********************
    fetchOffer(page, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const skip = (page - 1) * limit;
                const data = yield this.model
                    .find()
                    .sort({ createdAt: -1 })
                    .skip(skip)
                    .limit(limit);
                const offers = data.map((offer) => {
                    var _a;
                    return ({
                        carName: offer.carName,
                        offerTitle: offer.offerTitle,
                        startDate: offer.startDate,
                        endDate: offer.endDate,
                        discountPercentage: offer.discountPercentage,
                        id: ((_a = offer.id) === null || _a === void 0 ? void 0 : _a.toString()) || "",
                        isActive: offer === null || offer === void 0 ? void 0 : offer.isActive
                    });
                });
                return offers;
            }
            catch (error) {
                return null;
            }
        });
    }
    // **************************edit Offer*************************8
    editOffer(offerId) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                let check = yield this.model.findById(offerId);
                if (check) {
                    return {
                        carName: check.carName,
                        offerTitle: check.offerTitle,
                        startDate: check.startDate,
                        endDate: check.endDate,
                        discountPercentage: check.discountPercentage,
                        id: ((_a = check._id) === null || _a === void 0 ? void 0 : _a.toString()) || "",
                        isActive: check === null || check === void 0 ? void 0 : check.isActive
                    };
                }
                return null;
            }
            catch (error) {
                return null;
            }
        });
    }
    // *******************************update Offer********************
    updateOffer(offerData, id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const updatedOffer = yield this.model.findByIdAndUpdate(id, {
                    carName: offerData.carName,
                    offerTitle: offerData.offerTitle,
                    startDate: offerData.startDate,
                    endDate: offerData.endDate,
                    discountPercentage: offerData.discountPercentage,
                }, { new: true });
                return updatedOffer;
            }
            catch (error) {
                return null;
            }
        });
    }
    // ***********************updateStatus offer********************88
    updateStatusOffer(offerId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let offer = yield this.model.findById(offerId);
                if (!offer) {
                    return null;
                }
                const updateOffer = yield OfferModel_1.default.findByIdAndUpdate(offer, { isActive: !offer.isActive }, { new: true });
                return updateOffer;
            }
            catch (error) {
                return null;
            }
        });
    }
    // ***************************total offers*******************************
    countOffers() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const countOffers = yield OfferModel_1.default.countDocuments();
                return countOffers;
            }
            catch (error) {
                return null;
            }
        });
    }
    // *************************fetch offer8*******************888
    fetchOfferForUser() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield this.model.find().sort({ createdAt: -1 }); // Array of OfferDataInterface documents
                const offers = data.map((offer) => {
                    var _a, _b;
                    return ({
                        carName: offer.carName,
                        offerTitle: offer.offerTitle,
                        startDate: offer.startDate,
                        endDate: offer.endDate,
                        discountPercentage: offer.discountPercentage,
                        id: ((_a = offer.id) === null || _a === void 0 ? void 0 : _a.toString()) || "",
                        isActive: (_b = offer.isActive) !== null && _b !== void 0 ? _b : true,
                    });
                });
                return offers;
            }
            catch (error) {
                return null;
            }
        });
    }
    // ******************check offer for booking******************
    checkOfferForBooking(carName) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const offer = yield this.model.findOne({
                    carName: { $regex: new RegExp(`^${carName}$`, 'i') },
                });
                if (offer) {
                    return offer;
                }
                return null;
            }
            catch (error) {
                return null;
            }
        });
    }
}
exports.OfferRepository = OfferRepository;
