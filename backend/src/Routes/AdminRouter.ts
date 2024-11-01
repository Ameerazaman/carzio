import express, { Router } from 'express';
import { AdminServices } from '../Services/Admin/AdminServices';
import { AdminRepository } from '../Repostries/Admin/AdminRepostries';

import Encrypt from '../Utlis/ComparedPassword'; // Importing the Encrypt utility
import { CreateJWT } from '../Utlis/GenerateToken'; // Importing the CreateJWT utility
import { AdminController } from '../Controller/Admin/AdminController';
import adminAuthenticate from '../Middlewares/AdminAuthMiddleware'


const adminRouter: Router = express.Router();

const adminRepository = new AdminRepository();
const encrypt = new Encrypt(); // Creating an instance of Encrypt
const createJWT = new CreateJWT();

// Passing all required dependencies to UserServices
const adminServices = new AdminServices(adminRepository, encrypt, createJWT);

// Pass the instance of UserServices to the UserController
const adminController = new AdminController(adminServices);
adminRouter.get('/logout', (req, res) => adminController.adminLogout(req, res))
adminRouter.post('/login', (req, res) => adminController.adminLogin(req, res))
adminRouter.post('/refresh-token', (req, res, next) => adminController.refreshToken(req, res, next))
adminRouter.get('/users', adminAuthenticate, async (req, res) => adminController.fetchUsers(req, res))
adminRouter.get('/providers', adminAuthenticate, async (req, res) => adminController.fetchProviders(req, res))
adminRouter.get('/edit_user/:id', adminAuthenticate, async (req, res) => adminController.editUser(req, res))
adminRouter.put('/edit_user/:id', adminAuthenticate, async (req, res) => adminController.updateUser(req, res));
adminRouter.put('/update_status/:id',adminAuthenticate, async (req, res) => adminController.updateStatus(req, res));
adminRouter.get('/edit_provider/:id', adminAuthenticate, async (req, res) => adminController.editProvider(req, res))
adminRouter.put('/edit_provider/:id', adminAuthenticate, async (req, res)=> adminController.updateProvider(req, res));
adminRouter.put('/update_status_provider/:id',adminAuthenticate, async (req, res) => adminController.updateStatusProvider(req, res));
adminRouter.get('/notifications',adminAuthenticate, async (req, res) => adminController.fetchNotification(req, res));
adminRouter.get('/notification_details/:id',adminAuthenticate, async (req, res) => adminController.notificationDetails(req, res));
adminRouter.get('/verify_notification/:id/:value', adminAuthenticate, async (req, res) => adminController.verifyNotification(req, res));
adminRouter.get('/cars', adminAuthenticate, async (req, res) => adminController.fetchCars(req, res))
adminRouter.put('/update_status_car/:id',adminAuthenticate,async(req,res)=>adminController.updateStatusCar(req,res))
adminRouter.post('/add_offer',adminAuthenticate,async(req,res)=>adminController.addOffer(req,res))
adminRouter.get('/fetchOffer',adminAuthenticate,async(req,res)=>adminController.fetchOffer(req,res))
adminRouter.get('/edit_offers/:id', adminAuthenticate, async (req, res) => adminController.editOffer(req, res))
adminRouter.put('/edit_offers/:id', adminAuthenticate, async (req, res)=> adminController.updateOffer(req, res));
adminRouter.delete('/delete_offers/:id', adminAuthenticate, async (req, res)=> adminController.deleteOffer(req, res));

export default adminRouter;


