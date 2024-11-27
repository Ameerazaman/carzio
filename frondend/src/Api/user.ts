import { signupFormData } from '../Interface/SignupFormInterface';
import { userApi } from '../Services/Axios'
import userRouter from '../Services/EndPoints/UserEndPoints';
import { AxiosError } from 'axios';
import errorHandler from './ErrorHandler';
import Cookies from 'js-cookie';
import { Filter } from '../Interface/FilterInterface';
import { ProfileInterface } from '../Interface/ProfileInterface';
import { AddressInterface } from '../Interface/AddressInterface';
import { BookingFormData } from '../Interface/BookingInterface';
import { reviewDataInterface } from '../Interface/ReviewInterface';

// refresh Accesss token

const refreshUserAccessToken = async () => {

    try {
        const response = await userApi.post('/refresh-token', {}, {
            withCredentials: true
        });

        const { access_token } = response.data;
        Cookies.set('access_token', access_token);
        return access_token;
    } catch (error) {

        throw error;
    }
};
// ******************************signup**************************
const signup = async ({ email, password, confirmPassword, username }: signupFormData) => {
    try {
        const result = await userApi.post(userRouter.signup, {
            email,
            password,
            confirmPassword,
            username, 
        });
        if (result.data.success) {
            return { success: true }; 
        } else {
            return { success: false, message: result.data.message || 'Signup failed.' };
        }
    } catch (error) {
        if (error instanceof AxiosError && error.response) {
           
            return { success: false, message: error.response.data.message || 'An error occurred during signup.' };
        } else {
            console.log(error as Error);
            return { success: false, message: 'An error occurred during signup.' };
        }
    }
};

// *********************************resend otp **********************

const resend = async () => {
    try {
        const result = await userApi.get(userRouter.reSend);
        return result
    } catch (error) {
        console.log(error as Error);
    }
};

// ***********************************verify otp*******************
const verifyOtp = async (otp: string) => {
    try {

        const result = await userApi.post(userRouter.verifyOtp, { otp });

        if (result.data.success) {

            return { success: true };
        } else {
            return { success: false, message: result.data.message || 'OTP verification failed.' };
        }
    } catch (error: any) {
   
        if (error.response) {
          
            return { success: false, message: error.response.data.message || 'OTP verification failed.' };
        } else {

            throw new Error('Network or server error during OTP verification.');
        }
    }

};

// *****************************login User****************
const loginUser = async ({ email, password }: signupFormData) => {
    try {
        const result = await userApi.post(userRouter.userLogin, { email, password });
        return result;
    } catch (error) {
        console.log(error as Error);
        errorHandler(error as Error);
    }
}

// ********************************user Logout*********************
const userLogout = async () => {
    try {
        const result = await userApi.get(userRouter.userLogout)
        if (result) {
            window.location.href = '/login'
        }
        return result
    } catch (error) {
        errorHandler(error as Error);

    }
};


// **************************fetch cars ******************************
const fetchCars = async (page: number, limit: number) => {
    try {

        const result = await userApi.get(userRouter.fetchCar, {
            params: {
                page,
                limit
            }
        })
        if (result) {
            return result
        }
    } catch (error) {
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

        errorHandler(error as Error);
    }

}

// *****************Edit Profile********************
const editProfile = async (profileData: ProfileInterface, id: string) => {
    try {
        const result = await userApi.put(`/edit_profile/${id}`, { profileData })
        if (result) {
            return result
        }
    } catch (error) {

        errorHandler(error as Error);
    }
}
// *********************check Address*******************
const checkAddress = async (id: string) => {
    try {
        const result = await userApi.get(`/address/${id}`)
        if (result) {
            return result
        }
    } catch (error) {
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
        errorHandler(error as Error);
    }
}
// *********************booking_confirm******************

const BookingConfirm = async (bookingData: BookingFormData) => {
    try {

        const result = await userApi.post(`/booking_confirm`, bookingData);
        return result;
    } catch (error) {

        errorHandler(error as Error);
        throw error;
    }
};


//   ************************userId stored in coupon****************
const userIdStoredInCoupon = async (coupon: string, userId: string,) => {
    try {
        const result = await userApi.post(`/userid_in_coupon/${coupon}/${userId}`);
        return result;
    } catch (error) {

        errorHandler(error as Error);
        throw error;
    }
};

// ****************************Booking Page ***************************
const getBookingHistory = async (userId: string, page: number, limit: number) => {
    try {
        const result = await userApi.get(userRouter.bookingHistory, {
            params: {
                userId,
                page,
                limit
            }
        });
        return result;
    } catch (error) {

        errorHandler(error as Error);
        throw error;
    }
}


// ****************************booking details of specilf order***************
const specificBookingDetails = async (bookingId: string) => {
    try {
        const result = await userApi.get(`/details_of_specifc_order/${bookingId}`);
        return result;
    } catch (error) {

        errorHandler(error as Error);
        throw error;
    }
};


// ****************************cancel booking by user**********************
const cancelBookingByUser = async (bookingId: string, userId: string, amount: number) => {
    try {
        const result = await userApi.put('/cancel_booking', null, {
            params: {
                bookingId,
                userId,
                amount,
            },
        });
        return result;
    } catch (error) {

        throw error;
    }
};

//*****************/ cancelBookong update add amount to waalet***********************
const storeCancelAmtToWallet = async (userId: string, amount: number) => {
    try {

        const result = await userApi.put(`/credit_to_wallet`, {
            userId,
            amount
        });
        return result;
    } catch (error) {

        errorHandler(error as Error);
        throw error;
    }
};

// ****************************check booked or not *********************
const checkingBookedOrNot = async (issueDate: string, returnDate: string, carId: string) => {
    try {

        const result = await userApi.get(`/check_booking`, {
            params: {
                issueDate,
                returnDate,
                carId
            }
        });
        return result;
    } catch (error) {

        errorHandler(error as Error);
        throw error;
    }
};
//   *******************************check Wallet ****************
const checkBalanceUpdateWallet = async (amount: number, userId: string) => {
    try {

        const result = await userApi.put(`/check_update_wallet/${userId}/${amount}`);
        return result;
    } catch (error) {

        errorHandler(error as Error);
        throw error;
    }
};

// ********************************get Wallet Page ***********************
const getWalletPage = async (userId: string, page: number, limit: number) => {
    try {
        const result = await userApi.get(userRouter.getWallet, {
            params: {
                userId,
                page,
                limit
            }
        });
        return result;
    } catch (error) {
        errorHandler(error as Error);
        throw error;
    }
}

// ****************************create review and ratings***************
const createReviewAndRatings = async (reviewData: reviewDataInterface): Promise<any> => {
    try {
        const result = await userApi.post(userRouter.createReviewRatings, reviewData); 
        return result.data;
    } catch (error) {

        errorHandler(error as Error); 
        throw error;
    }
};

// *************************check bookId is exist in review ***********************

const checkBookidInReview = async (bookId: string): Promise<any> => {
    try {
        const result = await userApi.get(userRouter.checkBookIdInReview, {
            params: {
                bookId
            }
        });
        return result;
    } catch (error) {

        errorHandler(error as Error); 
        throw error;
    }
}

// **********************chat history***********************

const fetchChat = async (userId: string, providerId: string): Promise<any> => {
    try {
    
        const result = await userApi.get(`/chat_history/${userId}/${providerId}`)
        return result.data;  
        
    } catch (error) {
 
        errorHandler(error as Error);
        throw error; 
    }
};

// *****************************search car availabilty*******************
const searchCarAvailabilty = async (issueDate: string, returnDate: string): Promise<any> => {
    try {

      const result = await userApi.get(userRouter.searchCarAvailabilty, {
        params: {
          issueDate,
          returnDate,
        },
      });
      return result;
    } catch (error) {

      errorHandler(error as Error); 
      throw error;
    }
  };
  

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
    cancelBookingByUser,
  
    checkingBookedOrNot,
    checkBalanceUpdateWallet,
    storeCancelAmtToWallet,
    getWalletPage,
    createReviewAndRatings,
    checkBookidInReview,
    fetchChat,
    searchCarAvailabilty

};
