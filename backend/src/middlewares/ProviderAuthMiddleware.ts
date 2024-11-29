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
        console.log(token, "token", refresh_token, "refersh token")
        if (!refresh_token) {
            console.log("refresh_token is not get")
            return res.status(401).json({ success: false, message: 'Refresh Token Expired' });
        }

        const refreshTokenValid = verifyRefreshToken(refresh_token);
        console.log(refreshTokenValid, "refreshTokenValid")
        const provider = await providerRepository.getProviderById(refreshTokenValid.data);
        console.log(provider, "provider")
        if (provider?.isBlocked === true) {
            console.log("blocked")
            return res.status(401).json({ success: false, message: "Provider is blocked by Admin" });
        }


        if (!token) {
            console.log(token, "token")
            return res.status(401).json({ success: false, message: "Access Token Expired" });
        }

        const decoded = verifyAccessToken(token);
        console.log(decoded, "decoded")
        if (!decoded?.data) {
            console.log("decoded data not get")
            return res.status(401).json({ success: false, message: "Access Token Expired" });
        }

        const existingProvider = await providerRepository.getProviderById(decoded.data);
        console.log(existingProvider,"existing provider")
        if (!existingProvider) {
            console.log("existing provider is not get")
            return res.status(404).json({ message: "provider not found" });
        }
        if (existingProvider?.isBlocked) {
            console.log("existingProvider is blocked")
            return res.status(401).json({ success: false, message: "Provider is blocked by admin!" })
        } else {
            req.provider = existingProvider;
            console.log(req.provider)
            next();
        }

    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

export default providerAuth;


