import { Request, Response } from 'express';
import { UserServices } from '../Services/userServices';

import { generateAndSendOTP } from '../utlis/generateAndSendOtp';
import { STATUS_CODES } from '../constants/httpStatusCode'
import { Otp } from '../Model/user/otpModel';
const { BAD_REQUEST, OK, INTERNAL_SERVER_ERROR, UNAUTHORIZED, } = STATUS_CODES;

export class UserController {


    constructor(private userServices: UserServices) { }
    milliseconds = (h: number, m: number, s: number) => ((h * 60 * 60 + m * 60 + s) * 1000);


    async userSignup(req: Request, res: Response): Promise<void> {
        try {
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

            console.log("controllerresult");
            const result = await this.userServices.userSignIn({ email, password });

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

}
// }

// async userLogin(req: Request, res: Response): Promise<void> {
//     try {
//         console.log("hai");

//         const { email, password }: { email: string; password: string } = req.body;
//         const loginStatus = await this.userServices.userSignIn({ email, password });

//         console.log(loginStatus);

//         // Check if loginStatus is valid
//         if (loginStatus && loginStatus.data && typeof loginStatus.data == 'object') {
//             console.log(loginStatus.data.message, "failed");

//             if (!loginStatus.data.success) {
//                 // Return 400 for better clarity in error cases
//                 console.log("hai failed");
//                 res.status(BAD_REQUEST).json({ success: false, message: loginStatus.data.message });
//                 return;  // Exit after sending the response
//             }

//             // Login success case
//             const access_token = loginStatus.data.token;
//             const refresh_token = loginStatus.data.refreshToken;
//             const accessTokenMaxAge = 5 * 60 * 1000; // 5 minutes
//             const refreshTokenMaxAge = 48 * 60 * 60 * 1000; // 48 hours

//             res.status(OK) // Send 200 OK status
//                 .cookie('access_token', access_token, {
//                     maxAge: accessTokenMaxAge,
//                     httpOnly: true,
//                     secure: process.env.NODE_ENV === 'production'
//                 })
//                 .cookie('refresh_token', refresh_token, {
//                     maxAge: refreshTokenMaxAge,
//                     httpOnly: true,
//                     secure: process.env.NODE_ENV === 'production'
//                 })
//                 .json({
//                     success: true,
//                     message: 'Login successful',
//                     userId: loginStatus.data.userId
//                 });
//             return;  // Exit after sending the success response
//         } else {
//             res.status(BAD_REQUEST).json({ success: false, message: 'Authentication error' });
//             return;  // Exit after sending the authentication error
//         }
//     } catch (error) {
//         console.error('Error during login:', error);
//         res.status(INTERNAL_SERVER_ERROR).json({ success: false, message: 'Internal server error' });
//         return;  // Exit after sending the internal server error
//     }
// }



