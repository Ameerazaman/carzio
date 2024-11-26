import { Request, Response, NextFunction } from 'express'
import dotenv from 'dotenv';
import { CreateJWT } from '../Utlis/GenerateToken';
import { verifyRefreshToken, verifyAccessToken } from '../Utlis/VerifyTokens';
import { STATUS_CODES } from '../Constants/HttpStatusCode';
import { ProviderInterface } from '../Interface/ProviderInterface';
import { ProviderRepository } from '../Repostries/Provider/ProviderRepostries';
import { access } from 'fs';

const { UNAUTHORIZED } = STATUS_CODES

const jwt = new CreateJWT();
const providerRepository = new ProviderRepository();
dotenv.config()

declare global {
    namespace Express {
        interface Request {
            provider?: ProviderInterface; 
        }
    }
}


const providerAuth = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let token = req.cookies.access_token;
        let refresh_token = req.cookies.refresh_token;
        if (!refresh_token) {
            return res.status(401).json({ success: false, message: 'Refresh Token Expired' });
        }

        const refreshTokenValid = verifyRefreshToken(refresh_token);

        const provider = await providerRepository.getProviderById(refreshTokenValid.data);

        if (provider?.isBlocked === true) {
            return res.status(401).json({ success: false, message: "Provider is blocked by Admin" });
        }

      
        if (!token) {
            return res.status(401).json({ success: false, message: "Access Token Expired" });
        }

        const decoded = verifyAccessToken(token);
     
        if (!decoded?.data) {
            return res.status(401).json({ success: false, message: "Access Token Expired" });
        }

        const existingProvider = await providerRepository.getProviderById(decoded.data);
        if (!existingProvider) {
            return res.status(404).json({ message: "provider not found" });
        }
        if (existingProvider?.isBlocked) {
            return res.status(401).json({ success: false, message: "Provider is blocked by admin!" })
        } else {
            req.provider = existingProvider;
            next();
        }
        
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

export default providerAuth;


