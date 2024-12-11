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
exports.UserController = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const GenerateAndSendOtp_1 = require("../../Utlis/GenerateAndSendOtp");
const HttpStatusCode_1 = require("../../Constants/HttpStatusCode");
const VerifyTokens_1 = require("../../Utlis/VerifyTokens");
const stripe_1 = __importDefault(require("stripe"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const { BAD_REQUEST, OK, INTERNAL_SERVER_ERROR, UNAUTHORIZED, } = HttpStatusCode_1.STATUS_CODES;
class UserController {
    constructor(userServices) {
        this.userServices = userServices;
        this.milliseconds = (h, m, s) => ((h * 60 * 60 + m * 60 + s) * 1000);
    }
    // ********************************refresh access token for user******************
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
                const result = yield this.userServices.userGetById(decoded.data);
                const accessTokenMaxAge = process.env.ACCESS_TOKEN_MAX_AGE
                    ? parseInt(process.env.ACCESS_TOKEN_MAX_AGE, 10)
                    : 5 * 60 * 1000;
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
    // ***********************user signup************************
    userSignup(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log(req.body, "req.body");
                req.app.locals.userData = req.body;
                const existingUser = yield this.userServices.emailExistCheck(req.app.locals.userData.email);
                console.log(existingUser, "existingUser");
                if (existingUser) {
                    res.status(BAD_REQUEST).json({ success: false, message: 'The email is already in use!' });
                }
                else {
                    req.app.locals.newUser = true;
                    req.app.locals.userEmail = req.body.email;
                    const otp = yield (0, GenerateAndSendOtp_1.generateAndSendOTP)(req.body.email);
                    console.log(otp, "otp");
                    const otpData = yield this.userServices.createOtp(req.body.email, otp);
                    res.status(OK).json({ userId: null, success: true, message: 'OTP sent for verification...' });
                }
            }
            catch (error) {
                console.log(error);
                res.status(INTERNAL_SERVER_ERROR).json({ success: false, message: 'Internal server error' });
            }
        });
    }
    // ***********************************resend otp********************
    resendOtp(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const email = req.app.locals.userEmail;
                const otp = yield (0, GenerateAndSendOtp_1.generateAndSendOTP)(email);
                if (otp) {
                    const result = yield this.userServices.updateOtp(email, otp);
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
    // **********************************verify otp***********************
    verifyOtp(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { otp } = req.body;
                let email = req.app.locals.userEmail;
                var OTPRecord = yield this.userServices.verifyOtp(email, otp);
                if (!OTPRecord) {
                    return res.status(BAD_REQUEST).json({ success: false, message: 'No OTP record found!' });
                }
                if (otp === OTPRecord.otp.toString()) {
                    const userData = req.app.locals.userData;
                    const savedUser = yield this.userServices.saveUser(userData);
                    if (savedUser) {
                        const deleteOtp = yield this.userServices.deleteOtp(email);
                        return res.status(OK).json({
                            success: true,
                            message: 'OTP verified Successfully',
                            user: savedUser,
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
                req.app.locals.userEmail = req.body.email;
                const existingUser = yield this.userServices.emailExistCheck(req.body.email);
                if (!existingUser) {
                    res.status(BAD_REQUEST).json({ success: false, message: 'The email is already in use!' });
                }
                else {
                    const otp = yield (0, GenerateAndSendOtp_1.generateAndSendOTP)(req.body.email);
                    const otpData = yield this.userServices.createOtp(req.body.email, otp);
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
                let email = req.app.locals.userEmail;
                var OTPRecord = yield this.userServices.verifyOtp(email, otp);
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
                const email = req.app.locals.userEmail;
                const result = yield this.userServices.changePassword(email, password);
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
    // *****************************user Login*******************************
    userLogin(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password } = req.body;
                const result = yield this.userServices.userSignIn({ email, password });
                console.log(result, "result");
                if (result === null || result === void 0 ? void 0 : result.data.success) {
                    const access_token = result.data.token;
                    const refresh_token = result.data.refreshToken;
                    const accessTokenMaxAge = process.env.ACCESS_TOKEN_MAX_AGE
                        ? parseInt(process.env.ACCESS_TOKEN_MAX_AGE, 10) : 5 * 60 * 1000;
                    const refreshTokenMaxAge = process.env.REFRESH_TOKEN_MAX_AGE
                        ? parseInt(process.env.REFRESH_TOKEN_MAX_AGE, 10) : 48 * 60 * 60 * 1000;
                    return res.status(200)
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
    // ************************************user Logout **************************
    userLogout(req, res) {
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
    // ****************************fetch  car for card***************************
    fetchCars(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const page = req.query.page ? Number(req.query.page) : undefined;
                const limit = req.query.limit ? Number(req.query.limit) : undefined;
                if (page !== undefined && limit !== undefined) {
                    const result = yield this.userServices.fetchCars(page, limit);
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
    // *********************************car details page********************
    carDetails(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = req.params.id;
                if (!id || typeof id !== "string" || !mongoose_1.default.Types.ObjectId.isValid(id)) {
                    return res.status(400).json({ message: "Invalid ID parameter" });
                }
                const carExist = yield this.userServices.carDetails(id);
                if (!carExist) {
                    return res.status(400).json({ message: "Car not found or car is blocked" });
                }
                return res.status(200).json(carExist.data);
            }
            catch (error) {
                return res.status(500).json({ message: "Internal server error" });
            }
        });
    }
    // *****************************filter****************
    filterCar(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { engineType, fuelType, sortPrice, searchQuery } = req.body.params;
                const carExist = yield this.userServices.carFilter(engineType, fuelType, sortPrice);
                if (!carExist || carExist.length === 0) {
                    return res.status(200).json({ message: "Car not found" });
                }
                return res.status(200).json(carExist);
            }
            catch (error) {
                return res.status(500).json({ message: "Internal server error" });
            }
        });
    }
    // ***********************************search Car************************
    searchCar(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const carExist = yield this.userServices.searchCar(req.body.searchQuery);
                if (!carExist) {
                    return res.status(404).json({ message: "Car not found" });
                }
                return res.status(200).json(carExist);
            }
            catch (error) {
                return res.status(500).json({ message: "Internal server error" });
            }
        });
    }
    // ***********************fetch offer**********************8
    fetchOffer(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.userServices.fetchOffer(); // Fetch offers from service
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
    //******************************check profile********************************
    checkProfile(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.params.id;
                const result = yield this.userServices.checkProfile(userId);
                if (!result) {
                    res.status(400);
                    return;
                }
                res.status(200).json(result);
            }
            catch (error) {
                res.status(500).json({ message: "Internal server error" });
            }
        });
    }
    // ****************************savee Profile***********************
    saveProfile(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const profileData = req.body.profileData;
                const result = yield this.userServices.saveProfile(profileData);
                if (!result) {
                    res.status(500).json({ message: "Error saving profile" });
                    return;
                }
                res.status(200).json({
                    success: true,
                    message: 'Profile saved successfully',
                    data: result
                });
            }
            catch (error) {
                res.status(500).json({ message: "Internal server error" });
            }
        });
    }
    // ******************************8Edit profile*******************
    editProfile(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const profileData = req.body.profileData;
                const profileId = req.params.id;
                const result = yield this.userServices.editProfile(profileData, profileId);
                if (!result) {
                    res.status(500).json({ message: "Error editing profile" });
                    return;
                }
                res.status(200).json({
                    success: true,
                    message: 'Profile edit successfully',
                    data: result
                });
            }
            catch (error) {
                res.status(500).json({ message: "Internal server error" });
            }
        });
    }
    // ********************************check Address***********************
    checkAddress(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.params.id;
                const result = yield this.userServices.checkAddress(userId);
                if (!result) {
                    res.status(500).json({ message: 'No address found. Please create a new address.' });
                    return;
                }
                res.status(200).json({
                    success: true,
                    data: result
                });
            }
            catch (error) {
                res.status(500).json({ message: "Internal server error" });
            }
        });
    }
    // ****************************savee Address***********************
    saveAddress(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const addressData = req.body.addressData;
                const result = yield this.userServices.saveAddress(addressData);
                if (!result) {
                    res.status(500).json({ message: "Error saving Address" });
                    return;
                }
                res.status(200).json({
                    success: true,
                    message: 'Address saved successfully',
                    data: result
                });
            }
            catch (error) {
                res.status(500).json({ message: "Internal server error" });
            }
        });
    }
    // ******************************8Edit Address*******************
    editAddress(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const addressData = req.body.addressData;
                const addressId = req.params.id;
                const result = yield this.userServices.editAddress(addressData, addressId);
                if (!result) {
                    res.status(500).json({ message: "Error editing address" });
                    return;
                }
                res.status(200).json({
                    success: true,
                    message: 'Address edit successfully',
                    data: result
                });
            }
            catch (error) {
                res.status(500).json({ message: "Internal server error" });
            }
        });
    }
    // *************************************fetch coupon******************8
    fetchCoupon(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.params.id;
                const result = yield this.userServices.fetchCoupon(userId);
                if (!result) {
                    res.status(500).json({ message: "Error fetch coupon" });
                    return;
                }
                res.status(result.status).json(result.data);
            }
            catch (error) {
                res.status(500).json({ message: "Internal server error" });
            }
        });
    }
    //*********************** */ Check offer for Booking**********************
    checkOfferForBooking(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const carName = req.params.car_name;
                const result = yield this.userServices.checkOfferForBookiing(carName);
                if (!result) {
                    res.status(500).json({ message: "No Offers" });
                    return;
                }
                res.status(result.status).json(result.data);
            }
            catch (error) {
                res.status(500).json({ message: "Internal server error" });
            }
        });
    }
    // *************************save BookingData*********************
    saveBookingData(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const bookingData = req.body;
                const result = yield this.userServices.saveBookingData(bookingData);
                if (!result) {
                    res.status(500).json({ message: "Error saving Booking" });
                    return;
                }
                res.status(200).json({
                    success: true,
                    message: 'Booking Successfully',
                    data: result
                });
            }
            catch (error) {
                res.status(500).json({ message: "Internal server error" });
            }
        });
    }
    // *************************payment for stripe*******************
    paymentForStripe(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { amount } = req.body;
            try {
                const stripe = new stripe_1.default(process.env.NEXT_PUBLIC_STRIPE_PRICE_ID);
                const paymentIntent = yield stripe.paymentIntents.create({
                    amount: amount,
                    currency: 'usd',
                    payment_method_types: ['card'],
                });
                res.send({
                    clientSecret: paymentIntent.client_secret,
                });
            }
            catch (error) {
                res.status(500).send({ error: 'Internal Server Error' });
            }
        });
    }
    //  ********************stored userid in coupon********************
    userIdInCoupon(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const coupon = req.params.coupon;
                const userId = req.params.userId;
                const result = yield this.userServices.userIdInCoupon(coupon, userId);
                if (!result) {
                    res.status(500).json({ message: "Error Coupon Updating" });
                    return;
                }
                res.status(200).json({
                    success: true,
                    data: result
                });
            }
            catch (error) {
                res.status(500).json({ message: "Internal server error" });
            }
        });
    }
    // ******************************get booking history**************************8
    getBookingHistory(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.query.userId;
                const page = req.query.page ? Number(req.query.page) : 1;
                const limit = req.query.limit ? Number(req.query.limit) : 10;
                if (!userId) {
                    res.status(400).json({ message: "User ID is required." });
                    return;
                }
                const result = yield this.userServices.getBookingHistory(userId, page, limit);
                if (!result) {
                    res.status(500).json({ message: "Error fetching booking history" });
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
                const result = yield this.userServices.specificBookingDetails(bookingId);
                if (!result) {
                    res.status(404).json({ message: "Booking not found" });
                    return;
                }
                res.status(200).json(result.data);
            }
            catch (error) {
                res.status(500).json({ message: "Internal server error" });
            }
        });
    }
    // *********************cancel booking By user add amount to wallet**********************
    cancelBookingByUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const bookingId = req.query.bookingId;
                const userId = req.query.userId;
                const amount = req.query.amount ? Number(req.query.amount) : undefined;
                if (!bookingId || !userId || amount === undefined) {
                    res.status(400).json({ message: "Booking ID, User ID, and Amount are required" });
                    return;
                }
                const result = yield this.userServices.cancelBookingByUser(bookingId, userId, amount);
                if (!result) {
                    res.status(500).json({ message: "Error Cancel Booking" });
                }
                res.status(200).json(result);
            }
            catch (error) {
                res.status(500).json({ message: "Internal server error" });
            }
        });
    }
    // *********************cancel booking By user add amount to wallet**********************
    creditToWallet(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId, amount } = req.body;
                if (!userId || amount === undefined) {
                    res.status(400).json({ message: "User ID and Amount are required" });
                    return;
                }
                const result = yield this.userServices.creditToWallet(userId, amount);
                if (!result) {
                    res.status(500).json({ message: "Error Credit to Wallet" });
                    return;
                }
                res.status(200).json(result);
            }
            catch (error) {
                res.status(500).json({ message: "Internal server error" });
            }
        });
    }
    // **********************************check Booked Or Not**********************************
    checkBookedOrNot(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const issueDate = req.query.issueDate;
                const returnDate = req.query.returnDate;
                const carId = req.query.carId || '';
                if (!issueDate || !returnDate) {
                    res.status(400).json({ message: "Both issueDate and returnDate are required" });
                    return;
                }
                const result = yield this.userServices.checkBookedOrNot(issueDate, returnDate, carId);
                if (!result) {
                    res.status(404).json({ message: "No booking found for the given dates" });
                    return;
                }
                res.status(200).json(result);
            }
            catch (error) {
                res.status(500).json({ message: "Internal server error" });
            }
        });
    }
    // **********************************check and updtae wallet ***********************
    checkAndUpdateWallet(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.params.userId;
                const amount = Number(req.params.amount);
                if (!userId || isNaN(amount)) {
                    res.status(400).json({ message: "Both userId and a valid amount are required" });
                    return;
                }
                const result = yield this.userServices.checkWalletAndUpdate(userId, amount);
                if (!result) {
                    res.status(400).json({ message: "Insufficient balance or user not found" });
                    return;
                }
                res.status(200).json(result);
            }
            catch (error) {
                res.status(500).json({ message: "Internal server error" });
            }
        });
    }
    // ************************ get wallet ***********************
    getWallet(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.query.userId;
                const page = req.query.page ? Number(req.query.page) : 1;
                const limit = req.query.limit ? Number(req.query.limit) : 2;
                if (!userId) {
                    res.status(400).json({ message: "User ID is required." });
                    return;
                }
                const result = yield this.userServices.getWalletPage(userId, page, limit);
                if (!result) {
                    res.status(500).json({ message: "Error fetching booking history" });
                    return;
                }
                res.status(200).json(result.data);
            }
            catch (error) {
                res.status(500).json({ message: "Internal server error" });
            }
        });
    }
    // *******************************create Review and ratings*************************
    createReviewAndRatings(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const reviewData = req.body;
                if (!reviewData) {
                    res.status(400).json({ success: false, message: "Review data is required." });
                    return;
                }
                const result = yield this.userServices.createReviewData(reviewData);
                if ((_a = result === null || result === void 0 ? void 0 : result.data) === null || _a === void 0 ? void 0 : _a.success) {
                    res.status(201).json({
                        success: true,
                        message: "Review and rating created successfully.",
                        data: result.data.data,
                    });
                }
                else {
                    res.status(400).json({
                        success: false,
                        message: "Failed to create review and rating. Please try again.",
                    });
                }
            }
            catch (error) {
                res.status(500).json({
                    success: false,
                    message: "An unexpected error occurred while creating the review and rating.",
                });
            }
        });
    }
    // ***************************check BookId exist in review*****************
    checkBookIdinReview(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const bookId = req.query.bookId;
                if (!bookId) {
                    res.status(400).json({ success: false, message: "BookId is required." });
                    return;
                }
                const result = yield this.userServices.checkBookidInReview(bookId);
                if ((_a = result === null || result === void 0 ? void 0 : result.data) === null || _a === void 0 ? void 0 : _a.success) {
                    res.status(201).json({
                        success: true,
                        data: result.data.data,
                    });
                }
                else {
                    res.status(200).json({
                        success: false,
                    });
                }
            }
            catch (error) {
                res.status(500).json({
                    success: false,
                    message: "An unexpected error occurred while bookId in review",
                });
            }
        });
    }
    // *********************************fetch chat history***********************8
    fetchChatHistory(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const userId = req.params.userId;
                const providerId = req.params.providerId;
                if (!userId || !providerId) {
                    res.status(400).json({ success: false, message: "userId and providerId are required" });
                    return;
                }
                const result = yield this.userServices.fetchChatHistory(userId, providerId);
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
                res.status(500).json({
                    success: false,
                    message: "An unexpected error occurred while fetching chat history",
                });
            }
        });
    }
    // ******************************check car availabilty********************
    searchCarAvailability(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const issueDate = req.query.issueDate ? String(req.query.issueDate) : undefined;
                const returnDate = req.query.returnDate ? String(req.query.returnDate) : undefined;
                if (issueDate && returnDate) {
                    const result = yield this.userServices.searchCarAvailability(issueDate, returnDate);
                    if (result) {
                        res.status(200).json(result.data);
                    }
                    else {
                        res.status(500).json({ message: "Internal server error" });
                    }
                }
                else {
                    res.status(400).json({ message: "Invalid issueDate or returnDate" });
                }
            }
            catch (error) {
                res.status(500).json({ message: "Internal server error" });
            }
        });
    }
}
exports.UserController = UserController;
