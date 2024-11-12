import express, { Router } from 'express';
import { UserController } from '../Controller/User/UserController';
import { UserServices } from '../Services/User/UserServices';
import { UserRepository } from '../Repostries/User/UserRepostries';
import Encrypt from '../Utlis/ComparedPassword';
import { CreateJWT } from '../Utlis/GenerateToken';
import userAuth from '../Middlewares/UserAuthMiddleware';

const userRouter: Router = express.Router();
const userRepository = new UserRepository();
const encrypt = new Encrypt();
const createJWT = new CreateJWT();
const userServices = new UserServices(userRepository, encrypt, createJWT);
const userController = new UserController(userServices);

userRouter.post('/signup', (req, res) => userController.userSignup(req, res));
userRouter.get('/resend-otp', (req, res) => userController.resendOtp(req, res));
userRouter.post('/verify-otp', (req, res) => userController.verifyOtp(req, res))
userRouter.post('/login', (req, res) => userController.userLogin(req, res))
userRouter.post('/refresh-token', (req, res, next) => userController.refreshToken(req, res, next))
userRouter.get('/logout', async (req, res) => userController.userLogout(req, res))
userRouter.get('/cars', userAuth, async (req, res) => userController.fetchCars(req, res))
userRouter.get('/car_details/:id', userAuth, async (req, res) => userController.carDetails(req, res))
userRouter.post('/filter', userAuth, async (req, res) => userController.filterCar(req, res))
userRouter.post('/search', userAuth, async (req, res) => userController.searchCar(req, res))
userRouter.get('/offers', userAuth, async (req, res) => userController.fetchOffer(req, res))
// userRouter.get('/booking_details', userAuth, async (req, res) => userController.bookRentalCar(req, res));
userRouter.get('/profile/:id', userAuth, async (req, res) => userController.checkProfile(req, res))
userRouter.post('/save_profile', userAuth, async (req, res) => userController.saveProfile(req, res))
userRouter.put('/edit_profile/:id', userAuth, async (req, res) => userController.editProfile(req, res))
userRouter.get('/address/:id', userAuth, async (req, res) => userController.checkAddress(req, res))
userRouter.post('/save_address', userAuth, async (req, res) => userController.saveAddress(req, res))
userRouter.put('/edit_address/:id', userAuth, async (req, res) => userController.editAddress(req, res));
userRouter.get('/fetch_coupon/:id', userAuth, async (req, res) => userController.fetchCoupon(req, res));
userRouter.get('/fetch_offer/:car_name', userAuth, async (req, res) => userController.checkOfferForBooking(req, res));
userRouter.post('/booking_confirm', userAuth, async (req, res) => userController.saveBookingData(req, res));
userRouter.post('/create-payment-intent',userAuth,async(req,res)=>userController.paymentForStripe(req,res))
export default userRouter;
