import { Request, Response, NextFunction } from 'express'
import dotenv from 'dotenv';
import { CreateJWT } from '../Utlis/GenerateToken';
import { verifyRefreshToken, verifyAccessToken } from '../Utlis/VerifyTokens';
import { STATUS_CODES } from '../Constants/HttpStatusCode';
import { adminInterface } from '../Interface/AdminInterface';
import { AdminRepository } from '../Repostries/Admin/AdminRepostries';
import { access } from 'fs';

const { UNAUTHORIZED } = STATUS_CODES

const jwt = new CreateJWT();
const adminRepository = new AdminRepository();
dotenv.config()

declare global {
    namespace Express {
        interface Request {
            admin?: adminInterface; // Add your UserInterface type here
        }
    }
}


const adminAuth = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let token = req.cookies.access_token;
        let refresh_token = req.cookies.refresh_token;
        // Handle missing refresh token
        if (!refresh_token) {
            return res.status(401).json({ success: false, message: 'Refresh Token Expired' });
        }

        const refreshTokenValid = verifyRefreshToken(refresh_token);

        // Fetch user using the token
        const admin = await adminRepository.getAdminById(refreshTokenValid.data);

        console.log(admin, "middleware when call admin")

        if (!token) {
            return res.status(401).json({ success: false, message: "Access Token Expired" });
        }

        // Verify access token
        const decoded = verifyAccessToken(token);

        if (!decoded?.data) {
            return res.status(401).json({ success: false, message: "Access Token Expired" });
        }

        // Fetch user using access token
        const existingAdmin = await adminRepository.getAdminById(decoded.data);
        if (!existingAdmin) {
            return res.status(404).json({ message: "Admin not found" });
        }
        console.log(existingAdmin, "existing user")
        if (existingAdmin) {

            req.admin = existingAdmin;
            console.log(req.admin, "req.admin")
            next();
        }


    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

export default adminAuth;