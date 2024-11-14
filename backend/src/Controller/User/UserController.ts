import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { UserServices } from '../../Services/User/UserServices';
import { CreateJWT } from '../../Utlis/GenerateToken';
import { generateAndSendOTP } from '../../Utlis/GenerateAndSendOtp';
import { STATUS_CODES } from '../../Constants/HttpStatusCode'
import { Otp } from '../../Model/User/OtpModel';
import { verifyRefreshToken } from '../../Utlis/VerifyTokens';
import { BookingInterface } from '../../Interface/BookingInterface';
import Stripe from 'stripe';
const { BAD_REQUEST, OK, INTERNAL_SERVER_ERROR, UNAUTHORIZED, } = STATUS_CODES;

export class UserController {

    constructor(private userServices: UserServices) { }
    milliseconds = (h: number, m: number, s: number) => ((h * 60 * 60 + m * 60 + s) * 1000);


    // ********************************refresh access token for user******************


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

            const result = await this.userServices.userGetById(decoded.data);
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
            res.status(200).json({ success: true });
        }
        catch (error) {
            next(error);
        }
    }
    async userSignup(req: Request, res: Response): Promise<void> {
        try {
            console.log(req.body, "req.body")
            req.app.locals.userData = req.body;

            // Check if the user already exists
            const existingUser = await this.userServices.userSignup(req.app.locals.userData);
            console.log(existingUser, "exis")

            if (existingUser) {

                res.status(BAD_REQUEST).json({ success: false, message: 'The email is already in use!' });
            } else {
                req.app.locals.newUser = true;
                req.app.locals.userEmail = req.body.email;
                const otp = await generateAndSendOTP(req.body.email);

                await Otp.create({ otp: otp, email: req.body.email });

                res.status(OK).json({ userId: null, success: true, message: 'OTP sent for verification...' });
            }
        } catch (error) {
            console.log(error as Error);
            res.status(INTERNAL_SERVER_ERROR).json({ success: false, message: 'Internal server error' });
        }
    }



    async resendOtp(req: Request, res: Response): Promise<Response> {
        try {
            console.log("otp page");
            const email = req.app.locals.userEmail; // Getting user email from app locals
            console.log(email);

            const otp = await generateAndSendOTP(email); // Assuming this function generates and sends OTP
            if (otp) {
                const result = await Otp.updateMany(
                    { email: email },  // Find the OTP entry by email
                    { $set: { otp: otp } }  // Update only the OTP field
                ); // Store OTP in DB
                console.log("otpresend", otp);
                req.app.locals.userOtp = otp; // Save OTP in app locals for further verification
                req.app.locals.resendOtp = otp;

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


    async verifyOtp(req: Request, res: Response): Promise<Response<any, Record<string, any>>> {
        try {

            const { otp } = req.body; // OTP from request
            let email = req.app.locals.userEmail; // Email from app locals

            // Find the OTP in the database for the user
            const OTPRecord = await Otp.findOne({ email });

            // Check if OTPRecord exists
            if (!OTPRecord) {

                return res.status(BAD_REQUEST).json({ success: false, message: 'No OTP record found!' });
            }

            // Compare OTPs (ensure both are of the same type)
            if (otp === OTPRecord.otp.toString()) {


                // Save user data after successful OTP verification
                const userData = req.app.locals.userData
                console.log(userData, "controller")
                // Call saveUser function to persist user
                const savedUser = await this.userServices.saveUser(userData);

                if (savedUser) {
                    // Optional: Generate JWT tokens if needed
                    // const token = this.createjwt.generateToken(savedUser.id);
                    // const refreshToken = this.createjwt.generateRefreshToken(savedUser.id);

                    // Clear the OTP after successful verification
                    await Otp.deleteOne({ email });

                    return res.status(OK).json({
                        success: true,
                        message: 'OTP verified Successfully',
                        // token,
                        // refreshToken,
                        user: savedUser,
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





    async userLogin(req: Request, res: Response): Promise<Response<any, Record<string, any>>> {
        try {
            const { email, password }: { email: string; password: string } = req.body;

            const result = await this.userServices.userSignIn({ email, password });


            if (result?.data.success) {
                const access_token = result.data.token;
                const refresh_token = result.data.refreshToken;

                const accessTokenMaxAge = 5 * 60 * 1000; // 5 minutes
                const refreshTokenMaxAge = 48 * 60 * 60 * 1000; // 48 hours



                // Set cookies with tokens
                return res.status(200)
                    .cookie('access_token', access_token, {
                        maxAge: accessTokenMaxAge,
                        httpOnly: true,
                        secure: process.env.NODE_ENV === 'production',
                    })
                    .cookie('refresh_token', refresh_token, {
                        maxAge: refreshTokenMaxAge,
                        httpOnly: true,
                        secure: process.env.NODE_ENV === 'production',
                    })
                    .json({ success: true, user: result.data, message: result.data.message });

            } else {

                return res.status(BAD_REQUEST).json({ success: false, message: result?.data.message });
            }
        } catch (error) {
            console.error("Error during sign-in:", error);
            return res.status(INTERNAL_SERVER_ERROR).json({ message: "Internal server error" });
        }
    }



    async userLogout(req: Request, res: Response): Promise<void> {
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
            console.log("loggout successfully")
            // Send success response
            res.status(200).json({ success: true, message: "Logged out successfully" });
        } catch (error) {
            console.error("Error during user logout:", error);
            res.status(500).json({ message: "Internal server error" });
        }
    }


    // ****************************fetch  car for card***************************
    async fetchCars(req: Request, res: Response): Promise<void> {
        try {
            const result = await this.userServices.fetchCars(); // Fetch users from service
            console.log(result, "rsult fetch car")
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

    // *********************************car details page********************
    async carDetails(req: Request, res: Response): Promise<Response<any, Record<string, any>>> {
        try {
            const id = req.params.id; // Extract 'id' from req.params
            console.log(id, "edit car provider controller");

            // Validate if ID is a string and a valid ObjectId
            if (!id || typeof id !== "string" || !mongoose.Types.ObjectId.isValid(id)) {
                return res.status(400).json({ message: "Invalid ID parameter" });
            }

            const carExist = await this.userServices.carDetails(id);

            console.log(carExist, "exist car");

            if (!carExist) {
                return res.status(400).json({ message: "Car not found or car is blockec" });
            }

            return res.status(200).json(carExist);
        } catch (error) {
            console.error("Error during check Car exist:", error);
            return res.status(500).json({ message: "Internal server error" });
        }
    }

    // *****************************filter****************

    async filterCar(req: Request, res: Response): Promise<Response> {
        try {
            console.log(req.body, "req query")
            const { engineType, fuelType, sortPrice, searchQuery } = req.body.params;

            const carExist = await this.userServices.carFilter(engineType, fuelType, sortPrice);

            console.log(carExist, "exist car");

            if (!carExist || carExist.length === 0) {
                return res.status(200).json({ message: "Car not found" });
            }

            return res.status(200).json(carExist);
        } catch (error) {
            console.error("Error during car filtering:", error);
            return res.status(500).json({ message: "Internal server error" });
        }
    }
    // ***********************************search Car************************
    async searchCar(req: Request, res: Response): Promise<Response> {
        try {
            console.log(req.body.searchQuery, "req.body")
            const carExist = await this.userServices.searchCar(req.body.searchQuery)
            console.log(carExist, "carexist when searching")
            if (!carExist) {
                return res.status(404).json({ message: "Car not found" });
            }
            return res.status(200).json(carExist);
        }
        catch (error) {
            console.error("Error during car searching:", error);
            return res.status(500).json({ message: "Internal server error" });
        }
    }
    // ***********************fetch offer**********************8
    async fetchOffer(req: Request, res: Response): Promise<void> {
        try {
            const result = await this.userServices.fetchOffer(); // Fetch offers from service
            console.log(result, "result in fetch offer")
            if (result) {
                res.status(result.status).json(result.data);
            } else {
                res.status(500).json({ message: "Internal server error" });
            }
        } catch (error) {
            console.error("Error during fetch offers:", error);
            res.status(500).json({ message: "Internal server error" });
        }
    }

    //******************************check profile********************************

    async checkProfile(req: Request, res: Response): Promise<void> {
        try {
            const userId = req.params.id;
            const result = await this.userServices.checkProfile(userId);

            if (!result) {
                res.status(404).json({ message: "Profile not found" });
                return;
            }

            res.status(200).json(result);
        } catch (error) {
            console.error("Error during fetch profile:", error);
            res.status(500).json({ message: "Internal server error" });
        }
    }
    // ****************************savee Profile***********************

    async saveProfile(req: Request, res: Response): Promise<void> {
        try {
            // Extract profileData from the request body
            const profileData = req.body.profileData;

            // Save the profile using your user service
            const result = await this.userServices.saveProfile(profileData);

            if (!result) {
                res.status(500).json({ message: "Error saving profile" });
                return
            }

            // Successfully saved, return the response
            res.status(200).json({
                success: true,
                message: 'Profile saved successfully',
                data: result
            });
        } catch (error) {
            console.error("Error saving profile:", error);
            res.status(500).json({ message: "Internal server error" });
        }
    }
    // ******************************8Edit profile*******************
    async editProfile(req: Request, res: Response): Promise<void> {
        try {
            // Extract profileData from the request body
            const profileData = req.body.profileData;
            const userId = req.params.id
            // Save the profile using your user service
            const result = await this.userServices.editProfile(profileData, userId);

            if (!result) {
                res.status(500).json({ message: "Error editing profile" });
                return
            }

            // Successfully saved, return the response
            res.status(200).json({
                success: true,
                message: 'Profile edit successfully',
                data: result
            });
        } catch (error) {
            console.error("Error edit profile:", error);
            res.status(500).json({ message: "Internal server error" });
        }
    }
    // ********************************check Address***********************
    async checkAddress(req: Request, res: Response): Promise<void> {
        try {

            const userId = req.params.id;
            const result = await this.userServices.checkAddress(userId);

            if (!result) {
                res.status(500).json({ message: "Address not found" });
                return
            }

            res.status(200).json({
                success: true,
                data: result
            });

        } catch (error) {
            console.error("Error checking address:", error);
            res.status(500).json({ message: "Internal server error" });
        }
    }
    // ****************************savee Address***********************

    async saveAddress(req: Request, res: Response): Promise<void> {
        try {
            // Extract profileData from the request body
            const addressData = req.body.addressData;

            // Save the profile using your user service
            const result = await this.userServices.saveAddress(addressData);

            if (!result) {
                res.status(500).json({ message: "Error saving Address" });
                return
            }

            // Successfully saved, return the response
            res.status(200).json({
                success: true,
                message: 'Address saved successfully',
                data: result
            });
        } catch (error) {
            console.error("Error saving profile:", error);
            res.status(500).json({ message: "Internal server error" });
        }
    }
    // ******************************8Edit Address*******************
    async editAddress(req: Request, res: Response): Promise<void> {
        try {
            // Extract profileData from the request body
            const addressData = req.body.addressData;
            const addressId = req.params.id
            // Save the profile using your user service
            const result = await this.userServices.editAddress(addressData, addressId);

            if (!result) {
                res.status(500).json({ message: "Error editing address" });
                return
            }

            // Successfully saved, return the response
            res.status(200).json({
                success: true,
                message: 'Address edit successfully',
                data: result
            });
        } catch (error) {
            console.error("Error edit profile:", error);
            res.status(500).json({ message: "Internal server error" });
        }
    }
    // *************************************fetch coupon******************8
    async fetchCoupon(req: Request, res: Response): Promise<void> {
        try {

            const userId = req.params.id
            // Save the profile using your user service
            const result = await this.userServices.fetchCoupon(userId);

            if (!result) {
                res.status(500).json({ message: "Error fetch coupon" });
                return
            }

            // Successfully saved, return the response
            res.status(result.status).json(result.data);
        } catch (error) {
            console.error("Error fetch coupon:", error);
            res.status(500).json({ message: "Internal server error" });
        }
    }

    //*********************** */ Check offer for Booking**********************

    async checkOfferForBooking(req: Request, res: Response): Promise<void> {
        try {

            const carName = req.params.car_name
            const result = await this.userServices.checkOfferForBookiing(carName);

            if (!result) {
                res.status(500).json({ message: "No Offers" });
                return
            }
            res.status(result.status).json(result.data);
        } catch (error) {
            console.error("Error fetch coupon:", error);
            res.status(500).json({ message: "Internal server error" });
        }
    }

    // *************************save BookingData*********************
    async saveBookingData(req: Request, res: Response): Promise<void> {
        try {

            console.log(req.body, "req.body")
            const bookingData = req.body;
            const result = await this.userServices.saveBookingData(bookingData);
            if (!result) {
                res.status(500).json({ message: "Error saving Booking" });
                return
            }
            res.status(200).json({
                success: true,
                message: 'Booking Successfully',
                data: result
            });
        } catch (error) {
            console.error("Error saving profile:", error);
            res.status(500).json({ message: "Internal server error" });
        }
    }

    // *************************payment for stripe*******************


    async paymentForStripe(req: Request, res: Response): Promise<void> {
        const { amount } = req.body;
        console.log(req.body, "amount")
        try {

            const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_PRICE_ID as string);

            const paymentIntent = await stripe.paymentIntents.create({
                amount: amount,
                currency: 'usd',
                payment_method_types: ['card'],
            });
            console.log(paymentIntent, "paymentIntent")
            res.send({
                clientSecret: paymentIntent.client_secret,
            });
        } catch (error) {
            console.error("Error creating payment intent:", error);
            res.status(500).send({ error: 'Internal Server Error' });
        }
    }
    //  ********************stored userid in coupon********************
    async userIdInCoupon(req: Request, res: Response): Promise<void> {
        try {
            const coupon = req.params.coupon
            const userId = req.params.userId
            console.log(coupon, userId, "coupon and userid")
            const result = await this.userServices.userIdInCoupon(coupon, userId);
            if (!result) {
                res.status(500).json({ message: "Error Coupon Updating" });
                return
            }
            res.status(200).json({
                success: true,
                data: result
            });
        } catch (error) {
            console.error("Error saving profile:", error);
            res.status(500).json({ message: "Internal server error" });
        }
    }

    // ******************************get booking history**************************8
    async getBookingHistory(req: Request, res: Response): Promise<void> {
        try {
            const userId = req.params.id
            console.log(userId,"userid")
            const result = await this.userServices.getBookingHistory(userId);
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
            const status=req.params.status
            console.log(bookingId,"bookingId")
            const result = await this.userServices.specificBookingDetails(bookingId);
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

    // *********************cancel booking By user**********************
    async cancelBookingByUser(req:Request,res:Response):Promise<void>{
        try {
            const bookingId = req.params.id
            console.log(bookingId,"bookingId")
            const result = await this.userServices.cancelBookingByUser(bookingId);
            if (!result) {
                res.status(500).json({ message: "Error Cancel Boooking" });
                return
            }
            res.status(200).json(result.data);
        } catch (error) {
            console.error("Error cancel booking:", error);
            res.status(500).json({ message: "Internal server error" });
        }
    }
}