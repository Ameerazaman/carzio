import { signupFormData } from '../Interface/SignupFormInterface';
import { userApi } from '../Services/Axios'
import userRouter from '../Services/EndPoints/UserEndPoints';
import { AxiosError } from 'axios';
import errorHandler from './ErrorHandler';
import Cookies from 'js-cookie';
import { Filter } from '../Interface/FilterInterface';
import { string } from 'yargs';
import { ProfileInterface } from '../Interface/ProfileInterface';
import { AddressInterface } from '../Interface/AddressInterface';
import { BookingFormData } from '../Interface/BookingInterface';

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


const userLogout = async () => {
    try {

        const result = await userApi.get(userRouter.userLogout)
        if (result) {
            window.location.href = '/login'

        }
        return result
    } catch (error) {
        console.log(error as Error);
        errorHandler(error as Error);

    }
};


// **************************fetch cars ******************************
const fetchCars = async () => {
    try {

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
// ************************Apply filters*********************
const applyFilters = async (params: Filter) => {
    try {
        const result = await userApi.post(userRouter.carFilter, { params });
        if (result) {
            return result;
        }
    } catch (error) {
        console.error(error as Error);
        errorHandler(error as Error);
    }
};

// **************************search Car*************************
const searchCar = async (searchQuery: string) => {
    try {

        const result = await userApi.post(userRouter.searchCar, { searchQuery });
        if (result) {
            return result;
        }
    } catch (error) {
        console.error(error as Error);
        errorHandler(error as Error);
    }
}
// ***************************Offers*********************
const getOffer = async () => {
    try {
        const result = await userApi.get(userRouter.getOfferCar);
        if (result) {
            return result;
        }
    } catch (error) {
        console.error(error as Error);
        errorHandler(error as Error);
    }
}

// *************************checkProfile*****************8
const checkProfile = async (id: string) => {
    try {
        const result = await userApi.get(`/profile/${id}`);
        if (result) {
            return result;
        }
    } catch (error) {
        console.error(error as Error);
        errorHandler(error as Error);
    }
}

// ***********************save profile****************88
const saveProfileData = async (profileData: ProfileInterface) => {
    try {
        const result = await userApi.post(userRouter.saveProfile, { profileData })
        if (result) {
            return result
        }
    } catch (error) {
        console.error(error as Error);
        errorHandler(error as Error);
    }

}

// *****************Edit Profile********************
const editProfile = async (profile: ProfileInterface, id: string) => {
    try {
        const result = await userApi.put(`/edit_profile/${id}`)
        if (result) {
            return result
        }
    } catch (error) {
        console.error(error as Error);
        errorHandler(error as Error);
    }
}
// *********************check Address*******************
const checkAddress = async (id: string) => {
    try {
        const result = await userApi.get(`/address/${id}`)
        if (result) {
            console.log(result, "result fetch address")
            return result
        }
    } catch (error) {
        console.error(error as Error);
        errorHandler(error as Error);
    }
}

// **************************check offer********************
const checkOffer = async (carName: string) => {
    try {
        const result = await userApi.get(`/fetch_offer/${carName}`)
        if (result) {
            return result
        }
    } catch (error) {
        console.error(error as Error);
        errorHandler(error as Error);
    }
}
// ************************save address***************8
const saveAddressData = async (addressData: AddressInterface) => {
    try {
        const result = await userApi.post(userRouter.saveAddress, { addressData })
        if (result) {
            return result
        }
    } catch (error) {
        console.error(error as Error);
        errorHandler(error as Error);
    }
}

// ****************Edit address************
const editAddress = async (addressData: AddressInterface, id: string) => {
    try {
        const result = await userApi.put(`/edit_address/${id}`, { addressData })
        if (result) {
            return result
        }
    } catch (error) {
        console.error(error as Error);
        errorHandler(error as Error);
    }
}

// **********************8fetch Coupon***************

const fetchCoupon = async (id: string) => {
    try {
        const result = await userApi.get(`/fetch_coupon/${id}`)
        if (result) {
            return result
        }
    } catch (error) {
        console.error(error as Error);
        errorHandler(error as Error);
    }
}
// *********************booking_confirm******************

const BookingConfirm = async (bookingData: BookingFormData) => {
    try {
        console.log(bookingData, "booking data")
        const result = await userApi.post(`/booking_confirm`, bookingData);
        return result;
    } catch (error) {
        console.error("API Error:", error);
        errorHandler(error as Error);
        throw error; // Propagate the error to handle it in handleSubmit
    }
};


//   ************************userId stored in coupon****************
const userIdStoredInCoupon = async (coupon: string, userId: string,) => {
    try {
        const result = await userApi.post(`/userid_in_coupon/${coupon}/${userId}`);
        return result;
    } catch (error) {
        console.error("API Error:", error);
        errorHandler(error as Error);
        throw error;
    }
};

// ****************************Booking Page ***************************
const getBookingHistory=async(userId:string)=>{
    try {
        const result = await userApi.get(`/bookibg_history/${userId}`);
        return result;
    } catch (error) {
        console.error("API Error:", error);
        errorHandler(error as Error);
        throw error;
    }
}

// ****************************booking details of specilf order***************
const specificBookingDetails=async(bookingId:string)=>{
    try {
        const result = await userApi.get(`/details_of_specifc_order/${bookingId}`);
        return result;
    } catch (error) {
        console.error("API Error:", error);
        errorHandler(error as Error);
        throw error;
    }
}

// ****************************cancel booking by user**********************
const cancelBookingByUser =async(id:string)=>{
    try {
        const result = await userApi.get(`/cancel_booking/${id}`);
        return result;
    } catch (error) {
        console.error("API Error:", error);
        errorHandler(error as Error);
        throw error;
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
    carDetail,
    applyFilters,
    searchCar,
    getOffer,
    checkProfile,
    saveProfileData,
    editProfile,
    checkAddress,
    saveAddressData,
    editAddress,
    fetchCoupon,
    BookingConfirm,
    checkOffer,
    userIdStoredInCoupon,
    getBookingHistory,
    specificBookingDetails,
    cancelBookingByUser
};
