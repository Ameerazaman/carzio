import jwt from 'jsonwebtoken';

export const verifyAccessToken  =(token: string):any =>{
    try{  
        const decoded = jwt.verify(token,process.env.JWT_SECRET!);
        return decoded
    }catch(error){
        if (error instanceof jwt.TokenExpiredError) {
            return { success: false, message: 'Token has expired' };
        } else if (error instanceof jwt.JsonWebTokenError) {
            return { success: false, message: 'Invalid token' };
        } else {
            return { success: false, message: 'Token verification failed' };
        }
    }   
}

export const verifyRefreshToken = (token: string):any => {
try{
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET!)
    return decoded;
}catch(error){
    return error;
}
}
  