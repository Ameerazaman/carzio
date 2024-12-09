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
exports.ProviderController = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const GenerateAndSendOtp_1 = require("../../Utlis/GenerateAndSendOtp");
const http_status_codes_1 = require("http-status-codes");
const VerifyTokens_1 = require("../../Utlis/VerifyTokens");
const { BAD_REQUEST, OK, INTERNAL_SERVER_ERROR, UNAUTHORIZED } = http_status_codes_1.StatusCodes;
class ProviderController {
    constructor(providerServices) {
        this.providerServices = providerServices;
        this.milliseconds = (h, m, s) => ((h * 60 * 60 + m * 60 + s) * 1000);
    }
    // ***********************refersh accesss token for provider*****************
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
                const result = yield this.providerServices.providerGetById(decoded.data);
                const accessTokenMaxAge = process.env.ACCESS_TOKEN_MAX_AGE
                    ? parseInt(process.env.ACCESS_TOKEN_MAX_AGE, 10) : 5 * 60 * 1000;
                const newAccessToken = (_a = result === null || result === void 0 ? void 0 : result.data) === null || _a === void 0 ? void 0 : _a.token;
                res.cookie('access_token', newAccessToken, {
                    maxAge: accessTokenMaxAge,
                    httpOnly: true,
                    secure: true,
                    sameSite: 'none',
                });
                res.status(200).json({ success: true });
            }
            catch (error) {
                next(error);
            }
        });
    }
    // ******************************provider signup************************8
    ProviderSignup(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                req.app.locals.ProviderData = req.body;
                const existingUser = yield this.providerServices.emailExistCheck(req.app.locals.ProviderData.email);
                if (existingUser) {
                    res.status(BAD_REQUEST).json({ success: false, message: 'The email is already in use for provider!' });
                }
                else {
                    req.app.locals.newProvider = true;
                    req.app.locals.providerEmail = req.body.email;
                    const otp = yield (0, GenerateAndSendOtp_1.generateAndSendOTP)(req.body.email);
                    const otpData = yield this.providerServices.createOtp(req.body.email, Number(otp));
                    res.status(OK).json({ providerId: null, success: true, message: 'OTP sent for verification...' });
                }
            }
            catch (error) {
                console.log(error);
                res.status(INTERNAL_SERVER_ERROR).json({ success: false, message: 'Internal server error' });
            }
        });
    }
    /*********************************resend Otp for provider***************** */
    ProviderResendOtp(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const email = req.app.locals.providerEmail;
                const otp = yield (0, GenerateAndSendOtp_1.generateAndSendOTP)(email);
                if (otp) {
                    const result = yield this.providerServices.updateOtp(email, otp);
                    req.app.locals.userOtp = otp;
                    req.app.locals.resendOtp = otp;
                    return res.status(OK).json({
                        success: true,
                        message: 'Resend OTP successfully',
                    });
                }
                else {
                    return res.status(BAD_REQUEST).json({
                        success: false,
                        message: 'Error during OTP resend'
                    });
                }
            }
            catch (error) {
                return res.status(INTERNAL_SERVER_ERROR).json({
                    success: false,
                    message: 'Internal Server Error.'
                });
            }
        });
    }
    // *******************************verify provider Otp*********************************
    verifyOtp(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { otp } = req.body;
                let email = req.app.locals.providerEmail;
                var OTPRecord = yield this.providerServices.verifyOtp(email, otp);
                if (!OTPRecord) {
                    return res.status(BAD_REQUEST).json({ success: false, message: 'No OTP record found!' });
                }
                if (OTPRecord) {
                    const providerData = req.app.locals.ProviderData;
                    const savedProvider = yield this.providerServices.saveProvider(providerData);
                    if (savedProvider) {
                        const deleteOtp = yield this.providerServices.deleteOtp(email);
                        return res.status(OK).json({
                            success: true,
                            provider: savedProvider,
                        });
                    }
                    else {
                        return res.status(INTERNAL_SERVER_ERROR).json({
                            success: false,
                            message: 'Error saving user after OTP verification',
                        });
                    }
                }
                else {
                    return res.status(BAD_REQUEST).json({ success: false, message: 'Incorrect OTP!' });
                }
            }
            catch (error) {
                return res.status(INTERNAL_SERVER_ERROR).json({ success: false, message: 'Internal Server Error.' });
            }
        });
    }
    // ****************************forgot Password*******************************
    forgotPassword(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                req.app.locals.providerEmail = req.body.email;
                const existingUser = yield this.providerServices.emailExistCheck(req.body.email);
                if (!existingUser) {
                    res.status(BAD_REQUEST).json({ success: false, message: 'The email is already in use!' });
                }
                else {
                    const otp = yield (0, GenerateAndSendOtp_1.generateAndSendOTP)(req.body.email);
                    const otpData = yield this.providerServices.createOtp(req.body.email, Number(otp));
                    res.status(OK).json({ userId: null, success: true, message: 'OTP sent for verification...' });
                }
            }
            catch (error) {
                console.log(error);
                res.status(INTERNAL_SERVER_ERROR).json({ success: false, message: 'Internal server error' });
            }
        });
    }
    // ********************************verify otp for forgot password*********************
    verifyOtpForgotPassword(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { otp } = req.body;
                let email = req.app.locals.providerEmail;
                console.log(otp, email);
                var OTPRecord = yield this.providerServices.verifyOtp(email, otp);
                console.log(otp, email);
                if (!OTPRecord) {
                    return res.status(BAD_REQUEST).json({ success: false, message: 'No OTP record found!' });
                }
                if (otp === OTPRecord.otp.toString()) {
                    return res.status(OK).json({
                        success: true,
                        message: 'OTP verified Successfully',
                    });
                }
                else {
                    return res.status(BAD_REQUEST).json({ success: false, message: 'Incorrect OTP!' });
                }
            }
            catch (error) {
                return res.status(INTERNAL_SERVER_ERROR).json({ success: false, message: 'Internal Server Error.' });
            }
        });
    }
    // **********************************change password*****************************
    changePassword(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const password = req.body.password;
                const email = req.app.locals.providerEmail;
                const result = yield this.providerServices.changePassword(email, password);
                if (!result) {
                    return res.status(BAD_REQUEST).json({ success: false, message: 'Password change failed!' });
                }
                return res.status(OK).json({ success: true, message: 'Password changed successfully!' });
            }
            catch (error) {
                return res.status(INTERNAL_SERVER_ERROR).json({ success: false, message: 'Internal server error.' });
            }
        });
    }
    // **************************************************provider Login*******************
    providerLogin(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password } = req.body;
                const result = yield this.providerServices.providerSignIn({ email, password });
                if (result === null || result === void 0 ? void 0 : result.data.success) {
                    const access_token = result.data.token;
                    const refresh_token = result.data.refreshToken;
                    const accessTokenMaxAge = process.env.ACCESS_TOKEN_MAX_AGE
                        ? parseInt(process.env.ACCESS_TOKEN_MAX_AGE, 10) : 5 * 60 * 1000;
                    const refreshTokenMaxAge = process.env.REFRESH_TOKEN_MAX_AGE
                        ? parseInt(process.env.REFRESH_TOKEN_MAX_AGE, 10) : 48 * 60 * 60 * 1000;
                    return res.status(OK)
                        .cookie('access_token', access_token, {
                        maxAge: accessTokenMaxAge,
                        httpOnly: true,
                        secure: true,
                        sameSite: 'none',
                    })
                        .cookie('refresh_token', refresh_token, {
                        maxAge: refreshTokenMaxAge,
                        httpOnly: true,
                        secure: true,
                        sameSite: 'none',
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
    // **************************************provider Logout***********************
    providerLogout(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                res.clearCookie('access_token', {
                    httpOnly: true,
                    secure: true, // Ensure this matches `secure` from res.cookie in login
                    sameSite: 'none', // Ensure this matches `sameSite` from res.cookie in login
                });
                res.clearCookie('refresh_token', {
                    httpOnly: true,
                    secure: true, // Ensure this matches `secure` from res.cookie in login
                    sameSite: 'none', // Ensure this matches `sameSite` from res.cookie in login
                });
                res.status(200).json({ success: true, message: "Logged out successfully" });
            }
            catch (error) {
                res.status(500).json({ message: "Internal server error" });
            }
        });
    }
    // ****************************check provider address exist or not******************
    checkProviderAddrress(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = req.params.id;
                if (!id || typeof id !== "string") {
                    return res.status(400).json({ message: "Invalid ID parameter" });
                }
                const address = yield this.providerServices.checkProviderAddress(id);
                if (address) {
                    return res.status(200).json(address);
                }
                else {
                    return res.status(400).json({ message: "Address not found" });
                }
            }
            catch (error) {
                return res.status(500).json({ message: "Internal server error" });
            }
        });
    }
    // ******************************save profile of provider************************
    saveProfile(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                req.app.locals.profile = req.body.profileData;
                const result = yield this.providerServices.saveProfile(req.app.locals.profile);
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
    // **************************edit profile*********************************
    editProfile(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = req.params.id;
                if (!id) {
                    return res.status(400).json({ message: 'ID is missing' });
                }
                const profileData = req.body;
                if (!profileData) {
                    return res.status(400).json({ message: 'Profile data is missing' });
                }
                const result = yield this.providerServices.editProfile(profileData, id);
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
    // *************************************update Profileimage*******************************
    updateProfileImage(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                if (!id) {
                    return res.status(400).json({ message: 'ID is missing' });
                }
                const uploadedFile = req.file;
                if (!uploadedFile) {
                    return res.status(400).json({ message: 'No image file uploaded' });
                }
                const imagePath = `/uploads/${uploadedFile.filename}`;
                const result = yield this.providerServices.updateProfileImage(req.file, id);
                if ((result === null || result === void 0 ? void 0 : result.status) === OK) {
                    return res.status(OK).json(result.data);
                }
                else {
                    return res.status(INTERNAL_SERVER_ERROR).json({ message: "Failed to update profile image" });
                }
            }
            catch (error) {
                return res.status(500).json({ message: "Internal server error" });
            }
        });
    }
    // *************************************Addd car details******************************
    addCarDetails(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const carData = req.body;
                const uploadedFiles = req.files;
                const imagePaths = uploadedFiles.map((file) => `/uploads/${file.filename}`);
                carData.images = imagePaths;
                let result = yield this.providerServices.addCarDetails(req.files, carData);
                if ((result === null || result === void 0 ? void 0 : result.status) === OK) {
                    return res.status(OK).json(result.data);
                }
                else {
                    return res.status(INTERNAL_SERVER_ERROR).json({ message: "Car Already exist" }); // Handle internal error from service
                }
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
                const page = req.query.page ? Number(req.query.page) : undefined;
                const limit = req.query.limit ? Number(req.query.limit) : undefined;
                const providerId = req.query.providerId;
                if (page !== undefined && limit !== undefined) {
                    const result = yield this.providerServices.fetchCars(providerId, page, limit);
                    if (result) {
                        res.status(200).json(result.data);
                    }
                    else {
                        res.status(500).json({ message: "Internal server error" });
                    }
                }
                else {
                    res.status(400).json({ message: "Invalid page or limit" });
                }
            }
            catch (error) {
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
                const carExist = yield this.providerServices.updateStatusCar(id);
                if (!carExist) {
                    return res.status(400).json({ message: "Car not found" });
                }
                return res.status(200).json({ message: "Car status updated successfully", car: carExist });
            }
            catch (error) {
                return res.status(500).json({ message: "Internal server error" });
            }
        });
    }
    //   / ***********************************get Edit Car for car mgt*****************
    editCar(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = req.params.id;
                if (!id || typeof id !== "string" || !mongoose_1.default.Types.ObjectId.isValid(id)) {
                    return res.status(400).json({ message: "Invalid ID parameter" });
                }
                const carExist = yield this.providerServices.editCar(id);
                if (!carExist) {
                    return res.status(400).json({ message: "Car not found" });
                }
                return res.status(200).json(carExist);
            }
            catch (error) {
                return res.status(500).json({ message: "Internal server error" });
            }
        });
    }
    // *****************************update Car**********************
    updateCar(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = req.params.id;
                if (!id) {
                    return res.status(400).json({ message: 'ID is missing' });
                }
                const carData = req.body;
                let result = yield this.providerServices.updateCar(carData, id);
                if ((result === null || result === void 0 ? void 0 : result.status) === OK) {
                    return res.status(OK).json(result.data);
                }
                else {
                    return res.status(INTERNAL_SERVER_ERROR).json({ message: "Car already exists" });
                }
            }
            catch (error) {
                return res.status(500).json({ message: "Internal server error" });
            }
        });
    }
    // ************************************update Car image******************************
    updateCarImage(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = req.params.id;
                if (!id) {
                    return res.status(400).json({ message: 'ID is missing' });
                }
                const carData = req.body;
                const uploadedFiles = req.files; // Uploaded image files
                const imagePaths = uploadedFiles.map((file) => `/uploads/${file.filename}`);
                carData.images = imagePaths;
                let result = yield this.providerServices.updateCarImage(req.files, id);
                if ((result === null || result === void 0 ? void 0 : result.status) === OK) {
                    return res.status(OK).json(result.data);
                }
                else {
                    return res.status(INTERNAL_SERVER_ERROR).json({ message: "Car already exists" });
                }
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
                const providerId = req.query.providerId;
                const page = req.query.page ? Number(req.query.page) : 1;
                const limit = req.query.limit ? Number(req.query.limit) : 10;
                const result = yield this.providerServices.getBookingHistory(providerId, page, limit);
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
                const result = yield this.providerServices.specificBookingDetails(bookingId);
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
                const result = yield this.providerServices.updateStatusOfBooking(bookingId, status);
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
    // *****************************fetch users chat by provider*****************
    fetchUsersChat(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const providerId = req.params.providerId;
                const result = yield this.providerServices.fetchUsersChat(providerId);
                if (!result) {
                    res.status(500).json({ message: "Fetch users chat is failed" });
                    return;
                }
                res.status(200).json(result.data);
            }
            catch (error) {
                res.status(500).json({ message: "Internal server error" });
            }
        });
    }
    // *********************************fetch chat history***********************8
    fetchChatHistory(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const providerId = req.params.providerId;
                const userId = req.params.userId;
                if (!userId || !providerId) {
                    res.status(400).json({ success: false, message: "userId and providerId are required" });
                    return;
                }
                const result = yield this.providerServices.fetchChatHistory(userId, providerId);
                if ((_a = result === null || result === void 0 ? void 0 : result.data) === null || _a === void 0 ? void 0 : _a.success) {
                    res.status(200).json({
                        success: true,
                        data: result.data.data,
                    });
                }
                else {
                    res.status(200).json({
                        success: false,
                        message: "No chat history found",
                    });
                }
            }
            catch (error) {
                console.error("Error in fetch chat history:", error);
                res.status(500).json({
                    success: false,
                    message: "An unexpected error occurred while fetching chat history",
                });
            }
        });
    }
    // **************************get dash board constsnt data**********************
    getDashboardConstData(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const providerId = req.params.providerId;
                const result = yield this.providerServices.getConstDashboardData(providerId);
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
                const providerId = req.query.providerId;
                const result = yield this.providerServices.fetchSalesReport(page, limit, providerId);
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
exports.ProviderController = ProviderController;
