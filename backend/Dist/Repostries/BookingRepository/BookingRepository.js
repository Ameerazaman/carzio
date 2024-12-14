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
exports.BookingRepository = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const BookingModel_1 = __importDefault(require("../../Model/User/BookingModel"));
const BaseRepostry_1 = require("../BaseRepostry");
class BookingRepository extends BaseRepostry_1.BaseRepository {
    constructor() {
        super(BookingModel_1.default);
    }
    // ***************************booking history*****************
    getBookingHistory(page, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const skip = (page - 1) * limit;
                const bookingHistory = yield this.model.aggregate([
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
                const bookingHistory = yield this.model.aggregate([
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
                const updatedBooking = yield this.model.findByIdAndUpdate(bookingId, { status: status }, { new: true });
                return updatedBooking;
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
                const bookingCountByCar = yield this.model.aggregate([
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
                const bookings = yield this.model.find();
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
                const countBooking = yield this.model.countDocuments();
                return countBooking;
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
                const bookingCountByCar = yield this.model.aggregate([
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
                const completedBookings = yield this.model.find({ status: 'Completed' })
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
    // **************************car bookings based one car***********************
    CountBookingCarForProvider(providerId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const bookingCountByCar = yield this.model.aggregate([
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
    totalRevenueForProvider(providerId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const bookings = yield this.model.find({
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
    countBookingForProvider(providerId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const countBooking = yield this.model.countDocuments({ providerId: providerId });
                return countBooking;
            }
            catch (error) {
                return null;
            }
        });
    }
    // *************************************revenue based on car**********************
    revenueByCarForProvider(providerId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const bookingCountByCar = yield this.model.aggregate([
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
    fetchSalesReportForProvider(page, limit, providerId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const skip = (page - 1) * limit;
                const completedBookings = yield this.model.find({ status: 'Completed', providerId: providerId })
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
    // ***************************booking history*****************
    getBookingHistoryForProvider(providerId, page, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const bookingHistory = yield this.model.aggregate([
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
    specificBookingDetailsForProvider(bookingId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const objectId = new mongoose_1.default.Types.ObjectId(bookingId);
                const bookingHistory = yield this.model.aggregate([
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
    updateStatusOfBookingForProvider(bookingId, status) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const updatedBooking = yield this.model.findByIdAndUpdate(bookingId, { status: status }, { new: true });
                return updatedBooking;
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
                const savedBooking = yield this.model.create(bookingData);
                return savedBooking;
            }
            catch (error) {
                return null;
            }
        });
    }
    // ***************************booking history*****************
    getBookingHistoryForUser(userId, page, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const bookingHistory = yield this.model.aggregate([
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
    countBookingHistoryForUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const total = yield this.model.aggregate([
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
    specificBookingDetailsForUser(bookingId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const objectId = new mongoose_1.default.Types.ObjectId(bookingId);
                const bookingHistory = yield this.model.aggregate([
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
                const updatedBooking = yield this.model.findByIdAndUpdate(bookingId, { status: 'Cancelled' }, { new: true });
                return updatedBooking;
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
                const check = yield this.model.find({ CarsId: carId });
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
    // ************************************car availabilty in date***************************
    findUnavailableCars(startDate, endDate) {
        return __awaiter(this, void 0, void 0, function* () {
            const bookedCars = yield BookingModel_1.default.find({
                $or: [
                    { IssueDate: { $lte: endDate }, ReturnDate: { $gte: startDate } },
                ],
            }).select('CarsId');
            return bookedCars.map((booking) => booking.CarsId);
        });
    }
    // **************************search car availabiltyu*****************
    findBookedCarIds(startDate, endDate) {
        return __awaiter(this, void 0, void 0, function* () {
            const bookedCars = yield BookingModel_1.default.find({
                $or: [
                    { IssueDate: { $lte: endDate }, ReturnDate: { $gte: startDate } },
                ],
            }).select('CarsId');
            return bookedCars.map((booking) => booking.CarsId);
        });
    }
}
exports.BookingRepository = BookingRepository;
