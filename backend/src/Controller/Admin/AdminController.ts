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
    console.log("inside controllr for accesstoken", refreshToken);

    if (!refreshToken)
      res
        .status(401)
        .json({ success: false, message: "Refresh Token Expired" });

    try {
      const decoded = verifyRefreshToken(refreshToken);
      console.log(decoded, "decoded data")
      if (!decoded || !decoded.data) {
        console.log("hai")
        res.status(401).json({ success: false, message: "Refresh Token Expired" });
      }

      const result = await this.adminServices.adminGetById(decoded.data);
      console.log(result, "result after create neew token")

      const accessTokenMaxAge = 5 * 60 * 1000;
      const newAccessToken = result?.data?.token
      console.log(newAccessToken, "new token")
      res.cookie('access_token', newAccessToken, {
        maxAge: accessTokenMaxAge,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
      })
      console.log(res.cookie, "cookie")
      res.status(200).json({ success: true, message: "Token Updated" });
    }
    catch (error) {
      next(error);
    }
  }

  async adminLogin(req: Request, res: Response): Promise<Response<any, Record<string, any>>> {
    try {
      const { email, password }: { email: string; password: string } = req.body;

      console.log("controllerresult");
      const result = await this.adminServices.adminSignIn({ email, password });

      console.log("result", result);
      if (result?.data.success) {
        const access_token = result.data.token;
        const refresh_token = result.data.refreshToken;
        const accessTokenMaxAge = 5 * 60 * 1000; // 5 minutes
        const refreshTokenMaxAge = 48 * 60 * 60 * 1000; // 48 hours
        console.log("login successfully");
        return res.status(OK) // Change OK to 200 for clarity
          .cookie('access_token', access_token, {
            maxAge: accessTokenMaxAge,
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production'
          })
          .cookie('refresh_token', refresh_token, {
            maxAge: refreshTokenMaxAge,
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production'
          })
          .json({ success: true, user: result.data, message: result.data.message });
      } else {
        console.log("login failed");
        return res.status(BAD_REQUEST).json({ success: false, message: result?.data.message });
      }
    } catch (error) {
      console.error("Error during sign-in:", error);
      return res.status(INTERNAL_SERVER_ERROR).json({ message: "Internal server error" });
    }
  }


  async adminLogout(req: Request, res: Response): Promise<void> {
    try {
      console.log("logout");

      // Clear the cookies by setting them with an empty value and setting the `maxAge` to 0
      res.clearCookie('access_token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production'
      });
      res.clearCookie('refresh_token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production'
      });
      console.log("admin loggout successfully")
      // Send success response
      res.status(200).json({ success: true, message: "Logged out successfully" });
    } catch (error) {
      console.error("Error during admin logout:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  async fetchUsers(req: Request, res: Response): Promise<void> {
    try {
      const result = await this.adminServices.fetchUsers(); // Fetch users from service

      if (result) {
        // Respond with the service result, no need to return
        res.status(result.status).json(result.data);
      } else {
        res.status(500).json({ message: "Internal server error" });
      }
    } catch (error) {
      console.error("Error during fetch users:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  async fetchProviders(req: Request, res: Response): Promise<void> {
    try {
      const result = await this.adminServices.fetchProviders(); // Fetch users from service

      if (result) {
        // Respond with the service result, no need to return
        res.status(result.status).json(result.data);
      } else {
        res.status(500).json({ message: "Internal server error" });
      }
    } catch (error) {
      console.error("Error during fetch provider:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }


  async editUser(req: Request, res: Response): Promise<Response<any, Record<string, any>>> {
    try {
      const id = req.params.id; // Extract 'id' from req.params
      console.log(id, "edit user admin controller");

      // Validate if ID is a string and a valid ObjectId
      if (!id || typeof id !== "string" || !mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid ID parameter" });
      }

      const userExist = await this.adminServices.editUser(id);

      console.log(userExist, "exist user");

      if (!userExist) {
        return res.status(404).json({ message: "User not found" });
      }

      return res.status(200).json(userExist);
    } catch (error) {
      console.error("Error during check user exist:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }



  async updateUser(req: Request, res: Response): Promise<Response<any, Record<string, any>>> {
    try {
      // Log incoming data to debug
      console.log("Edit Uiser - Params:", req.params);
      console.log("user Data:", req.body);

      const id = req.params.id;  // Get the id from params
      if (!id) {
        return res.status(400).json({ message: 'ID is missing' });
      }

      const userData = req.body;  // Directly use req.body, assuming you're sending JSON
      if (!userData) {
        return res.status(400).json({ message: 'Profile data is missing' });
      }

      // Call the service to save the profile
      const result = await this.adminServices.updateUser(userData, id);
      console.log(result, "Edit user Result");

      if (result?.status === OK) {
        return res.status(OK).json(result.data);  // Return success response
      } else {
        return res.status(INTERNAL_SERVER_ERROR).json(result?.data);  // Handle internal error from service
      }
    } catch (error) {
      console.error("Error during profile update:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }
  async updateStatus(req: Request, res: Response): Promise<Response<any, Record<string, any>>> {
    try {
      const id = req.params.id; // Extract 'id' from req.params
      console.log(id, "edit user admin controller");

      // Validate if ID is a string and a valid ObjectId
      if (!id || typeof id !== "string" || !mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid ID parameter" });
      }

      const userExist = await this.adminServices.updateStatus(id);

      console.log(userExist, "exist user");

      if (!userExist) {
        return res.status(404).json({ message: "User not found" });
      }

      return res.status(200).json(userExist);
    } catch (error) {
      console.error("Error during check user exist:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }
  async editProvider(req: Request, res: Response): Promise<Response<any, Record<string, any>>> {
    try {
      const id = req.params.id; // Extract 'id' from req.params
      console.log(id, "edit provider admin controller");

      // Validate if ID is a string and a valid ObjectId
      if (!id || typeof id !== "string" || !mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid ID parameter" });
      }

      const providerExist = await this.adminServices.editProvider(id);

      console.log(providerExist, "exist user");

      if (!providerExist) {
        return res.status(404).json({ message: "provider not found" });
      }

      return res.status(200).json(providerExist);
    } catch (error) {
      console.error("Error during check provider exist:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }



  async updateProvider(req: Request, res: Response): Promise<Response<any, Record<string, any>>> {
    try {
      // Log incoming data to debug
      console.log("Edit provider - Params:", req.params);
      console.log("provider Data:", req.body);

      const id = req.params.id;  // Get the id from params
      if (!id) {
        return res.status(400).json({ message: 'ID is missing' });
      }

      const providerData = req.body;  // Directly use req.body, assuming you're sending JSON
      if (!providerData) {
        return res.status(400).json({ message: 'Profile data is missing' });
      }

      // Call the service to save the profile
      const result = await this.adminServices.updateProvider(providerData, id);
      console.log(result, "Edit provider Result");

      if (result?.status === OK) {
        return res.status(OK).json(result.data);  // Return success response
      } else {
        return res.status(INTERNAL_SERVER_ERROR).json(result?.data);  // Handle internal error from service
      }
    } catch (error) {
      console.error("Error during provider data update:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }
  async updateStatusProvider(req: Request, res: Response): Promise<Response<any, Record<string, any>>> {
    try {
      const id = req.params.id;
      console.log(id, "edit provider admin controller");

      if (!id || typeof id !== "string" || !mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid ID parameter" });
      }

      const providerExist = await this.adminServices.updateStatusProvider(id);

      console.log(providerExist, "exist provider");

      if (!providerExist) {
        return res.status(404).json({ message: "provider not found" });
      }

      return res.status(200).json(providerExist);
    } catch (error) {
      console.error("Error during check provider exist:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }


  // *************************fetch notification that send by providers****************
  async fetchNotification(req: Request, res: Response): Promise<void> {
    try {
      console.log("fetch notificationos")
      const result = await this.adminServices.fetchNotification(); // Fetch users from service
      console.log(result, "fetch notificaion result")
      if (result) {
        // Respond with the service result, no need to return
        res.status(result.status).json(result.data);
      } else {
        res.status(500).json({ message: "Internal server error" });
      }
    } catch (error) {
      console.error("Error during fetch provider:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  // ***************************fetch notification details*****************

  async notificationDetails(req: Request, res: Response): Promise<Response<any, Record<string, any>>> {
    try {
      const id = req.params.id; // Extract 'id' from req.params


      // Validate if ID is a string and a valid ObjectId
      if (!id || typeof id !== "string" || !mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid ID parameter" });
      }

      const carDocumentExist = await this.adminServices.notificationDetails(id);


      if (!carDocumentExist) {
        return res.status(404).json({ message: "provider not found" });
      }

      return res.status(200).json(carDocumentExist);
    } catch (error) {
      console.error("Error during check provider exist:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  //  ********************************verify notification(reject or accept)**************

  async verifyNotification(req: Request, res: Response): Promise<Response<any, Record<string, any>>> {
    try {
      console.log("Controller handling notification verification");
      const id = req.params.id; // Extract 'id' from req.params
      const value = req.params.value; // Extract 'value' from req.params

      // Validate if ID is a string and a valid ObjectId
      if (!id || typeof id !== "string" || !mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid ID parameter" });
      }

      // Call your service to verify the notification
      let result = await this.adminServices.verifynotification(id, value);
      console.log(result, "controller result")
      // Handle cases based on value and result
      if (result) {
        if (value === "Accept") {
          return res.status(200).json({ message: "Car Accepted" });
        } else if (value === "Reject") {
          return res.status(200).json({ message: "Car Rejected" });
        }
      }

      // If no matching result, return a 404 or an appropriate message
      return res.status(404).json({ message: "Notification not found or invalid action" });

    } catch (error) {
      console.error("Error during notification verification:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  // *************************fetch car for car management********************
  async fetchCars(req: Request, res: Response): Promise<void> {
    try {
      const result = await this.adminServices.fetchCars(); // Fetch users from service

      if (result) {
        // Respond with the service result, no need to return
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
      console.log("Updating car status");
      const id = req.params.id;
      console.log(id, "Car ID in updateStatusCar");

      if (!id || !mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid car ID" });
      }

      const carExist = await this.adminServices.updateStatusCar(id);

      if (!carExist) {
        return res.status(404).json({ message: "Car not found" });
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
      console.log(req.body, "offer")
      const saveOffer = await this.adminServices.addOffer(req.body.offer);
      console.log(saveOffer, "save offer")
      if (!saveOffer) {
        return res.status(404).json({ message: "Offer is not saved" });
      }

      return res.status(200).json({ message: "Offer saved updated successfully", car: req.body });
    } catch (error) {
      console.error("Error save Offer status:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  // ***************************fetch Offer**********************
  async fetchOffer(req: Request, res: Response): Promise<void> {
    try {
      const result = await this.adminServices.fetchOffer(); // Fetch offers from service
      console.log(result, "result in fetch offer")
      if (result) {
        // Send the response, no explicit return needed
        res.status(result.status).json(result.data);
      } else {
        res.status(500).json({ message: "Internal server error" });
      }
    } catch (error) {
      console.error("Error during fetch offers:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
  // ************************************8edit offer***************************
  async editOffer(req: Request, res: Response): Promise<Response<any, Record<string, any>>> {
    try {
      const id = req.params.id; // Extract 'id' from req.params
      console.log(id, "edit offer admin controller");


      if (!id || typeof id !== "string" || !mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid ID parameter" });
      }

      const offerExist = await this.adminServices.editOffer(id);

      console.log(offerExist, "offerExist");

      if (!offerExist) {
        return res.status(404).json({ message: "Offer not found" });
      }

      return res.status(200).json(offerExist);
    } catch (error) {
      console.error("Error during check offer exist:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  // ***********************************update offer*************************

  async updateOffer(req: Request, res: Response): Promise<Response<any, Record<string, any>>> {
    try {
      console.log("Edit offer - Params:", req.params);
      console.log("offer Data:", req.body);

      const id = req.params.id;  // Get the id from params
      if (!id) {
        return res.status(400).json({ message: 'ID is missing' });
      }

      const offerData = req.body;  // Directly use req.body, assuming you're sending JSON
      if (!offerData) {
        return res.status(400).json({ message: 'offer data is missing' });
      }

      // Call the service to save the profile
      const result = await this.adminServices.updateOffer(offerData, id);
      console.log(result, "Edit offer Result");

      if (result?.status === OK) {
        return res.status(OK).json(result.data);  // Return success response
      } else {
        return res.status(INTERNAL_SERVER_ERROR).json(result?.data);  // Handle internal error from service
      }
    } catch (error) {
      console.error("Error during  offer update:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }
  // *******************************delete Offer*********************888
  async updateStatusOffer(req: Request, res: Response): Promise<Response> {
    try {
      console.log("updateStatusOffer");
      const id = req.params.id;
      console.log(id, "Car ID in updateStatusOffer");

      if (!id || !mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid car ID" });
      }

      const offerExist = await this.adminServices.updateStatusOffer(id);
      console.log("delete offer", offerExist)

      if (!offerExist) {
        return res.status(404).json({ message: "Offer not found" });
      }

      return res.status(200).json({ message: "Offer updateStatusOffer successfully", data: offerExist });
    } catch (error) {
      console.error("Error updating car status:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }
  // *************************add coupon**************************


  async addCoupon(req: Request, res: Response): Promise<Response> {
    try {
      console.log(req.body, "coupon")
      const saveCoupon = await this.adminServices.addCoupon(req.body.coupon);
      console.log(saveCoupon, "Coupon offer")
      if (!saveCoupon) {
        return res.status(404).json({ message: "Coupon is not saved" });
      }

      return res.status(200).json({ message: "Coupon saved updated successfully", car: req.body });
    } catch (error) {
      console.error("Error save Offer status:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  // ***************************fetch Coupon**********************
  async fetchCoupon(req: Request, res: Response): Promise<void> {
    try {
      const result = await this.adminServices.fetchCoupon(); // Fetch offers from service
      console.log(result, "result in fetch Coupon")
      if (result) {
        // Send the response, no explicit return needed
        res.status(result.status).json(result.data);
      } else {
        res.status(500).json({ message: "Internal server error" });
      }
    } catch (error) {
      console.error("Error during fetch Coupon:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  // ************************************edit coupon***************************
  async editCoupon(req: Request, res: Response): Promise<Response<any, Record<string, any>>> {
    try {
      const id = req.params.id; // Extract 'id' from req.params
      console.log(id, "edit coupon admin controller");


      if (!id || typeof id !== "string" || !mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid ID parameter" });
      }

      const couponExist = await this.adminServices.editCoupon(id);

      console.log(couponExist, "couponExist");

      if (!couponExist) {
        return res.status(404).json({ message: "Coupon not found" });
      }

      return res.status(200).json(couponExist);
    } catch (error) {
      console.error("Error during check coupon exist:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }
  // ***********************************update Coupon *************************

  async updateCoupon(req: Request, res: Response): Promise<Response<any, Record<string, any>>> {
    try {
      console.log("Edit coupon - Params:", req.params);
      console.log("coupon Data:", req.body);

      const id = req.params.id;  // Get the id from params
      if (!id) {
        return res.status(400).json({ message: 'ID is missing' });
      }

      const couponData = req.body;  // Directly use req.body, assuming you're sending JSON
      if (!couponData) {
        return res.status(400).json({ message: 'coupon data is missing' });
      }

      // Call the service to save the profile
      const result = await this.adminServices.updateCoupon(couponData, id);
      console.log(result, "Edit coupon Data Result");

      if (result?.status === OK) {
        return res.status(OK).json(result.data);  // Return success response
      } else {
        return res.status(INTERNAL_SERVER_ERROR).json(result?.data);  // Handle internal error from service
      }
    } catch (error) {
      console.error("Error during  couponData update:", error);
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
  
}