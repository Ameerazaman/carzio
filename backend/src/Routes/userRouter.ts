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
userRouter.get('/logout',  async (req, res) => userController.userLogout(req, res))
userRouter.get('/cars',userAuth,async(req,res)=>userController.fetchCars(req,res))
userRouter.get('/car_details/:id',userAuth,async(req,res)=>userController.carDetails(req,res))
userRouter.post('/filter',userAuth,async(req,res)=>userController.filterCar(req,res))
userRouter.post('/search',userAuth,async(req,res)=>userController.searchCar(req,res))
userRouter.get('/offers',userAuth,async(req,res)=>userController.fetchOffer(req,res))
export default userRouter;
