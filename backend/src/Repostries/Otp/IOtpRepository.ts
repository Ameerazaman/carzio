import { OtpDocument } from "../../Model/User/OtpModel"

export interface IOtpRepository {

deleteOtp(email: string): Promise<OtpDocument | null>

updateOtp(email: string, otp: string): Promise<OtpDocument | null>

createOtp(otp: string, email: string): Promise<OtpDocument | null>,

findOtp(email: string, otp: string): Promise<OtpDocument | null>,
}