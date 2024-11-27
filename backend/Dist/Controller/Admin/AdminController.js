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
exports.AdminController = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const http_status_codes_1 = require("http-status-codes");
const VerifyTokens_1 = require("../../Utlis/VerifyTokens");
const { BAD_REQUEST, OK, INTERNAL_SERVER_ERROR, UNAUTHORIZED } = http_status_codes_1.StatusCodes;
class AdminController {
    constructor(adminServices) {
        this.adminServices = adminServices;
    }
    //  *******************************refresh access token for admin*************************
    refreshToken(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const refreshToken = req.cookies.refresh_token;
            if (!refreshToken)
                res
                    .status(401)
                    .json({ success: false });
            try {
                const decoded = (0, VerifyTokens_1.verifyRefreshToken)(refreshToken);
                if (!decoded || !decoded.data) {
                    res.status(401).json({ success: false, message: "Refresh Token Expired" });
                }
                const result = yield this.adminServices.adminGetById(decoded.data);
                const accessTokenMaxAge = 5 * 60 * 1000;
                const newAccessToken = (_a = result === null || result === void 0 ? void 0 : result.data) === null || _a === void 0 ? void 0 : _a.token;
                res.cookie('access_token', newAccessToken, {
                    maxAge: accessTokenMaxAge,
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                });
                res.status(200).json({ success: true });
            }
            catch (error) {
                next(error);
            }
        });
    }
    // ***********************************admin Login**************************8
    adminLogin(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password } = req.body;
                const result = yield this.adminServices.adminSignIn({ email, password });
                if (result === null || result === void 0 ? void 0 : result.data.success) {
                    const access_token = result.data.token;
                    const refresh_token = result.data.refreshToken;
                    const accessTokenMaxAge = 5 * 60 * 1000;
                    const refreshTokenMaxAge = 48 * 60 * 60 * 1000;
                    return res.status(OK)
                        .cookie('access_token', access_token, {
                        maxAge: accessTokenMaxAge,
                        httpOnly: true,
                        secure: process.env.NODE_ENV === 'production'
                    })
                        .cookie('refresh_token', refresh_token, {
                        maxAge: refreshTokenMaxAge,
                        httpOnly: true,
                        secure: process.env.NODE_ENV === 'production'
                    })
                        .json({ success: true, user: result.data, message: result.data.message });
                }
                else {
                    return res.status(BAD_REQUEST).json({ success: false, message: result === null || result === void 0 ? void 0 : result.data.message });
                }
            }
            catch (error) {
                return res.status(INTERNAL_SERVER_ERROR).json({ message: "Internal server error" });
            }
        });
    }
    // ***************************admin logout***************************
    adminLogout(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                res.clearCookie('access_token', {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production'
                });
                res.clearCookie('refresh_token', {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production'
                });
                res.status(200).json({ success: true, message: "Logged out successfully" });
            }
            catch (error) {
                console.error("Error during admin logout:", error);
                res.status(500).json({ message: "Internal server error" });
            }
        });
    }
    // ******************************fetch users**************************
    fetchUsers(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const page = req.query.page ? Number(req.query.page) : 1;
                const limit = req.query.limit ? Number(req.query.limit) : 10;
                const result = yield this.adminServices.fetchUsers(page, limit);
                if (result) {
                    res.status(result.status).json(result.data);
                }
                else {
                    res.status(500).json({ message: "Internal server error" });
                }
            }
            catch (error) {
                res.status(500).json({ message: "Internal server error" });
            }
        });
    }
    // **********************************edit User******************************8
    editUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = req.params.id;
                if (!id || typeof id !== "string" || !mongoose_1.default.Types.ObjectId.isValid(id)) {
                    return res.status(400).json({ message: "Invalid ID parameter" });
                }
                const userExist = yield this.adminServices.editUser(id);
                if (!userExist) {
                    return res.status(404).json({ message: "User not found" });
                }
                return res.status(200).json(userExist);
            }
            catch (error) {
                return res.status(500).json({ message: "Internal server error" });
            }
        });
    }
    // *****************************************update user****************************
    updateUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = req.params.id;
                if (!id) {
                    return res.status(400).json({ message: 'ID is missing' });
                }
                const userData = req.body;
                if (!userData) {
                    return res.status(400).json({ message: 'Profile data is missing' });
                }
                const result = yield this.adminServices.updateUser(userData, id);
                if ((result === null || result === void 0 ? void 0 : result.status) === OK) {
                    return res.status(OK).json(result.data);
                }
                else {
                    return res.status(INTERNAL_SERVER_ERROR).json(result === null || result === void 0 ? void 0 : result.data);
                }
            }
            catch (error) {
                return res.status(500).json({ message: "Internal server error" });
            }
        });
    }
    // ********************************* update status of Userss*****************
    updateStatus(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = req.params.id;
                if (!id || typeof id !== "string" || !mongoose_1.default.Types.ObjectId.isValid(id)) {
                    return res.status(400).json({ message: "Invalid ID parameter" });
                }
                const userExist = yield this.adminServices.updateStatus(id);
                if (!userExist) {
                    return res.status(404).json({ message: "User not found" });
                }
                return res.status(200).json(userExist);
            }
            catch (error) {
                return res.status(500).json({ message: "Internal server error" });
            }
        });
    }
    // ********************************fetch providers*********************
    fetchProviders(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const page = req.query.page ? Number(req.query.page) : 1;
                const limit = req.query.limit ? Number(req.query.limit) : 10;
                const result = yield this.adminServices.fetchProviders(page, limit);
                if (result) {
                    res.status(result.status).json(result.data);
                }
                else {
                    res.status(500).json({ message: "Internal server error" });
                }
            }
            catch (error) {
                res.status(500).json({ message: "Internal server error" });
            }
        });
    }
    // ******************************edit provider****************************88
    editProvider(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = req.params.id;
                if (!id || typeof id !== "string" || !mongoose_1.default.Types.ObjectId.isValid(id)) {
                    return res.status(400).json({ message: "Invalid ID parameter" });
                }
                const providerExist = yield this.adminServices.editProvider(id);
                if (!providerExist) {
                    return res.status(404).json({ message: "provider not found" });
                }
                return res.status(200).json(providerExist);
            }
            catch (error) {
                return res.status(500).json({ message: "Internal server error" });
            }
        });
    }
    // ***********************************update provider*********************88
    updateProvider(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = req.params.id;
                if (!id) {
                    return res.status(400).json({ message: 'ID is missing' });
                }
                const providerData = req.body;
                if (!providerData) {
                    return res.status(400).json({ message: 'Profile data is missing' });
                }
                const result = yield this.adminServices.updateProvider(providerData, id);
                if ((result === null || result === void 0 ? void 0 : result.status) === OK) {
                    return res.status(OK).json(result.data);
                }
                else {
                    return res.status(INTERNAL_SERVER_ERROR).json(result === null || result === void 0 ? void 0 : result.data);
                }
            }
            catch (error) {
                return res.status(500).json({ message: "Internal server error" });
            }
        });
    }
    // *************************8888update status provider*************************
    updateStatusProvider(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = req.params.id;
                if (!id || typeof id !== "string" || !mongoose_1.default.Types.ObjectId.isValid(id)) {
                    return res.status(400).json({ message: "Invalid ID parameter" });
                }
                const providerExist = yield this.adminServices.updateStatusProvider(id);
                if (!providerExist) {
                    return res.status(404).json({ message: "provider not found" });
                }
                return res.status(200).json(providerExist);
            }
            catch (error) {
                return res.status(500).json({ message: "Internal server error" });
            }
        });
    }
    // *************************fetch notification that send by providers****************
    fetchNotification(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.adminServices.fetchNotification();
                if (result) {
                    res.status(result.status).json(result.data);
                }
                else {
                    res.status(500).json({ message: "Internal server error" });
                }
            }
            catch (error) {
                res.status(500).json({ message: "Internal server error" });
            }
        });
    }
    // ***************************fetch notification details*****************
    notificationDetails(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = req.params.id;
                if (!id || typeof id !== "string" || !mongoose_1.default.Types.ObjectId.isValid(id)) {
                    return res.status(400).json({ message: "Invalid ID parameter" });
                }
                const carDocumentExist = yield this.adminServices.notificationDetails(id);
                if (!carDocumentExist) {
                    return res.status(400).json({ message: "car documnet not found" });
                }
                return res.status(200).json(carDocumentExist);
            }
            catch (error) {
                return res.status(500).json({ message: "Internal server error" });
            }
        });
    }
    //  ********************************verify notification(reject or accept)**************
    verifyNotification(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = req.params.id;
                const value = req.params.value;
                if (!id || typeof id !== "string" || !mongoose_1.default.Types.ObjectId.isValid(id)) {
                    return res.status(400).json({ message: "Invalid ID parameter" });
                }
                let result = yield this.adminServices.verifynotification(id, value);
                if (result) {
                    if (value === "Accept") {
                        return res.status(200).json({ message: "Car Accepted" });
                    }
                    else if (value === "Reject") {
                        return res.status(200).json({ message: "Car Rejected" });
                    }
                }
                return res.status(400).json({ message: "Notification not found or invalid action" });
            }
            catch (error) {
                return res.status(500).json({ message: "Internal server error" });
            }
        });
    }
    // *************************fetch car for car management********************
    fetchCars(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const page = req.query.page ? Number(req.query.page) : 1;
                const limit = req.query.limit ? Number(req.query.limit) : 10;
                const result = yield this.adminServices.fetchCars(page, limit);
                if (result) {
                    res.status(result.status).json(result.data);
                }
                else {
                    res.status(500).json({ message: "Internal server error" });
                }
            }
            catch (error) {
                console.error("Error during fetch cars:", error);
                res.status(500).json({ message: "Internal server error" });
            }
        });
    }
    // ******************************Change car status*****************************
    updateStatusCar(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = req.params.id;
                if (!id || !mongoose_1.default.Types.ObjectId.isValid(id)) {
                    return res.status(400).json({ message: "Invalid car ID" });
                }
                const carExist = yield this.adminServices.updateStatusCar(id);
                if (!carExist) {
                    return res.status(400).json({ message: "Car not found" });
                }
                return res.status(200).json({ message: "Car status updated successfully", car: carExist });
            }
            catch (error) {
                console.error("Error updating car status:", error);
                return res.status(500).json({ message: "Internal server error" });
            }
        });
    }
    // ***********************Add offer*************************
    addOffer(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const saveOffer = yield this.adminServices.addOffer(req.body.offer);
                if (!saveOffer) {
                    return res.status(400).json({ message: "Offer is not saved" });
                }
                return res.status(200).json({ message: "Offer saved updated successfully", car: req.body });
            }
            catch (error) {
                return res.status(500).json({ message: "Internal server error" });
            }
        });
    }
    // ***************************fetch Offer**********************
    fetchOffer(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const page = req.query.page ? Number(req.query.page) : 1;
                const limit = req.query.limit ? Number(req.query.limit) : 10;
                const result = yield this.adminServices.fetchOffer(page, limit);
                if (result) {
                    res.status(result.status).json(result.data);
                }
                else {
                    res.status(500).json({ message: "Internal server error" });
                }
            }
            catch (error) {
                res.status(500).json({ message: "Internal server error" });
            }
        });
    }
    // ************************************8edit offer***************************
    editOffer(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = req.params.id;
                if (!id || typeof id !== "string" || !mongoose_1.default.Types.ObjectId.isValid(id)) {
                    return res.status(400).json({ message: "Invalid ID parameter" });
                }
                const offerExist = yield this.adminServices.editOffer(id);
                if (!offerExist) {
                    return res.status(404).json({ message: "Offer not found" });
                }
                return res.status(200).json(offerExist);
            }
            catch (error) {
                return res.status(500).json({ message: "Internal server error" });
            }
        });
    }
    // ***********************************update offer*************************
    updateOffer(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = req.params.id;
                if (!id) {
                    return res.status(400).json({ message: 'ID is missing' });
                }
                const offerData = req.body;
                if (!offerData) {
                    return res.status(400).json({ message: 'offer data is missing' });
                }
                const result = yield this.adminServices.updateOffer(offerData, id);
                if ((result === null || result === void 0 ? void 0 : result.status) === OK) {
                    return res.status(OK).json(result.data); // Return success response
                }
                else {
                    return res.status(INTERNAL_SERVER_ERROR).json(result === null || result === void 0 ? void 0 : result.data); // Handle internal error from service
                }
            }
            catch (error) {
                return res.status(500).json({ message: "Internal server error" });
            }
        });
    }
    // *******************************delete Offer*********************888
    updateStatusOffer(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = req.params.id;
                if (!id || !mongoose_1.default.Types.ObjectId.isValid(id)) {
                    return res.status(400).json({ message: "Invalid car ID" });
                }
                const offerExist = yield this.adminServices.updateStatusOffer(id);
                if (!offerExist) {
                    return res.status(404).json({ message: "Offer not found" });
                }
                return res.status(200).json({ message: "Offer updateStatusOffer successfully", data: offerExist });
            }
            catch (error) {
                return res.status(500).json({ message: "Internal server error" });
            }
        });
    }
    // *************************add coupon**************************
    addCoupon(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const saveCoupon = yield this.adminServices.addCoupon(req.body.coupon);
                if (!saveCoupon) {
                    return res.status(404).json({ message: "Coupon is not saved" });
                }
                return res.status(200).json({ message: "Coupon saved updated successfully", car: req.body });
            }
            catch (error) {
                return res.status(500).json({ message: "Internal server error" });
            }
        });
    }
    // ***************************fetch Coupon**********************
    fetchCoupon(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const page = req.query.page ? Number(req.query.page) : 1;
                const limit = req.query.limit ? Number(req.query.limit) : 10;
                const result = yield this.adminServices.fetchCoupon(page, limit);
                if (result) {
                    res.status(result.status).json(result.data);
                }
                else {
                    res.status(500).json({ message: "Internal server error" });
                }
            }
            catch (error) {
                res.status(500).json({ message: "Internal server error" });
            }
        });
    }
    // ************************************edit coupon***************************
    editCoupon(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = req.params.id;
                if (!id || typeof id !== "string" || !mongoose_1.default.Types.ObjectId.isValid(id)) {
                    return res.status(400).json({ message: "Invalid ID parameter" });
                }
                const couponExist = yield this.adminServices.editCoupon(id);
                if (!couponExist) {
                    return res.status(400).json({ message: "Coupon not found" });
                }
                return res.status(200).json(couponExist);
            }
            catch (error) {
                return res.status(500).json({ message: "Internal server error" });
            }
        });
    }
    // ***********************************update Coupon *************************
    updateCoupon(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = req.params.id;
                if (!id) {
                    return res.status(400).json({ message: 'ID is missing' });
                }
                const couponData = req.body;
                if (!couponData) {
                    return res.status(400).json({ message: 'coupon data is missing' });
                }
                const result = yield this.adminServices.updateCoupon(couponData, id);
                if ((result === null || result === void 0 ? void 0 : result.status) === OK) {
                    return res.status(OK).json(result.data);
                }
                else {
                    return res.status(INTERNAL_SERVER_ERROR).json(result === null || result === void 0 ? void 0 : result.data);
                }
            }
            catch (error) {
                return res.status(500).json({ message: "Internal server error" });
            }
        });
    }
    // *******************************delete Offer*********************888
    updateStatusCoupon(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = req.params.id;
                if (!id || !mongoose_1.default.Types.ObjectId.isValid(id)) {
                    return res.status(400).json({ message: "Invalid car ID" });
                }
                const couponExist = yield this.adminServices.updateStatusCoupon(id);
                if (!couponExist) {
                    return res.status(404).json({ message: "Coupon not found" });
                }
                return res.status(200).json({ message: "update successfully", data: couponExist });
            }
            catch (error) {
                return res.status(500).json({ message: "Internal server error" });
            }
        });
    }
    // ******************************get booking history**************************8
    getBookingHistory(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const page = req.query.page ? Number(req.query.page) : 1;
                const limit = req.query.limit ? Number(req.query.limit) : 10;
                const result = yield this.adminServices.getBookingHistory(page, limit);
                if (!result) {
                    res.status(500).json({ message: "Error booking history" });
                    return;
                }
                res.status(200).json(result.data);
            }
            catch (error) {
                res.status(500).json({ message: "Internal server error" });
            }
        });
    }
    // ******************************details of specic details**************************8
    specificBookingDetails(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const bookingId = req.params.id;
                const result = yield this.adminServices.specificBookingDetails(bookingId);
                if (!result) {
                    res.status(500).json({ message: "Error booking history" });
                    return;
                }
                res.status(200).json(result.data);
            }
            catch (error) {
                res.status(500).json({ message: "Internal server error" });
            }
        });
    }
    // *********************update Status Of Booking**********************
    updateStatusOfBooking(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const bookingId = req.params.id;
                const status = req.params.status;
                const result = yield this.adminServices.updateStatusOfBooking(bookingId, status);
                if (!result) {
                    res.status(500).json({ message: "Status updation failed" });
                    return;
                }
                res.status(200).json(result.data);
            }
            catch (error) {
                res.status(500).json({ message: "Internal server error" });
            }
        });
    }
    // **************************get dash board constsnt data**********************
    getDashboardConstData(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.adminServices.getConstDashboardData();
                if (!result) {
                    res.status(500).json({
                        message: "Dashboard data could not be retrieved"
                    });
                    return;
                }
                res.status(200).json(result.data.data);
            }
            catch (error) {
                res.status(500).json({
                    "message": "Internal server error while fetching dashboard data"
                });
            }
        });
    }
    // ***************************fetch sales report*********************
    fetchSalesReport(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const page = req.query.page ? Number(req.query.page) : 1;
                const limit = req.query.limit ? Number(req.query.limit) : 10;
                const result = yield this.adminServices.fetchSalesReport(page, limit);
                if (!result) {
                    res.status(500).json({ message: "Error fetching sales report" });
                    return;
                }
                res.status(200).json(result.data);
            }
            catch (error) {
                res.status(500).json({ message: "Internal server error" });
            }
        });
    }
}
exports.AdminController = AdminController;
