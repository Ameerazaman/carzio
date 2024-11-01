import { signupFormData } from '../Interface/SignupFormInterface';
import { adminAPI } from '../Services/Axios';
import errorHandler from './ErrorHandler';
import adminRouter from '../Services/EndPoints/AdminEndPoints';
import Cookies from 'js-cookie';
import { OfferFormData } from '../Interface/OfferInterface';

// ********************refresh access token for Admin*************

const refreshAdminAccessToken = async () => {

    try {
        const response = await adminAPI.post('/admin/refresh-token', {}, {
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

const adminLogin = async ({ email, password }: signupFormData) => {
    try {

        const result = await adminAPI.post(adminRouter.adminLogin, { email, password });
        return result;
    } catch (error) {
        console.log(error as Error);
        errorHandler(error as Error);
    }
}

const adminLogout = async () => {
    try {
        console.log("admin logout")
        const result = await adminAPI.get(adminRouter.adminLogout)
        console.log("result logout")
        if (result) {
            // window.location.href='/admin/login'
            return result
        }
    } catch (error) {
        console.log(error as Error);
        errorHandler(error as Error);

    }
};


const userManagement = async () => {
    try {
        console.log("fetch users")
        const result = await adminAPI.get(adminRouter.userMgt)
        if (result) {
            return result
        }
    } catch (error) {
        console.log(error as Error);
        errorHandler(error as Error);

    }

}

const editUser = async (id: string) => {
    try {

        const result = await adminAPI.get(`/admin/edit_user/${id}`);
        console.log(result, "resulteditUser")
        if (result) {
            return result
        }

    } catch (error) {
        console.log(error as Error);
        errorHandler(error as Error);

    }
}



const updateUser = async (userData: signupFormData, userId: string) => {
    try {
        console.log("Edit profile called with ID:", userId, "and Data:", userData);

        // Make PUT request to update profile
        const result = await adminAPI.put(`/admin/edit_user/${userId}`, userData, {
            headers: { 'Content-Type': 'application/json' },
        });
        console.log(result, "user update result");

        if (result) {
            return result;  // Return result to update state or handle further
        }
    } catch (error) {
        console.error("Error in edit user Data:", error);
        errorHandler(error as Error);
    }
};

const updateStatus = async (id: string) => {
    try {

        const result = await adminAPI.put(`/admin/update_status/${id}`);
        console.log(result, "resulteditUser")
        if (result) {
            return result
        }

    } catch (error) {
        console.log(error as Error);
        errorHandler(error as Error);

    }
}

const providerManagement = async () => {
    try {
        console.log("fetch provider")
        const result = await adminAPI.get(adminRouter.providerMgt)
        if (result) {
            return result
        }
    } catch (error) {
        console.log(error as Error);
        errorHandler(error as Error);

    }

}


const editProvider = async (id: string) => {
    try {

        const result = await adminAPI.get(`/admin/edit_provider/${id}`);
        console.log(result, "resulteditProvider")
        if (result) {
            return result
        }

    } catch (error) {
        console.log(error as Error);
        errorHandler(error as Error);

    }
}




const updateProvider = async (providerData: signupFormData, providerId: string) => {
    try {
        // Make PUT request to update profile
        const result = await adminAPI.put(`/admin/edit_provider/${providerId}`, providerData, {
            headers: { 'Content-Type': 'application/json' },
        });
        console.log(result, "user update result");

        if (result) {
            return result;  // Return result to update state or handle further
        }
    } catch (error) {
        console.error("Error in edit user Data:", error);
        errorHandler(error as Error);
    }
};

const updateStatusProvider = async (id: string) => {
    try {

        const result = await adminAPI.put(`/admin/update_status_provider/${id}`);
        console.log(result, "update status provider")
        if (result) {
            return result
        }

    } catch (error) {
        console.log(error as Error);
        errorHandler(error as Error);

    }

}

// ****************************Notifications****************


// get notification
const fetchNotification = async () => {
    try {

        const result = await adminAPI.get(adminRouter.notificationMgt);
        console.log(result, "fetch notifications")
        if (result) {
            return result
        }

    } catch (error) {
        console.log(error as Error);
        errorHandler(error as Error);
    }

}

// fetch notification details
const notificaionDetails = async (id: string) => {
    try {

        const result = await adminAPI.get(`/admin/notification_details/${id}`);

        if (result) {
            return result
        }

    } catch (error) {
        console.log(error as Error);
        errorHandler(error as Error);

    }

}

// verified notification(Reject /acceppt)
const verifyNotification = async (id: string, value: string) => {
    try {
        console.log("Fetching notification details");
        const result = await adminAPI.get(`/admin/verify_notification/${id}/${value}`);
        console.log(result, "notification_details");
        return result.data; // Ensure you return the actual data if needed

    } catch (error) {
        console.log(error as Error);
        errorHandler(error as Error);
    }
};

// car mgt..display cars in for car mgt
const carManagementt = async () => {
    try {
        console.log("fetch cars")
        const result = await adminAPI.get(adminRouter.carMgt)
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
        const result = await adminAPI.put(`/admin/update_status_car/${id}`);
        console.log(result, "resulteditUser")
        if (result) {
            return result

        }

    } catch (error) {
        console.log(error as Error);
        errorHandler(error as Error);

    }
}
// ***********************Add Offer********************
const addOffer = async (offer: OfferFormData) => {
    try {

        const result = await adminAPI.post(adminRouter.addOffer, { offer });
        console.log(result, "resulteditUser")
        if (result) {
            return result

        }

    } catch (error) {
        console.log(error as Error);
        errorHandler(error as Error);

    }
}
// *************************fetch Offer*****************
const fetchOffer = async() => {
    try {

        const result = await adminAPI.get(adminRouter.fetchOffer);
        console.log(result, "fetch offer")
        if (result) {
            return result

        }

    } catch (error) {
        console.log(error as Error);
        errorHandler(error as Error);

    }
}
// **************************88edit offers***********************8
const editOffer = async (id: string) => {
    try {

        const result = await adminAPI.get(`/admin/edit_offers/${id}`);
        console.log(result, "edit_offers")
        if (result) {
            return result
        }

    } catch (error) {
        console.log(error as Error);
        errorHandler(error as Error);

    }
}
// **************************************update offer*******************8
const updateOffer = async ( offerId: string,offerData: OfferFormData) => {
    try {
        console.log("Edit offer called with ID:", offerId, "and Data:", offerData);

        // Make PUT request to update profile
        const result = await adminAPI.put(`/admin/edit_offers/${offerId}`, offerData, {
            headers: { 'Content-Type': 'application/json' },
        });
        console.log(result, "offerData update result");

        if (result) {
            return result;  // Return result to update state or handle further
        }
    } catch (error) {
        console.error("Error in edit offerData Data:", error);
        errorHandler(error as Error);
    }
};
// ****************************Delete Offer************************
const deleteOffer = async (id: string) => {
    try {

        const result = await adminAPI.delete(`/admin/delete_offers/${id}`);
        console.log(result, "edit_offers")
        if (result) {
            return result
        }

    } catch (error) {
        console.log(error as Error);
        errorHandler(error as Error);

    }
}
export {
    adminLogout,
    adminLogin,
    userManagement,
    providerManagement,
    editUser,
    updateUser,
    updateStatus,
    editProvider,
    updateProvider,
    updateStatusProvider,
    refreshAdminAccessToken,
    fetchNotification,
    notificaionDetails,
    verifyNotification,
    carManagementt,
    updateStatusCar,
    addOffer,
    fetchOffer,
    editOffer,
    updateOffer,
    deleteOffer
}