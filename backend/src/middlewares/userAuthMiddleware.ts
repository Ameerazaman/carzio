import { Request, Response, NextFunction } from 'express'
import dotenv from 'dotenv';
import { CreateJWT } from '../Utlis/GenerateToken';
import { verifyRefreshToken, verifyAccessToken } from '../Utlis/VerifyTokens';
import { STATUS_CODES } from '../Constants/HttpStatusCode';
import { UserInterface } from '../Interface/UserInterface';
import { UserRepository } from '../Repostries/User/UserRepostries';

import { access } from 'fs';

const { UNAUTHORIZED } = STATUS_CODES

const jwt = new CreateJWT();
const userRepository = new UserRepository();
dotenv.config()

// declare global {
//     namespace Express {
//         interface Request {
//             userId?: string,
//             user?: UserInterface | null,
//         }
//     }
// }
// interface AuthRequest extends Request {
//     user?: { id: string };
//   }
//   import { UserInterface } from './path-to-your-user-interface'; // Adjust the path accordingly

declare global {
    namespace Express {
        interface Request {
            user?: UserInterface; // Add your UserInterface type here
        }
    }
}


const userAuth = async (req: Request, res: Response, next: NextFunction) => {
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
        const user = await userRepository.getUserById(refreshTokenValid.data);
     

        // Check if the user is blocked
        if (user?.isBlocked === true) {
            return res.status(401).json({ success: false, message: "User is blocked by Admin" });
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
        const existingUser = await userRepository.getUserById(decoded.data);
        if (!existingUser) {
            return res.status(404).json({ message: "User not found" });
        }

        if (existingUser?.isBlocked) {
            return res.json({ success: false, message: "User is blocked by admin!" })
        } else {
            req.user = existingUser;
            next();
        }
        
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

export default userAuth;


