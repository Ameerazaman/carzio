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
            admin?: adminInterface; 
        }
    }
}


const adminAuth = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let token = req.cookies.access_token;
        let refresh_token = req.cookies.refresh_token;
      
        if (!refresh_token) {
            return res.status(401).json({ success: false, message: 'Refresh Token Expired' });
        }

        const refreshTokenValid = verifyRefreshToken(refresh_token);

        const admin = await adminRepository.getAdminById(refreshTokenValid.data);

        if (!token) {
            return res.status(401).json({ success: false, message: "Access Token Expired" });
        }

        const decoded = verifyAccessToken(token);

        if (!decoded?.data) {
            return res.status(401).json({ success: false, message: "Access Token Expired" });
        }

        const existingAdmin = await adminRepository.getAdminById(decoded.data);
        if (!existingAdmin) {
            return res.status(404).json({ message: "Admin not found" });
        }

        if (existingAdmin) {

            req.admin = existingAdmin;
           
            next();
        }

    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

export default adminAuth;