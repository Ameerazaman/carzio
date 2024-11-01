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

            const result = await this.providerServices.providerGetById(decoded.data);
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


    // ******************************provider signup************************8

    async ProviderSignup(req: Request, res: Response): Promise<void> {
        try {
            req.app.locals.ProviderData = req.body;

            console.log("provider control", req.app.locals.ProviderData)
            // Check if the user already existsconst existingUser = await this.providerServices.userSignup(req.app.locals.ProviderData);
            const existingUser = await this.providerServices.userSignup(req.app.locals.ProviderData);

            console.log(existingUser, "existUser")
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
            console.log("providerotp page");
            const email = req.app.locals.providerEmail; // Getting user email from app locals
            console.log("email", email);

            const otp = await generateAndSendOTP(email);
            var otpData = await this.providerServices.createOtp(email, Number(otp)) // Assuming this function generates and sends OTP
            if (otpData) {

                // Return success response
                return res.status(OK).json({
                    success: true,
                    message: 'Resend OTP successfully',
                });
            } else {
                // Return error response if OTP generation failed
                return res.status(BAD_REQUEST).json({
                    success: false,
                    message: 'Error during OTP resend'
                });
            }
        } catch (error) {
            console.error('Error in resending OTP:', error);
            // Return internal server error response
            return res.status(INTERNAL_SERVER_ERROR).json({
                success: false,
                message: 'Internal Server Error.'
            });
        }
    }

    // *******************************verify provider Otp*********************************

    async verifyOtp(req: Request, res: Response): Promise<Response<any, Record<string, any>>> {
        try {
            const { otp } = req.body; // OTP from request
            let email = req.app.locals.providerEmail; // Email from app locals
            console.log("is verify otp")
            console.log(email, "email")
            console.log(req.app.locals.ProviderData, "providerdata")
            // Find the OTP in the database for the user
            var OTPRecord = await this.providerServices.verifyOtp(email, otp) // Assuming this function generates and sends OTP

            console.log(OTPRecord, "otp record")
            // Check if OTPRecord exists
            if (!OTPRecord) {

                return res.status(BAD_REQUEST).json({ success: false, message: 'No OTP record found!' });
            }
            if (OTPRecord) {
                const providerData = req.app.locals.ProviderData
                console.log(providerData, "controller")

                const savedProvider = await this.providerServices.saveProvider(providerData);

                if (savedProvider) {


                    return res.status(OK).json({
                        success: true,
                        message: 'OTP verified Successfully',
                        // token,
                        // refreshToken,
                        provider: savedProvider,
                    });
                } else {
                    return res.status(INTERNAL_SERVER_ERROR).json({
                        success: false,
                        message: 'Error saving user after OTP verification',
                    });
                }

            } else {
                console.log('Incorrect OTP provided.');
                return res.status(BAD_REQUEST).json({ success: false, message: 'Incorrect OTP!' });
            }
        } catch (error) {
            console.log('Error during OTP verification:', error);
            return res.status(INTERNAL_SERVER_ERROR).json({ success: false, message: 'Internal Server Error.' });
        }
    }

    // **************************************************provider Login*******************

    async providerLogin(req: Request, res: Response): Promise<Response<any, Record<string, any>>> {
        try {
            const { email, password }: { email: string; password: string } = req.body;

            console.log("controllerresult");
            const result = await this.providerServices.providerSignIn({ email, password });

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

    // **************************************provider Logout***********************
    async providerLogout(req: Request, res: Response): Promise<void> {
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
            console.log("provider loggout successfully")
            // Send success response
            res.status(200).json({ success: true, message: "Logged out successfully" });
        } catch (error) {
            console.error("Error during user logout:", error);
            res.status(500).json({ message: "Internal server error" });
        }
    }

    // ****************************check provider address exist or not******************
    async checkProviderAddrress(req: Request, res: Response): Promise<Response<any, Record<string, any>>> {
        try {
            const id = req.params.id; // Extract 'id' from req.params

            // Ensure the ID is a string
            if (!id || typeof id !== "string") {
                // Return immediately after sending the response
                return res.status(400).json({ message: "Invalid ID parameter" });
            }

            console.log("addressssss checking");
            const address = await this.providerServices.checkProviderAddress(id);
            console.log(address, "addressssss");
            if (address) {

                return res.status(200).json(address);
            }

            // Handle the case where address is undefined
            else {
                // Return immediately after sending the response
                return res.status(404).json({ message: "Address not found" });
            }


        } catch (error) {
            console.error("Error during check providerAddress:", error);
            // Return immediately after sending the error response
            return res.status(500).json({ message: "Internal server error" });
        }
    }

    // ******************************save profile of provider************************

    async saveProfile(req: Request, res: Response): Promise<Response<any, Record<string, any>>> {
        try {

            // Save profile data in req.app.locals to access later
            req.app.locals.profile = req.body.profileData;

            // Call the service to save the profile and wait for the result
            const result = await this.providerServices.saveProfile(req.app.locals.profile);

            // Check if the service returned success
            if (result?.status === OK) {
                return res.status(OK).json(result.data);  // Return success response
            } else {
                return res.status(INTERNAL_SERVER_ERROR).json(result?.data);  // Handle internal error from service
            }

        } catch (error) {
            console.error("Error during check providerAddress:", error);
            return res.status(500).json({ message: "Internal server error" });
        }
    }

    // **************************edit profile*********************************
    async editProfile(req: Request, res: Response): Promise<Response<any, Record<string, any>>> {
        try {
            // Log incoming data to debug
            console.log("Edit Profile - Params:", req.params);
            console.log("Profile Data:", req.body);

            const id = req.params.id;  // Get the id from params
            if (!id) {
                return res.status(400).json({ message: 'ID is missing' });
            }

            const profileData = req.body;  // Directly use req.body, assuming you're sending JSON
            if (!profileData) {
                return res.status(400).json({ message: 'Profile data is missing' });
            }

            // Call the service to save the profile
            const result = await this.providerServices.editProfile(profileData, id);
            console.log(result, "Edit Profile Result");

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
    // *************************************update Profileimage*******************************
    // Controller - updateProfileImage
    async updateProfileImage(req: Request, res: Response): Promise<Response> {
        try {
            console.log("update profile image")
            const { id } = req.params;
            if (!id) {
                return res.status(400).json({ message: 'ID is missing' });
            }
            const uploadedFile = req.file;

            if (!uploadedFile) {
                return res.status(400).json({ message: 'No image file uploaded' });
            }

            // Generate image path to save in the database
            const imagePath = `/uploads/${uploadedFile.filename}`;
            console.log(imagePath, "image path")
            // Update the profile with the image path
            const result = await this.providerServices.updateProfileImage(req.file, id);
            console.log(result, "result")
            if (result?.status === OK) {
                return res.status(OK).json(result.data);
            } else {
                return res.status(INTERNAL_SERVER_ERROR).json({ message: "Failed to update profile image" });
            }
        } catch (error) {
            console.error("Error during profile image update:", error);
            return res.status(500).json({ message: "Internal server error" });
        }
    }

    // *************************************Addd car details******************************
    async addCarDetails(req: Request, res: Response): Promise<Response<any, Record<string, any>>> {
        try {
            const carData = req.body;  // Form data
            const uploadedFiles = req.files as Express.Multer.File[]; // Uploaded image files

            // Prepare the file paths to store in the database
            const imagePaths = uploadedFiles.map((file) => `/uploads/${file.filename}`);

            // Add the image paths to carData
            carData.images = imagePaths;
            let result = await this.providerServices.addCarDetails(req.files, carData)
            if (result?.status === OK) {
                return res.status(OK).json(result.data);
                // Return success response
            }
            else {
                return res.status(INTERNAL_SERVER_ERROR).json({ message: "Car Already exist" });  // Handle internal error from service
            }
        } catch (error) {
            console.error("Error during profile update:", error);
            return res.status(500).json({ message: "Internal server error" });
        }

    }


    // *************************fetch car for car management********************
    async fetchCars(req: Request, res: Response): Promise<void> {
        try {
            const result = await this.providerServices.fetchCars(); // Fetch users from service

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

            const carExist = await this.providerServices.updateStatusCar(id);

            if (!carExist) {
                return res.status(404).json({ message: "Car not found" });
            }

            return res.status(200).json({ message: "Car status updated successfully", car: carExist });
        } catch (error) {
            console.error("Error updating car status:", error);
            return res.status(500).json({ message: "Internal server error" });
        }
    }

    //   / ***********************************get Edit Car for car mgt*****************

    async editCar(req: Request, res: Response): Promise<Response<any, Record<string, any>>> {
        try {
            const id = req.params.id; // Extract 'id' from req.params


            // Validate if ID is a string and a valid ObjectId
            if (!id || typeof id !== "string" || !mongoose.Types.ObjectId.isValid(id)) {
                return res.status(400).json({ message: "Invalid ID parameter" });
            }

            const carExist = await this.providerServices.editCar(id);



            if (!carExist) {
                return res.status(404).json({ message: "Car not found" });
            }

            return res.status(200).json(carExist);
        } catch (error) {
            console.error("Error during check Car exist:", error);
            return res.status(500).json({ message: "Internal server error" });
        }
    }

    // *****************************update Car**********************
    async updateCar(req: Request, res: Response): Promise<Response<any, Record<string, any>>> {
        try {
            const id = req.params.id;
            // console.log("req.files:", req.files);  // Check if files are being received
            console.log("req.body:", req.body);

            if (!id) {
                return res.status(400).json({ message: 'ID is missing' });
            }

            const carData = req.body;
            // const uploadedFiles = req.files as Express.Multer.File[]; // Uploaded image files

            // const imagePaths = uploadedFiles.map((file) => `/uploads/${file.filename}`);
            // carData.images = imagePaths;
            // let result = await this.providerServices.updateCar(req.files, carData, id);
            console.log(carData, "cardata")
            let result = await this.providerServices.updateCar(carData, id);
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
}
