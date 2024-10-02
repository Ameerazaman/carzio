import { ProviderInterface } from '../../Interface/providerInterface';
import { ProviderRepository } from '../../Repostries/Provider/providerRepostries';
import { OtpDocument } from '../../Model/user/otpModel'; // Import OtpDocument for OTP-related return type
import Encrypt from '../../utlis/comparedPassword';
import { CreateJWT } from '../../utlis/generateToken';
import { UserRepository } from '../../Repostries/userRepostries';
import { ProviderAuthResponse } from '../../Interface/authServices/providerAuthServices';
import { StatusCodes } from 'http-status-codes';
const { BAD_REQUEST, OK, INTERNAL_SERVER_ERROR, UNAUTHORIZED } = StatusCodes;
import bcrypt from 'bcrypt'


export class ProviderServices {
    constructor(
        private providerRepostry: ProviderRepository,
        private encrypt: Encrypt,
        private createjwt: CreateJWT
    ) { }

    // Signup logic
    async userSignup(providerData: ProviderInterface): Promise<ProviderInterface | null> {
        try {
            console.log("signup services",providerData)
            return await this.providerRepostry.emailExistCheck(providerData.email);
        } catch (error) {
            console.log(error as Error);
            return null;
        }
    }

    // OTP creation logic
    async createOtp(email: string, otp: number): Promise<OtpDocument | null> {
        try {
            return await this.providerRepostry.createOtp(otp, email); // Ensure correct type
        } catch (error) {
            console.log(error as Error);
            return null;
        }
    }


    async verifyOtp(email: string, otp: string): Promise<OtpDocument | null> {
        try {
            return await this.providerRepostry.findOtp(email, otp)
        }
        catch (error) {
            console.log(error as Error);
            return null;
        }
    }


    async saveProvider(providerData: ProviderInterface): Promise<ProviderAuthResponse | undefined> {
        try {
            providerData.password = await this.encrypt.hashPassword(providerData.password);

            const provider = await this.providerRepostry.saveProvider(providerData);
            console.log(provider, "saveUser in services", provider)
            return {
                status: OK,
                data: {
                    success: true,
                    message: 'Success',
                }
            };

        } catch (error) {
            console.error("Error saving user:", (error as Error).message);
            return {
                status: INTERNAL_SERVER_ERROR,
                data: {
                    success: false,
                    message: 'Internal server error'
                }
            };
        }
    }


    async providerSignIn(providerData: ProviderInterface): Promise<ProviderAuthResponse | undefined> {
        try {
            // Call emailPasswordCheck from the repository to get the user by email

            const provider = await this.providerRepostry.emailExistCheck(providerData.email);

            if (!provider) {
                return {
                    status: UNAUTHORIZED,
                    data: {
                        success: false,
                        message: 'provider not found',
                    }
                };
            }
            // Validate the password
            const isPasswordValid = await bcrypt.compare(providerData.password, provider.password);
            if (!isPasswordValid) {
                return {
                    status: BAD_REQUEST,
                    data: {
                        success: false,
                        message: 'Incorrect Password, Try again',
                    }
                };
            }

            const token = this.createjwt.generateToken(provider.id!);
            console.log(token, "token"); // Assert that `id` exists after saving
            const refreshToken = this.createjwt.generateRefreshToken(provider.id!);
            console.log(refreshToken, "refreshtoken");

            return {
                status: OK,
                data: {
                    success: true,
                    message: 'Success',
                    providerId: provider.id,
                    token: token,
                    data: provider,
                    refreshToken,
                }
            };

        } catch (error) {
            console.error("Error login user:", (error as Error).message);
            return {
                status: INTERNAL_SERVER_ERROR,
                data: {
                    success: false,
                    message: 'Internal server error'
                }
            };
        }
    }
}
