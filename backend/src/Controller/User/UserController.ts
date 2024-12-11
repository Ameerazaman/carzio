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
import { ReviewDataInterface } from '../../Interface/ReviewInterface';
import dotenv from "dotenv";
import { outputJson } from 'fs-extra';
import { IUserServices } from '../../Services/User/IUserServices';

dotenv.config();
const { BAD_REQUEST, OK, INTERNAL_SERVER_ERROR, UNAUTHORIZED, } = STATUS_CODES;

export class UserController {
    constructor(private userServices: IUserServices) {}
  

    milliseconds = (h: number, m: number, s: number) => ((h * 60 * 60 + m * 60 + s) * 1000);


    // ********************************refresh access token for user******************


    async refreshToken(req: Request, res: Response, next: NextFunction): Promise<Response | void> {

        const refreshToken = req.cookies.refresh_token;

        if (!refreshToken)
            res
                .status(401)
                .json({ success: false });

        try {
            const decoded = verifyRefreshToken(refreshToken);

            if (!decoded || !decoded.data) {

                res.status(401).json({ success: false, message: "Refresh Token Expired" });
            }

            const result = await this.userServices.userGetById(decoded.data);

            const accessTokenMaxAge = process.env.ACCESS_TOKEN_MAX_AGE
                ? parseInt(process.env.ACCESS_TOKEN_MAX_AGE, 10)
                : 5 * 60 * 1000;

            const newAccessToken = result?.data?.token

            res.cookie('access_token', newAccessToken, {
                maxAge: accessTokenMaxAge,
                httpOnly: true,
                secure: true,
                sameSite: 'none',
            })

            res.status(200).json({ success: true });
        }
        catch (error) {
            next(error);
        }
    }

    // ***********************user signup************************
    async userSignup(req: Request, res: Response): Promise<void> {
        try {
            console.log(req.body, "req.body")
            req.app.locals.userData = req.body;

            const existingUser = await this.userServices.emailExistCheck(req.app.locals.userData.email);
            console.log(existingUser, "existingUser")
            if (existingUser) {
                res.status(BAD_REQUEST).json({ success: false, message: 'The email is already in use!' });
            } else {
                req.app.locals.newUser = true;
                req.app.locals.userEmail = req.body.email;
                const otp = await generateAndSendOTP(req.body.email);
                console.log(otp, "otp")
                const otpData = await this.userServices.createOtp(req.body.email, otp)

                res.status(OK).json({ userId: null, success: true, message: 'OTP sent for verification...' });
            }
        } catch (error) {
            console.log(error as Error);
            res.status(INTERNAL_SERVER_ERROR).json({ success: false, message: 'Internal server error' });
        }
    }

    // ***********************************resend otp********************

    async resendOtp(req: Request, res: Response): Promise<Response> {
        try {
            const email = req.app.locals.userEmail;

            const otp = await generateAndSendOTP(email);
            if (otp) {
                const result = await this.userServices.updateOtp(email, otp)

                req.app.locals.userOtp = otp;
                req.app.locals.resendOtp = otp;

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

    // **********************************verify otp***********************

    async verifyOtp(req: Request, res: Response): Promise<Response<any, Record<string, any>>> {
        try {

            const { otp } = req.body;
            let email = req.app.locals.userEmail;
            var OTPRecord = await this.userServices.verifyOtp(email, otp)

            if (!OTPRecord) {

                return res.status(BAD_REQUEST).json({ success: false, message: 'No OTP record found!' });
            }

            if (otp === OTPRecord.otp.toString()) {

                const userData = req.app.locals.userData

                const savedUser = await this.userServices.saveUser(userData);

                if (savedUser) {

                    const deleteOtp = await this.userServices.deleteOtp(email);

                    return res.status(OK).json({
                        success: true,
                        message: 'OTP verified Successfully',
                        user: savedUser,
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
    // ****************************forgot Password*******************************

    async forgotPassword(req: Request, res: Response): Promise<void> {
        try {
            req.app.locals.userEmail = req.body.email
            const existingUser = await this.userServices.emailExistCheck(req.body.email);
            if (!existingUser) {
                res.status(BAD_REQUEST).json({ success: false, message: 'The email is already in use!' });
            } else {

                const otp = await generateAndSendOTP(req.body.email);
                const otpData = await this.userServices.createOtp(req.body.email, otp)
                res.status(OK).json({ userId: null, success: true, message: 'OTP sent for verification...' });
            }
        } catch (error) {
            console.log(error as Error);
            res.status(INTERNAL_SERVER_ERROR).json({ success: false, message: 'Internal server error' });
        }
    }

    // ********************************verify otp for forgot password*********************

    async verifyOtpForgotPassword(req: Request, res: Response): Promise<Response<any, Record<string, any>>> {
        try {
            const { otp } = req.body;
            let email = req.app.locals.userEmail;
            var OTPRecord = await this.userServices.verifyOtp(email, otp)
            if (!OTPRecord) {
                return res.status(BAD_REQUEST).json({ success: false, message: 'No OTP record found!' });
            }
            if (otp === OTPRecord.otp.toString()) {
                return res.status(OK).json({
                    success: true,
                    message: 'OTP verified Successfully',
                })
            }
            else {
                return res.status(BAD_REQUEST).json({ success: false, message: 'Incorrect OTP!' });
            }
        } catch (error) {

            return res.status(INTERNAL_SERVER_ERROR).json({ success: false, message: 'Internal Server Error.' });
        }
    }

    // **********************************change password*****************************

    async changePassword(req: Request, res: Response): Promise<Response<any>> {
        try {
            const password = req.body.password;
            const email = req.app.locals.userEmail;
            const result = await this.userServices.changePassword(email, password);
            if (!result) {
                return res.status(BAD_REQUEST).json({ success: false, message: 'Password change failed!' });
            }
            return res.status(OK).json({ success: true, message: 'Password changed successfully!' });
        } catch (error) {
            return res.status(INTERNAL_SERVER_ERROR).json({ success: false, message: 'Internal server error.' });
        }
    }


    // *****************************user Login*******************************


    async userLogin(req: Request, res: Response): Promise<Response<any, Record<string, any>>> {
        try {
            const { email, password }: { email: string; password: string } = req.body;

            const result = await this.userServices.userSignIn({ email, password });
            console.log(result, "result")
            if (result?.data.success) {
                const access_token = result.data.token;
                const refresh_token = result.data.refreshToken;

                const accessTokenMaxAge = process.env.ACCESS_TOKEN_MAX_AGE
                    ? parseInt(process.env.ACCESS_TOKEN_MAX_AGE, 10) : 5 * 60 * 1000;

                const refreshTokenMaxAge = process.env.REFRESH_TOKEN_MAX_AGE
                    ? parseInt(process.env.REFRESH_TOKEN_MAX_AGE, 10) : 48 * 60 * 60 * 1000;



                return res.status(200)
                    .cookie('access_token', access_token, {
                        maxAge: accessTokenMaxAge,
                        httpOnly: true,
                        secure: true,
                        sameSite: 'none',
                    })
                    .cookie('refresh_token', refresh_token, {
                        maxAge: refreshTokenMaxAge,
                        httpOnly: true,
                        secure: true,
                        sameSite: 'none',
                    })
                    .json({ success: true, user: result.data, message: result.data.message });

            } else {

                return res.status(BAD_REQUEST).json({ success: false, message: result?.data.message });
            }
        } catch (error) {

            return res.status(INTERNAL_SERVER_ERROR).json({ message: "Internal server error" });
        }
    }

    // ************************************user Logout **************************

    async userLogout(req: Request, res: Response): Promise<void> {
        try {
            res.clearCookie('access_token', {
                httpOnly: true,
                secure: true, // Ensure this matches `secure` from res.cookie in login
                sameSite: 'none', // Ensure this matches `sameSite` from res.cookie in login
            });

            res.clearCookie('refresh_token', {
                httpOnly: true,
                secure: true, // Ensure this matches `secure` from res.cookie in login
                sameSite: 'none', // Ensure this matches `sameSite` from res.cookie in login
            });

            res.status(200).json({ success: true, message: "Logged out successfully" });
        } catch (error) {
            res.status(500).json({ message: "Internal server error" });
        }
    }


    // ****************************fetch  car for card***************************
    async fetchCars(req: Request, res: Response): Promise<void> {
        try {

            const page = req.query.page ? Number(req.query.page) : undefined;
            const limit = req.query.limit ? Number(req.query.limit) : undefined;

            if (page !== undefined && limit !== undefined) {
                const result = await this.userServices.fetchCars(page, limit);
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

    // *********************************car details page********************
    async carDetails(req: Request, res: Response): Promise<Response<any, Record<string, any>>> {
        try {
            const id = req.params.id;

            if (!id || typeof id !== "string" || !mongoose.Types.ObjectId.isValid(id)) {
                return res.status(400).json({ message: "Invalid ID parameter" });
            }

            const carExist = await this.userServices.carDetails(id);


            if (!carExist) {
                return res.status(400).json({ message: "Car not found or car is blocked" });
            }

            return res.status(200).json(carExist.data);
        } catch (error) {

            return res.status(500).json({ message: "Internal server error" });
        }
    }

    // *****************************filter****************

    async filterCar(req: Request, res: Response): Promise<Response> {
        try {

            const { engineType, fuelType, sortPrice, searchQuery } = req.body.params;

            const carExist = await this.userServices.carFilter(engineType, fuelType, sortPrice);

            if (!carExist || carExist.length === 0) {
                return res.status(200).json({ message: "Car not found" });
            }

            return res.status(200).json(carExist);
        } catch (error) {

            return res.status(500).json({ message: "Internal server error" });
        }
    }
    // ***********************************search Car************************
    async searchCar(req: Request, res: Response): Promise<Response> {
        try {

            const carExist = await this.userServices.searchCar(req.body.searchQuery)

            if (!carExist) {
                return res.status(404).json({ message: "Car not found" });
            }
            return res.status(200).json(carExist);
        }
        catch (error) {

            return res.status(500).json({ message: "Internal server error" });
        }
    }
    // ***********************fetch offer**********************8
    async fetchOffer(req: Request, res: Response): Promise<void> {
        try {
            const result = await this.userServices.fetchOffer(); // Fetch offers from service

            if (result) {
                res.status(result.status).json(result.data);
            } else {
                res.status(500).json({ message: "Internal server error" });
            }
        } catch (error) {

            res.status(500).json({ message: "Internal server error" });
        }
    }

    //******************************check profile********************************

    async checkProfile(req: Request, res: Response): Promise<void> {
        try {
            const userId = req.params.id;
            const result = await this.userServices.checkProfile(userId);
            if (!result) {
                res.status(400);
                return;
            }
            res.status(200).json(result);
        } catch (error) {

            res.status(500).json({ message: "Internal server error" });
        }
    }
    // ****************************savee Profile***********************

    async saveProfile(req: Request, res: Response): Promise<void> {
        try {

            const profileData = req.body.profileData;

            const result = await this.userServices.saveProfile(profileData);

            if (!result) {
                res.status(500).json({ message: "Error saving profile" });
                return
            }

            res.status(200).json({
                success: true,
                message: 'Profile saved successfully',
                data: result
            });
        } catch (error) {
            res.status(500).json({ message: "Internal server error" });
        }
    }

    // ******************************8Edit profile*******************
    async editProfile(req: Request, res: Response): Promise<void> {
        try {
            const profileData = req.body.profileData;
            const profileId = req.params.id
            const result = await this.userServices.editProfile(profileData, profileId);

            if (!result) {
                res.status(500).json({ message: "Error editing profile" });
                return
            }
            res.status(200).json({
                success: true,
                message: 'Profile edit successfully',
                data: result
            });
        } catch (error) {

            res.status(500).json({ message: "Internal server error" });
        }
    }
    // ********************************check Address***********************
    async checkAddress(req: Request, res: Response): Promise<void> {
        try {

            const userId = req.params.id;
            const result = await this.userServices.checkAddress(userId);

            if (!result) {
                res.status(500).json({ message: 'No address found. Please create a new address.' });
                return
            }

            res.status(200).json({
                success: true,
                data: result
            });

        } catch (error) {

            res.status(500).json({ message: "Internal server error" });
        }
    }
    // ****************************savee Address***********************

    async saveAddress(req: Request, res: Response): Promise<void> {
        try {

            const addressData = req.body.addressData
            const result = await this.userServices.saveAddress(addressData);
            if (!result) {
                res.status(500).json({ message: "Error saving Address" });
                return
            }

            res.status(200).json({
                success: true,
                message: 'Address saved successfully',
                data: result
            });
        } catch (error) {

            res.status(500).json({ message: "Internal server error" });
        }
    }
    // ******************************8Edit Address*******************
    async editAddress(req: Request, res: Response): Promise<void> {
        try {
            const addressData = req.body.addressData;
            const addressId = req.params.id
            const result = await this.userServices.editAddress(addressData, addressId);
            if (!result) {
                res.status(500).json({ message: "Error editing address" });
                return
            }
            res.status(200).json({
                success: true,
                message: 'Address edit successfully',
                data: result
            });
        } catch (error) {
            res.status(500).json({ message: "Internal server error" });
        }
    }
    // *************************************fetch coupon******************8
    async fetchCoupon(req: Request, res: Response): Promise<void> {
        try {

            const userId = req.params.id
            const result = await this.userServices.fetchCoupon(userId);

            if (!result) {
                res.status(500).json({ message: "Error fetch coupon" });
                return
            }
            res.status(result.status).json(result.data);
        } catch (error) {
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
            res.status(500).json({ message: "Internal server error" });
        }
    }

    // *************************save BookingData*********************
    async saveBookingData(req: Request, res: Response): Promise<void> {
        try {
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
            res.status(500).json({ message: "Internal server error" });
        }
    }

    // *************************payment for stripe*******************


    async paymentForStripe(req: Request, res: Response): Promise<void> {
        const { amount } = req.body;
        try {
            const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_PRICE_ID as string);
            const paymentIntent = await stripe.paymentIntents.create({
                amount: amount,
                currency: 'usd',
                payment_method_types: ['card'],
            });
            res.send({
                clientSecret: paymentIntent.client_secret,
            });
        } catch (error) {
            res.status(500).send({ error: 'Internal Server Error' });
        }
    }
    //  ********************stored userid in coupon********************
    async userIdInCoupon(req: Request, res: Response): Promise<void> {
        try {
            const coupon = req.params.coupon
            const userId = req.params.userId
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
            res.status(500).json({ message: "Internal server error" });
        }
    }

    // ******************************get booking history**************************8
    async getBookingHistory(req: Request, res: Response): Promise<void> {
        try {
            const userId = req.query.userId as string | undefined;
            const page = req.query.page ? Number(req.query.page) : 1;
            const limit = req.query.limit ? Number(req.query.limit) : 10;

            if (!userId) {
                res.status(400).json({ message: "User ID is required." });
                return;
            }

            const result = await this.userServices.getBookingHistory(userId, page, limit);
            if (!result) {
                res.status(500).json({ message: "Error fetching booking history" });
                return;
            }
            res.status(200).json(result.data);
        } catch (error) {
            res.status(500).json({ message: "Internal server error" });
        }
    }

    // ******************************details of specic details**************************8
    async specificBookingDetails(req: Request, res: Response): Promise<void> {
        try {
            const bookingId = req.params.id;
            const result = await this.userServices.specificBookingDetails(bookingId);

            if (!result) {
                res.status(404).json({ message: "Booking not found" });
                return;
            }

            res.status(200).json(result.data);
        } catch (error) {

            res.status(500).json({ message: "Internal server error" });
        }
    }


    // *********************cancel booking By user add amount to wallet**********************
    async cancelBookingByUser(req: Request, res: Response): Promise<void> {
        try {

            const bookingId = req.query.bookingId as string | undefined;
            const userId = req.query.userId as string | undefined;
            const amount = req.query.amount ? Number(req.query.amount) : undefined;

            if (!bookingId || !userId || amount === undefined) {
                res.status(400).json({ message: "Booking ID, User ID, and Amount are required" });
                return
            }

            const result = await this.userServices.cancelBookingByUser(bookingId, userId, amount);

            if (!result) {
                res.status(500).json({ message: "Error Cancel Booking" });
            }
            res.status(200).json(result);
        } catch (error) {
            res.status(500).json({ message: "Internal server error" });
        }
    }
    // *********************cancel booking By user add amount to wallet**********************
    async creditToWallet(req: Request, res: Response): Promise<void> {
        try {
            const { userId, amount } = req.body;

            if (!userId || amount === undefined) {
                res.status(400).json({ message: "User ID and Amount are required" });
                return;
            }
            const result = await this.userServices.creditToWallet(userId, amount);
            if (!result) {
                res.status(500).json({ message: "Error Credit to Wallet" });
                return;
            }
            res.status(200).json(result);
        } catch (error) {
            res.status(500).json({ message: "Internal server error" });
        }
    }
    // **********************************check Booked Or Not**********************************

    async checkBookedOrNot(req: Request, res: Response): Promise<void> {
        try {
            const issueDate = req.query.issueDate as string | undefined;
            const returnDate = req.query.returnDate as string | undefined;
            const carId = req.query.carId as string | undefined || '';

            if (!issueDate || !returnDate) {
                res.status(400).json({ message: "Both issueDate and returnDate are required" });
                return;
            }
            const result = await this.userServices.checkBookedOrNot(issueDate, returnDate, carId);
            if (!result) {
                res.status(404).json({ message: "No booking found for the given dates" });
                return;
            }
            res.status(200).json(result);
        } catch (error) {
            res.status(500).json({ message: "Internal server error" });
        }
    }

    // **********************************check and updtae wallet ***********************
    async checkAndUpdateWallet(req: Request, res: Response): Promise<void> {
        try {
            const userId = req.params.userId as string;
            const amount = Number(req.params.amount);
            if (!userId || isNaN(amount)) {
                res.status(400).json({ message: "Both userId and a valid amount are required" });
                return;
            }

            const result = await this.userServices.checkWalletAndUpdate(userId, amount);
            if (!result) {
                res.status(400).json({ message: "Insufficient balance or user not found" });
                return;
            }

            res.status(200).json(result);
        } catch (error) {

            res.status(500).json({ message: "Internal server error" });
        }
    }

    // ************************ get wallet ***********************
    async getWallet(req: Request, res: Response): Promise<void> {
        try {

            const userId = req.query.userId as string | undefined;
            const page = req.query.page ? Number(req.query.page) : 1;
            const limit = req.query.limit ? Number(req.query.limit) : 2;

            if (!userId) {
                res.status(400).json({ message: "User ID is required." });
                return;
            }

            const result = await this.userServices.getWalletPage(userId, page, limit);
            if (!result) {
                res.status(500).json({ message: "Error fetching booking history" });
                return;
            }
            res.status(200).json(result.data);
        } catch (error) {

            res.status(500).json({ message: "Internal server error" });
        }
    }

    // *******************************create Review and ratings*************************
    async createReviewAndRatings(req: Request, res: Response): Promise<void> {
        try {

            const reviewData = req.body as ReviewDataInterface | undefined;

            if (!reviewData) {
                res.status(400).json({ success: false, message: "Review data is required." });
                return;
            }

            const result = await this.userServices.createReviewData(reviewData);

            if (result?.data?.success) {
                res.status(201).json({
                    success: true,
                    message: "Review and rating created successfully.",
                    data: result.data.data,
                });
            } else {
                res.status(400).json({
                    success: false,
                    message: "Failed to create review and rating. Please try again.",
                });
            }
        } catch (error) {
            res.status(500).json({
                success: false,
                message: "An unexpected error occurred while creating the review and rating.",
            });
        }
    }

    // ***************************check BookId exist in review*****************
    async checkBookIdinReview(req: Request, res: Response): Promise<void> {
        try {

            const bookId = req.query.bookId as string | undefined;
            if (!bookId) {
                res.status(400).json({ success: false, message: "BookId is required." });
                return;
            }

            const result = await this.userServices.checkBookidInReview(bookId);

            if (result?.data?.success) {
                res.status(201).json({
                    success: true,
                    data: result.data.data,
                });
            } else {
                res.status(200).json({
                    success: false,

                });
            }
        } catch (error) {
            res.status(500).json({
                success: false,
                message: "An unexpected error occurred while bookId in review",
            });
        }

    }
    // *********************************fetch chat history***********************8
    async fetchChatHistory(req: Request, res: Response): Promise<void> {
        try {

            const userId = req.params.userId as string | undefined | '';
            const providerId = req.params.providerId as string | undefined | '';
            if (!userId || !providerId) {
                res.status(400).json({ success: false, message: "userId and providerId are required" });
                return;
            }
            const result = await this.userServices.fetchChatHistory(userId, providerId);
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

            res.status(500).json({
                success: false,
                message: "An unexpected error occurred while fetching chat history",
            });
        }
    }
    // ******************************check car availabilty********************
    async searchCarAvailability(req: Request, res: Response): Promise<void> {
        try {
            const issueDate = req.query.issueDate ? String(req.query.issueDate) : undefined;
            const returnDate = req.query.returnDate ? String(req.query.returnDate) : undefined;

            if (issueDate && returnDate) {
                const result = await this.userServices.searchCarAvailability(issueDate, returnDate);

                if (result) {

                    res.status(200).json(result.data);
                } else {
                    res.status(500).json({ message: "Internal server error" });
                }
            } else {
                res.status(400).json({ message: "Invalid issueDate or returnDate" });
            }
        } catch (error) {

            res.status(500).json({ message: "Internal server error" });
        }
    }

}