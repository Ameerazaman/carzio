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
const AdminServices_1 = require("../Services/Admin/AdminServices");
const AdminRepostries_1 = require("../Repostries/Admin/AdminRepostries");
const ComparedPassword_1 = __importDefault(require("../Utlis/ComparedPassword"));
const GenerateToken_1 = require("../Utlis/GenerateToken");
const AdminController_1 = require("../Controller/Admin/AdminController");
const AdminAuthMiddleware_1 = __importDefault(require("../Middlewares/AdminAuthMiddleware"));
const CouponRepository_1 = require("../Repostries/Coupon/CouponRepository");
const OfferRepository_1 = require("../Repostries/Offer/OfferRepository");
const CarRepository_1 = require("../Repostries/Car/CarRepository");
const CarNotification_1 = require("../Repostries/CarNotification/CarNotification");
const BookingRepository_1 = require("../Repostries/BookingRepository/BookingRepository");
const UserRepostries_1 = require("../Repostries/User/UserRepostries");
const ProviderRepostries_1 = require("../Repostries/Provider/ProviderRepostries");
const adminRouter = express_1.default.Router();
const adminRepository = new AdminRepostries_1.AdminRepository();
const couponRepository = new CouponRepository_1.CouponRepository();
const offerRepository = new OfferRepository_1.OfferRepository();
const carRepository = new CarRepository_1.CarRepository();
const carNotificationRepostry = new CarNotification_1.CarNotificationRepository();
const bookingRepository = new BookingRepository_1.BookingRepository();
const userRepository = new UserRepostries_1.UserRepository();
const providerRepository = new ProviderRepostries_1.ProviderRepository();
const encrypt = new ComparedPassword_1.default();
const createJWT = new GenerateToken_1.CreateJWT();
const adminServices = new AdminServices_1.AdminServices(adminRepository, couponRepository, offerRepository, carRepository, carNotificationRepostry, bookingRepository, userRepository, providerRepository, encrypt, createJWT);
const adminController = new AdminController_1.AdminController(adminServices);
adminRouter.get('/logout', (req, res) => adminController.adminLogout(req, res));
adminRouter.post('/login', (req, res) => adminController.adminLogin(req, res));
adminRouter.post('/refresh-token', (req, res, next) => adminController.refreshToken(req, res, next));
adminRouter.get('/dashboard', AdminAuthMiddleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () { return adminController.getDashboardConstData(req, res); }));
adminRouter.get('/users', AdminAuthMiddleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () { return adminController.fetchUsers(req, res); }));
adminRouter.put('/edit_user/:id', AdminAuthMiddleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () { return adminController.updateUser(req, res); }));
adminRouter.get('/edit_user/:id', AdminAuthMiddleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () { return adminController.editUser(req, res); }));
adminRouter.put('/update_status/:id', AdminAuthMiddleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () { return adminController.updateStatus(req, res); }));
adminRouter.get('/providers', AdminAuthMiddleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () { return adminController.fetchProviders(req, res); }));
adminRouter.get('/edit_provider/:id', AdminAuthMiddleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () { return adminController.editProvider(req, res); }));
adminRouter.put('/edit_provider/:id', AdminAuthMiddleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () { return adminController.updateProvider(req, res); }));
adminRouter.put('/update_status_provider/:id', AdminAuthMiddleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () { return adminController.updateStatusProvider(req, res); }));
adminRouter.get('/notifications', AdminAuthMiddleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () { return adminController.fetchNotification(req, res); }));
adminRouter.get('/notification_details/:id', AdminAuthMiddleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () { return adminController.notificationDetails(req, res); }));
adminRouter.get('/verify_notification/:id/:value', AdminAuthMiddleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () { return adminController.verifyNotification(req, res); }));
adminRouter.get('/cars', AdminAuthMiddleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () { return adminController.fetchCars(req, res); }));
adminRouter.put('/update_status_car/:id', AdminAuthMiddleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () { return adminController.updateStatusCar(req, res); }));
adminRouter.post('/add_offer', AdminAuthMiddleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () { return adminController.addOffer(req, res); }));
adminRouter.get('/fetchOffer', AdminAuthMiddleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () { return adminController.fetchOffer(req, res); }));
adminRouter.get('/edit_offers/:id', AdminAuthMiddleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () { return adminController.editOffer(req, res); }));
adminRouter.put('/edit_offers/:id', AdminAuthMiddleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () { return adminController.updateOffer(req, res); }));
adminRouter.put('/update_status_offers/:id', AdminAuthMiddleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () { return adminController.updateStatusOffer(req, res); }));
adminRouter.post('/add_coupon', AdminAuthMiddleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () { return adminController.addCoupon(req, res); }));
adminRouter.get('/fetchCoupon', AdminAuthMiddleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () { return adminController.fetchCoupon(req, res); }));
adminRouter.get('/edit_coupons/:id', AdminAuthMiddleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () { return adminController.editCoupon(req, res); }));
adminRouter.put('/edit_coupon/:id', AdminAuthMiddleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () { return adminController.updateCoupon(req, res); }));
adminRouter.put('/update_status_coupon/:id', AdminAuthMiddleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () { return adminController.updateStatusCoupon(req, res); }));
adminRouter.get('/booking_history', AdminAuthMiddleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () { return adminController.getBookingHistory(req, res); }));
adminRouter.get('/details_of_specifc_order/:id', AdminAuthMiddleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () { return adminController.specificBookingDetails(req, res); }));
adminRouter.get('/update_status/:id/:status', AdminAuthMiddleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () { return adminController.updateStatusOfBooking(req, res); }));
adminRouter.get('/sales_report', AdminAuthMiddleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () { return adminController.fetchSalesReport(req, res); }));
exports.default = adminRouter;
