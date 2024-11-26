
import { providerAPI } from '../Services/Axios';
import { signupFormData } from '../Interface/SignupFormInterface';
import { AxiosError } from 'axios';
import errorHandler from './ErrorHandler';
import providerRouter from '../Services/EndPoints/ProviderEndPoints';
import { ProfileType } from '../Pages/Provider/ProfilePage';
import Cookies from 'js-cookie';
import { CarDataInterface } from '../Interface/CarInterface';

//************************ */ refress access token for provider****************

const refreshProviderAccessToken = async () => {

    try {
        const response = await providerAPI.post('/provider/refresh-token', {}, {
            withCredentials: true
        });

        const { access_token } = response.data;
        Cookies.set('access_token', access_token);
        return access_token;
    } catch (error) {

        throw error;
    }
};
//   ****************************signup ******************************

const signup = async ({ email, password, confirmPassword,username }: signupFormData) => {
    try {

        const result = await providerAPI.post(providerRouter.signup, {
            email,
            password,
            confirmPassword,
            username
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

// ********************************resend otp**************************

const resend = async () => {
    try {

        const result = await providerAPI.get(providerRouter.reSend);
        return result
    } catch (error) {
        errorHandler(error as Error);
    }
};

// *************************************verify Otp*****************************
const verifyOtp = async (otp: string) => {
    try {

        const result = await providerAPI.post(providerRouter.verifyOtp, { otp });

        if (result.data.success) {

            return { success: true };
        } else {
            return { success: false, message: result.data.message || 'OTP verification failed.' };
        }
    } catch (error: any) {
        if (error.response) {

            return { success: false, message: error.response.data.message || 'OTP verification failed.' };
        } else {
            errorHandler(error as Error);
            throw new Error('Network or server error during OTP verification.');
        }
    }

};

// ******************************login provider*******************************
const loginProvider = async ({ email, password }: signupFormData) => {
    try {
        const result = await providerAPI.post(providerRouter.providerLogin, { email, password });
        return result;
    } catch (error) {      
        errorHandler(error as Error);
    }
}
// ******************************************logout Provider***************************
const providerLogout = async () => {
    try {
       
        const result = await providerAPI.get(providerRouter.providerLogout)
        
        if (result) {
            window.location.href = '/'
        }
    } catch (error) {
       
        errorHandler(error as Error);

    }
};
// *******************************get profile details in home page*****************

const getProfile = async (userId: string) => {
    try {
       
        const result = await providerAPI.get(`/provider/home/${userId}`);  // Use the id in the API URL
        
        if (result) {
            return result;
        }
    } catch (error) {
       
        errorHandler(error as Error);
    }
};
// ****************************submit profile data or save data**************
const submitProfileData = async (profileData: ProfileType) => {
    try {
        const result = await providerAPI.post(providerRouter.saveProfile, { profileData })

        if (result) {

            return result;
        }
    }
    catch (error) {
        console.log(error as Error);
        errorHandler(error as Error);
    }
}
// ************************edit profile data ***********************
const editProfileData = async (profileData: ProfileType, addressId: string) => {
    try {
        const result = await providerAPI.put(`/provider/edit_profile/${addressId}`, profileData, {
            headers: { 'Content-Type': 'application/json' },
        });
        if (result) {
            return result;
        }
    } catch (error) {

        errorHandler(error as Error);
    }
};
// ******************************add car deetails in provider***********************

const addCarDetails = async (carData: CarDataInterface) => {
    try {
        const formData = new FormData();

        Object.entries(carData).forEach(([key, value]) => {
            if (key !== 'uploadedFiles') { 
                formData.append(key, value as string);
            }
        });

        carData.uploadedFiles?.forEach((file) => {
            formData.append('images', file); 
        });

        const result = await providerAPI.post(providerRouter.add_car, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',  
            },
        });

        return result.data;
    } catch (error) {
      
        errorHandler(error as Error);
    }
};
// ****************************car mnagement**************************
const carManagement = async (providerId:string,page:number,limit:number) => {
    try {

        const result = await providerAPI.get(providerRouter.carMgt, {
            params: {
                page,
                limit,
                providerId
            }
        });
        if (result) {
            return result
        }
    } catch (error) {
        errorHandler(error as Error);
    }

}


//***********************update Status of Car*************************

const updateStatusCar = async (id: string) => {
    try {
        const result = await providerAPI.put(`/provider/update_status_car/${id}`);
        if (result) {
            return result
        }

    } catch (error) {
        errorHandler(error as Error);

    }
}

//*******************Edit car Data******************
const editCar = async (id: string) => {
    try {

        const result = await providerAPI.get(`/provider/edit_Car/${id}`);

        if (result) {
            return result
        }

    } catch (error) {
        console.log(error as Error);
        errorHandler(error as Error);

    }
}

//***************** */ Edit car details in car mgt************************
const editCarDetails = async (carData: CarDataInterface, id: string) => {
    try {
        const result = await providerAPI.put(`/provider/edit_Car/${id}`, carData,
            { headers: { 'Content-Type': 'application/json' } },);

        return result.data;
    } catch (error) {

        errorHandler(error as Error);
    }
};

// ********************8********update images***************************
const editCarImage = async (uploadedFiles: File[], id: string) => {
    try {
        const formData = new FormData();

        uploadedFiles.forEach((file) => {
            if (file instanceof File) {
                formData.append('images', file); 
            } else {
                console.error("Invalid file object, expected a File:", file);
            }
        });
        const result = await providerAPI.put(
            `/provider/edit_car_image/${id}`,
            formData,
            { headers: { 'Content-Type': 'multipart/form-data' } } 
        );

        return result.data;
    } catch (error) {
        console.error("Error in editCarImage:", error);
        errorHandler(error as Error);
    }
};

//************************ */ Frontend - updateProfileImage function**************************
const updateProfileImage = async (formData: FormData, id: string) => {
    try {
        const result = await providerAPI.put(
            `/provider/edit_profile_image/${id}`,
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data', 
                },
            }
        );
        return result.data;
    } catch (error) {
        errorHandler(error as Error);
    }
};
// ****************************Booking Page ***************************
const getBookingHistory = async (providerId: string, page: number, limit: number) => {
    try {
        const result = await providerAPI.get(providerRouter.bookingHistory, {
            params: {
                providerId,
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
        const result = await providerAPI.get(`/provider/details_of_specifc_order/${bookingId}`);
        return result;
    } catch (error) {

        errorHandler(error as Error);
        throw error;
    }
}

// ****************************cancel booking by user**********************
const updateStatusOfBooking = async (bookingId: string, status: string) => {
    try {
        const result = await providerAPI.get(`/provider/update_status/${bookingId}/${status}`);
        return result;
    } catch (error) {
        errorHandler(error as Error);
        throw error;
    }
}

// ********************************fetch users***********************8
const fetchUsersChat = async (providerId: string) => {
    try {
        const response = await providerAPI.get(`/provider/fetch_users_chat/${providerId}`);
        return response.data; 
    } catch (error) {

        errorHandler(error as Error); 
        throw new Error("Failed to fetch user chat.");
    }
};


// **********************chat history***********************

const fetchChat = async (providerId: string, userId: string): Promise<any> => {
    try {
       
        const url = `/provider/chat_history/${providerId}/${userId}`;
      
        const result = await providerAPI.get(url);
       
        return result.data;
    } catch (error) {
  
        throw error;
    }
};
// ******************************get DashboardData********************
const getDashboardConstData=async(providerId:string)=>{
    try {
        const result = await providerAPI.get(`/provider/dashboard/${providerId}`);
        return result;
    } catch (error) {
        console.error("API Error:", error);
        errorHandler(error as Error);
        throw error;
    }
}
// ************************fetch sales resport***********************

const fetchSalesReport = async (page: number, limit: number,providerId:string): Promise<any> => {
    try {
        const result = await providerAPI.get(providerRouter.salesReport, {
            params: { page, limit, providerId },
          });
          
      return result.data;
    } catch (error) {
     
      errorHandler(error as Error);
      throw error;
    }
  };

export {
    signup,
    resend,
    verifyOtp,
    loginProvider,
    providerLogout,
    getProfile,
    submitProfileData,
    editProfileData,
    refreshProviderAccessToken,
    addCarDetails,
    carManagement,
    updateStatusCar,
    editCar,
    editCarDetails,
    editCarImage,
    updateProfileImage,
    getBookingHistory,
    specificBookingDetails,
    updateStatusOfBooking,
    fetchUsersChat,
    fetchChat,
    getDashboardConstData,
    fetchSalesReport
};
