// import nodemailer from 'nodemailer'
// import dotenv from 'dotenv';

// dotenv.config();

// const transporter = nodemailer.createTransport({
//     service: 'gmail',
//     auth: {
//         user: process.env.TRANSPORTER_EMAIL,
//         pass: process.env.TRANSPORTER_PASS,
//     }
// })

// export const generateAndSendOTP = async (toEmail: string): Promise<string> => {
//     const otp: string | null = generateRandomOTP()

//     const mailOptions = {
//         from: process.env.TRANSPORTER_EMAIL,
//         to: toEmail,
//         subject: 'OTP Verification',
//         text: `Welcome to GoCar. Your OTP for registration is: ${otp}`
//     }
//     await transporter.sendMail(mailOptions)
//     console.log("send otp")
//     return otp
// }

// function generateRandomOTP(): string {
//     const otpLength = 6
//     const min = Math.pow(10, otpLength - 1)
//     const max = Math.pow(10, otpLength) - 1
//     const randomOTP = Math.floor(min + Math.random() * (max - min + 1))
//     return randomOTP.toString()
// }

import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // true for port 465, false for other ports
    auth: {
        user: process.env.TRANSPORTER_EMAIL,
        pass: process.env.TRANSPORTER_PASS,
    },
});


export async function generateAndSendOTP(toEmail: string): Promise<string> {
    const otp = generateRandomOTP(); // Call your existing function to generate OTP

    // Save the OTP in the database
    // await Otp.create({ email: toEmail, otp });

    // Prepare the email options
    const mailOptions = {
        from: process.env.TRANSPORTER_EMAIL,
        to: toEmail,
        subject: 'OTP Verification',
        text: `Welcome to GoCar. Your OTP for registration is: ${otp}`
    };

    // Send the email
    const email = await transporter.sendMail(mailOptions);
    console.log("OTP sent", email);

    return otp;
}


function generateRandomOTP(): string {
    const otpLength = 6;
    const min = Math.pow(10, otpLength - 1);
    const max = Math.pow(10, otpLength) - 1;
    const randomOTP = Math.floor(min + Math.random() * (max - min + 1));
    return randomOTP.toString();
}
