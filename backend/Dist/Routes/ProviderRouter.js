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
const ProviderController_1 = require("../Controller/Provider/ProviderController");
const ProviderServices_1 = require("../Services/Provider/ProviderServices");
const ProviderRepostries_1 = require("../Repostries/Provider/ProviderRepostries");
const ComparedPassword_1 = __importDefault(require("../Utlis/ComparedPassword")); // Importing the Encrypt utility
const GenerateToken_1 = require("../Utlis/GenerateToken"); // Importing the CreateJWT utility
const ProviderAuthMiddleware_1 = __importDefault(require("../Middlewares/ProviderAuthMiddleware"));
const ImgAuthMiddleware_1 = __importDefault(require("../Middlewares/ImgAuthMiddleware"));
const providerRouter = express_1.default.Router();
const providerRepository = new ProviderRepostries_1.ProviderRepository();
const encrypt = new ComparedPassword_1.default(); // Creating an instance of Encrypt
const createJWT = new GenerateToken_1.CreateJWT();
// Passing all required dependencies to UserServices
const providerServices = new ProviderServices_1.ProviderServices(providerRepository, encrypt, createJWT);
// Pass the instance of UserServices to the UserController
const providerController = new ProviderController_1.ProviderController(providerServices);
providerRouter.post('/signup', (req, res) => providerController.ProviderSignup(req, res));
providerRouter.get('/resend-otp', (req, res) => providerController.ProviderResendOtp(req, res));
providerRouter.post('/verify-otp', (req, res) => providerController.verifyOtp(req, res));
providerRouter.post('/login', (req, res) => providerController.providerLogin(req, res));
providerRouter.get('/logout', (req, res) => __awaiter(void 0, void 0, void 0, function* () { return providerController.providerLogout(req, res); }));
providerRouter.post('/refresh-token', (req, res, next) => providerController.refreshToken(req, res, next));
providerRouter.post('/forgot_password', (req, res) => providerController.forgotPassword(req, res));
providerRouter.post('/change_password', (req, res) => providerController.changePassword(req, res));
providerRouter.get('/home/:id', ProviderAuthMiddleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () { return providerController.checkProviderAddrress(req, res); }));
providerRouter.post('/save_profile', ProviderAuthMiddleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () { return providerController.saveProfile(req, res); }));
providerRouter.put('/edit_profile/:id', ProviderAuthMiddleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () { return providerController.editProfile(req, res); }));
providerRouter.put('/edit_profile_image/:id', ProviderAuthMiddleware_1.default, ImgAuthMiddleware_1.default.single('image'), (req, res) => __awaiter(void 0, void 0, void 0, function* () { return providerController.updateProfileImage(req, res); }));
providerRouter.post('/add_car', ProviderAuthMiddleware_1.default, ImgAuthMiddleware_1.default.array('images', 4), (req, res) => __awaiter(void 0, void 0, void 0, function* () { return providerController.addCarDetails(req, res); }));
providerRouter.get('/cars', ProviderAuthMiddleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () { return providerController.fetchCars(req, res); }));
providerRouter.put('/update_status_car/:id', ProviderAuthMiddleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () { return providerController.updateStatusCar(req, res); }));
providerRouter.get('/edit_car/:id', ProviderAuthMiddleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () { return providerController.editCar(req, res); }));
providerRouter.put('/edit_car/:id', ProviderAuthMiddleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () { return providerController.updateCar(req, res); }));
providerRouter.put('/edit_car_image/:id', ProviderAuthMiddleware_1.default, ImgAuthMiddleware_1.default.array('images', 4), (req, res) => __awaiter(void 0, void 0, void 0, function* () { return providerController.updateCarImage(req, res); }));
providerRouter.get('/booking_history', ProviderAuthMiddleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () { return providerController.getBookingHistory(req, res); }));
providerRouter.get('/details_of_specifc_order/:id', ProviderAuthMiddleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () { return providerController.specificBookingDetails(req, res); }));
providerRouter.get('/update_status/:id/:status', ProviderAuthMiddleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () { return providerController.updateStatusOfBooking(req, res); }));
providerRouter.get('/fetch_users_chat/:providerId', ProviderAuthMiddleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () { return providerController.fetchUsersChat(req, res); }));
// providerRouter.get('/chat_history/:providerId/:userId', providerAuthenticate, async (req, res) => providerController.fetchChatHistory(req, res));
providerRouter.get('/chat_history/:providerId/:userId', ProviderAuthMiddleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () { return providerController.fetchChatHistory(req, res); }));
providerRouter.get('/dashboard/:providerId', ProviderAuthMiddleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () { return providerController.getDashboardConstData(req, res); }));
providerRouter.get('/sales_report', ProviderAuthMiddleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () { return providerController.fetchSalesReport(req, res); }));
exports.default = providerRouter;
