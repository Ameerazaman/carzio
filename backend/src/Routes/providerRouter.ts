import express, { Router } from 'express';

import { ProviderController } from '../Controller/Provider/ProviderController';
import { ProviderServices } from '../Services/Provider/ProviderServices';
import { ProviderRepository } from '../Repostries/Provider/ProviderRepostries';
import Encrypt from '../Utlis/ComparedPassword'; // Importing the Encrypt utility
import { CreateJWT } from '../Utlis/GenerateToken'; // Importing the CreateJWT utility
import providerAuthenticate from '../Middlewares/ProviderAuthMiddleware'
import upload from '../Middlewares/ImgAuthMiddleware';
import { ProviderProfileRepository } from '../Repostries/ProviderProfile/ProviderProfile';
import { OtpRepository } from '../Repostries/Otp/OtpRepository';
import { CarRepository } from '../Repostries/Car/CarRepository';
import { CarNotificationRepository } from '../Repostries/CarNotification/CarNotification';
import { BookingRepository } from '../Repostries/BookingRepository/BookingRepository';
import { ChatRepository } from '../Repostries/Chat/ChatRepository';
const providerRouter: Router = express.Router();

const providerRepository = new ProviderRepository();
const profileRepository = new ProviderProfileRepository()
const otpRepository = new OtpRepository()
const carRepository = new CarRepository()
const carNotificationRepository = new CarNotificationRepository()
const bookingRepository = new BookingRepository()
const chatRepository = new ChatRepository()
const encrypt = new Encrypt(); 
const createJWT = new CreateJWT();


// Passing all required dependencies to UserServices
const providerServices = new ProviderServices(
    providerRepository,
    profileRepository,
    otpRepository,
    carRepository,
    carNotificationRepository,
    bookingRepository,
    chatRepository,
    encrypt,
    createJWT );

// Pass the instance of UserServices to the UserController
const providerController = new ProviderController(providerServices);

providerRouter.post('/signup', (req, res) => providerController.ProviderSignup(req, res));
providerRouter.get('/resend-otp', (req, res) => providerController.ProviderResendOtp(req, res));
providerRouter.post('/verify-otp', (req, res) => providerController.verifyOtp(req, res))
providerRouter.post('/login', (req, res) => providerController.providerLogin(req, res))
providerRouter.get('/logout', async (req, res) => providerController.providerLogout(req, res))
providerRouter.post('/refresh-token', (req, res, next) => providerController.refreshToken(req, res, next))
providerRouter.post('/forgot_password', (req, res) => providerController.forgotPassword(req, res));
providerRouter.post('/change_password', (req, res) => providerController.changePassword(req, res));


providerRouter.get('/home/:id', providerAuthenticate, async (req, res) => providerController.checkProviderAddrress(req, res))
providerRouter.post('/save_profile', providerAuthenticate, async (req, res) => providerController.saveProfile(req, res))
providerRouter.put('/edit_profile/:id', providerAuthenticate, async (req, res) => providerController.editProfile(req, res));
providerRouter.put('/edit_profile_image/:id', providerAuthenticate, upload.single('image'), async (req, res) => providerController.updateProfileImage(req, res));

providerRouter.post('/add_car', providerAuthenticate, upload.array('images', 4), async (req, res) => providerController.addCarDetails(req, res))
providerRouter.get('/cars', providerAuthenticate, async (req, res) => providerController.fetchCars(req, res))
providerRouter.put('/update_status_car/:id', providerAuthenticate, async (req, res) => providerController.updateStatusCar(req, res))
providerRouter.get('/edit_car/:id', providerAuthenticate, async (req, res) => providerController.editCar(req, res))
providerRouter.put('/edit_car/:id', providerAuthenticate, async (req, res) => providerController.updateCar(req, res))
providerRouter.put('/edit_car_image/:id', providerAuthenticate, upload.array('images', 4), async (req, res) => providerController.updateCarImage(req, res))

providerRouter.get('/booking_history', providerAuthenticate, async (req, res) => providerController.getBookingHistory(req, res))
providerRouter.get('/details_of_specifc_order/:id', providerAuthenticate, async (req, res) => providerController.specificBookingDetails(req, res))
providerRouter.get('/update_status/:id/:status', providerAuthenticate, async (req, res) => providerController.updateStatusOfBooking(req, res))
providerRouter.get('/fetch_users_chat/:providerId', providerAuthenticate, async (req, res) => providerController.fetchUsersChat(req, res))
// providerRouter.get('/chat_history/:providerId/:userId', providerAuthenticate, async (req, res) => providerController.fetchChatHistory(req, res));
providerRouter.get('/chat_history/:providerId/:userId', providerAuthenticate, async (req, res) => providerController.fetchChatHistory(req, res));

providerRouter.get('/dashboard/:providerId', providerAuthenticate, async (req, res) => providerController.getDashboardConstData(req, res))
providerRouter.get('/sales_report', providerAuthenticate, async (req, res) => providerController.fetchSalesReport(req, res));



export default providerRouter;
