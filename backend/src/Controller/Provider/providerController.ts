import { Request, Response } from 'express';
import { ProviderServices } from '../../Services/Provider/providerServices';
import { generateAndSendOTP } from '../../utlis/generateAndSendOtp';
import { StatusCodes } from 'http-status-codes';
const { BAD_REQUEST, OK, INTERNAL_SERVER_ERROR, UNAUTHORIZED } = StatusCodes;



export class ProviderController {


    constructor(private providerServices: ProviderServices) { }
    milliseconds = (h: number, m: number, s: number) => ((h * 60 * 60 + m * 60 + s) * 1000);


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
}