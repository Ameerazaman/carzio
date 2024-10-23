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
            provider?: ProviderInterface; // Add your UserInterface type here
        }
    }
}


const providerAuth = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let token = req.cookies.access_token;
        let refresh_token = req.cookies.refresh_token;
            // Handle missing refresh token
        if (!refresh_token) {
            return res.status(401).json({ success: false, message: 'Refresh Token Expired' });
        }

        // Verify refresh token
        const refreshTokenValid = verifyRefreshToken(refresh_token);
  
        // Fetch user using the token
        const provider = await providerRepository.getProviderById(refreshTokenValid.data);
     

        // Check if the user is blocked
        if (provider?.isBlocked === true) {
            return res.status(401).json({ success: false, message: "Provider is blocked by Admin" });
        }

      
        if (!token) {
            return res.status(401).json({ success: false, message: "Access Token Expired" });
        }

        // Verify access token
        const decoded = verifyAccessToken(token);
     
        if (!decoded?.data) {
            return res.status(401).json({ success: false, message: "Access Token Expired" });
        }

        // Fetch user using access token
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


