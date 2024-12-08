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
const CouponModel_1 = __importDefault(require("../../Model/Admin/CouponModel"));
const OfferModel_1 = __importDefault(require("../../Model/Admin/OfferModel"));
const CarModel_1 = __importDefault(require("../../Model/Provider/CarModel"));
const AddressModel_1 = __importDefault(require("../../Model/User/AddressModel"));
const BookingModel_1 = __importDefault(require("../../Model/User/BookingModel"));
const ProfileModel_1 = __importDefault(require("../../Model/User/ProfileModel"));
const UserModel_1 = __importDefault(require("../../Model/User/UserModel"));
const mongoose_1 = __importDefault(require("mongoose"));
const WalletModel_1 = __importDefault(require("../../Model/User/WalletModel"));
const ReviewModel_1 = __importDefault(require("../../Model/User/ReviewModel"));
const ChatModel_1 = __importDefault(require("../../Model/User/ChatModel"));
const OtpModel_1 = require("../../Model/User/OtpModel");
class UserRepository {
    // *************************email Exist**************************
    emailExistCheck(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const existingUser = yield UserModel_1.default.findOne({ email });
                return existingUser;
            }
            catch (error) {
                console.log("Error checking email existence:", error);
                return null;
            }
        });
    }
    //*******This function creates or updates an OTP for a given email*************
    createOtp(otp, email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let existUserOtp = yield OtpModel_1.Otp.findOne({ email });
                if (existUserOtp) {
                    const updatedOtp = yield OtpModel_1.Otp.findOneAndUpdate({ email }, { otp }, { new: true });
                    return updatedOtp;
                }
                else {
                    const newOtp = yield OtpModel_1.Otp.create({ email, otp });
                    return newOtp;
                }
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
                const result = yield OtpModel_1.Otp.findOneAndDelete({ email });
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
                const result = yield OtpModel_1.Otp.findOneAndUpdate({ email: email }, { $set: { otp: otp } }, { new: true });
                return result;
            }
            catch (error) {
                console.error("Error updating OTP:", error);
                return null;
            }
        });
    }
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
                const existingUser = yield UserModel_1.default.findOne({ email });
                return existingUser ? { exists: true, userData: existingUser } : { exists: false };
            }
            catch (error) {
                console.error("Error in user login:", error);
                return { exists: false };
            }
        });
    }
    //*****************check username and password for login*************
    emailPasswordCheck(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const existingUser = yield UserModel_1.default.findOne({ email });
                return existingUser;
            }
            catch (error) {
                console.log("Error checking email and password:", error);
                return null;
            }
        });
    }
    // **************************change password**********************
    changePassword(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const changeUserpassword = yield UserModel_1.default.findOneAndUpdate({ email: email, password: password });
                return changeUserpassword;
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
                const existProviderOtp = yield OtpModel_1.Otp.findOne({ email });
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
    //*****************check user for tooken validation**********************
    getUserById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const existingUser = yield UserModel_1.default.findById(id);
                return existingUser;
            }
            catch (error) {
                return null;
            }
        });
    }
    // ******************************fetch car for card**********************
    fetchCars(page, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const skip = (page - 1) * limit;
                const carDocuments = yield CarModel_1.default.find({ isBlocked: false })
                    .sort({ createdAt: -1 })
                    .skip(skip)
                    .limit(limit)
                    .exec();
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
                    id: car.id,
                }));
                return cars;
            }
            catch (error) {
                return null;
            }
        });
    }
    // *******************************fetch cout for Total Page in FetchCar*****************
    countsOfCar() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const total = yield CarModel_1.default.countDocuments();
                return total;
            }
            catch (error) {
                return null;
            }
        });
    }
    // ***********************************Car Details *************************
    carDetails(carId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield CarModel_1.default.findById(carId);
                return result;
            }
            catch (error) {
                return null;
            }
        });
    }
    // ************************car ratings(star) in carDetails*****************
    getReviewAndRatings(carId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield ReviewModel_1.default.aggregate([
                    { $match: { carId: carId } },
                    {
                        $group: {
                            _id: null, // Group all matched documents
                            averageRating: { $avg: "$rating" }, // Calculate average rating
                            reviews: { $push: "$review" }, // Collect review texts
                        },
                    },
                ]);
                if (result.length === 0) {
                    return { averageRating: null, reviews: [] };
                }
                return {
                    averageRating: result[0].averageRating,
                    reviews: result[0].reviews,
                };
            }
            catch (error) {
                return { averageRating: null, reviews: [] };
            }
        });
    }
    // ***************************filter************************
    carFilter(engineType, fuelType, sortPrice) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const filters = {};
                if (engineType && engineType.length > 0) {
                    filters.engineType = { $in: engineType.map(type => new RegExp(type, 'i')) }; // Case-insensitive filter
                }
                if (fuelType && fuelType.length > 0) {
                    filters.fuelType = { $in: fuelType.map(type => new RegExp(type, 'i')) }; // Case-insensitive filter
                }
                const sortOrder = sortPrice === 'lowToHigh' ? 1 : sortPrice === 'highToLow' ? -1 : undefined;
                const filteredCars = yield CarModel_1.default.find(filters)
                    .sort(sortOrder ? { rentalPrice: sortOrder } : {})
                    .exec();
                const cars = filteredCars.map((car) => ({
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
                return cars;
            }
            catch (error) {
                return null;
            }
        });
    }
    // ******************************search car**********************
    searchCar(searchQuery) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const regex = new RegExp(searchQuery, "i");
                const result = yield CarModel_1.default.find({ car_name: { $regex: regex } });
                return result;
            }
            catch (error) {
                return null;
            }
        });
    }
    // *************************fetch offer8*******************888
    fetchOffer() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield OfferModel_1.default.find().sort({ createdAt: -1 }); // Array of OfferDataInterface documents
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
    // ***********************check profile******************
    checkProfile(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d, _e, _f;
            const data = yield ProfileModel_1.default.findOne({ userId: userId });
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
                const savedProfile = yield ProfileModel_1.default.create(profileData);
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
                const updatedProfile = yield ProfileModel_1.default.findOneAndUpdate({ _id: profileId }, profileData, { new: true });
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
    //******************** */ check Address**************************
    checkAddress(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const checkAddress = yield AddressModel_1.default.findOne({ userId: userId });
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
                const savedAddress = yield AddressModel_1.default.create(addressData);
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
                const updatedAddress = yield AddressModel_1.default.findOneAndUpdate({ _id: addressId }, addressData, { new: true });
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
    // **************************fetch coupon************
    fetchCoupon(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const couponsWithoutUser = yield CouponModel_1.default.find({ userId: { $ne: userId } });
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
    // ******************check offer for booking******************
    checkOfferForBooking(carName) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const offer = yield OfferModel_1.default.findOne({
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
    // **********************************save Booking**********************
    saveBookingData(bookingData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const savedBooking = yield BookingModel_1.default.create(bookingData);
                return savedBooking;
            }
            catch (error) {
                return null;
            }
        });
    }
    // **********************update userid in coupon ***********************
    userIdInCoupon(couponCode, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const updatedCoupon = yield CouponModel_1.default.findOneAndUpdate({ code: couponCode }, { $push: { userId: userId } }, { new: true });
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
    // ***************************booking history*****************
    getBookingHistory(userId, page, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const bookingHistory = yield BookingModel_1.default.aggregate([
                    { $match: { UserId: userId } },
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
                    { $limit: limit },
                ]);
                return bookingHistory;
            }
            catch (error) {
                return null;
            }
        });
    }
    // ******************************count bookingHistory****************
    countBookingHistory(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const total = yield BookingModel_1.default.aggregate([
                    { $match: { UserId: userId } }
                ]);
                return total.length;
            }
            catch (error) {
                return null;
            }
        });
    }
    // ***************************specific booking details*****************
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
    // *******************************update status for booking*****************
    cancelBookingByUser(bookingId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const updatedBooking = yield BookingModel_1.default.findByIdAndUpdate(bookingId, { status: 'Cancelled' }, { new: true });
                return updatedBooking;
            }
            catch (error) {
                return null;
            }
        });
    }
    // ***************************canceled booking amount credited to walet**********8
    creditToWallet(userId, amount) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const lastTransaction = yield WalletModel_1.default.findOne({ UserId: userId }).sort({ createdAt: -1 });
                const lastTotalAmt = lastTransaction && typeof lastTransaction.TotalAmt === 'number' ? lastTransaction.TotalAmt : 0;
                if (isNaN(amount)) {
                    throw new Error("Invalid amount provided");
                }
                const updatedTotal = lastTotalAmt + amount;
                // Create a new wallet transaction entry
                const result = yield WalletModel_1.default.create({
                    UserId: userId,
                    TransactionType: 'Credit',
                    Amount: amount,
                    Description: "Canceled booked car",
                    TotalAmt: updatedTotal,
                });
                return result;
            }
            catch (error) {
                return null;
            }
        });
    }
    // ****************************check booked or not **********************
    checkBookedOrNot(carId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const check = yield BookingModel_1.default.find({ CarsId: carId });
                const result = yield BookingModel_1.default.find({ CarsId: carId }, { IssueDate: 1, ReturnDate: 1 }).lean();
                const transformedResult = result.map(doc => ({
                    issueDate: doc.IssueDate,
                    returnDate: doc.ReturnDate
                }));
                return transformedResult;
            }
            catch (error) {
                return null;
            }
        });
    }
    // *************************check balnce and update*********************
    checkBalanceAndUpdateWallet(userId, amount) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const lastTransaction = yield WalletModel_1.default.findOne({ UserId: userId }).sort({ createdAt: -1 });
                const lastTotalAmt = lastTransaction && typeof lastTransaction.TotalAmt === 'number' ? lastTransaction.TotalAmt : 0;
                if (isNaN(amount) || amount <= 0) {
                    throw new Error("Invalid or negative amount provided");
                }
                if (lastTotalAmt >= amount) {
                    const updatedTotal = lastTotalAmt - amount;
                    const result = yield WalletModel_1.default.create({
                        UserId: userId,
                        TransactionType: 'Debit',
                        Amount: amount,
                        Description: "Booked car using wallet amount",
                        TotalAmt: updatedTotal,
                    });
                    return result;
                }
                else {
                    return null;
                }
            }
            catch (error) {
                return null;
            }
        });
    }
    // ***************get Wallet********************************
    getWalletPage(userId, page, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const walletData = yield WalletModel_1.default.aggregate([
                    { $match: { UserId: userId } },
                    { $skip: (page - 1) * limit },
                    { $limit: limit },
                ]);
                return walletData;
            }
            catch (error) {
                return null;
            }
        });
    }
    // ******************************count bookingHistory************************
    countWalletDocuments(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const total = yield WalletModel_1.default.aggregate([
                    { $match: { UserId: userId } }
                ]);
                return total.length;
            }
            catch (error) {
                return null;
            }
        });
    }
    // **************************create Review and ratings*********************
    createReviewData(reviewData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const saveReview = yield ReviewModel_1.default.create(reviewData);
                return saveReview;
            }
            catch (error) {
                return null;
            }
        });
    }
    // **********************check bookId in review*******************
    checkBookidInReview(bookId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let result = yield ReviewModel_1.default.findOne({ bookingId: bookId });
                return result;
            }
            catch (error) {
                return null;
            }
        });
    }
    // *************************fetch chat History******************************
    fetchChatHistory(userId, providerId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let result = yield ChatModel_1.default.find({
                    $or: [
                        {
                            receiverId: userId, senderId: providerId
                        },
                        {
                            receiverId: providerId, senderId: userId
                        },
                    ],
                });
                return result;
            }
            catch (error) {
                return null;
            }
        });
    }
    // ************************************car availabilty in date***************************
    searchCarAvailability(startDate, endDate) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const start = new Date(startDate);
                const end = new Date(endDate);
                const bookedCars = yield BookingModel_1.default.find({
                    $or: [
                        { IssueDate: { $lte: endDate }, ReturnDate: { $gte: startDate } },
                    ],
                }).select('CarsId');
                const bookedCarIds = bookedCars.map((booking) => booking.CarsId);
                const availableCars = yield CarModel_1.default.find({
                    _id: { $nin: bookedCarIds },
                });
                const cars = availableCars.map((car) => ({
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
                    id: car.id,
                }));
                return cars;
            }
            catch (error) {
                throw error;
            }
        });
    }
}
exports.UserRepository = UserRepository;
