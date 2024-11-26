import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';

import { ProviderServices } from '../../Services/Provider/ProviderServices';
import { generateAndSendOTP } from '../../Utlis/GenerateAndSendOtp';
import { StatusCodes } from 'http-status-codes';
import { verifyRefreshToken } from '../../Utlis/VerifyTokens';
const { BAD_REQUEST, OK, INTERNAL_SERVER_ERROR, UNAUTHORIZED } = StatusCodes;



export class ProviderController {


    constructor(private providerServices: ProviderServices) { }
    milliseconds = (h: number, m: number, s: number) => ((h * 60 * 60 + m * 60 + s) * 1000);

    // ***********************refersh accesss token for provider*****************
    async refreshToken(req: Request, res: Response, next: NextFunction): Promise<Response | void> {

        const refreshToken = req.cookies.refresh_token;

        if (!refreshToken)
            res
                .status(401)
                .json({ success: false, message: "Refresh Token Expired" });

        try {
            const decoded = verifyRefreshToken(refreshToken);
            if (!decoded || !decoded.data) {
                res.status(401).json({ success: false, message: "Refresh Token Expired" });
            }

            const result = await this.providerServices.providerGetById(decoded.data);

            const accessTokenMaxAge = 5 * 60 * 1000;
            const newAccessToken = result?.data?.token
            res.cookie('access_token', newAccessToken, {
                maxAge: accessTokenMaxAge,
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
            })
            res.status(200).json({ success: true, message: "Token Updated" });
        }
        catch (error) {
            next(error);
        }
    }


    // ******************************provider signup************************8

    async ProviderSignup(req: Request, res: Response): Promise<void> {
        try {
            req.app.locals.ProviderData = req.body;

            const existingUser = await this.providerServices.userSignup(req.app.locals.ProviderData);

            if (existingUser) {

                res.status(BAD_REQUEST).json({ success: false, message: 'The email is already in use for provider!' });
            } else {
                req.app.locals.newProvider = true;
                req.app.locals.providerEmail = req.body.email;
                const otp = await generateAndSendOTP(req.body.email);

                const otpData = await this.providerServices.createOtp(req.body.email, Number(otp))


                res.status(OK).json({ providerId: null, success: true, message: 'OTP sent for verification...' });
            }
        } catch (error) {
            console.log(error as Error);
            res.status(INTERNAL_SERVER_ERROR).json({ success: false, message: 'Internal server error' });
        }
    }

    /*********************************resend Otp for provider***************** */
    async ProviderResendOtp(req: Request, res: Response): Promise<Response> {
        try {
         
            const email = req.app.locals.providerEmail; 
            const otp = await generateAndSendOTP(email);
            var otpData = await this.providerServices.createOtp(email, Number(otp))
            if (otpData) {

                return res.status(OK).json({
                    success: true,
                    message: 'Resend OTP successfully',
                });
            } else {
          
                return res.status(BAD_REQUEST).json({
                    success: false,
                    message: 'Error during OTP resend'
                });
            }
        } catch (error) {
           
            return res.status(INTERNAL_SERVER_ERROR).json({
                success: false,
                message: 'Internal Server Error.'
            });
        }
    }

    // *******************************verify provider Otp*********************************

    async verifyOtp(req: Request, res: Response): Promise<Response<any, Record<string, any>>> {
        try {
            const { otp } = req.body; 
            let email = req.app.locals.providerEmail; 
           
            var OTPRecord = await this.providerServices.verifyOtp(email, otp)

            if (!OTPRecord) {

                return res.status(BAD_REQUEST).json({ success: false, message: 'No OTP record found!' });
            }
            if (OTPRecord) {
                const providerData = req.app.locals.ProviderData

                const savedProvider = await this.providerServices.saveProvider(providerData);

                if (savedProvider) {


                    return res.status(OK).json({
                        success: true,
                        message: 'OTP verified Successfully',
                        provider: savedProvider,
                    });
                } else {
                    return res.status(INTERNAL_SERVER_ERROR).json({
                        success: false,
                        message: 'Error saving user after OTP verification',
                    });
                }

            } else {
                
                return res.status(BAD_REQUEST).json({ success: false, message: 'Incorrect OTP!' });
            }
        } catch (error) {
           
            return res.status(INTERNAL_SERVER_ERROR).json({ success: false, message: 'Internal Server Error.' });
        }
    }

    // **************************************************provider Login*******************

    async providerLogin(req: Request, res: Response): Promise<Response<any, Record<string, any>>> {
        try {
            const { email, password }: { email: string; password: string } = req.body;
            const result = await this.providerServices.providerSignIn({ email, password });

            if (result?.data.success) {
                const access_token = result.data.token;
                const refresh_token = result.data.refreshToken;
                const accessTokenMaxAge = 5 * 60 * 1000;
                const refreshTokenMaxAge = 48 * 60 * 60 * 1000; 
                
                return res.status(OK) 
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
               
                return res.status(BAD_REQUEST).json({ success: false, message: result?.data.message });
            }
        } catch (error) {
            return res.status(INTERNAL_SERVER_ERROR).json({ message: "Internal server error" });
        }
    }

    // **************************************provider Logout***********************
    async providerLogout(req: Request, res: Response): Promise<void> {
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
        
            res.status(500).json({ message: "Internal server error" });
        }
    }

    // ****************************check provider address exist or not******************
    async checkProviderAddrress(req: Request, res: Response): Promise<Response<any, Record<string, any>>> {
        try {
            const id = req.params.id; 

            if (!id || typeof id !== "string") {
                return res.status(400).json({ message: "Invalid ID parameter" });
            }
            const address = await this.providerServices.checkProviderAddress(id);
            if (address) {

                return res.status(200).json(address);
            }

            else {
                
                return res.status(404).json({ message: "Address not found" });
            }


        } catch (error) {
            
            return res.status(500).json({ message: "Internal server error" });
        }
    }

    // ******************************save profile of provider************************

    async saveProfile(req: Request, res: Response): Promise<Response<any, Record<string, any>>> {
        try {

            req.app.locals.profile = req.body.profileData;

            const result = await this.providerServices.saveProfile(req.app.locals.profile);

            if (result?.status === OK) {
                return res.status(OK).json(result.data); 
            } else {
                return res.status(INTERNAL_SERVER_ERROR).json(result?.data); 
            }

        } catch (error) {
           
            return res.status(500).json({ message: "Internal server error" });
        }
    }

    // **************************edit profile*********************************
    async editProfile(req: Request, res: Response): Promise<Response<any, Record<string, any>>> {
        try {

            const id = req.params.id;  
            if (!id) {
                return res.status(400).json({ message: 'ID is missing' });
            }

            const profileData = req.body; 
            if (!profileData) {
                return res.status(400).json({ message: 'Profile data is missing' });
            }

            const result = await this.providerServices.editProfile(profileData, id);

            if (result?.status === OK) {
                return res.status(OK).json(result.data);  // Return success response
            } else {
                return res.status(INTERNAL_SERVER_ERROR).json(result?.data);  // Handle internal error from service
            }
        } catch (error) {
            return res.status(500).json({ message: "Internal server error" });
        }
    }
    // *************************************update Profileimage*******************************

    async updateProfileImage(req: Request, res: Response): Promise<Response> {
        try {
          
            const { id } = req.params;
            if (!id) {
                return res.status(400).json({ message: 'ID is missing' });
            }
            const uploadedFile = req.file;

            if (!uploadedFile) {
                return res.status(400).json({ message: 'No image file uploaded' });
            }

            const imagePath = `/uploads/${uploadedFile.filename}`;

            const result = await this.providerServices.updateProfileImage(req.file, id);

            if (result?.status === OK) {
                return res.status(OK).json(result.data);
            } else {
                return res.status(INTERNAL_SERVER_ERROR).json({ message: "Failed to update profile image" });
            }
        } catch (error) {
            return res.status(500).json({ message: "Internal server error" });
        }
    }

    // *************************************Addd car details******************************
    async addCarDetails(req: Request, res: Response): Promise<Response<any, Record<string, any>>> {
        try {
            const carData = req.body;  
            const uploadedFiles = req.files as Express.Multer.File[]; 

            const imagePaths = uploadedFiles.map((file) => `/uploads/${file.filename}`);

            carData.images = imagePaths;
            let result = await this.providerServices.addCarDetails(req.files, carData)
            if (result?.status === OK) {
                return res.status(OK).json(result.data);
            }
            else {
                return res.status(INTERNAL_SERVER_ERROR).json({ message: "Car Already exist" });  // Handle internal error from service
            }
        } catch (error) {
    
            return res.status(500).json({ message: "Internal server error" });
        }

    }


    // *************************fetch car for car management********************
      async fetchCars(req: Request, res: Response): Promise<void> {
        try {
            const page = req.query.page ? Number(req.query.page) : undefined;
            const limit = req.query.limit ? Number(req.query.limit) : undefined;
            const providerId = req.query.providerId as string ;
            if (page !== undefined && limit !== undefined) {
               
                const result = await this.providerServices.fetchCars(providerId,page, limit);
              
                if (result) {
                   
                    res.status(200).json(result.data);
                } else {
                    res.status(500).json({ message: "Internal server error" });
                }
            } else {
                res.status(400).json({ message: "Invalid page or limit" });
            }
        } catch (error) {
          
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

            const carExist = await this.providerServices.updateStatusCar(id);

            if (!carExist) {
                return res.status(404).json({ message: "Car not found" });
            }

            return res.status(200).json({ message: "Car status updated successfully", car: carExist });
        } catch (error) {
           
            return res.status(500).json({ message: "Internal server error" });
        }
    }

    //   / ***********************************get Edit Car for car mgt*****************

    async editCar(req: Request, res: Response): Promise<Response<any, Record<string, any>>> {
        try {
            const id = req.params.id; 

            if (!id || typeof id !== "string" || !mongoose.Types.ObjectId.isValid(id)) {
                return res.status(400).json({ message: "Invalid ID parameter" });
            }

            const carExist = await this.providerServices.editCar(id);

            if (!carExist) {
                return res.status(404).json({ message: "Car not found" });
            }

            return res.status(200).json(carExist);
        } catch (error) {
          
            return res.status(500).json({ message: "Internal server error" });
        }
    }

    // *****************************update Car**********************
    async updateCar(req: Request, res: Response): Promise<Response<any, Record<string, any>>> {
        try {
            const id = req.params.id;
           
            if (!id) {
                return res.status(400).json({ message: 'ID is missing' });
            }

            const carData = req.body;
 
            let result = await this.providerServices.updateCar(carData, id);

            if (result?.status === OK) {
                return res.status(OK).json(result.data);
            } else {
                return res.status(INTERNAL_SERVER_ERROR).json({ message: "Car already exists" });
            }
        } catch (error) {
   
            return res.status(500).json({ message: "Internal server error" });
        }
    }

    // ************************************update Car image******************************
    async updateCarImage(req: Request, res: Response): Promise<Response<any, Record<string, any>>> {
        try {
            const id = req.params.id;
            console.log("req.files:", req.files);  // Check if files are being received
            console.log("req.body:", req.body);

            if (!id) {
                return res.status(400).json({ message: 'ID is missing' });
            }

            const carData = req.body;
            const uploadedFiles = req.files as Express.Multer.File[]; // Uploaded image files

            const imagePaths = uploadedFiles.map((file) => `/uploads/${file.filename}`);
            carData.images = imagePaths;
            let result = await this.providerServices.updateCarImage(req.files, id);
            console.log(carData, "cardata")

            console.log(result, "result")
            if (result?.status === OK) {
                return res.status(OK).json(result.data);
            } else {
                return res.status(INTERNAL_SERVER_ERROR).json({ message: "Car already exists" });
            }
        } catch (error) {
            console.error("Error during car update:", error);
            return res.status(500).json({ message: "Internal server error" });
        }
    }

    // ******************************get booking history**************************8
    async getBookingHistory(req: Request, res: Response): Promise<void> {
        try {
            const providerId = req.query.providerId as string ;
            const page = req.query.page ? Number(req.query.page) : 1;
            const limit = req.query.limit ? Number(req.query.limit) : 10;
            const result = await this.providerServices.getBookingHistory(providerId, page, limit);
            if (!result) {
                res.status(500).json({ message: "Error booking history" });
                return
            }
            res.status(200).json(result.data);
        } catch (error) {
            console.error("Error saving profile:", error);
            res.status(500).json({ message: "Internal server error" });
        }
    }
    // ******************************details of specic details**************************8
    async specificBookingDetails(req: Request, res: Response): Promise<void> {
        try {
            const bookingId = req.params.id
            console.log(bookingId, "bookingId")
            const result = await this.providerServices.specificBookingDetails(bookingId);
            if (!result) {
                res.status(500).json({ message: "Error booking history" });
                return
            }
            res.status(200).json(result.data);
        } catch (error) {
            console.error("Error saving profile:", error);
            res.status(500).json({ message: "Internal server error" });
        }
    }
    // *********************update Status Of Booking**********************
    async updateStatusOfBooking(req: Request, res: Response): Promise<void> {
        try {
            const bookingId = req.params.id
            const status = req.params.status
            
            const result = await this.providerServices.updateStatusOfBooking(bookingId, status);
            if (!result) {
                res.status(500).json({ message: "Status updation failed" });
                return
            }
            res.status(200).json(result.data);
        } catch (error) {
            res.status(500).json({ message: "Internal server error" });
        }
    }

    // *****************************fetch users chat by provider*****************
    async fetchUsersChat(req: Request, res: Response): Promise<void> {
        try {

            const providerId = req.params.providerId
           
            const result = await this.providerServices.fetchUsersChat(providerId);
            if (!result) {
                res.status(500).json({ message: "Fetch users chat is failed" });
                return
            }
            res.status(200).json(result.data);
        } catch (error) {
          
            res.status(500).json({ message: "Internal server error" });
        }
    }
 // *********************************fetch chat history***********************8
 async fetchChatHistory(req: Request, res: Response): Promise<void> {
    try {
        
        const providerId = req.params.providerId as string | undefined | '';
        const userId = req.params.userId as string | undefined | '';
        if (!userId || !providerId) {
            res.status(400).json({ success: false, message: "userId and providerId are required" });
            return; 
        }
        const result = await this.providerServices.fetchChatHistory(userId, providerId);
        if (result?.data?.success) {
            res.status(200).json({
                success: true,
                data: result.data.data, 
            });
        } else {
            res.status(200).json({
                success: false,
                message: "No chat history found",
            });
        }
    } catch (error) {
        console.error("Error in fetch chat history:", error);
        res.status(500).json({
            success: false,
            message: "An unexpected error occurred while fetching chat history",
        });
    }
}

 // **************************get dash board constsnt data**********************
 async getDashboardConstData(req: Request, res: Response): Promise<void> {
    try {
        const providerId=req.params.providerId
      const result = await this.providerServices.getConstDashboardData(providerId)
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
      const providerId = req.query.providerId as string ;
      const result = await this.providerServices.fetchSalesReport(page, limit,providerId);
  
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
