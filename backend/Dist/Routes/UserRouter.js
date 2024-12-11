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
const express_1 = __importDefault(require("express"));
const UserController_1 = require("../Controller/User/UserController");
const UserServices_1 = require("../Services/User/UserServices");
const UserRepostries_1 = require("../Repostries/User/UserRepostries");
const ComparedPassword_1 = __importDefault(require("../Utlis/ComparedPassword"));
const GenerateToken_1 = require("../Utlis/GenerateToken");
const UserAuthMiddleware_1 = __importDefault(require("../Middlewares/UserAuthMiddleware"));
const userRouter = express_1.default.Router();
// Instantiate dependencies
const userRepository = new UserRepostries_1.UserRepository(); // Using interface
const encrypt = new ComparedPassword_1.default();
const createJwt = new GenerateToken_1.CreateJWT();
// Instantiate the UserServices, passing in the UserRepository and other dependencies
const userServices = new UserServices_1.UserServices(userRepository, encrypt, createJwt); // Using interface
// Instantiate the UserController with the UserServices
const userController = new UserController_1.UserController(userServices);
userRouter.post('/signup', (req, res) => userController.userSignup(req, res));
userRouter.get('/resend-otp', (req, res) => userController.resendOtp(req, res));
userRouter.post('/verify-otp', (req, res) => userController.verifyOtp(req, res));
userRouter.post('/login', (req, res) => userController.userLogin(req, res));
userRouter.post('/refresh-token', (req, res, next) => userController.refreshToken(req, res, next));
userRouter.get('/logout', (req, res) => __awaiter(void 0, void 0, void 0, function* () { return userController.userLogout(req, res); }));
userRouter.post('/forgot_password', (req, res) => userController.forgotPassword(req, res));
userRouter.post('/change_password', (req, res) => userController.changePassword(req, res));
userRouter.get('/cars', UserAuthMiddleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () { return userController.fetchCars(req, res); }));
userRouter.get('/car_details/:id', UserAuthMiddleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () { return userController.carDetails(req, res); }));
userRouter.get('/chat_history/:userId/:providerId', UserAuthMiddleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () { return userController.fetchChatHistory(req, res); }));
userRouter.post('/filter', UserAuthMiddleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () { return userController.filterCar(req, res); }));
userRouter.post('/search', UserAuthMiddleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () { return userController.searchCar(req, res); }));
userRouter.get('/offers', UserAuthMiddleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () { return userController.fetchOffer(req, res); }));
userRouter.get('/profile/:id', UserAuthMiddleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () { return userController.checkProfile(req, res); }));
userRouter.post('/save_profile', UserAuthMiddleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () { return userController.saveProfile(req, res); }));
userRouter.put('/edit_profile/:id', UserAuthMiddleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () { return userController.editProfile(req, res); }));
userRouter.get('/address/:id', UserAuthMiddleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () { return userController.checkAddress(req, res); }));
userRouter.post('/save_address', UserAuthMiddleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () { return userController.saveAddress(req, res); }));
userRouter.put('/edit_address/:id', UserAuthMiddleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () { return userController.editAddress(req, res); }));
userRouter.get('/fetch_coupon/:id', UserAuthMiddleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () { return userController.fetchCoupon(req, res); }));
userRouter.get('/fetch_offer/:car_name', UserAuthMiddleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () { return userController.checkOfferForBooking(req, res); }));
userRouter.get('/check_booking', UserAuthMiddleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () { return userController.checkBookedOrNot(req, res); }));
userRouter.post('/booking_confirm', UserAuthMiddleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () { return userController.saveBookingData(req, res); }));
userRouter.post('/create-payment-intent', UserAuthMiddleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () { return userController.paymentForStripe(req, res); }));
userRouter.post('/userid_in_coupon/:coupon/:userId', UserAuthMiddleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () { return userController.userIdInCoupon(req, res); }));
userRouter.put('/check_update_wallet/:userId/:amount', UserAuthMiddleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () { return userController.checkAndUpdateWallet(req, res); }));
userRouter.get('/booking_history', UserAuthMiddleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("After userAuth middleware");
    yield userController.getBookingHistory(req, res);
}));
userRouter.get('/details_of_specifc_order/:id', UserAuthMiddleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () { return userController.specificBookingDetails(req, res); }));
userRouter.put('/cancel_booking', UserAuthMiddleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () { return userController.cancelBookingByUser(req, res); }));
userRouter.put('/credit_to_wallet', UserAuthMiddleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () { return userController.creditToWallet(req, res); }));
userRouter.get('/wallet', UserAuthMiddleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () { return userController.getWallet(req, res); }));
userRouter.post('/create_review_and_ratings', UserAuthMiddleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () { return userController.createReviewAndRatings(req, res); }));
userRouter.get('/check_bookid_in_Review', UserAuthMiddleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () { return userController.checkBookIdinReview(req, res); }));
userRouter.get('/search_car_availability', UserAuthMiddleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () { return userController.searchCarAvailability(req, res); }));
exports.default = userRouter;
