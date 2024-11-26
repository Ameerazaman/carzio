import { signupFormData } from '../Interface/SignupFormInterface';
import { adminAPI } from '../Services/Axios';
import errorHandler from './ErrorHandler';
import adminRouter from '../Services/EndPoints/AdminEndPoints';
import Cookies from 'js-cookie';
import { OfferFormData } from '../Interface/OfferInterface';
import { CouponFormData } from '../Interface/CouponFormData';

// ********************refresh access token for Admin*************

const refreshAdminAccessToken = async () => {

    try {
        const response = await adminAPI.post('/admin/refresh-token', {}, {
            withCredentials: true
        });
        const { access_token } = response.data;
        Cookies.set('access_token', access_token);
        return access_token;
    } catch (error) {

        throw error;
    }
};
// *********************************admin Login***********************
const adminLogin = async ({ email, password }: signupFormData) => {
    try {
        const result = await adminAPI.post(adminRouter.adminLogin, { email, password });
        return result;
    } catch (error) {
        console.log(error as Error);
        errorHandler(error as Error);
    }
}

// *******************************admin Logout*************************
const adminLogout = async () => {
    try {

        const result = await adminAPI.get(adminRouter.adminLogout)

        if (result) {

            return result
        }
    } catch (error) {

        errorHandler(error as Error);

    }
};

// **************************fetch users for user mgt*******************888
const userManagement = async (page: number, limit: number) => {
    try {

        const result = await adminAPI.get(adminRouter.userMgt, {
            params: {
                page,
                limit,

            }
        });
        if (result) {
            return result
        }
    } catch (error) {

        errorHandler(error as Error);

    }

}
// ***************************edit user ***************
const editUser = async (id: string) => {
    try {

        const result = await adminAPI.get(`/admin/edit_user/${id}`);

        if (result) {
            return result
        }

    } catch (error) {
        console.log(error as Error);
        errorHandler(error as Error);

    }
}

// *******************************update user******************

const updateUser = async (userData: signupFormData, userId: string) => {
    try {

        const result = await adminAPI.put(`/admin/edit_user/${userId}`, userData, {
            headers: { 'Content-Type': 'application/json' },
        });

        if (result) {
            return result;
        }
    } catch (error) {
        errorHandler(error as Error);
    }
};

// ***********************************update status********************

const updateStatus = async (id: string) => {
    try {

        const result = await adminAPI.put(`/admin/update_status/${id}`);

        if (result) {
            return result
        }

    } catch (error) {

        errorHandler(error as Error);

    }
}
// *****************************provider managemenet***********************8
const providerManagement = async (page: number, limit: number) => {
    try {

        const result = await adminAPI.get(adminRouter.providerMgt, {
            params: {
                page,
                limit,

            }
        });
        if (result) {
            return result
        }
    } catch (error) {

        errorHandler(error as Error);

    }

}

// *************************edit provider************************88

const editProvider = async (id: string) => {
    try {

        const result = await adminAPI.get(`/admin/edit_provider/${id}`);

        if (result) {
            return result
        }

    } catch (error) {

        errorHandler(error as Error);

    }
}


// **************************update provider***********************************

const updateProvider = async (providerData: signupFormData, providerId: string) => {
    try {

        const result = await adminAPI.put(`/admin/edit_provider/${providerId}`, providerData, {
            headers: { 'Content-Type': 'application/json' },
        });
        if (result) {
            return result;
        }
    } catch (error) {
        errorHandler(error as Error);
    }
};

// *************************update sttus provider******************

const updateStatusProvider = async (id: string) => {
    try {
        const result = await adminAPI.put(`/admin/update_status_provider/${id}`);
        if (result) {
            return result
        }
    } catch (error) {
        errorHandler(error as Error);
    }

}

// ****************************Notifications****************

const fetchNotification = async (page: number, limit: number) => {
    try {

        const result = await adminAPI.get(adminRouter.notificationMgt, {
            params: {
                page,
                limit,

            }
        });

        if (result) {
            return result
        }

    } catch (error) {

        errorHandler(error as Error);
    }

}

//******************** */ fetch notification details***********************
const notificaionDetails = async (id: string) => {
    try {

        const result = await adminAPI.get(`/admin/notification_details/${id}`);

        if (result) {
            return result
        }

    } catch (error) {

        errorHandler(error as Error);

    }

}

//*************************verified notification(Reject /acceppt)*******************
const verifyNotification = async (id: string, value: string) => {
    try {

        const result = await adminAPI.get(`/admin/verify_notification/${id}/${value}`);

        return result.data;

    } catch (error) {

        errorHandler(error as Error);
    }
};

//**************************car mgt..display cars in for car mgt***********************
const carManagementt = async (page: number, limit: number) => {
    try {

        const result = await adminAPI.get(adminRouter.carMgt, {
            params: {
                page,
                limit,
            }
        })
        if (result) {
            return result
        }
    } catch (error) {
        errorHandler(error as Error);
    }
}


//**********************/ update Status of Car *******************888

const updateStatusCar = async (id: string) => {
    try {
        const result = await adminAPI.put(`/admin/update_status_car/${id}`);
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
        if (result) {
            return result
        }
    } catch (error) {
        console.log(error as Error);
        errorHandler(error as Error);

    }
}
// *************************fetch Offer*****************
const fetchOffer = async (page: number, limit: number) => {
    try {

        const result = await adminAPI.get(adminRouter.fetchOffer, {
            params: {
                page,
                limit,
            }
        })

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
        if (result) {
            return result
        }

    } catch (error) {
        errorHandler(error as Error);
    }
}
// **************************************update offer*******************8
const updateOffer = async (offerId: string, offerData: OfferFormData) => {
    try {
        const result = await adminAPI.put(`/admin/edit_offers/${offerId}`, offerData, {
            headers: { 'Content-Type': 'application/json' },
        });

        if (result) {
            return result;
        }

    } catch (error) {
        errorHandler(error as Error);
    }
};
// ****************************Delete or update Offer************************
const updateStatusOffer = async (id: string) => {
    try {
        const result = await adminAPI.put(`/admin/update_status_offers/${id}`);
        if (result) {
            return result
        }
    } catch (error) {
        console.log(error as Error);
        errorHandler(error as Error);

    }
}

// *********************create coupon*****************8
const createCoupon = async (coupon: CouponFormData) => {
    try {
        const result = await adminAPI.post(adminRouter.addCoupon, { coupon });
        if (result) {
            return result

        }
    } catch (error) {
        console.log(error as Error);
        errorHandler(error as Error);
    }
}
// *************************fetch Coupon*****************
const fetchCoupon = async (page: number, limit: number) => {
    try {
        const result = await adminAPI.get(adminRouter.fetchCoupon, {
            params: {
                page,
                limit,
            }
        })
        return result
    } catch (error) {
        console.log(error as Error);
        errorHandler(error as Error);
    }
}

// **************************88edit offers***********************8
const editCoupon = async (id: string) => {
    try {
        const result = await adminAPI.get(`/admin/edit_coupons/${id}`);
        if (result) {
            return result
        }
    } catch (error) {
        console.log(error as Error);
        errorHandler(error as Error);

    }
}
// **************************************update offer*******************8
const updateCoupon = async (couponId: string, couponData: CouponFormData) => {
    try {
 
        const result = await adminAPI.put(`/admin/edit_coupon/${couponId}`, couponData, {
            headers: { 'Content-Type': 'application/json' },
        });

        if (result) {
            return result;
        }
    } catch (error) {
        errorHandler(error as Error);
    }
};
// ****************************Delete or update  coupon************************
const updateStatusCoupon = async (id: string) => {
    try {
        const result = await adminAPI.put(`/admin/update_status_coupon/${id}`);
        if (result) {
            return result
        }
    } catch (error) {
        console.log(error as Error);
        errorHandler(error as Error);
    }
}
// ****************************Booking Page ***************************
const getBookingHistory = async (page: number, limit: number) => {
    try {
        const result = await adminAPI.get(`/admin/booking_history`, {
            params: {
                page,
                limit,
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
        const result = await adminAPI.get(`/admin/details_of_specifc_order/${bookingId}`);
        return result;
    } catch (error) {
        errorHandler(error as Error);
        throw error;
    }
}

// ****************************cancel booking by user**********************
const updateStatusOfBooking = async (bookingId: string, status: string) => {
    try {
        const result = await adminAPI.get(`/admin/update_status/${bookingId}/${status}`);
        return result;
    } catch (error) {
        errorHandler(error as Error);
        throw error;
    }
}

// ***********************get Dashboard const datas***************

const getDashboardConstData = async () => {
    try {
        const result = await adminAPI.get(adminRouter.getDashboard);
        return result;
    } catch (error) {
        errorHandler(error as Error);
        throw error;
    }
}

// **************************** sales report ***************************
const fetchSalesReport = async (page: number, limit: number): Promise<any> => {
    try {
        const result = await adminAPI.get(adminRouter.salesReport, {
            params: { page, limit },
        });
        return result.data;
    } catch (error) {
        errorHandler(error as Error);
        throw error;
    }
};


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
    updateStatusOffer,
    createCoupon,
    fetchCoupon,
    editCoupon,
    updateCoupon,
    updateStatusCoupon,
    getBookingHistory,
    specificBookingDetails,
    updateStatusOfBooking,
    getDashboardConstData,
    fetchSalesReport
}