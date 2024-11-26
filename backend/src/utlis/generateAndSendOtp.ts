
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, 
    auth: {
        user: process.env.TRANSPORTER_EMAIL,
        pass: process.env.TRANSPORTER_PASS,
    },
});


export async function generateAndSendOTP(toEmail: string): Promise<string> {
    const otp = generateRandomOTP(); 
    const mailOptions = {
        from: process.env.TRANSPORTER_EMAIL,
        to: toEmail,
        subject: 'OTP Verification',
        text: `Welcome to GoCar. Your OTP for registration is: ${otp}`
    };

    const email = await transporter.sendMail(mailOptions);
    return otp;
}


function generateRandomOTP(): string {
    const otpLength = 6;
    const min = Math.pow(10, otpLength - 1);
    const max = Math.pow(10, otpLength) - 1;
    const randomOTP = Math.floor(min + Math.random() * (max - min + 1));
    return randomOTP.toString();
}
