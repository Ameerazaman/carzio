import express, { Router } from 'express';

import { ProviderController } from '../Controller/Provider/ProviderController';
import { ProviderServices } from '../Services/Provider/ProviderServices';
import { ProviderRepository } from '../Repostries/Provider/ProviderRepostries';
import Encrypt from '../Utlis/ComparedPassword'; // Importing the Encrypt utility
import { CreateJWT } from '../Utlis/GenerateToken'; // Importing the CreateJWT utility
import providerAuthenticate from '../Middlewares/ProviderAuthMiddleware'
import upload from '../Middlewares/ImgAuthMiddleware';
const providerRouter: Router = express.Router();

const providerRepository = new ProviderRepository();
const encrypt = new Encrypt(); // Creating an instance of Encrypt
const createJWT = new CreateJWT();

// Passing all required dependencies to UserServices
const providerServices = new ProviderServices(providerRepository, encrypt, createJWT);

// Pass the instance of UserServices to the UserController
const providerController = new ProviderController(providerServices);

providerRouter.post('/signup', (req, res) => providerController.ProviderSignup(req, res));
providerRouter.get('/resend-otp', (req, res) => providerController.ProviderResendOtp(req, res));
providerRouter.post('/verify-otp', (req, res) => providerController.verifyOtp(req, res))
providerRouter.post('/login', (req, res) => providerController.providerLogin(req, res))
providerRouter.get('/logout', async (req, res) => providerController.providerLogout(req, res))
providerRouter.post('/refresh-token', (req, res, next) => providerController.refreshToken(req, res, next))
providerRouter.get('/home/:id', providerAuthenticate, async (req, res) => providerController.checkProviderAddrress(req, res))
providerRouter.post('/save_profile',providerAuthenticate, async (req, res) => providerController.saveProfile(req, res))
providerRouter.put('/edit_profile/:id', providerAuthenticate, async (req, res) => providerController.editProfile(req, res));
providerRouter.post('/add_car',providerAuthenticate, upload.array('images', 4),async (req, res)=> providerController.addCarDetails(req,res))
providerRouter.get('/cars', providerAuthenticate, async (req, res) => providerController.fetchCars(req, res))
providerRouter.put('/update_status_car/:id',providerAuthenticate,async(req,res)=>providerController.updateStatusCar(req,res))
providerRouter.get('/edit_car/:id',providerAuthenticate,async(req,res)=>providerController.editCar(req,res))
providerRouter.put('/edit_car/:id',providerAuthenticate,async(req,res)=>providerController.updateCar(req,res))
providerRouter.put('/edit_car_image/:id',providerAuthenticate, upload.array('images', 4),async (req, res)=> providerController.updateCarImage(req,res))

export default providerRouter;
