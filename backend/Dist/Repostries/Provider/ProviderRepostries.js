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
const mongoose_1 = __importDefault(require("mongoose"));
const CarModel_1 = __importDefault(require("../../Model/Provider/CarModel"));
const CarNotification_1 = __importDefault(require("../../Model/Provider/CarNotification"));
const ProviderAddressModel_1 = __importDefault(require("../../Model/Provider/ProviderAddressModel"));
const ProviderModel_1 = __importDefault(require("../../Model/Provider/ProviderModel"));
const BookingModel_1 = __importDefault(require("../../Model/User/BookingModel"));
const OtpModel_1 = require("../../Model/User/OtpModel");
const ChatModel_1 = __importDefault(require("../../Model/User/ChatModel"));
class ProviderRepository {
    //*******************check provider for tooken validation*************
    getProviderById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const existingProvider = yield ProviderModel_1.default.findById(id);
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
                const existingUser = yield ProviderModel_1.default.findOne({ email });
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
                const changeUserpassword = yield ProviderModel_1.default.findOneAndUpdate({ email: email, password: password });
                return changeUserpassword;
            }
            catch (error) {
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
    // *******************************check provider Address********************
    checkProviderAddress(providerId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const check = yield ProviderAddressModel_1.default.findOne({ providerId });
                console.log(check, "check profile");
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
                const newUser = new ProviderAddressModel_1.default({
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
                const editAddress = yield ProviderAddressModel_1.default.findByIdAndUpdate({ _id: id }, {
                    name: providerData.name,
                    providerId: providerData.providerId,
                    email: providerData.email,
                    city: providerData.city,
                    state: providerData.state,
                    pinNumber: providerData.pinNumber,
                    phone: providerData.phone,
                }, { new: true }).lean();
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
                const profile = yield ProviderAddressModel_1.default.findById(id);
                if (!profile) {
                    return null;
                }
                const updatedProfile = yield ProviderAddressModel_1.default.findByIdAndUpdate(id, { image: images }, { new: true });
                return updatedProfile;
            }
            catch (error) {
                return null;
            }
        });
    }
    // ************************add car details****************************
    addCarDetails(carData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let carExist = yield CarModel_1.default.findOne({
                    providerId: carData.providerId,
                    rcNumber: carData.rcNumber
                });
                if (carExist) {
                    return undefined;
                }
                const newCar = new CarNotification_1.default({
                    car_name: carData.car_name,
                    model: carData.model,
                    rentalPrice: Number(carData.rentalPrice),
                    engineType: carData.engineType,
                    fuelType: carData.fuelType,
                    color: carData.color,
                    images: carData.images.length > 0 ? carData.images : [],
                    rcExpiry: new Date(carData.rcExpiry),
                    rcNumber: carData.rcNumber,
                    insurancePolicyNumber: carData.insurancePolicyNumber,
                    insuranceExpiry: new Date(carData.insuranceExpiry),
                    pollutionCertificateNumber: carData.pollutionCertificateNumber,
                    pollutionExpiry: new Date(carData.pollutionExpiry),
                    providerId: carData.providerId,
                });
                const car = yield newCar.save();
                return car.toObject();
            }
            catch (error) {
                return undefined;
            }
        });
    }
    // ******************************fetch car for car management**********************
    fetchCars(providerId, page, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const skip = (page - 1) * limit;
                const carDocuments = yield CarModel_1.default.find({ providerId })
                    .sort({ createdAt: -1 })
                    .skip(skip)
                    .limit(limit);
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
                    isStatus: car.isStatus,
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
    //***********************fetch car for eedit in car mgt************************************
    editCar(carId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let car = yield CarModel_1.default.findById(carId);
                if (car) {
                    return {
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
                        isStatus: car.isStatus,
                        createdAt: car.createdAt,
                        id: car.id
                    };
                }
                return null;
            }
            catch (error) {
                console.error("Error fetching Car:", error);
                return null;
            }
        });
    }
    // ******************************update car in car management*************************
    updateCar(carData, id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const updateData = {
                    car_name: carData.car_name,
                    model: carData.model,
                    rentalPrice: carData.rentalPrice,
                    engineType: carData.engineType,
                    fuelType: carData.fuelType,
                    color: carData.color,
                    images: carData.images,
                    rcNumber: carData.rcNumber,
                    rcExpiry: carData.rcExpiry,
                    insurancePolicyNumber: carData.insurancePolicyNumber,
                    insuranceExpiry: carData.insuranceExpiry,
                    pollutionCertificateNumber: carData.pollutionCertificateNumber,
                    pollutionExpiry: carData.pollutionExpiry,
                    providerId: carData.providerId,
                };
                const editCar = yield CarModel_1.default.findByIdAndUpdate(id, updateData, { new: true }).lean();
                return editCar;
            }
            catch (error) {
                return null;
            }
        });
    }
    // **********************************update Car image*************************
    updateCarImage(images, id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const car = yield CarModel_1.default.findById(id);
                if (!car) {
                    return null;
                }
                const updatedCar = yield CarModel_1.default.findByIdAndUpdate(id, { images: images }, { new: true });
                return updatedCar;
            }
            catch (error) {
                return null;
            }
        });
    }
    // ***************************booking history*****************
    getBookingHistory(providerId, page, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const bookingHistory = yield BookingModel_1.default.aggregate([
                    { $match: { providerId: providerId } },
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
    // *******************************update status for booking**********************
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
    // *****************************fetch users chat by provider*********************
    fetchUsersChat(providerId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield ChatModel_1.default.find({
                    receiverId: providerId
                })
                    .sort({ timestamp: -1 });
                return result;
            }
            catch (error) {
                return null;
            }
        });
    }
    // *************************fetch chat History******************************
    fetchChatHistory(recieverId, senderId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let result = yield ChatModel_1.default.find({
                    $or: [
                        {
                            receiverId: senderId, senderId: recieverId
                        },
                        {
                            receiverId: recieverId, senderId: senderId
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
    // **********************************count cars****************************
    countCars(providerId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const countCars = yield CarModel_1.default.find({ providerId: providerId }).countDocuments();
                ;
                return countCars;
            }
            catch (error) {
                return null;
            }
        });
    }
    // **************************car bookings based one car***********************
    CountBookingCar(providerId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const bookingCountByCar = yield BookingModel_1.default.aggregate([
                    {
                        $match: {
                            providerId: providerId,
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
    totalRevenue(providerId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const bookings = yield BookingModel_1.default.find({
                    providerId: providerId,
                    status: "Completed"
                });
                const totalCompletedAmount = bookings.reduce((sum, booking) => sum + booking.total_Amt, 0);
                return totalCompletedAmount / 2;
            }
            catch (error) {
                return null;
            }
        });
    }
    // ***************************total Bookings*******************************
    countBooking(providerId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const countBooking = yield BookingModel_1.default.countDocuments({ providerId: providerId });
                return countBooking;
            }
            catch (error) {
                return null;
            }
        });
    }
    // *************************************revenue based on car**********************
    revenueByCar(providerId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const bookingCountByCar = yield BookingModel_1.default.aggregate([
                    {
                        $match: {
                            status: 'Completed',
                            providerId: providerId,
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
    fetchSalesReport(page, limit, providerId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const skip = (page - 1) * limit;
                const completedBookings = yield BookingModel_1.default.find({ status: 'Completed', providerId: providerId })
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
exports.ProviderRepository = ProviderRepository;
