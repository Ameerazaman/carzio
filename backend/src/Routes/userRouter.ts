import express, { Router } from 'express';
import { UserController } from '../Controller/userController';
import { UserServices } from '../Services/userServices';
import { UserRepository } from '../Repostries/userRepostries';
import Encrypt from '../utlis/comparedPassword'; // Importing the Encrypt utility
import { CreateJWT } from '../utlis/generateToken'; // Importing the CreateJWT utility

const userRouter: Router = express.Router();

const userRepository = new UserRepository();
const encrypt = new Encrypt(); // Creating an instance of Encrypt
const createJWT = new CreateJWT(); 

// Passing all required dependencies to UserServices
const userServices = new UserServices(userRepository, encrypt, createJWT);

// Pass the instance of UserServices to the UserController
const userController = new UserController(userServices);

userRouter.post('/signup', (req, res) => userController.userSignup(req, res));
userRouter.get('/resend-otp', (req, res) => userController.resendOtp(req, res));
userRouter.post('/verify-otp', (req, res) => userController.verifyOtp(req,res))
userRouter.get('/logout', (req, res) => userController.userLogout(req, res))
userRouter.post('/login', (req, res) => userController.userLogin(req, res))

export default userRouter;
