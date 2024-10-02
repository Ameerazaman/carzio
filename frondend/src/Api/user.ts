import { FormData } from '../components/user/Signups';
import {Api} from '../services/axios';
import userRouter from '../services/EndPoints/userEndPoints';
import { AxiosError } from 'axios';
import errorHandler from './errorHandler';

const signup = async ({ email, password, confirmPassword }: FormData) => {
    try {
        const result = await Api.post(userRouter.signup, {
            email,
            password,
            confirmPassword,
        });
        console.log(result, "response");

        // Check if the signup was successful
        if (result.data.success) {
            return { success: true };  // Successful signup
        } else {
            // Handle the failure case (like email already exists)
            return { success: false, message: result.data.message || 'Signup failed.' };
        }
    } catch (error) {
        // Type assertion to narrow down the type of 'error'
        if (error instanceof AxiosError && error.response) {
            // Check if the server returned a specific error message
            console.log('Axios Error:', error.response.data.message);
            return { success: false, message: error.response.data.message || 'An error occurred during signup.' };
        } else {
            // Handle generic error (network error, etc.)
            console.log(error as Error);
            return { success: false, message: 'An error occurred during signup.' };
        }
    }
};


const resend = async () => {
    try {
        console.log("Resending OTP via API...");
        const result = await Api.get(userRouter.reSend);
        return result
    } catch (error) {
        console.log(error as Error);
    }
};

const verifyOtp = async (otp: string) => {
    try {
        console.log(`Verifying OTP: ${otp}`);
        const result = await Api.post(userRouter.verifyOtp, { otp });

        // Check if the result was successful
        if (result.data.success) {
            console.log('OTP verified successfully.');
            return { success: true };
        } else {
            return { success: false, message: result.data.message || 'OTP verification failed.' };
        }
    } catch (error: any) {
        // Handle both network errors and response errors (like 400 status)
        if (error.response) {
            console.log('OTP verification failed:', error.response.data.message);
            return { success: false, message: error.response.data.message || 'OTP verification failed.' };
        } else {
            console.log('Error during OTP verification:', error.message);
            throw new Error('Network or server error during OTP verification.');
        }
    }

};


const loginUser = async ({ email, password }: FormData) => {
    try {
        const result = await Api.post(userRouter.userLogin, { email, password });
        return result;
    } catch (error) {
        console.log(error as Error);
         errorHandler(error as Error);
    }
}
// const loginUser = async ({ email, password }: FormData) => {
//     try {
//         // const result = await Api.post(userRouter.userLogin, { email, password });
//         const result = await Api.post(userRouter.userLogin, { email, password }, { withCredentials: true });

//         console.log(result, "result");

//         // Check if result.data exists and then access the success state
//         if (result.data && result.data.success === true) {
//             console.log("Login successful");
//             return {
//                 success: true,
//                 data: result.data.data // Access actual user data
//             };
//         } else {
//             console.log("Login failed");
//             return {
//                 success: false,
//                 message: result.data?.message || 'Login failed. Please check password and email'
//             };
//         }
//     } catch (error) {
//         console.log(error as Error);
//         errorHandler(error as Error);
//     }
// };

const userLogout = async () => {
    try {
        console.log("logout")
        const result = await Api.get(userRouter.userLogout)
    if(result){
        console.log("result",result)
        return result
    }

        // if (result.data.success === true) {
        //     return {
        //         success: true,
        //     };
        // } else {
        //     return {
        //         success: false,
        //         message: result.data.message || 'Logout failed',
        //     };
        // }
      } catch (error) {
        console.log(error as Error);
         errorHandler(error as Error);
    
    }
};
export {
    signup,
    resend,
    verifyOtp,
    loginUser,
    userLogout
};
