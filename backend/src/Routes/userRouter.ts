import express, { Router } from 'express';
import { UserController } from '../Controller/User/UserController';
import { UserServices } from '../Services/User/UserServices';
import { UserRepository } from '../Repostries/User/UserRepostries';
import Encrypt from '../Utlis/ComparedPassword';
import { CreateJWT } from '../Utlis/GenerateToken';
import userAuth from '../Middlewares/UserAuthMiddleware';
import { IUserServices } from '../Services/User/IUserServices';
import { IUserRepository } from '../Repostries/User/IUserRepostry';
import { OtpRepository } from '../Repostries/Otp/OtpRepository';
import { CarRepository } from '../Repostries/Car/CarRepository';
import { BookingRepository } from '../Repostries/BookingRepository/BookingRepository';
import { OfferRepository } from '../Repostries/Offer/OfferRepository';
import { WalletRepository } from '../Repostries/Wallet/WalletRepository';
import { ReviewRepository } from '../Repostries/Review/ReviewRepository';
import { ChatRepository } from '../Repostries/Chat/ChatRepository';
import { CouponRepository } from '../Repostries/Coupon/CouponRepository';
import { ProfileUserRepository } from '../Repostries/ProfileUser/ProfileUser';
import { UserAddressRepository } from '../Repostries/UserAddress/UserAddress';

const userRouter: Router = express.Router();

// Instantiate dependencies
const userRepository = new UserRepository(); // Using interface
const otpRepository = new OtpRepository()
const carRepository = new CarRepository()
const bookingRepository = new BookingRepository()
const offerRepository = new OfferRepository();
const walletRepository = new WalletRepository()
const reviewRepository = new ReviewRepository()
const chatRepository = new ChatRepository()
const couponRepository = new CouponRepository()
const profileUserRepository = new ProfileUserRepository()
const  userAddressRepository=new UserAddressRepository()
const encrypt = new Encrypt();
const createJwt = new CreateJWT();

// Instantiate the UserServices, passing in the UserRepository and other dependencies
const userServices = new UserServices(
    userRepository,
    otpRepository,
    carRepository,
    bookingRepository,
    offerRepository,
    walletRepository,
    reviewRepository,
    chatRepository,
    couponRepository,
    profileUserRepository,
    userAddressRepository,
    encrypt, 
    createJwt); // Using interface

// Instantiate the UserController with the UserServices
const userController = new UserController(userServices);


userRouter.post('/signup', (req, res) => userController.userSignup(req, res));
userRouter.get('/resend-otp', (req, res) => userController.resendOtp(req, res));
userRouter.post('/verify-otp', (req, res) => userController.verifyOtp(req, res))
userRouter.post('/login', (req, res) => userController.userLogin(req, res))
userRouter.post('/refresh-token', (req, res, next) => userController.refreshToken(req, res, next))
userRouter.get('/logout', async (req, res) => userController.userLogout(req, res))
userRouter.post('/forgot_password', (req, res) => userController.forgotPassword(req, res));
userRouter.post('/change_password', (req, res) => userController.changePassword(req, res));

userRouter.get('/cars', userAuth, async (req, res) => userController.fetchCars(req, res))
userRouter.get('/car_details/:id', userAuth, async (req, res) => userController.carDetails(req, res))
userRouter.get('/chat_history/:userId/:providerId', userAuth, async (req, res) => userController.fetchChatHistory(req, res));
userRouter.post('/filter', userAuth, async (req, res) => userController.filterCar(req, res))
userRouter.post('/search', userAuth, async (req, res) => userController.searchCar(req, res))
userRouter.get('/offers', userAuth, async (req, res) => userController.fetchOffer(req, res))

userRouter.get('/profile/:id', userAuth, async (req, res) => userController.checkProfile(req, res))
userRouter.post('/save_profile', userAuth, async (req, res) => userController.saveProfile(req, res))
userRouter.put('/edit_profile/:id', userAuth, async (req, res) => userController.editProfile(req, res))

userRouter.get('/address/:id', userAuth, async (req, res) => userController.checkAddress(req, res))
userRouter.post('/save_address', userAuth, async (req, res) => userController.saveAddress(req, res))
userRouter.put('/edit_address/:id', userAuth, async (req, res) => userController.editAddress(req, res));

userRouter.get('/fetch_coupon/:id', userAuth, async (req, res) => userController.fetchCoupon(req, res));
userRouter.get('/fetch_offer/:car_name', userAuth, async (req, res) => userController.checkOfferForBooking(req, res));
userRouter.get('/check_booking', userAuth, async (req, res) => userController.checkBookedOrNot(req, res))
userRouter.post('/booking_confirm', userAuth, async (req, res) => userController.saveBookingData(req, res));
userRouter.post('/create-payment-intent', userAuth, async (req, res) => userController.paymentForStripe(req, res))
userRouter.post('/userid_in_coupon/:coupon/:userId', userAuth, async (req, res) => userController.userIdInCoupon(req, res))
userRouter.put('/check_update_wallet/:userId/:amount', userAuth, async (req, res) => userController.checkAndUpdateWallet(req, res));
userRouter.get('/booking_history', userAuth, async (req, res) => {
    console.log("After userAuth middleware");
    await userController.getBookingHistory(req, res);
}); userRouter.get('/details_of_specifc_order/:id', userAuth, async (req, res) => userController.specificBookingDetails(req, res));

userRouter.put('/cancel_booking', userAuth, async (req, res) => userController.cancelBookingByUser(req, res));
userRouter.put('/credit_to_wallet', userAuth, async (req, res) => userController.creditToWallet(req, res));

userRouter.get('/wallet', userAuth, async (req, res) => userController.getWallet(req, res));
userRouter.post('/create_review_and_ratings', userAuth, async (req, res) => userController.createReviewAndRatings(req, res));
userRouter.get('/check_bookid_in_Review', userAuth, async (req, res) => userController.checkBookIdinReview(req, res));
userRouter.get('/search_car_availability', userAuth, async (req, res) => userController.searchCarAvailability(req, res));


export default userRouter;

