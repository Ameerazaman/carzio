
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

        console.log(response.data, 'refreshed')
        const { access_token } = response.data;
        Cookies.set('access_token', access_token);
        return access_token;
    } catch (error) {
        console.error('Error refreshing access token:', error);
        throw error;
    }
};
//   ****************************signup ******************************

const signup = async ({ email, password, confirmPassword }: signupFormData) => {
    try {
        console.log("providerSignup")
        const result = await providerAPI.post(providerRouter.signup, {
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

// ********************************resend otp**************************

const resend = async () => {
    try {

        const result = await providerAPI.get(providerRouter.reSend);
        return result
    } catch (error) {
        console.log(error as Error);
    }
};

// *************************************verify Otp*****************************
const verifyOtp = async (otp: string) => {
    try {

        const result = await providerAPI.post(providerRouter.verifyOtp, { otp });

        // Check if the result was successful
        if (result.data.success) {

            return { success: true };
        } else {
            return { success: false, message: result.data.message || 'OTP verification failed.' };
        }
    } catch (error: any) {
        // Handle both network errors and response errors (like 400 status)
        if (error.response) {

            return { success: false, message: error.response.data.message || 'OTP verification failed.' };
        } else {
            console.log('Error during OTP verification:', error.message);
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
        console.log(error as Error);
        errorHandler(error as Error);
    }
}
// ******************************************logout Provider***************************
const providerLogout = async () => {
    try {
        console.log("logout ")
        const result = await providerAPI.get(providerRouter.providerLogout)
        console.log("result when logout")
        if (result) {
            window.location.href = '/'
        }
    } catch (error) {
        console.log(error as Error);
        errorHandler(error as Error);

    }
};
// *******************************get profile details in home page*****************

const getProfile = async (userId: string) => {
    try {
        console.log("fetch address of provider with id:", userId);
        const result = await providerAPI.get(`/provider/home/${userId}`);  // Use the id in the API URL
        console.log(result, "profile");
        if (result) {
            return result;
        }
    } catch (error) {
        console.log(error as Error);
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
        console.log("Edit profile called with ID:", addressId, "and Data:", profileData);

        // Make PUT request to update profile
        const result = await providerAPI.put(`/provider/edit_profile/${addressId}`, profileData, {
            headers: { 'Content-Type': 'application/json' },
        });
        console.log(result, "Profile update result");

        if (result) {
            return result;
        }
    } catch (error) {
        console.error("Error in editProfileData:", error);
        errorHandler(error as Error);
    }
};
// ******************************add car deetails in provider***********************

const addCarDetails = async (carData: CarDataInterface) => {
    try {
        const formData = new FormData();

        // Append each field in carData except for the uploaded files
        Object.entries(carData).forEach(([key, value]) => {
            if (key !== 'uploadedFiles') {  // Ignore the file field for now
                formData.append(key, value as string);
            }
        });

        // Append the uploaded files (if there are any)
        carData.uploadedFiles?.forEach((file) => {
            formData.append('images', file);  // Append each file under the 'images' field
        });

        // Make the API call with formData
        const result = await providerAPI.post(providerRouter.add_car, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',  // Optional, as Axios will handle this
            },
        });

        return result.data;
    } catch (error) {
        console.error("Error in addCarDetails:", error);
        errorHandler(error as Error);
    }
};
// ****************************car mnagement**************************
const carManagement = async (providerId:string,page:number,limit:number) => {
    try {
        console.log("fetch cars")
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
        console.log(error as Error);
        errorHandler(error as Error);

    }

}


// update Status of Car

const updateStatusCar = async (id: string) => {
    try {
        console.log(id, "update status")
        const result = await providerAPI.put(`/provider/update_status_car/${id}`);
        console.log(result, "resulteditUser")
        if (result) {
            return result

        }

    } catch (error) {
        console.log(error as Error);
        errorHandler(error as Error);

    }
}

// Edit car Data
const editCar = async (id: string) => {
    try {

        const result = await providerAPI.get(`/provider/edit_Car/${id}`);
        console.log(result, "resulteditCar")
        if (result) {
            return result
        }

    } catch (error) {
        console.log(error as Error);
        errorHandler(error as Error);

    }
}

// Edit car details in car mgt
const editCarDetails = async (carData: CarDataInterface, id: string) => {
    try {
        // const formData = new FormData();
        // Object.entries(carData).forEach(([key, value]) => {
        //     if (key !== 'uploadedFiles') {
        //         formData.append(key, value as string);
        //     }
        // });

        // console.log()
        // carData.uploadedFiles?.forEach((file) => {
        //     console.log("uploaded files",file)
        //     if (typeof file === 'object' && file instanceof File) {
        //         formData.append('images', file); // Correctly append file
        //     } else {
        //         console.error("Invalid file object, expected a File:", file);
        //     }
        // });

        const result = await providerAPI.put(`/provider/edit_Car/${id}`, carData,
            { headers: { 'Content-Type': 'application/json' } },);

        return result.data;
    } catch (error) {
        console.error("Error in addCarDetails:", error);
        errorHandler(error as Error);
    }
};

// ********************8********update images***************************
const editCarImage = async (uploadedFiles: File[], id: string) => {
    try {
        const formData = new FormData();

        // Append each file to formData
        uploadedFiles.forEach((file) => {
            if (file instanceof File) {
                formData.append('images', file); // Add each image file
            } else {
                console.error("Invalid file object, expected a File:", file);
            }
        });
        const result = await providerAPI.put(
            `/provider/edit_car_image/${id}`,
            formData,
            { headers: { 'Content-Type': 'multipart/form-data' } } // Ensure 'multipart/form-data'
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
                    'Content-Type': 'multipart/form-data', // Required for file upload
                },
            }
        );
        return result.data;
    } catch (error) {
        console.error('Error in updateProfileImage:', error);
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
        console.error("API Error:", error);
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
        console.error("API Error:", error);
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
        console.error("API Error:", error);
        errorHandler(error as Error);
        throw error;
    }
}

// ********************************fetch users***********************8
const fetchUsersChat = async (providerId: string) => {
    try {
        const response = await providerAPI.get(`/provider/fetch_users_chat/${providerId}`);
        console.log("API Response:", response.data);
        return response.data; // Return only the data portion
    } catch (error) {
        console.error("Error fetching user chat:", error);
        errorHandler(error as Error); // Custom error handler
        throw new Error("Failed to fetch user chat.");
    }
};


// **********************chat history***********************

const fetchChat = async (providerId: string, userId: string): Promise<any> => {
    try {
        console.log(`Fetching chat history for providerId: ${providerId}, userId: ${userId}`);
        const url = `/provider/chat_history/${providerId}/${userId}`;
        console.log("API URL:", url);
        const result = await providerAPI.get(url);
        console.log("API Response:", result);
        return result.data;
    } catch (error) {
        console.error("Error fetching chat history:", error);
        throw error; // Handle the error appropriately
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
    getDashboardConstData
};
