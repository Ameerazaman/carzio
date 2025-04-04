import express, { Router } from 'express';
import { AdminServices } from '../Services/Admin/AdminServices';
import { AdminRepository } from '../Repostries/Admin/AdminRepostries';

import Encrypt from '../Utlis/ComparedPassword';
import { CreateJWT } from '../Utlis/GenerateToken';
import { AdminController } from '../Controller/Admin/AdminController';
import adminAuthenticate from '../Middlewares/AdminAuthMiddleware'
import { CouponRepository } from '../Repostries/Coupon/CouponRepository';
import { OfferRepository } from '../Repostries/Offer/OfferRepository';
import { CarRepository } from '../Repostries/Car/CarRepository';
import { CarNotificationRepository } from '../Repostries/CarNotification/CarNotification';
import { BookingRepository } from '../Repostries/BookingRepository/BookingRepository';
import { UserRepository } from '../Repostries/User/UserRepostries';
import { ProviderRepository } from '../Repostries/Provider/ProviderRepostries';


const adminRouter: Router = express.Router();

const adminRepository = new AdminRepository();
const couponRepository = new CouponRepository();
const offerRepository = new OfferRepository()
const carRepository = new CarRepository()
const carNotificationRepostry = new CarNotificationRepository()
const bookingRepository = new BookingRepository()
const userRepository = new UserRepository()
const providerRepository = new ProviderRepository()
const encrypt = new Encrypt();
const createJWT = new CreateJWT();

const adminServices = new AdminServices(
    adminRepository,
    couponRepository,
    offerRepository,
    carRepository,
    carNotificationRepostry,
    bookingRepository,
    userRepository,
    providerRepository,
    encrypt,
    createJWT
);

const adminController = new AdminController(adminServices);

adminRouter.get('/logout', (req, res) => adminController.adminLogout(req, res))
adminRouter.post('/login', (req, res) => adminController.adminLogin(req, res))

adminRouter.post('/refresh-token', (req, res, next) => adminController.refreshToken(req, res, next))

adminRouter.get('/dashboard', adminAuthenticate, async (req, res) => adminController.getDashboardConstData(req, res))

adminRouter.get('/users', adminAuthenticate, async (req, res) => adminController.fetchUsers(req, res))
adminRouter.put('/edit_user/:id', adminAuthenticate, async (req, res) => adminController.updateUser(req, res));
adminRouter.get('/edit_user/:id', adminAuthenticate, async (req, res) => adminController.editUser(req, res))
adminRouter.put('/update_status/:id', adminAuthenticate, async (req, res) => adminController.updateStatus(req, res));

adminRouter.get('/providers', adminAuthenticate, async (req, res) => adminController.fetchProviders(req, res))
adminRouter.get('/edit_provider/:id', adminAuthenticate, async (req, res) => adminController.editProvider(req, res))
adminRouter.put('/edit_provider/:id', adminAuthenticate, async (req, res) => adminController.updateProvider(req, res));
adminRouter.put('/update_status_provider/:id', adminAuthenticate, async (req, res) => adminController.updateStatusProvider(req, res));

adminRouter.get('/notifications', adminAuthenticate, async (req, res) => adminController.fetchNotification(req, res));
adminRouter.get('/notification_details/:id', adminAuthenticate, async (req, res) => adminController.notificationDetails(req, res));
adminRouter.get('/verify_notification/:id/:value', adminAuthenticate, async (req, res) => adminController.verifyNotification(req, res));

adminRouter.get('/cars', adminAuthenticate, async (req, res) => adminController.fetchCars(req, res))
adminRouter.put('/update_status_car/:id', adminAuthenticate, async (req, res) => adminController.updateStatusCar(req, res))
adminRouter.post('/add_offer', adminAuthenticate, async (req, res) => adminController.addOffer(req, res))

adminRouter.get('/fetchOffer', adminAuthenticate, async (req, res) => adminController.fetchOffer(req, res))
adminRouter.get('/edit_offers/:id', adminAuthenticate, async (req, res) => adminController.editOffer(req, res))
adminRouter.put('/edit_offers/:id', adminAuthenticate, async (req, res) => adminController.updateOffer(req, res));
adminRouter.put('/update_status_offers/:id', adminAuthenticate, async (req, res) => adminController.updateStatusOffer(req, res));

adminRouter.post('/add_coupon', adminAuthenticate, async (req, res) => adminController.addCoupon(req, res));
adminRouter.get('/fetchCoupon', adminAuthenticate, async (req, res) => adminController.fetchCoupon(req, res))
adminRouter.get('/edit_coupons/:id', adminAuthenticate, async (req, res) => adminController.editCoupon(req, res))
adminRouter.put('/edit_coupon/:id', adminAuthenticate, async (req, res) => adminController.updateCoupon(req, res));
adminRouter.put('/update_status_coupon/:id', adminAuthenticate, async (req, res) => adminController.updateStatusCoupon(req, res));

adminRouter.get('/booking_history', adminAuthenticate, async (req, res) => adminController.getBookingHistory(req, res))
adminRouter.get('/details_of_specifc_order/:id', adminAuthenticate, async (req, res) => adminController.specificBookingDetails(req, res))
adminRouter.get('/update_status/:id/:status', adminAuthenticate, async (req, res) => adminController.updateStatusOfBooking(req, res))

adminRouter.get('/sales_report', adminAuthenticate, async (req, res) => adminController.fetchSalesReport(req, res));


export default adminRouter;



