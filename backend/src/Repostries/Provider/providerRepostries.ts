import { ProviderInterface } from "../../Interface/providerInterface";
import providerModel from "../../Model/provider/providerModel";
import { Otp, OtpDocument } from "../../Model/user/otpModel"; // Assuming OtpDocument is defined for the Otp schema

export class ProviderRepository {
    // This function checks if an email exists in the provider database
    async emailExistCheck(email: string): Promise<ProviderInterface | null> {
        try {
            const existingUser = await providerModel.findOne({ email });
            console.log(existingUser,"repostries")
            return existingUser as ProviderInterface;
        } catch (error) {
            console.log("Error checking email existence:", error);
            return null;
        }
    }

    // This function creates or updates an OTP for a given email
    async createOtp(otp: number, email: string): Promise<OtpDocument | null> {
        try {
            let existUserOtp = await Otp.findOne({ email });

            if (existUserOtp) {
                // Use findOneAndUpdate to get the updated document
                const updatedOtp = await Otp.findOneAndUpdate(
                    { email },
                    { otp },
                    { new: true } // Return the updated document
                );
                return updatedOtp;
            } else {
                const newOtp = await Otp.create({ email, otp });
                return newOtp;
            }
        } catch (error) {
            console.log("Error creating or updating OTP:", error);
            return null;
        }
    }


    async findOtp(email: string, otp: string): Promise<OtpDocument | null> {
        try {
            const existProviderOtp = await Otp.findOne({ email });
            console.log(existProviderOtp, otp, "check otp")
            // Check if existProviderOtp is not null and compare OTPs
            if (existProviderOtp && existProviderOtp.otp.toString() === otp) {
                await Otp.deleteOne({ email })
                return existProviderOtp;
            }

            return null; // If no match or null, return null
        } catch (error) {
            console.log("Error checking email existence:", error);
            return null;
        }
    }


    async saveProvider(providerData: ProviderInterface): Promise<ProviderInterface | null> {
        try {
            const newUser = new providerModel(providerData);

            await newUser.save();
            return newUser as ProviderInterface;
        } catch (error) {
            console.log("Error saving user:", error);
            return null;
        }
    }

    
}
