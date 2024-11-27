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
import { userApi } from '../Services/Axios';
import userRouter from '../Services/EndPoints/UserEndPoints';
import { AxiosError } from 'axios';
import errorHandler from './ErrorHandler';
import Cookies from 'js-cookie';
// refresh Accesss token
var refreshUserAccessToken = function () { return __awaiter(void 0, void 0, void 0, function () {
    var response, access_token, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, userApi.post('/refresh-token', {}, {
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
// ******************************signup**************************
var signup = function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
    var result, error_2;
    var email = _b.email, password = _b.password, confirmPassword = _b.confirmPassword, username = _b.username;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 2, , 3]);
                return [4 /*yield*/, userApi.post(userRouter.signup, {
                        email: email,
                        password: password,
                        confirmPassword: confirmPassword,
                        username: username,
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
// *********************************resend otp **********************
var resend = function () { return __awaiter(void 0, void 0, void 0, function () {
    var result, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, userApi.get(userRouter.reSend)];
            case 1:
                result = _a.sent();
                return [2 /*return*/, result];
            case 2:
                error_3 = _a.sent();
                console.log(error_3);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
// ***********************************verify otp*******************
var verifyOtp = function (otp) { return __awaiter(void 0, void 0, void 0, function () {
    var result, error_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, userApi.post(userRouter.verifyOtp, { otp: otp })];
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
                    throw new Error('Network or server error during OTP verification.');
                }
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
// *****************************login User****************
var loginUser = function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
    var result, error_5;
    var email = _b.email, password = _b.password;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 2, , 3]);
                return [4 /*yield*/, userApi.post(userRouter.userLogin, { email: email, password: password })];
            case 1:
                result = _c.sent();
                return [2 /*return*/, result];
            case 2:
                error_5 = _c.sent();
                console.log(error_5);
                errorHandler(error_5);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
// ********************************user Logout*********************
var userLogout = function () { return __awaiter(void 0, void 0, void 0, function () {
    var result, error_6;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, userApi.get(userRouter.userLogout)];
            case 1:
                result = _a.sent();
                if (result) {
                    window.location.href = '/login';
                }
                return [2 /*return*/, result];
            case 2:
                error_6 = _a.sent();
                errorHandler(error_6);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
// **************************fetch cars ******************************
var fetchCars = function (page, limit) { return __awaiter(void 0, void 0, void 0, function () {
    var result, error_7;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, userApi.get(userRouter.fetchCar, {
                        params: {
                            page: page,
                            limit: limit
                        }
                    })];
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
// *******************car Details Page *************************
var carDetail = function (id) { return __awaiter(void 0, void 0, void 0, function () {
    var result, error_8;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, userApi.get("/car_details/".concat(id))];
            case 1:
                result = _a.sent();
                if (result) {
                    return [2 /*return*/, result];
                }
                return [3 /*break*/, 3];
            case 2:
                error_8 = _a.sent();
                errorHandler(error_8);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
// ************************Apply filters*********************
var applyFilters = function (params) { return __awaiter(void 0, void 0, void 0, function () {
    var result, error_9;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, userApi.post(userRouter.carFilter, { params: params })];
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
// **************************search Car*************************
var searchCar = function (searchQuery) { return __awaiter(void 0, void 0, void 0, function () {
    var result, error_10;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, userApi.post(userRouter.searchCar, { searchQuery: searchQuery })];
            case 1:
                result = _a.sent();
                if (result) {
                    return [2 /*return*/, result];
                }
                return [3 /*break*/, 3];
            case 2:
                error_10 = _a.sent();
                errorHandler(error_10);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
// ***************************Offers*********************
var getOffer = function () { return __awaiter(void 0, void 0, void 0, function () {
    var result, error_11;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, userApi.get(userRouter.getOfferCar)];
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
// *************************checkProfile*****************8
var checkProfile = function (id) { return __awaiter(void 0, void 0, void 0, function () {
    var result, error_12;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, userApi.get("/profile/".concat(id))];
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
// ***********************save profile****************88
var saveProfileData = function (profileData) { return __awaiter(void 0, void 0, void 0, function () {
    var result, error_13;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, userApi.post(userRouter.saveProfile, { profileData: profileData })];
            case 1:
                result = _a.sent();
                if (result) {
                    return [2 /*return*/, result];
                }
                return [3 /*break*/, 3];
            case 2:
                error_13 = _a.sent();
                errorHandler(error_13);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
// *****************Edit Profile********************
var editProfile = function (profileData, id) { return __awaiter(void 0, void 0, void 0, function () {
    var result, error_14;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, userApi.put("/edit_profile/".concat(id), { profileData: profileData })];
            case 1:
                result = _a.sent();
                if (result) {
                    return [2 /*return*/, result];
                }
                return [3 /*break*/, 3];
            case 2:
                error_14 = _a.sent();
                errorHandler(error_14);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
// *********************check Address*******************
var checkAddress = function (id) { return __awaiter(void 0, void 0, void 0, function () {
    var result, error_15;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, userApi.get("/address/".concat(id))];
            case 1:
                result = _a.sent();
                if (result) {
                    return [2 /*return*/, result];
                }
                return [3 /*break*/, 3];
            case 2:
                error_15 = _a.sent();
                errorHandler(error_15);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
// **************************check offer********************
var checkOffer = function (carName) { return __awaiter(void 0, void 0, void 0, function () {
    var result, error_16;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, userApi.get("/fetch_offer/".concat(carName))];
            case 1:
                result = _a.sent();
                if (result) {
                    return [2 /*return*/, result];
                }
                return [3 /*break*/, 3];
            case 2:
                error_16 = _a.sent();
                errorHandler(error_16);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
// ************************save address***************8
var saveAddressData = function (addressData) { return __awaiter(void 0, void 0, void 0, function () {
    var result, error_17;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, userApi.post(userRouter.saveAddress, { addressData: addressData })];
            case 1:
                result = _a.sent();
                if (result) {
                    return [2 /*return*/, result];
                }
                return [3 /*break*/, 3];
            case 2:
                error_17 = _a.sent();
                errorHandler(error_17);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
// ****************Edit address************
var editAddress = function (addressData, id) { return __awaiter(void 0, void 0, void 0, function () {
    var result, error_18;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, userApi.put("/edit_address/".concat(id), { addressData: addressData })];
            case 1:
                result = _a.sent();
                if (result) {
                    return [2 /*return*/, result];
                }
                return [3 /*break*/, 3];
            case 2:
                error_18 = _a.sent();
                errorHandler(error_18);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
// **********************8fetch Coupon***************
var fetchCoupon = function (id) { return __awaiter(void 0, void 0, void 0, function () {
    var result, error_19;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, userApi.get("/fetch_coupon/".concat(id))];
            case 1:
                result = _a.sent();
                if (result) {
                    return [2 /*return*/, result];
                }
                return [3 /*break*/, 3];
            case 2:
                error_19 = _a.sent();
                errorHandler(error_19);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
// *********************booking_confirm******************
var BookingConfirm = function (bookingData) { return __awaiter(void 0, void 0, void 0, function () {
    var result, error_20;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, userApi.post("/booking_confirm", bookingData)];
            case 1:
                result = _a.sent();
                return [2 /*return*/, result];
            case 2:
                error_20 = _a.sent();
                errorHandler(error_20);
                throw error_20;
            case 3: return [2 /*return*/];
        }
    });
}); };
//   ************************userId stored in coupon****************
var userIdStoredInCoupon = function (coupon, userId) { return __awaiter(void 0, void 0, void 0, function () {
    var result, error_21;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, userApi.post("/userid_in_coupon/".concat(coupon, "/").concat(userId))];
            case 1:
                result = _a.sent();
                return [2 /*return*/, result];
            case 2:
                error_21 = _a.sent();
                errorHandler(error_21);
                throw error_21;
            case 3: return [2 /*return*/];
        }
    });
}); };
// ****************************Booking Page ***************************
var getBookingHistory = function (userId, page, limit) { return __awaiter(void 0, void 0, void 0, function () {
    var result, error_22;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, userApi.get(userRouter.bookingHistory, {
                        params: {
                            userId: userId,
                            page: page,
                            limit: limit
                        }
                    })];
            case 1:
                result = _a.sent();
                return [2 /*return*/, result];
            case 2:
                error_22 = _a.sent();
                errorHandler(error_22);
                throw error_22;
            case 3: return [2 /*return*/];
        }
    });
}); };
// ****************************booking details of specilf order***************
var specificBookingDetails = function (bookingId) { return __awaiter(void 0, void 0, void 0, function () {
    var result, error_23;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, userApi.get("/details_of_specifc_order/".concat(bookingId))];
            case 1:
                result = _a.sent();
                return [2 /*return*/, result];
            case 2:
                error_23 = _a.sent();
                errorHandler(error_23);
                throw error_23;
            case 3: return [2 /*return*/];
        }
    });
}); };
// ****************************cancel booking by user**********************
var cancelBookingByUser = function (bookingId, userId, amount) { return __awaiter(void 0, void 0, void 0, function () {
    var result, error_24;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, userApi.put('/cancel_booking', null, {
                        params: {
                            bookingId: bookingId,
                            userId: userId,
                            amount: amount,
                        },
                    })];
            case 1:
                result = _a.sent();
                return [2 /*return*/, result];
            case 2:
                error_24 = _a.sent();
                throw error_24;
            case 3: return [2 /*return*/];
        }
    });
}); };
//*****************/ cancelBookong update add amount to waalet***********************
var storeCancelAmtToWallet = function (userId, amount) { return __awaiter(void 0, void 0, void 0, function () {
    var result, error_25;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, userApi.put("/credit_to_wallet", {
                        userId: userId,
                        amount: amount
                    })];
            case 1:
                result = _a.sent();
                return [2 /*return*/, result];
            case 2:
                error_25 = _a.sent();
                errorHandler(error_25);
                throw error_25;
            case 3: return [2 /*return*/];
        }
    });
}); };
// ****************************check booked or not *********************
var checkingBookedOrNot = function (issueDate, returnDate, carId) { return __awaiter(void 0, void 0, void 0, function () {
    var result, error_26;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, userApi.get("/check_booking", {
                        params: {
                            issueDate: issueDate,
                            returnDate: returnDate,
                            carId: carId
                        }
                    })];
            case 1:
                result = _a.sent();
                return [2 /*return*/, result];
            case 2:
                error_26 = _a.sent();
                errorHandler(error_26);
                throw error_26;
            case 3: return [2 /*return*/];
        }
    });
}); };
//   *******************************check Wallet ****************
var checkBalanceUpdateWallet = function (amount, userId) { return __awaiter(void 0, void 0, void 0, function () {
    var result, error_27;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, userApi.put("/check_update_wallet/".concat(userId, "/").concat(amount))];
            case 1:
                result = _a.sent();
                return [2 /*return*/, result];
            case 2:
                error_27 = _a.sent();
                errorHandler(error_27);
                throw error_27;
            case 3: return [2 /*return*/];
        }
    });
}); };
// ********************************get Wallet Page ***********************
var getWalletPage = function (userId, page, limit) { return __awaiter(void 0, void 0, void 0, function () {
    var result, error_28;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, userApi.get(userRouter.getWallet, {
                        params: {
                            userId: userId,
                            page: page,
                            limit: limit
                        }
                    })];
            case 1:
                result = _a.sent();
                return [2 /*return*/, result];
            case 2:
                error_28 = _a.sent();
                errorHandler(error_28);
                throw error_28;
            case 3: return [2 /*return*/];
        }
    });
}); };
// ****************************create review and ratings***************
var createReviewAndRatings = function (reviewData) { return __awaiter(void 0, void 0, void 0, function () {
    var result, error_29;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, userApi.post(userRouter.createReviewRatings, reviewData)];
            case 1:
                result = _a.sent();
                return [2 /*return*/, result.data];
            case 2:
                error_29 = _a.sent();
                errorHandler(error_29);
                throw error_29;
            case 3: return [2 /*return*/];
        }
    });
}); };
// *************************check bookId is exist in review ***********************
var checkBookidInReview = function (bookId) { return __awaiter(void 0, void 0, void 0, function () {
    var result, error_30;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, userApi.get(userRouter.checkBookIdInReview, {
                        params: {
                            bookId: bookId
                        }
                    })];
            case 1:
                result = _a.sent();
                return [2 /*return*/, result];
            case 2:
                error_30 = _a.sent();
                errorHandler(error_30);
                throw error_30;
            case 3: return [2 /*return*/];
        }
    });
}); };
// **********************chat history***********************
var fetchChat = function (userId, providerId) { return __awaiter(void 0, void 0, void 0, function () {
    var result, error_31;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, userApi.get("/chat_history/".concat(userId, "/").concat(providerId))];
            case 1:
                result = _a.sent();
                return [2 /*return*/, result.data];
            case 2:
                error_31 = _a.sent();
                errorHandler(error_31);
                throw error_31;
            case 3: return [2 /*return*/];
        }
    });
}); };
// *****************************search car availabilty*******************
var searchCarAvailabilty = function (issueDate, returnDate) { return __awaiter(void 0, void 0, void 0, function () {
    var result, error_32;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, userApi.get(userRouter.searchCarAvailabilty, {
                        params: {
                            issueDate: issueDate,
                            returnDate: returnDate,
                        },
                    })];
            case 1:
                result = _a.sent();
                return [2 /*return*/, result];
            case 2:
                error_32 = _a.sent();
                errorHandler(error_32);
                throw error_32;
            case 3: return [2 /*return*/];
        }
    });
}); };
export { signup, resend, verifyOtp, loginUser, userLogout, refreshUserAccessToken, fetchCars, carDetail, applyFilters, searchCar, getOffer, checkProfile, saveProfileData, editProfile, checkAddress, saveAddressData, editAddress, fetchCoupon, BookingConfirm, checkOffer, userIdStoredInCoupon, getBookingHistory, specificBookingDetails, cancelBookingByUser, checkingBookedOrNot, checkBalanceUpdateWallet, storeCancelAmtToWallet, getWalletPage, createReviewAndRatings, checkBookidInReview, fetchChat, searchCarAvailabilty };
