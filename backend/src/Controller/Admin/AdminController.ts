import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import { AdminServices } from '../../Services/Admin/AdminServices';
import { generateAndSendOTP } from '../../Utlis/GenerateAndSendOtp';
import { StatusCodes } from 'http-status-codes';
import { verifyRefreshToken } from '../../Utlis/VerifyTokens';
const { BAD_REQUEST, OK, INTERNAL_SERVER_ERROR, UNAUTHORIZED } = StatusCodes;


export class AdminController {


  constructor(private adminServices: AdminServices) { }

  //  *******************************refresh access token for admin*************************


  async refreshToken(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    const refreshToken = req.cookies.refresh_token;
    console.log(refreshToken, "refresh token");
    
    if (!refreshToken) {
      console.log("refreshToken not received");
      return res.status(401).json({ success: false });
    }
  
    try {
      const decoded = verifyRefreshToken(refreshToken);
      console.log(decoded, "decoded data");
  
      if (!decoded || !decoded.data) {
        console.log("decoded data is not found");
        return res.status(401).json({ success: false, message: "Refresh Token Expired" });
      }
  
      const result = await this.adminServices.adminGetById(decoded.data);
      const accessTokenMaxAge = 5 * 60 * 1000;
      const newAccessToken = result?.data?.token;
  
      if (!newAccessToken) {
        return res.status(401).json({ success: false, message: "Access token not generated" });
      }
  
      res.cookie('access_token', newAccessToken, {
        maxAge: accessTokenMaxAge,
        httpOnly: true,
        sameSite: 'none', // Ensure 'none' is in lowercase
        secure: true, // Ensure you set this correctly for your environment
      });
  
      res.status(200).json({ success: true });
    } catch (error) {
      next(error);
    }
  }
  

  // ***********************************admin Login**************************8

  async adminLogin(req: Request, res: Response): Promise<Response<any, Record<string, any>>> {
    try {
      const { email, password }: { email: string; password: string } = req.body;

      const result = await this.adminServices.adminSignIn({ email, password });
      if (result?.data.success) {
        const access_token = result.data.token;
        const refresh_token = result.data.refreshToken;
        const accessTokenMaxAge = 5 * 60 * 1000;
        const refreshTokenMaxAge = 48 * 60 * 60 * 1000;
        // console.log(access_token, "access_token", refresh_token, "refresh_token", accessTokenMaxAge, "accessTokenMaxAge", refreshTokenMaxAge, "refreshTokenMaxAge")
        return res.status(OK)
          .cookie('access_token', access_token, {
            maxAge: accessTokenMaxAge,
            httpOnly: true,
            secure:true,
            sameSite: 'none',
          })
          .cookie('refresh_token', refresh_token, {
            maxAge: refreshTokenMaxAge,
            httpOnly: true,
            secure:true,
            sameSite: 'none',
          })
          .json({ success: true, user: result.data, message: result.data.message });
      } else {
        console.log("admin login failed")
        return res.status(BAD_REQUEST).json({ success: false, message: result?.data.message });
      }
    } catch (error) {

      return res.status(INTERNAL_SERVER_ERROR).json({ message: "Internal server error" });
    }
  }

  // ***************************admin logout***************************

  async adminLogout(req: Request, res: Response): Promise<void> {
    try {
      res.clearCookie('access_token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production'
      });
      res.clearCookie('refresh_token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production'
      });
      res.status(200).json({ success: true, message: "Logged out successfully" });
    } catch (error) {
      console.error("Error during admin logout:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
  // ******************************fetch users**************************
  async fetchUsers(req: Request, res: Response): Promise<void> {
    try {
      const page = req.query.page ? Number(req.query.page) : 1;
      const limit = req.query.limit ? Number(req.query.limit) : 10;
      const result = await this.adminServices.fetchUsers(page, limit);

      if (result) {
        res.status(result.status).json(result.data);
      } else {
        res.status(500).json({ message: "Internal server error" });
      }
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  }


  // **********************************edit User******************************8

  async editUser(req: Request, res: Response): Promise<Response<any, Record<string, any>>> {
    try {
      const id = req.params.id;


      if (!id || typeof id !== "string" || !mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid ID parameter" });
      }

      const userExist = await this.adminServices.editUser(id);


      if (!userExist) {
        return res.status(404).json({ message: "User not found" });
      }

      return res.status(200).json(userExist);
    } catch (error) {
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  // *****************************************update user****************************

  async updateUser(req: Request, res: Response): Promise<Response<any, Record<string, any>>> {
    try {

      const id = req.params.id;
      if (!id) {
        return res.status(400).json({ message: 'ID is missing' });
      }

      const userData = req.body;
      if (!userData) {
        return res.status(400).json({ message: 'Profile data is missing' });
      }

      const result = await this.adminServices.updateUser(userData, id);

      if (result?.status === OK) {
        return res.status(OK).json(result.data);
      } else {
        return res.status(INTERNAL_SERVER_ERROR).json(result?.data);
      }
    } catch (error) {

      return res.status(500).json({ message: "Internal server error" });
    }
  }

  // ********************************* update status of Userss*****************

  async updateStatus(req: Request, res: Response): Promise<Response<any, Record<string, any>>> {
    try {
      const id = req.params.id;
      if (!id || typeof id !== "string" || !mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid ID parameter" });
      }

      const userExist = await this.adminServices.updateStatus(id);

      if (!userExist) {
        return res.status(404).json({ message: "User not found" });
      }

      return res.status(200).json(userExist);
    } catch (error) {
      return res.status(500).json({ message: "Internal server error" });
    }
  }
  // ********************************fetch providers*********************

  async fetchProviders(req: Request, res: Response): Promise<void> {
    try {
      const page = req.query.page ? Number(req.query.page) : 1;
      const limit = req.query.limit ? Number(req.query.limit) : 10;
      const result = await this.adminServices.fetchProviders(page, limit);

      if (result) {

        res.status(result.status).json(result.data);
      } else {
        res.status(500).json({ message: "Internal server error" });
      }
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  }

  // ******************************edit provider****************************88

  async editProvider(req: Request, res: Response): Promise<Response<any, Record<string, any>>> {
    try {
      const id = req.params.id;

      if (!id || typeof id !== "string" || !mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid ID parameter" });
      }

      const providerExist = await this.adminServices.editProvider(id);

      if (!providerExist) {
        return res.status(404).json({ message: "provider not found" });
      }

      return res.status(200).json(providerExist);
    } catch (error) {
      return res.status(500).json({ message: "Internal server error" });
    }
  }


  // ***********************************update provider*********************88
  async updateProvider(req: Request, res: Response): Promise<Response<any, Record<string, any>>> {
    try {

      const id = req.params.id;
      if (!id) {
        return res.status(400).json({ message: 'ID is missing' });
      }

      const providerData = req.body;
      if (!providerData) {
        return res.status(400).json({ message: 'Profile data is missing' });
      }

      const result = await this.adminServices.updateProvider(providerData, id);

      if (result?.status === OK) {
        return res.status(OK).json(result.data);
      } else {
        return res.status(INTERNAL_SERVER_ERROR).json(result?.data);
      }
    } catch (error) {
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  // *************************8888update status provider*************************


  async updateStatusProvider(req: Request, res: Response): Promise<Response<any, Record<string, any>>> {
    try {
      const id = req.params.id;
      if (!id || typeof id !== "string" || !mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid ID parameter" });
      }

      const providerExist = await this.adminServices.updateStatusProvider(id);

      if (!providerExist) {
        return res.status(404).json({ message: "provider not found" });
      }

      return res.status(200).json(providerExist);
    } catch (error) {

      return res.status(500).json({ message: "Internal server error" });
    }
  }


  // *************************fetch notification that send by providers****************
  async fetchNotification(req: Request, res: Response): Promise<void> {
    try {

      const result = await this.adminServices.fetchNotification();

      if (result) {

        res.status(result.status).json(result.data);
      } else {
        res.status(500).json({ message: "Internal server error" });
      }
    } catch (error) {

      res.status(500).json({ message: "Internal server error" });
    }
  }

  // ***************************fetch notification details*****************

  async notificationDetails(req: Request, res: Response): Promise<Response<any, Record<string, any>>> {
    try {
      const id = req.params.id;

      if (!id || typeof id !== "string" || !mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid ID parameter" });
      }

      const carDocumentExist = await this.adminServices.notificationDetails(id);

      if (!carDocumentExist) {
        return res.status(400).json({ message: "car documnet not found" });
      }

      return res.status(200).json(carDocumentExist);
    } catch (error) {

      return res.status(500).json({ message: "Internal server error" });
    }
  }

  //  ********************************verify notification(reject or accept)**************

  async verifyNotification(req: Request, res: Response): Promise<Response<any, Record<string, any>>> {
    try {

      const id = req.params.id;
      const value = req.params.value;

      if (!id || typeof id !== "string" || !mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid ID parameter" });
      }

      let result = await this.adminServices.verifynotification(id, value);

      if (result) {
        if (value === "Accept") {
          return res.status(200).json({ message: "Car Accepted" });
        } else if (value === "Reject") {
          return res.status(200).json({ message: "Car Rejected" });
        }
      }

      return res.status(400).json({ message: "Notification not found or invalid action" });

    } catch (error) {
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  // *************************fetch car for car management********************
  async fetchCars(req: Request, res: Response): Promise<void> {
    try {
      const page = req.query.page ? Number(req.query.page) : 1;
      const limit = req.query.limit ? Number(req.query.limit) : 10;
      const result = await this.adminServices.fetchCars(page, limit);

      if (result) {
        res.status(result.status).json(result.data);
      } else {
        res.status(500).json({ message: "Internal server error" });
      }
    } catch (error) {
      console.error("Error during fetch cars:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }


  // ******************************Change car status*****************************

  async updateStatusCar(req: Request, res: Response): Promise<Response> {
    try {
      const id = req.params.id;
      if (!id || !mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid car ID" });
      }

      const carExist = await this.adminServices.updateStatusCar(id);

      if (!carExist) {
        return res.status(400).json({ message: "Car not found" });
      }

      return res.status(200).json({ message: "Car status updated successfully", car: carExist });
    } catch (error) {
      console.error("Error updating car status:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  // ***********************Add offer*************************
  async addOffer(req: Request, res: Response): Promise<Response> {
    try {

      const saveOffer = await this.adminServices.addOffer(req.body.offer);

      if (!saveOffer) {
        return res.status(400).json({ message: "Offer is not saved" });
      }
      return res.status(200).json({ message: "Offer saved updated successfully", car: req.body });
    } catch (error) {

      return res.status(500).json({ message: "Internal server error" });
    }
  }

  // ***************************fetch Offer**********************
  async fetchOffer(req: Request, res: Response): Promise<void> {
    try {
      const page = req.query.page ? Number(req.query.page) : 1;
      const limit = req.query.limit ? Number(req.query.limit) : 10;
      const result = await this.adminServices.fetchOffer(page, limit);
      if (result) {
        res.status(result.status).json(result.data);
      } else {
        res.status(500).json({ message: "Internal server error" });
      }
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  }
  // ************************************8edit offer***************************
  async editOffer(req: Request, res: Response): Promise<Response<any, Record<string, any>>> {
    try {
      const id = req.params.id;

      if (!id || typeof id !== "string" || !mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid ID parameter" });
      }

      const offerExist = await this.adminServices.editOffer(id);

      if (!offerExist) {
        return res.status(404).json({ message: "Offer not found" });
      }

      return res.status(200).json(offerExist);
    } catch (error) {

      return res.status(500).json({ message: "Internal server error" });
    }
  }

  // ***********************************update offer*************************

  async updateOffer(req: Request, res: Response): Promise<Response<any, Record<string, any>>> {
    try {

      const id = req.params.id;
      if (!id) {
        return res.status(400).json({ message: 'ID is missing' });
      }

      const offerData = req.body;
      if (!offerData) {
        return res.status(400).json({ message: 'offer data is missing' });
      }

      const result = await this.adminServices.updateOffer(offerData, id);

      if (result?.status === OK) {
        return res.status(OK).json(result.data);  // Return success response
      } else {
        return res.status(INTERNAL_SERVER_ERROR).json(result?.data);  // Handle internal error from service
      }
    } catch (error) {
      return res.status(500).json({ message: "Internal server error" });
    }
  }
  // *******************************delete Offer*********************888
  async updateStatusOffer(req: Request, res: Response): Promise<Response> {
    try {

      const id = req.params.id;

      if (!id || !mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid car ID" });
      }

      const offerExist = await this.adminServices.updateStatusOffer(id);

      if (!offerExist) {
        return res.status(404).json({ message: "Offer not found" });
      }

      return res.status(200).json({ message: "Offer updateStatusOffer successfully", data: offerExist });
    } catch (error) {
      return res.status(500).json({ message: "Internal server error" });
    }
  }
  // *************************add coupon**************************


  async addCoupon(req: Request, res: Response): Promise<Response> {
    try {

      const saveCoupon = await this.adminServices.addCoupon(req.body.coupon);

      if (!saveCoupon) {
        return res.status(404).json({ message: "Coupon is not saved" });
      }

      return res.status(200).json({ message: "Coupon saved updated successfully", car: req.body });
    } catch (error) {
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  // ***************************fetch Coupon**********************
  async fetchCoupon(req: Request, res: Response): Promise<void> {
    try {
      const page = req.query.page ? Number(req.query.page) : 1;
      const limit = req.query.limit ? Number(req.query.limit) : 10;
      const result = await this.adminServices.fetchCoupon(page, limit);

      if (result) {
        res.status(result.status).json(result.data);
      } else {
        res.status(500).json({ message: "Internal server error" });
      }
    } catch (error) {

      res.status(500).json({ message: "Internal server error" });
    }
  }

  // ************************************edit coupon***************************
  async editCoupon(req: Request, res: Response): Promise<Response<any, Record<string, any>>> {
    try {
      const id = req.params.id;

      if (!id || typeof id !== "string" || !mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid ID parameter" });
      }

      const couponExist = await this.adminServices.editCoupon(id);

      if (!couponExist) {
        return res.status(400).json({ message: "Coupon not found" });
      }

      return res.status(200).json(couponExist);
    } catch (error) {

      return res.status(500).json({ message: "Internal server error" });
    }
  }
  // ***********************************update Coupon *************************

  async updateCoupon(req: Request, res: Response): Promise<Response<any, Record<string, any>>> {
    try {

      const id = req.params.id;
      if (!id) {
        return res.status(400).json({ message: 'ID is missing' });
      }
      const couponData = req.body;
      if (!couponData) {
        return res.status(400).json({ message: 'coupon data is missing' });
      }

      const result = await this.adminServices.updateCoupon(couponData, id);

      if (result?.status === OK) {
        return res.status(OK).json(result.data);
      } else {
        return res.status(INTERNAL_SERVER_ERROR).json(result?.data);
      }
    } catch (error) {

      return res.status(500).json({ message: "Internal server error" });
    }
  }

  // *******************************delete Offer*********************888
  async updateStatusCoupon(req: Request, res: Response): Promise<Response> {
    try {
      const id = req.params.id;
      if (!id || !mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid car ID" });
      }
      const couponExist = await this.adminServices.updateStatusCoupon(id);
      if (!couponExist) {
        return res.status(404).json({ message: "Coupon not found" });
      }
      return res.status(200).json({ message: "update successfully", data: couponExist });
    } catch (error) {
      return res.status(500).json({ message: "Internal server error" });
    }
  }
  // ******************************get booking history**************************8
  async getBookingHistory(req: Request, res: Response): Promise<void> {
    try {
      const page = req.query.page ? Number(req.query.page) : 1;
      const limit = req.query.limit ? Number(req.query.limit) : 10;
      const result = await this.adminServices.getBookingHistory(page, limit);
      if (!result) {
        res.status(500).json({ message: "Error booking history" });
        return
      }
      res.status(200).json(result.data);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  }
  // ******************************details of specic details**************************8
  async specificBookingDetails(req: Request, res: Response): Promise<void> {
    try {
      const bookingId = req.params.id
      const result = await this.adminServices.specificBookingDetails(bookingId);
      if (!result) {
        res.status(500).json({ message: "Error booking history" });
        return
      }
      res.status(200).json(result.data);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  }
  // *********************update Status Of Booking**********************
  async updateStatusOfBooking(req: Request, res: Response): Promise<void> {
    try {
      const bookingId = req.params.id
      const status = req.params.status
      const result = await this.adminServices.updateStatusOfBooking(bookingId, status);
      if (!result) {
        res.status(500).json({ message: "Status updation failed" });
        return
      }
      res.status(200).json(result.data);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  }

  // **************************get dash board constsnt data**********************
  async getDashboardConstData(req: Request, res: Response): Promise<void> {
    try {
      const result = await this.adminServices.getConstDashboardData()
      if (!result) {
        res.status(500).json({
          message: "Dashboard data could not be retrieved"
        }
        );
        return
      }
      res.status(200).json(result.data.data);


    } catch (error) {

      res.status(500).json({
        "message": "Internal server error while fetching dashboard data"
      }
      );
    }
  }

  // ***************************fetch sales report*********************

  async fetchSalesReport(req: Request, res: Response): Promise<void> {
    try {

      const page = req.query.page ? Number(req.query.page) : 1;
      const limit = req.query.limit ? Number(req.query.limit) : 10;

      const result = await this.adminServices.fetchSalesReport(page, limit);

      if (!result) {
        res.status(500).json({ message: "Error fetching sales report" });
        return;
      }

      res.status(200).json(result.data);
    } catch (error) {

      res.status(500).json({ message: "Internal server error" });
    }
  }

}

