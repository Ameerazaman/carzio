import express, { Router } from 'express';

import { ProviderController } from '../Controller/Provider/providerController';
import { ProviderServices } from '../Services/Provider/providerServices';
import { ProviderRepository } from '../Repostries/Provider/providerRepostries';
import Encrypt from '../utlis/comparedPassword'; // Importing the Encrypt utility
import { CreateJWT } from '../utlis/generateToken'; // Importing the CreateJWT utility

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
providerRouter.post('/verify-otp', (req, res) => providerController.verifyOtp(req,res))
// providerRouter.get('/logout', (req, res) => providerController.userLogout(req, res))
providerRouter.post('/login', (req, res) => providerController.providerLogin(req, res))

export default providerRouter;
