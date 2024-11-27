var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import { providerAPI } from '../Services/Axios';
import { AxiosError } from 'axios';
import errorHandler from './ErrorHandler';
import providerRouter from '../Services/EndPoints/ProviderEndPoints';
import Cookies from 'js-cookie';
//************************ */ refress access token for provider****************
var refreshProviderAccessToken = function () { return __awaiter(void 0, void 0, void 0, function () {
    var response, access_token, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, providerAPI.post('/provider/refresh-token', {}, {
                        withCredentials: true
                    })];
            case 1:
                response = _a.sent();
                access_token = response.data.access_token;
                Cookies.set('access_token', access_token);
                return [2 /*return*/, access_token];
            case 2:
                error_1 = _a.sent();
                throw error_1;
            case 3: return [2 /*return*/];
        }
    });
}); };
//   ****************************signup ******************************
var signup = function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
    var result, error_2;
    var email = _b.email, password = _b.password, confirmPassword = _b.confirmPassword, username = _b.username;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 2, , 3]);
                return [4 /*yield*/, providerAPI.post(providerRouter.signup, {
                        email: email,
                        password: password,
                        confirmPassword: confirmPassword,
                        username: username
                    })];
            case 1:
                result = _c.sent();
                if (result.data.success) {
                    return [2 /*return*/, { success: true }];
                }
                else {
                    return [2 /*return*/, { success: false, message: result.data.message || 'Signup failed.' }];
                }
                return [3 /*break*/, 3];
            case 2:
                error_2 = _c.sent();
                if (error_2 instanceof AxiosError && error_2.response) {
                    return [2 /*return*/, { success: false, message: error_2.response.data.message || 'An error occurred during signup.' }];
                }
                else {
                    console.log(error_2);
                    return [2 /*return*/, { success: false, message: 'An error occurred during signup.' }];
                }
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
// ********************************resend otp**************************
var resend = function () { return __awaiter(void 0, void 0, void 0, function () {
    var result, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, providerAPI.get(providerRouter.reSend)];
            case 1:
                result = _a.sent();
                return [2 /*return*/, result];
            case 2:
                error_3 = _a.sent();
                errorHandler(error_3);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
// *************************************verify Otp*****************************
var verifyOtp = function (otp) { return __awaiter(void 0, void 0, void 0, function () {
    var result, error_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, providerAPI.post(providerRouter.verifyOtp, { otp: otp })];
            case 1:
                result = _a.sent();
                if (result.data.success) {
                    return [2 /*return*/, { success: true }];
                }
                else {
                    return [2 /*return*/, { success: false, message: result.data.message || 'OTP verification failed.' }];
                }
                return [3 /*break*/, 3];
            case 2:
                error_4 = _a.sent();
                if (error_4.response) {
                    return [2 /*return*/, { success: false, message: error_4.response.data.message || 'OTP verification failed.' }];
                }
                else {
                    errorHandler(error_4);
                    throw new Error('Network or server error during OTP verification.');
                }
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
// ******************************login provider*******************************
var loginProvider = function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
    var result, error_5;
    var email = _b.email, password = _b.password;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 2, , 3]);
                return [4 /*yield*/, providerAPI.post(providerRouter.providerLogin, { email: email, password: password })];
            case 1:
                result = _c.sent();
                return [2 /*return*/, result];
            case 2:
                error_5 = _c.sent();
                errorHandler(error_5);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
// ******************************************logout Provider***************************
var providerLogout = function () { return __awaiter(void 0, void 0, void 0, function () {
    var result, error_6;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, providerAPI.get(providerRouter.providerLogout)];
            case 1:
                result = _a.sent();
                if (result) {
                    window.location.href = '/';
                }
                return [3 /*break*/, 3];
            case 2:
                error_6 = _a.sent();
                errorHandler(error_6);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
// *******************************get profile details in home page*****************
var getProfile = function (userId) { return __awaiter(void 0, void 0, void 0, function () {
    var result, error_7;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, providerAPI.get("/provider/home/".concat(userId))];
            case 1:
                result = _a.sent();
                if (result) {
                    return [2 /*return*/, result];
                }
                return [3 /*break*/, 3];
            case 2:
                error_7 = _a.sent();
                errorHandler(error_7);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
// ****************************submit profile data or save data**************
var submitProfileData = function (profileData) { return __awaiter(void 0, void 0, void 0, function () {
    var result, error_8;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, providerAPI.post(providerRouter.saveProfile, { profileData: profileData })];
            case 1:
                result = _a.sent();
                if (result) {
                    return [2 /*return*/, result];
                }
                return [3 /*break*/, 3];
            case 2:
                error_8 = _a.sent();
                console.log(error_8);
                errorHandler(error_8);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
// ************************edit profile data ***********************
var editProfileData = function (profileData, addressId) { return __awaiter(void 0, void 0, void 0, function () {
    var result, error_9;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, providerAPI.put("/provider/edit_profile/".concat(addressId), profileData, {
                        headers: { 'Content-Type': 'application/json' },
                    })];
            case 1:
                result = _a.sent();
                if (result) {
                    return [2 /*return*/, result];
                }
                return [3 /*break*/, 3];
            case 2:
                error_9 = _a.sent();
                errorHandler(error_9);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
// ******************************add car deetails in provider***********************
var addCarDetails = function (carData) { return __awaiter(void 0, void 0, void 0, function () {
    var formData_1, result, error_10;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                formData_1 = new FormData();
                Object.entries(carData).forEach(function (_a) {
                    var key = _a[0], value = _a[1];
                    if (key !== 'uploadedFiles') {
                        formData_1.append(key, value);
                    }
                });
                (_a = carData.uploadedFiles) === null || _a === void 0 ? void 0 : _a.forEach(function (file) {
                    formData_1.append('images', file);
                });
                return [4 /*yield*/, providerAPI.post(providerRouter.add_car, formData_1, {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                        },
                    })];
            case 1:
                result = _b.sent();
                return [2 /*return*/, result.data];
            case 2:
                error_10 = _b.sent();
                errorHandler(error_10);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
// ****************************car mnagement**************************
var carManagement = function (providerId, page, limit) { return __awaiter(void 0, void 0, void 0, function () {
    var result, error_11;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, providerAPI.get(providerRouter.carMgt, {
                        params: {
                            page: page,
                            limit: limit,
                            providerId: providerId
                        }
                    })];
            case 1:
                result = _a.sent();
                if (result) {
                    return [2 /*return*/, result];
                }
                return [3 /*break*/, 3];
            case 2:
                error_11 = _a.sent();
                errorHandler(error_11);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
//***********************update Status of Car*************************
var updateStatusCar = function (id) { return __awaiter(void 0, void 0, void 0, function () {
    var result, error_12;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, providerAPI.put("/provider/update_status_car/".concat(id))];
            case 1:
                result = _a.sent();
                if (result) {
                    return [2 /*return*/, result];
                }
                return [3 /*break*/, 3];
            case 2:
                error_12 = _a.sent();
                errorHandler(error_12);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
//*******************Edit car Data******************
var editCar = function (id) { return __awaiter(void 0, void 0, void 0, function () {
    var result, error_13;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, providerAPI.get("/provider/edit_Car/".concat(id))];
            case 1:
                result = _a.sent();
                if (result) {
                    return [2 /*return*/, result];
                }
                return [3 /*break*/, 3];
            case 2:
                error_13 = _a.sent();
                console.log(error_13);
                errorHandler(error_13);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
//***************** */ Edit car details in car mgt************************
var editCarDetails = function (carData, id) { return __awaiter(void 0, void 0, void 0, function () {
    var result, error_14;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, providerAPI.put("/provider/edit_Car/".concat(id), carData, { headers: { 'Content-Type': 'application/json' } })];
            case 1:
                result = _a.sent();
                return [2 /*return*/, result.data];
            case 2:
                error_14 = _a.sent();
                errorHandler(error_14);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
// ********************8********update images***************************
var editCarImage = function (uploadedFiles, id) { return __awaiter(void 0, void 0, void 0, function () {
    var formData_2, result, error_15;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                formData_2 = new FormData();
                uploadedFiles.forEach(function (file) {
                    if (file instanceof File) {
                        formData_2.append('images', file);
                    }
                    else {
                        console.error("Invalid file object, expected a File:", file);
                    }
                });
                return [4 /*yield*/, providerAPI.put("/provider/edit_car_image/".concat(id), formData_2, { headers: { 'Content-Type': 'multipart/form-data' } })];
            case 1:
                result = _a.sent();
                return [2 /*return*/, result.data];
            case 2:
                error_15 = _a.sent();
                console.error("Error in editCarImage:", error_15);
                errorHandler(error_15);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
//************************ */ Frontend - updateProfileImage function**************************
var updateProfileImage = function (formData, id) { return __awaiter(void 0, void 0, void 0, function () {
    var result, error_16;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, providerAPI.put("/provider/edit_profile_image/".concat(id), formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                        },
                    })];
            case 1:
                result = _a.sent();
                return [2 /*return*/, result.data];
            case 2:
                error_16 = _a.sent();
                errorHandler(error_16);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
// ****************************Booking Page ***************************
var getBookingHistory = function (providerId, page, limit) { return __awaiter(void 0, void 0, void 0, function () {
    var result, error_17;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, providerAPI.get(providerRouter.bookingHistory, {
                        params: {
                            providerId: providerId,
                            page: page,
                            limit: limit
                        }
                    })];
            case 1:
                result = _a.sent();
                return [2 /*return*/, result];
            case 2:
                error_17 = _a.sent();
                errorHandler(error_17);
                throw error_17;
            case 3: return [2 /*return*/];
        }
    });
}); };
// ****************************booking details of specilf order***************
var specificBookingDetails = function (bookingId) { return __awaiter(void 0, void 0, void 0, function () {
    var result, error_18;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, providerAPI.get("/provider/details_of_specifc_order/".concat(bookingId))];
            case 1:
                result = _a.sent();
                return [2 /*return*/, result];
            case 2:
                error_18 = _a.sent();
                errorHandler(error_18);
                throw error_18;
            case 3: return [2 /*return*/];
        }
    });
}); };
// ****************************cancel booking by user**********************
var updateStatusOfBooking = function (bookingId, status) { return __awaiter(void 0, void 0, void 0, function () {
    var result, error_19;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, providerAPI.get("/provider/update_status/".concat(bookingId, "/").concat(status))];
            case 1:
                result = _a.sent();
                return [2 /*return*/, result];
            case 2:
                error_19 = _a.sent();
                errorHandler(error_19);
                throw error_19;
            case 3: return [2 /*return*/];
        }
    });
}); };
// ********************************fetch users***********************8
var fetchUsersChat = function (providerId) { return __awaiter(void 0, void 0, void 0, function () {
    var response, error_20;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, providerAPI.get("/provider/fetch_users_chat/".concat(providerId))];
            case 1:
                response = _a.sent();
                return [2 /*return*/, response.data];
            case 2:
                error_20 = _a.sent();
                errorHandler(error_20);
                throw new Error("Failed to fetch user chat.");
            case 3: return [2 /*return*/];
        }
    });
}); };
// **********************chat history***********************
var fetchChat = function (providerId, userId) { return __awaiter(void 0, void 0, void 0, function () {
    var url, result, error_21;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                url = "/provider/chat_history/".concat(providerId, "/").concat(userId);
                return [4 /*yield*/, providerAPI.get(url)];
            case 1:
                result = _a.sent();
                return [2 /*return*/, result.data];
            case 2:
                error_21 = _a.sent();
                throw error_21;
            case 3: return [2 /*return*/];
        }
    });
}); };
// ******************************get DashboardData********************
var getDashboardConstData = function (providerId) { return __awaiter(void 0, void 0, void 0, function () {
    var result, error_22;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, providerAPI.get("/provider/dashboard/".concat(providerId))];
            case 1:
                result = _a.sent();
                return [2 /*return*/, result];
            case 2:
                error_22 = _a.sent();
                console.error("API Error:", error_22);
                errorHandler(error_22);
                throw error_22;
            case 3: return [2 /*return*/];
        }
    });
}); };
// ************************fetch sales resport***********************
var fetchSalesReport = function (page, limit, providerId) { return __awaiter(void 0, void 0, void 0, function () {
    var result, error_23;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, providerAPI.get(providerRouter.salesReport, {
                        params: { page: page, limit: limit, providerId: providerId },
                    })];
            case 1:
                result = _a.sent();
                return [2 /*return*/, result.data];
            case 2:
                error_23 = _a.sent();
                errorHandler(error_23);
                throw error_23;
            case 3: return [2 /*return*/];
        }
    });
}); };
export { signup, resend, verifyOtp, loginProvider, providerLogout, getProfile, submitProfileData, editProfileData, refreshProviderAccessToken, addCarDetails, carManagement, updateStatusCar, editCar, editCarDetails, editCarImage, updateProfileImage, getBookingHistory, specificBookingDetails, updateStatusOfBooking, fetchUsersChat, fetchChat, getDashboardConstData, fetchSalesReport };
