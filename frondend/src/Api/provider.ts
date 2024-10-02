import { FormData } from '../components/user/Signups';
import { API } from '../services/axios';
import { AxiosError } from 'axios';
import errorHandler from './errorHandler';
import providerRouter from '../services/EndPoints/providerEndPoints';


const signup = async ({ email, password, confirmPassword }: FormData) => {
    try {
        console.log("providerSignup")
        const result = await API.post(providerRouter.signup, {
            email,
            password,
            confirmPassword,
        });
        console.log(result, "response");

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
        console.log("provider Resending OTP via API...");
        const result = await API.get(providerRouter.reSend);
        return result
    } catch (error) {
        console.log(error as Error);
    }
};

const verifyOtp = async (otp: string) => {
    try {
        console.log(`provider Verifying OTP: ${otp}`);
        const result = await API.post(providerRouter.verifyOtp, { otp });

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


const loginProvider = async ({ email, password }: FormData) => {
    try {
        console.log("provider login")
        const result = await API.post(providerRouter.userLogin, { email, password });
        return result;
    } catch (error) {
        console.log(error as Error);
        errorHandler(error as Error);
    }
}

const providerLogout = async () => {
    try {
        console.log("provider logout")
        const result = await API.get(providerRouter.userLogout)
        if (result) {
            console.log("result", result)
            return result
        }
    } catch (error) {
        console.log(error as Error);
        errorHandler(error as Error);

    }
};
export {
    signup,
    resend,
    verifyOtp,
    loginProvider,
    providerLogout
};
