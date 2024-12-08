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
exports.AdminRepository = void 0;
const UserModel_1 = __importDefault(require("../../Model/User/UserModel"));
const OfferModel_1 = __importDefault(require("../../Model/Admin/OfferModel"));
const AdminModel_1 = __importDefault(require("../../Model/Admin/AdminModel"));
const ProviderModel_1 = __importDefault(require("../../Model/Provider/ProviderModel"));
const CarNotification_1 = __importDefault(require("../../Model/Provider/CarNotification"));
const CarModel_1 = __importDefault(require("../../Model/Provider/CarModel"));
const CouponModel_1 = __importDefault(require("../../Model/Admin/CouponModel"));
const mongoose_1 = __importDefault(require("mongoose"));
const BookingModel_1 = __importDefault(require("../../Model/User/BookingModel"));
class AdminRepository {
    emailExistCheck(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const existingAdmin = yield AdminModel_1.default.findOne({ email });
                return existingAdmin;
            }
            catch (error) {
                return null;
            }
        });
    }
    // ***************************fetch users*************************
    fetchUsers(page, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const skip = (page - 1) * limit;
                const data = yield UserModel_1.default
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
    // ***************************fetch providers******************
    fetchProviders(page, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const skip = (page - 1) * limit;
                const data = yield ProviderModel_1.default
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
                let check = yield UserModel_1.default.findById(userId);
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
                const editUser = yield UserModel_1.default.findByIdAndUpdate({ _id: id }, {
                    username: userData.username,
                    email: userData.email,
                }, { new: true }).lean();
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
                let user = yield UserModel_1.default.findById(userId);
                if (!user) {
                    return null;
                }
                const updateUser = yield UserModel_1.default.findByIdAndUpdate({ _id: userId }, { isBlocked: !user.isBlocked }, { new: true });
                return updateUser;
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
                let check = yield ProviderModel_1.default.findById(providerId);
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
                const editProvider = yield ProviderModel_1.default.findByIdAndUpdate({ _id: id }, {
                    username: providerData.username,
                    email: providerData.email,
                }, { new: true }).lean();
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
                let provider = yield ProviderModel_1.default.findById(providerId);
                if (!provider) {
                    return null;
                }
                const updateProvider = yield ProviderModel_1.default.findByIdAndUpdate(providerId, { isBlocked: !provider.isBlocked }, { new: true });
                return updateProvider;
            }
            catch (error) {
                return null;
            }
        });
    }
    // *****************8get adminby Id*********************8
    getAdminById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const existingUser = yield AdminModel_1.default.findById(id);
                return existingUser;
            }
            catch (error) {
                return null;
            }
        });
    }
    // *******************fetch Notifications from Car Documents***************
    fetchNotification() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield CarNotification_1.default.find();
                console.log(data, "data");
                const notification = data.map((carDocument) => {
                    var _a;
                    return ({
                        id: (_a = carDocument._id) === null || _a === void 0 ? void 0 : _a.toString(),
                        car_name: carDocument.car_name,
                        model: carDocument.model,
                        rentalPrice: carDocument.rentalPrice,
                        engineType: carDocument.engineType,
                        fuelType: carDocument.fuelType,
                        color: carDocument.color,
                        images: carDocument.images,
                        rcNumber: carDocument.rcNumber,
                        rcExpiry: carDocument.rcExpiry,
                        insurancePolicyNumber: carDocument.insurancePolicyNumber,
                        insuranceExpiry: carDocument.insuranceExpiry,
                        pollutionCertificateNumber: carDocument.pollutionCertificateNumber,
                        pollutionExpiry: carDocument.pollutionExpiry,
                        isBlocked: carDocument.isBlocked,
                        providerId: carDocument.providerId ? carDocument.providerId.toString() : undefined,
                        createdAt: carDocument.createdAt,
                    });
                });
                console.log(notification, "notification");
                return notification;
            }
            catch (error) {
                return null;
            }
        });
    }
    // ******************************get car details for notification*******************
    carNotificationById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const carDocumentExist = yield CarNotification_1.default.findById(id);
                return carDocumentExist;
            }
            catch (error) {
                return null;
            }
        });
    }
    //**********************verify notification(car notification details addto car model and deleted notifcation***********)
    verifyNotification(id, value) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let carDocument;
                if (value === "Accept") {
                    carDocument = yield CarNotification_1.default.findById(id);
                    if (carDocument) {
                        const newCar = new CarModel_1.default({
                            car_name: carDocument.car_name,
                            model: carDocument.model,
                            rentalPrice: carDocument.rentalPrice,
                            engineType: carDocument.engineType,
                            fuelType: carDocument.fuelType,
                            color: carDocument.color,
                            images: carDocument.images,
                            rcNumber: carDocument.rcNumber,
                            rcExpiry: carDocument.rcExpiry,
                            insurancePolicyNumber: carDocument.insurancePolicyNumber,
                            insuranceExpiry: carDocument.insuranceExpiry,
                            pollutionCertificateNumber: carDocument.pollutionCertificateNumber,
                            pollutionExpiry: carDocument.pollutionExpiry,
                            providerId: carDocument.providerId,
                            isBlocked: false,
                        });
                        yield newCar.save();
                    }
                }
                const result = yield CarNotification_1.default.deleteOne({ _id: id });
                return result;
            }
            catch (error) {
                return null;
            }
        });
    }
    // ******************************fetch car for car management**********************
    fetchCars(page, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const skip = (page - 1) * limit;
                const carDocuments = yield CarModel_1.default
                    .find()
                    .sort({ createdAt: -1 })
                    .skip(skip)
                    .limit(limit);
                console.log(carDocuments, "cardocumnets");
                const cars = carDocuments.map((car) => ({
                    car_name: car.car_name,
                    model: car.model,
                    rentalPrice: car.rentalPrice,
                    engineType: car.engineType,
                    fuelType: car.fuelType,
                    color: car.color,
                    images: car.images,
                    rcNumber: car.rcNumber,
                    rcExpiry: car.rcExpiry,
                    insurancePolicyNumber: car.insurancePolicyNumber,
                    insuranceExpiry: car.insuranceExpiry,
                    pollutionCertificateNumber: car.pollutionCertificateNumber,
                    pollutionExpiry: car.pollutionExpiry,
                    providerId: car.providerId,
                    isBlocked: car.isBlocked,
                    createdAt: car.createdAt,
                    id: car.id
                }));
                console.log(cars, "cars");
                return cars;
            }
            catch (error) {
                return null;
            }
        });
    }
    // *******************************change status of car*****************
    updateStatusCar(carId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let car = yield CarModel_1.default.findById(carId);
                if (!car) {
                    return null;
                }
                const updateCar = yield CarModel_1.default.findByIdAndUpdate(car, { isBlocked: !car.isBlocked }, { new: true });
                return updateCar;
            }
            catch (error) {
                return null;
            }
        });
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
                const data = yield OfferModel_1.default
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
                let check = yield OfferModel_1.default.findById(offerId);
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
                const updatedOffer = yield OfferModel_1.default.findByIdAndUpdate(id, {
                    carName: offerData.carName,
                    offerTitle: offerData.offerTitle,
                    startDate: offerData.startDate,
                    endDate: offerData.endDate,
                    discountPercentage: offerData.discountPercentage,
                }, { new: true }).lean();
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
                let offer = yield OfferModel_1.default.findById(offerId);
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
    // **************************add coupon*****************
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
                const data = yield CouponModel_1.default.find()
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
                let coupon = yield CouponModel_1.default.findById(couponId);
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
                let coupon = yield CouponModel_1.default.findById(couponId);
                if (!coupon) {
                    return null;
                }
                const updateCoupon = yield CouponModel_1.default.findByIdAndUpdate(couponId, { isActive: !coupon.isActive }, { new: true });
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
    // ***************************booking history*****************
    getBookingHistory(page, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const skip = (page - 1) * limit;
                const bookingHistory = yield BookingModel_1.default.aggregate([
                    {
                        $addFields: {
                            CarsObjectId: { $toObjectId: "$CarsId" }
                        }
                    },
                    {
                        $lookup: {
                            from: 'carmodels',
                            localField: 'CarsObjectId',
                            foreignField: '_id',
                            as: 'bookingDetails',
                        },
                    },
                    { $unwind: '$bookingDetails' },
                    { $sort: { createdAt: -1 } },
                    { $skip: (page - 1) * limit },
                    { $limit: limit }
                ]);
                return bookingHistory.length ? bookingHistory : null;
            }
            catch (error) {
                return null;
            }
        });
    }
    // / ***************************specific booking details*****************
    specificBookingDetails(bookingId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const objectId = new mongoose_1.default.Types.ObjectId(bookingId);
                const bookingHistory = yield BookingModel_1.default.aggregate([
                    { $match: { _id: objectId } },
                    {
                        $addFields: {
                            CarsObjectId: { $toObjectId: "$CarsId" },
                            UserAddressObjectId: { $toObjectId: "$UserAddressId" }
                        }
                    },
                    {
                        $lookup: {
                            from: 'carmodels',
                            localField: 'CarsObjectId',
                            foreignField: '_id',
                            as: 'bookingDetails'
                        }
                    },
                    { $unwind: '$bookingDetails' },
                    {
                        $lookup: {
                            from: 'useraddressmodels',
                            localField: 'UserAddressObjectId',
                            foreignField: '_id',
                            as: 'userAddress'
                        }
                    },
                    { $unwind: '$userAddress' }
                ]);
                return bookingHistory[0] || null;
            }
            catch (error) {
                return null;
            }
        });
    }
    //  // *******************************update status for booking*****************
    updateStatusOfBooking(bookingId, status) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const updatedBooking = yield BookingModel_1.default.findByIdAndUpdate(bookingId, { status: status }, { new: true });
                return updatedBooking;
            }
            catch (error) {
                return null;
            }
        });
    }
    // ******************************get total cars********************
    countCars() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const countCars = yield CarModel_1.default.find().countDocuments();
                ;
                return countCars;
            }
            catch (error) {
                return null;
            }
        });
    }
    // ********************************count users**********************
    countUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const countUsers = yield UserModel_1.default.countDocuments();
                return countUsers;
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
                const countProviders = yield ProviderModel_1.default.countDocuments();
                return countProviders;
            }
            catch (error) {
                return null;
            }
        });
    }
    // **************************car bookings based one car***********************
    CountBookingCar() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const bookingCountByCar = yield BookingModel_1.default.aggregate([
                    {
                        $addFields: {
                            CarsId: { $toObjectId: '$CarsId' },
                        },
                    },
                    {
                        $lookup: {
                            from: 'carmodels',
                            localField: 'CarsId',
                            foreignField: '_id',
                            as: 'carDetails',
                        },
                    },
                    {
                        $unwind: '$carDetails',
                    },
                    {
                        $group: {
                            _id: '$carDetails.car_name',
                            count: { $sum: 1 },
                        },
                    },
                    {
                        $project: {
                            carName: '$_id',
                            count: 1,
                            _id: 0,
                        },
                    },
                    {
                        $sort: {
                            count: -1,
                        },
                    },
                ]);
                return bookingCountByCar;
            }
            catch (error) {
                return [];
            }
        });
    }
    // ********************************revenue based on each car*******************
    totalRevenue() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const bookings = yield BookingModel_1.default.find();
                const totalCompletedAmount = bookings
                    .filter((booking) => booking.status === "Completed")
                    .reduce((sum, booking) => sum + booking.total_Amt, 0);
                return totalCompletedAmount / 2;
            }
            catch (error) {
                return null;
            }
        });
    }
    // ***************************total Bookings*******************************
    countBooking() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const countBooking = yield BookingModel_1.default.countDocuments();
                return countBooking;
            }
            catch (error) {
                return null;
            }
        });
    }
    // ***************************total opffers*******************************
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
    // ***************************total opffers*******************************
    countNotification() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const countNotification = yield CarNotification_1.default.countDocuments();
                return countNotification;
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
                const countCoupon = yield CouponModel_1.default.countDocuments();
                return countCoupon;
            }
            catch (error) {
                return null;
            }
        });
    }
    // **************************revenue based on car*********************
    revenueByCar() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const bookingCountByCar = yield BookingModel_1.default.aggregate([
                    {
                        $match: {
                            status: 'Completed',
                        },
                    },
                    {
                        $addFields: {
                            CarsId: { $toObjectId: '$CarsId' },
                        },
                    },
                    {
                        $lookup: {
                            from: 'carmodels',
                            localField: 'CarsId',
                            foreignField: '_id',
                            as: 'carDetails',
                        },
                    },
                    {
                        $unwind: '$carDetails',
                    },
                    {
                        $group: {
                            _id: '$carDetails.car_name',
                            count: { $sum: 1 },
                            amount: { $sum: '$total_Amt' },
                        },
                    },
                    {
                        $project: {
                            carName: '$_id',
                            count: 1,
                            amount: 1,
                            _id: 0,
                        },
                    },
                    {
                        $sort: {
                            amount: -1,
                        },
                    },
                ]);
                return bookingCountByCar;
            }
            catch (error) {
                return [];
            }
        });
    }
    // **********************************Sales Report****************
    fetchSalesReport(page, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const skip = (page - 1) * limit;
                const completedBookings = yield BookingModel_1.default.find({ status: 'Completed' })
                    .sort({ createdAt: -1 })
                    .skip(skip)
                    .limit(limit);
                return completedBookings;
            }
            catch (error) {
                return null;
            }
        });
    }
}
exports.AdminRepository = AdminRepository;
