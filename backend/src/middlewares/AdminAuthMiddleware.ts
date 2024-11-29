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
        console.log(req.cookies,"cookies")
        let token = req.cookies.access_token;
        let refresh_token = req.cookies.refresh_token;
        console.log(token, "admin token")
        if (!refresh_token) {
            console.log("refresh token is not get")
            return res.status(401).json({ success: false, message: 'Refresh Token Expired' });
        }

        const refreshTokenValid = verifyRefreshToken(refresh_token);
        console.log(refreshTokenValid, "refreshtoken validation")
        const admin = await adminRepository.getAdminById(refreshTokenValid.data);
        console.log(admin, "admin login")
        if (!token) {
            console.log("acees token not retrieved")
            return res.status(401).json({ success: false, message: "Access Token Expired" });
        }

        const decoded = verifyAccessToken(token);
        console.log(decoded, "decoded")
        if (!decoded?.data) {
            console.log("decoded is not get")
            return res.status(401).json({ success: false, message: "Access Token Expired" });
        }

        const existingAdmin = await adminRepository.getAdminById(decoded.data);
        if (!existingAdmin) {
            console.log(existingAdmin, "existing admin is not get")
            return res.status(404).json({ message: "Admin not found" });
        }

        if (existingAdmin) {
            console.log(existingAdmin, "existingAdmin")
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