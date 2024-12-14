import { Otp, OtpDocument } from "../../Model/User/OtpModel";
import { BaseRepository } from "../BaseRepostry";
import { IOtpRepository } from "./IOtpRepository";

export class OtpRepository extends BaseRepository<typeof Otp> implements IOtpRepository {
    constructor() {
        super(Otp);
    }

    //*******This function creates or updates an OTP for a given email*************
    async createOtp(otp: string, email: string): Promise<OtpDocument | null> {
        try {
            let existUserOtp = await this.model.findOne({ email });

            if (existUserOtp) {

                const updatedOtp = await this.model.findOneAndUpdate(
                    { email },
                    { otp },
                    { new: true }
                );
                return updatedOtp;
            } else {
                const newOtp = await this.model.create({ email, otp });
                return newOtp;
            }
        } catch (error) {
            return null;
        }
    }

    // ***********************find Otp*****************************88
    async findOtp(email: string, otp: string): Promise<OtpDocument | null> {
        try {
            const existProviderOtp = await this.model.findOne({ email });
            if (existProviderOtp && existProviderOtp.otp.toString() === otp) {
                await Otp.deleteOne({ email })
                return existProviderOtp;
            }

            return null;
        } catch (error) {
            return null;
        }
    }
    // ***************************Delete Otp***********************************

    async deleteOtp(email: string): Promise<OtpDocument | null> {
        try {
            const result = await this.model.findOneAndDelete({ email });
            return result;
        } catch (error) {
            console.error("Error deleting OTP:", error);
            return null;
        }
    }
    // **************************Update otp*********************************

    async updateOtp(email: string, otp: string): Promise<OtpDocument | null> {
        try {
            const result = await this.model.findOneAndUpdate(
                { email: email },
                { $set: { otp: otp } },
                { new: true }
            );
            return result;
        } catch (error) {
            console.error("Error updating OTP:", error);
            return null;
        }
    }
}