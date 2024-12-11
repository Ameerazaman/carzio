"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminServices = void 0;
const http_status_codes_1 = require("http-status-codes");
const { BAD_REQUEST, OK, INTERNAL_SERVER_ERROR, UNAUTHORIZED } = http_status_codes_1.StatusCodes;
const bcrypt_1 = __importDefault(require("bcrypt"));
const CouponGenerator_1 = require("../../Utlis/CouponGenerator");
class AdminServices {
    constructor(adminRepostry, encrypt, createjwt) {
        this.adminRepostry = adminRepostry;
        this.encrypt = encrypt;
        this.createjwt = createjwt;
    }
    // *******************************refresh access token for admin*******************
    adminGetById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let admin = yield this.adminRepostry.getAdminById(id);
                if (!admin) {
                    return {
                        status: UNAUTHORIZED,
                        data: {
                            success: false,
                            message: 'User not found',
                        }
                    };
                }
                const newAccessToken = this.createjwt.generateToken(admin.id);
                return {
                    status: OK,
                    data: {
                        success: true,
                        message: 'Success',
                        adminId: admin.id,
                        token: newAccessToken,
                        data: admin
                    }
                };
            }
            catch (error) {
                return null;
            }
        });
    }
    // ***************************Signup logic*********************************
    adminSignIn(adminData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const provider = yield this.adminRepostry.emailExistCheck(adminData.email);
                if (!provider) {
                    return {
                        status: UNAUTHORIZED,
                        data: {
                            success: false,
                            message: 'provider not found',
                        }
                    };
                }
                const isPasswordValid = yield bcrypt_1.default.compare(adminData.password, provider.password);
                if (!isPasswordValid) {
                    return {
                        status: BAD_REQUEST,
                        data: {
                            success: false,
                            message: 'Incorrect Password, Try again',
                        }
                    };
                }
                const token = this.createjwt.generateToken(provider.id);
                const refreshToken = this.createjwt.generateRefreshToken(provider.id);
                return {
                    status: OK,
                    data: {
                        success: true,
                        token: token,
                        data: provider,
                        refreshToken,
                    }
                };
            }
            catch (error) {
                console.error("Error login user:", error.message);
                return {
                    status: INTERNAL_SERVER_ERROR,
                    data: {
                        success: false,
                        message: 'Internal server error'
                    }
                };
            }
        });
    }
    // *****************************8fetch users*****************************
    fetchUsers(page, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const userData = yield this.adminRepostry.fetchUsers(page, limit);
                const totalPage = (yield this.adminRepostry.countUsers()) || 0;
                if (userData && userData.length > 0) {
                    return {
                        status: OK,
                        data: {
                            success: true,
                            data: userData,
                            page: page,
                            totalPage: (_a = Math.ceil(totalPage / limit)) !== null && _a !== void 0 ? _a : 1
                        },
                    };
                }
                else {
                    return {
                        status: BAD_REQUEST,
                        data: {
                            success: false,
                            message: 'No users found',
                        },
                    };
                }
            }
            catch (error) {
                return {
                    status: INTERNAL_SERVER_ERROR,
                    data: {
                        success: false,
                        message: 'Internal server error',
                    },
                };
            }
        });
    }
    // ***************************edit user*****************************
    editUser(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.adminRepostry.editUser(id);
            }
            catch (error) {
                return null;
            }
        });
    }
    // ****************************update users*********************
    updateUser(userData, id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const provider = yield this.adminRepostry.updateUser(userData, id);
                return {
                    status: 200,
                    data: {
                        success: true,
                        message: 'user update successfully',
                    },
                };
            }
            catch (error) {
                return {
                    status: 500, // Internal server error
                    data: {
                        success: false,
                        message: 'Internal server error',
                    },
                };
            }
        });
    }
    // ********************************update status**********************
    updateStatus(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.adminRepostry.updateStatus(id);
            }
            catch (error) {
                return null;
            }
        });
    }
    // **********************************fetch providers**********************
    fetchProviders(page, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const providerData = yield this.adminRepostry.fetchProviders(page, limit);
                const totalPage = (yield this.adminRepostry.countProviders()) || 0;
                if (providerData && providerData.length > 0) {
                    return {
                        status: OK,
                        data: {
                            success: true,
                            data: providerData,
                            page: page,
                            totalPage: (_a = Math.ceil(totalPage / limit)) !== null && _a !== void 0 ? _a : 1
                        },
                    };
                }
                else {
                    return {
                        status: BAD_REQUEST,
                        data: {
                            success: false,
                            message: 'No providers found',
                        },
                    };
                }
            }
            catch (error) {
                return {
                    status: INTERNAL_SERVER_ERROR,
                    data: {
                        success: false,
                        message: 'Internal server error',
                    },
                };
            }
        });
    }
    // *****************************edit provider*************************
    editProvider(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.adminRepostry.editProvider(id);
            }
            catch (error) {
                return null;
            }
        });
    }
    // *******************************update providers**********************
    updateProvider(providerData, id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const provider = yield this.adminRepostry.updateProvider(providerData, id);
                return {
                    status: 200,
                    data: {
                        success: true,
                        message: 'provider update successfully',
                    },
                };
            }
            catch (error) {
                return {
                    status: 500,
                    data: {
                        success: false,
                        message: 'Internal server error',
                    },
                };
            }
        });
    }
    // *******************************update status of providers*******************
    updateStatusProvider(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.adminRepostry.updateStatusprovider(id);
            }
            catch (error) {
                return null;
            }
        });
    }
    //*************************/ fetch notification from car Document********************
    fetchNotification() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const carNotificationData = yield this.adminRepostry.fetchNotification();
                if (carNotificationData && carNotificationData.length > 0) {
                    return {
                        status: OK,
                        data: {
                            success: true,
                            data: carNotificationData,
                        },
                    };
                }
                else {
                    return {
                        status: BAD_REQUEST,
                        data: {
                            success: false,
                            message: 'Notification is Empty',
                        },
                    };
                }
            }
            catch (error) {
                return {
                    status: INTERNAL_SERVER_ERROR,
                    data: {
                        success: false,
                        message: 'Internal server error',
                    },
                };
            }
        });
    }
    // **************************notification details********************
    notificationDetails(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.adminRepostry.carNotificationById(id);
            }
            catch (error) {
                return null;
            }
        });
    }
    // ******verify notification (accept or reject the car details in notifiation.add car to car model)***********
    verifynotification(id, value) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.adminRepostry.verifyNotification(id, value);
            }
            catch (error) {
                return null;
            }
        });
    }
    // **************************fetch car for car managementa****************************
    fetchCars(page, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const carData = yield this.adminRepostry.fetchCars(page, limit);
                console.log(carData, "cardata services");
                const totalPage = (yield this.adminRepostry.countCars()) || 0;
                if (carData && carData.length > 0) {
                    return {
                        status: OK,
                        data: {
                            success: true,
                            data: carData,
                            page: page,
                            totalPage: (_a = Math.ceil(totalPage / limit)) !== null && _a !== void 0 ? _a : 1
                        },
                    };
                }
                else {
                    return {
                        status: BAD_REQUEST,
                        data: {
                            success: false,
                            message: 'No cars found',
                        },
                    };
                }
            }
            catch (error) {
                return {
                    status: INTERNAL_SERVER_ERROR,
                    data: {
                        success: false,
                        message: 'Internal server error',
                    },
                };
            }
        });
    }
    //  **********************change car status***********************
    updateStatusCar(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.adminRepostry.updateStatusCar(id);
            }
            catch (error) {
                return null;
            }
        });
    }
    //  ***************************Add offer********************************88
    addOffer(offer) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const offerData = yield this.adminRepostry.addOffer(offer);
                if (offerData) {
                    return {
                        status: OK,
                        data: {
                            success: true,
                            data: offerData,
                        },
                    };
                }
                else {
                    return {
                        status: BAD_REQUEST,
                        data: {
                            success: false,
                            message: 'Offers are not found',
                        },
                    };
                }
            }
            catch (error) {
                return {
                    status: INTERNAL_SERVER_ERROR,
                    data: {
                        success: false,
                        message: 'Internal server error',
                    },
                };
            }
        });
    }
    // *******************88fetch User*******************8
    fetchOffer(page, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const offerData = yield this.adminRepostry.fetchOffer(page, limit);
                const totalPage = (yield this.adminRepostry.countOffers()) || 0;
                if (offerData && offerData.length > 0) {
                    return {
                        status: OK,
                        data: {
                            success: true,
                            data: offerData,
                            page: page,
                            totalPage: (_a = Math.ceil(totalPage / limit)) !== null && _a !== void 0 ? _a : 1
                        },
                    };
                }
                else {
                    return {
                        status: BAD_REQUEST,
                        data: {
                            success: false,
                            message: 'offers are not found',
                        },
                    };
                }
            }
            catch (error) {
                return {
                    status: INTERNAL_SERVER_ERROR,
                    data: {
                        success: false,
                        message: 'Internal server error',
                    },
                };
            }
        });
    }
    // *****************************Edit Offer************************8
    editOffer(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.adminRepostry.editOffer(id);
            }
            catch (error) {
                return null;
            }
        });
    }
    // ************************update Offer*************8888
    updateOffer(offerData, id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const provider = yield this.adminRepostry.updateOffer(offerData, id);
                return {
                    status: 200,
                    data: {
                        success: true,
                        message: 'Offer update successfully',
                    },
                };
            }
            catch (error) {
                return {
                    status: 500,
                    data: {
                        success: false,
                        message: 'Internal server error',
                    },
                };
            }
        });
    }
    // ***********************delete Offer****************
    updateStatusOffer(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.adminRepostry.updateStatusOffer(id);
            }
            catch (error) {
                return null;
            }
        });
    }
    // ***********************add coupon******************
    addCoupon(coupon) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                coupon.code = (0, CouponGenerator_1.generateRandomCouponCode)(8);
                const offerData = yield this.adminRepostry.addCoupon(coupon);
                if (offerData) {
                    return {
                        status: OK,
                        data: {
                            success: true,
                            data: offerData,
                        },
                    };
                }
                else {
                    return {
                        status: BAD_REQUEST,
                        data: {
                            success: false,
                            message: 'Offers are not found',
                        },
                    };
                }
            }
            catch (error) {
                return {
                    status: INTERNAL_SERVER_ERROR,
                    data: {
                        success: false,
                        message: 'Internal server error',
                    },
                };
            }
        });
    }
    // *******************88fetch Coupon*******************8
    fetchCoupon(page, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const couponData = yield this.adminRepostry.fetchCoupon(page, limit);
                const totalPage = (yield this.adminRepostry.countCoupon()) || 0;
                if (couponData && couponData.length > 0) {
                    return {
                        status: OK,
                        data: {
                            success: true,
                            data: couponData,
                            page: page,
                            totalPage: (_a = Math.ceil(totalPage / limit)) !== null && _a !== void 0 ? _a : 1
                        },
                    };
                }
                else {
                    return {
                        status: BAD_REQUEST,
                        data: {
                            success: false,
                            message: 'coupons are not found',
                        },
                    };
                }
            }
            catch (error) {
                return {
                    status: INTERNAL_SERVER_ERROR,
                    data: {
                        success: false,
                        message: 'Internal server error',
                    },
                };
            }
        });
    }
    // *****************************Edit Coupon************************8
    editCoupon(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.adminRepostry.editCoupon(id);
            }
            catch (error) {
                return null;
            }
        });
    }
    // ************************update Coupon*************8888
    updateCoupon(couponData, id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const updatedCoupon = yield this.adminRepostry.updateCoupon(couponData, id);
                return {
                    status: 200,
                    data: {
                        success: true,
                        message: 'Coupon update successfully',
                    },
                };
            }
            catch (error) {
                console.error("Error upadting offer Data:", error.message);
                return {
                    status: 500,
                    data: {
                        success: false,
                        message: 'Internal server error',
                    },
                };
            }
        });
    }
    // ***********************delete or update status of coupon****************
    updateStatusCoupon(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.adminRepostry.updateStatusCoupon(id);
            }
            catch (error) {
                return null;
            }
        });
    }
    // ************************* booking page************************
    getBookingHistory(page, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const bookingHistory = yield this.adminRepostry.getBookingHistory(page, limit);
                const totalPage = (yield this.adminRepostry.countBooking()) || 0;
                if (bookingHistory && bookingHistory.length > 0) {
                    return {
                        status: OK,
                        data: {
                            success: true,
                            data: bookingHistory,
                            page: page,
                            totalPage: (_a = Math.ceil(totalPage / limit)) !== null && _a !== void 0 ? _a : 1
                        },
                    };
                }
                else {
                    return {
                        status: BAD_REQUEST,
                        data: {
                            success: false,
                            message: "Booking history is not get"
                        },
                    };
                }
            }
            catch (error) {
                return {
                    status: INTERNAL_SERVER_ERROR,
                    data: {
                        success: false,
                        message: 'Internal server error',
                    },
                };
            }
        });
    }
    // ************************* specif booking details************************
    specificBookingDetails(bookingId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const bookingHistory = yield this.adminRepostry.specificBookingDetails(bookingId);
                if (bookingHistory) {
                    return {
                        status: OK,
                        data: {
                            success: true,
                            data: bookingHistory,
                        },
                    };
                }
                else {
                    return {
                        status: BAD_REQUEST,
                        data: {
                            success: false,
                            message: "Booking history is not get"
                        },
                    };
                }
            }
            catch (error) {
                return {
                    status: INTERNAL_SERVER_ERROR,
                    data: {
                        success: false,
                        message: 'Internal server error',
                    },
                };
            }
        });
    }
    // *******************************update status for booking*****************
    updateStatusOfBooking(bookingId, status) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const updateStatus = yield this.adminRepostry.updateStatusOfBooking(bookingId, status);
                if (updateStatus) {
                    return {
                        status: OK,
                        data: {
                            success: true,
                            data: updateStatus,
                        },
                    };
                }
                else {
                    return {
                        status: BAD_REQUEST,
                        data: {
                            success: false,
                            message: "Status updation is failed"
                        },
                    };
                }
            }
            catch (error) {
                return {
                    status: INTERNAL_SERVER_ERROR,
                    data: {
                        success: false,
                        message: 'Internal server error',
                    },
                };
            }
        });
    }
    // *****************************get dashboard const data******************88
    getConstDashboardData() {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c;
            try {
                const totalCars = (yield this.adminRepostry.countCars()) || 0;
                const totalProviders = (yield this.adminRepostry.countProviders()) || 0;
                const totalUsers = (yield this.adminRepostry.countUsers()) || 0;
                const totalBookingCount = yield this.adminRepostry.CountBookingCar();
                const revenue = (_a = (yield this.adminRepostry.totalRevenue())) !== null && _a !== void 0 ? _a : 0;
                const totalBooking = (_b = (yield this.adminRepostry.countBooking())) !== null && _b !== void 0 ? _b : 0;
                const revenueByCar = (_c = (yield this.adminRepostry.revenueByCar())) !== null && _c !== void 0 ? _c : 0;
                return {
                    status: 200,
                    data: {
                        success: true,
                        data: {
                            totalCars,
                            totalProviders,
                            totalUsers,
                            revenue,
                            totalBookingCount,
                            totalBooking,
                            revenueByCar
                        },
                    },
                };
            }
            catch (error) {
                return null;
            }
        });
    }
    // *********************************Sales Report**********************
    fetchSalesReport(page, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const salesReport = yield this.adminRepostry.fetchSalesReport(page, limit);
                if (salesReport && salesReport.length > 0) {
                    return {
                        status: OK,
                        data: {
                            success: true,
                            data: salesReport,
                            page: page,
                            totalPage: Math.ceil(salesReport.length / limit),
                        },
                    };
                }
                else {
                    return {
                        status: BAD_REQUEST,
                        data: {
                            success: false,
                            message: "Sales report not retrieved",
                        },
                    };
                }
            }
            catch (error) {
                return {
                    status: INTERNAL_SERVER_ERROR,
                    data: {
                        success: false,
                        message: 'Internal server error',
                    },
                };
            }
        });
    }
}
exports.AdminServices = AdminServices;
