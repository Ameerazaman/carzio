import { signupFormData } from '../Interface/SignupFormInterface';
import {userApi} from '../Services/Axios'
import userRouter from '../Services/EndPoints/UserEndPoints';
import { AxiosError } from 'axios';
import errorHandler from './ErrorHandler';
import Cookies from 'js-cookie';

// refresh Accesss token

const refreshUserAccessToken = async () => {

    try {
        const response = await userApi.post('/refresh-token', {}, {
            withCredentials: true
        });

        console.log(response.data, 'refreshed')
        const { access_token } = response.data;
        Cookies.set('access_token', access_token);
        return access_token;
    } catch (error) {
        console.error('Error refreshing access token:', error);
        throw error;
    }
};

const signup = async ({ email, password, confirmPassword, username }: signupFormData) => {
    try {
        console.log(email, password, confirmPassword, username, "data")
        const result = await userApi.post(userRouter.signup, {
            email,
            password,
            confirmPassword,
            username, // Corrected field name here
        });
        console.log(result, "response");

        if (result.data.success) {
            return { success: true };  // Successful signup
        } else {
            return { success: false, message: result.data.message || 'Signup failed.' };
        }
    } catch (error) {
        if (error instanceof AxiosError && error.response) {
            console.log('Axios Error:', error.response.data.message);
            return { success: false, message: error.response.data.message || 'An error occurred during signup.' };
        } else {
            console.log(error as Error);
            return { success: false, message: 'An error occurred during signup.' };
        }
    }
};


const resend = async () => {
    try {
        console.log("Resending OTP via API...");
        const result = await userApi.get(userRouter.reSend);
        return result
    } catch (error) {
        console.log(error as Error);
    }
};

const verifyOtp = async (otp: string) => {
    try {
        console.log(`Verifying OTP: ${otp}`);
        const result = await userApi.post(userRouter.verifyOtp, { otp });

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


const loginUser = async ({ email, password }: signupFormData) => {
    try {
        const result = await userApi.post(userRouter.userLogin, { email, password });
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
        const result = await userApi.get(userRouter.userLogout)
        if (result) {
            console.log("result", result)
            return result
        }
    } catch (error) {
        console.log(error as Error);
        errorHandler(error as Error);

    }
};


// **************************fetch cars ******************************
const fetchCars= async () => {
    try {
        console.log("fetch cars")
        const result = await userApi.get(userRouter.fetchCar)
        if (result) {
            return result
        }
    } catch (error) {
        console.log(error as Error);
        errorHandler(error as Error);

    }

}
// *******************car Details Page *************************
const carDetail = async (id: string) => {
    try {

        const result = await userApi.get(`/car_details/${id}`);

        if (result) {
            return result
        }

    } catch (error) {
        console.log(error as Error);
        errorHandler(error as Error);

    }

}
export {
    signup,
    resend,
    verifyOtp,
    loginUser,
    userLogout,
    refreshUserAccessToken,
    fetchCars,
    carDetail
};
