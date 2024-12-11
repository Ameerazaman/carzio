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
exports.UserServices = void 0;
const HttpStatusCode_1 = require("../../Constants/HttpStatusCode");
const bcrypt_1 = __importDefault(require("bcrypt"));
const { OK, INTERNAL_SERVER_ERROR, UNAUTHORIZED, BAD_REQUEST } = HttpStatusCode_1.STATUS_CODES;
class UserServices {
    constructor(userRepository, encrypt, createjwt) {
        this.userRepository = userRepository;
        this.encrypt = encrypt;
        this.createjwt = createjwt;
    }
    //    user get by id
    userGetById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let user = yield this.userRepository.getUserById(id);
                if (!user) {
                    return {
                        status: UNAUTHORIZED,
                        data: {
                            success: false,
                            message: 'User not found',
                        }
                    };
                }
                const newAccessToken = this.createjwt.generateToken(user.id);
                return {
                    status: OK,
                    data: {
                        success: true,
                        userId: user.id,
                        token: newAccessToken,
                        data: user
                    }
                };
            }
            catch (error) {
                console.log(error);
                return null;
            }
        });
    }
    // *********************************Signup logic***************************
    emailExistCheck(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("check services");
                const data = yield this.userRepository.emailExistCheck(email);
                console.log(data, "data");
                return data;
            }
            catch (error) {
                console.log(error);
                return null;
            }
        });
    }
    // ********************************change password******************************
    changePassword(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const hashedPassword = yield this.encrypt.hashPassword(password);
                return yield this.userRepository.changePassword(email, hashedPassword);
            }
            catch (error) {
                return null;
            }
        });
    }
    //*********************************/ OTP creation logic**************************
    createOtp(email, otp) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.userRepository.createOtp(otp, email);
            }
            catch (error) {
                return null;
            }
        });
    }
    //    ***********************************Verify otp******************************
    verifyOtp(email, otp) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.userRepository.findOtp(email, otp);
            }
            catch (error) {
                return null;
            }
        });
    }
    // *************************************Delete Otp***************************
    deleteOtp(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.userRepository.deleteOtp(email);
            }
            catch (error) {
                return null;
            }
        });
    }
    // **********************************update Otp**************************
    updateOtp(email, otp) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.userRepository.updateOtp(email, otp);
            }
            catch (error) {
                return null;
            }
        });
    }
    // ********************************Save user logic************************
    saveUser(userData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                userData.password = yield this.encrypt.hashPassword(userData.password);
                const user = yield this.userRepository.saveUser(userData);
                return {
                    status: OK,
                    data: {
                        success: true,
                    }
                };
            }
            catch (error) {
                console.error("Error saving user:", error.message);
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
    // ******************************user Sign in*****************************
    userSignIn(userData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield this.userRepository.emailExistCheck(userData.email);
                console.log(user, "user");
                if (!user) {
                    return {
                        status: UNAUTHORIZED,
                        data: {
                            success: false,
                            message: 'User not found',
                        }
                    };
                }
                if (user.isBlocked) {
                    return {
                        status: UNAUTHORIZED,
                        data: {
                            success: false,
                            message: 'your account has been blocked by admin'
                        }
                    };
                }
                ;
                // Validate the password
                const isPasswordValid = yield bcrypt_1.default.compare(userData.password, user.password);
                if (!isPasswordValid) {
                    return {
                        status: BAD_REQUEST,
                        data: {
                            success: false,
                            message: 'Incorrect Password, Try again',
                        }
                    };
                }
                const token = this.createjwt.generateToken(user.id);
                const refreshToken = this.createjwt.generateRefreshToken(user.id);
                return {
                    status: OK,
                    data: {
                        success: true,
                        userId: user.id,
                        token: token,
                        data: user,
                        refreshToken,
                    }
                };
            }
            catch (error) {
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
    // *****************************************fetch cars for card****************************
    fetchCars(page, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const carData = yield this.userRepository.fetchCars(page, limit);
                const totalPage = yield this.userRepository.countsOfCar();
                if (carData && carData.length > 0 && totalPage) {
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
                            message: 'Car  is blocked or not found',
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
    // ********************************car Details ********************
    carDetails(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const carDetails = yield this.userRepository.carDetails(id);
                if (!carDetails) {
                    return {
                        status: 400,
                        data: {
                            success: false,
                            message: "No car found with the given ID.",
                        },
                    };
                }
                const { averageRating, reviews } = yield this.userRepository.getReviewAndRatings(id);
                return {
                    status: 200,
                    data: {
                        success: true,
                        data: carDetails,
                        ratings: averageRating !== null && averageRating !== void 0 ? averageRating : 0,
                        review: reviews.length > 0 ? reviews : [],
                    },
                };
            }
            catch (error) {
                return null;
            }
        });
    }
    // ******************************car filter*******************
    carFilter(engineType, fuelType, sortPrice) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.userRepository.carFilter(engineType, fuelType, sortPrice);
            }
            catch (error) {
                return null;
            }
        });
    }
    // ******************************search Car****************************
    searchCar(searchQuery) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.userRepository.searchCar(searchQuery);
            }
            catch (error) {
                return null;
            }
        });
    }
    // *******************fetch User*******************8
    fetchOffer() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const offerData = yield this.userRepository.fetchOffer();
                if (offerData && offerData.length > 0) {
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
    //   ***********************************check profile****************************
    checkProfile(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.userRepository.checkProfile(id);
            }
            catch (error) {
                return null;
            }
        });
    }
    // ********************************************save Profile******************************
    saveProfile(profileData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const provider = yield this.userRepository.saveProfile(profileData);
                return {
                    status: 200,
                    data: {
                        success: true,
                        message: 'Profile saved successfully',
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
    // *********************************Edit profile**************************
    editProfile(profileData, id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const provider = yield this.userRepository.editProfile(profileData, id);
                return {
                    status: 200,
                    data: {
                        success: true,
                        message: 'Profile Edit Successfully',
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
    //   ***********************************check profile****************************
    checkAddress(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.userRepository.checkAddress(id);
            }
            catch (error) {
                return null;
            }
        });
    }
    // ********************************************save Address******************************
    saveAddress(addressData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const provider = yield this.userRepository.saveAddress(addressData);
                return {
                    status: 200,
                    data: {
                        success: true,
                        message: 'Address saved successfully'
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
    // *********************************Edit Address**************************
    editAddress(addressData, id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const provider = yield this.userRepository.editAddress(addressData, id);
                return {
                    status: 200,
                    data: {
                        success: true,
                        message: 'Address Edit Successfully',
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
    // *******************88fetch Coupon*******************8
    fetchCoupon(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const couponData = yield this.userRepository.fetchCoupon(userId);
                if (couponData && couponData.length > 0) {
                    return {
                        status: OK,
                        data: {
                            success: true,
                            data: couponData,
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
    //   ******************************fetch offeer for booking******************8
    checkOfferForBookiing(carName) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const offerData = yield this.userRepository.checkOfferForBooking(carName);
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
                            message: 'Offers are not available',
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
    // ********************************booking confirm************************
    saveBookingData(bookingData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const savedBookingData = yield this.userRepository.saveBookingData(bookingData);
                if (savedBookingData) {
                    return {
                        status: OK,
                        data: {
                            success: true,
                            data: savedBookingData,
                        },
                    };
                }
                else {
                    return {
                        status: BAD_REQUEST,
                        data: {
                            success: false,
                            message: 'Offers are not available',
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
    // **********************************updated userId i coupon*****************
    userIdInCoupon(coupon, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const updateCoupon = yield this.userRepository.userIdInCoupon(coupon, userId);
                if (updateCoupon) {
                    return {
                        status: OK,
                        data: {
                            success: true,
                            data: updateCoupon,
                        },
                    };
                }
                else {
                    return {
                        status: BAD_REQUEST,
                        data: {
                            success: false,
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
    // ************************* booking page************************
    getBookingHistory(userId, page, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const bookingHistory = yield this.userRepository.getBookingHistory(userId, page, limit);
                const historyDocuments = yield this.userRepository.countBookingHistory(userId);
                if (bookingHistory && historyDocuments) {
                    return {
                        status: OK,
                        data: {
                            success: true,
                            data: bookingHistory,
                            page: page,
                            totalPage: (_a = Math.ceil(historyDocuments / limit)) !== null && _a !== void 0 ? _a : 1
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
                const bookingHistory = yield this.userRepository.specificBookingDetails(bookingId);
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
    cancelBookingByUser(bookingId, userId, amount) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const updateStatus = yield this.userRepository.cancelBookingByUser(bookingId);
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
                            message: "Booking cancel not working"
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
    // *******************************update wallet after cancel the booking *****************
    creditToWallet(userId, amount) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const updateWallet = yield this.userRepository.creditToWallet(userId, amount);
                if (updateWallet) {
                    return {
                        status: OK,
                        data: {
                            success: true,
                            data: updateWallet,
                        },
                    };
                }
                else {
                    return {
                        status: BAD_REQUEST,
                        data: {
                            success: false,
                            message: "Booking cancel not working"
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
    // ***************************check booked or not****************
    checkBookedOrNot(issueDate, returnDate, carId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const checkBooking = yield this.userRepository.checkBookedOrNot(carId);
                if (!checkBooking) {
                    return {
                        status: BAD_REQUEST,
                        data: {
                            success: false,
                            message: "No booking data available.",
                        },
                    };
                }
                const issueDateObj = new Date(issueDate);
                const returnDateObj = new Date(returnDate);
                const isBooked = checkBooking.some(booking => {
                    const bookingIssueDate = new Date(booking.issueDate);
                    const bookingReturnDate = new Date(booking.returnDate);
                    return ((issueDateObj <= bookingReturnDate && returnDateObj >= bookingIssueDate));
                });
                if (isBooked) {
                    return {
                        status: BAD_REQUEST,
                        data: {
                            success: false,
                            message: "The selected booking dates are unavailable as they overlap with an existing reservation. Please choose different dates.",
                        },
                    };
                }
                return {
                    status: OK,
                    data: {
                        success: true,
                        message: "The selected booking dates are available.",
                        data: checkBooking,
                    },
                };
            }
            catch (error) {
                return {
                    status: INTERNAL_SERVER_ERROR,
                    data: {
                        success: false,
                        message: "Internal server error.",
                    },
                };
            }
        });
    }
    // *************************check wallet and update ****************
    checkWalletAndUpdate(userId, amount) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let result = yield this.userRepository.checkBalanceAndUpdateWallet(userId, amount);
                if (result) {
                    return {
                        status: OK,
                        data: {
                            success: true,
                            message: "Your booking amount is debited from your wallet",
                            data: result,
                        },
                    };
                }
                else {
                    return {
                        status: BAD_REQUEST,
                        data: {
                            success: false,
                            message: "Insufficent blance for booking,Please select another Payment option"
                        },
                    };
                }
            }
            catch (error) {
                return {
                    status: INTERNAL_SERVER_ERROR,
                    data: {
                        success: false,
                        message: "Internal server error.",
                    },
                };
            }
        });
    }
    // ************************* walle page************************
    getWalletPage(userId, page, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            try {
                const walletPage = yield this.userRepository.getWalletPage(userId, page, limit);
                const walletDocuments = yield this.userRepository.countWalletDocuments(userId);
                if (walletPage && walletDocuments) {
                    const lastTransaction = walletPage[walletPage.length - 1];
                    let totalPrice = (_a = lastTransaction === null || lastTransaction === void 0 ? void 0 : lastTransaction.TotalAmt) !== null && _a !== void 0 ? _a : 0;
                    return {
                        status: OK,
                        data: {
                            success: true,
                            data: walletPage,
                            page: page,
                            totalPage: (_b = Math.ceil(walletDocuments / limit)) !== null && _b !== void 0 ? _b : 1,
                            totalAmount: totalPrice,
                        },
                    };
                }
                else {
                    return {
                        status: BAD_REQUEST,
                        data: {
                            success: false,
                            message: "Booking history is not found",
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
    // **************************create Review and ratings*********************
    createReviewData(reviewData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const reviewDocument = yield this.userRepository.createReviewData(reviewData);
                if (reviewDocument) {
                    return {
                        status: OK,
                        data: {
                            success: true,
                            data: reviewDocument,
                            message: "Review added successfully.",
                        },
                    };
                }
                else {
                    return {
                        status: BAD_REQUEST,
                        data: {
                            success: false,
                            message: "Failed to add review. Please check the provided data and try again.",
                        },
                    };
                }
            }
            catch (error) {
                return {
                    status: INTERNAL_SERVER_ERROR,
                    data: {
                        success: false,
                        message: "An unexpected error occurred while processing your request. Please try again later.",
                    },
                };
            }
        });
    }
    // **********************************check booki Id in reviewer***********************
    checkBookidInReview(bookId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const reviewDocument = yield this.userRepository.checkBookidInReview(bookId);
                if (reviewDocument) {
                    return {
                        status: OK,
                        data: {
                            success: true,
                            data: reviewDocument,
                            message: "Review added successfully.",
                        },
                    };
                }
                else {
                    return {
                        status: BAD_REQUEST,
                        data: {
                            success: false,
                            message: "Failed to add review. Please check the provided data and try again.",
                        },
                    };
                }
            }
            catch (error) {
                return {
                    status: INTERNAL_SERVER_ERROR,
                    data: {
                        success: false,
                        message: "An unexpected error occurred while processing your request. Please try again later.",
                    },
                };
            }
        });
    }
    // ********************************fetch chat history***********************
    fetchChatHistory(userId, providerId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const reviewDocument = yield this.userRepository.fetchChatHistory(userId, providerId);
                if (reviewDocument) {
                    return {
                        status: OK,
                        data: {
                            success: true,
                            data: reviewDocument,
                        },
                    };
                }
                else {
                    return {
                        status: BAD_REQUEST,
                        data: {
                            success: false,
                            message: "Failed to fetch chat history",
                        },
                    };
                }
            }
            catch (error) {
                return {
                    status: INTERNAL_SERVER_ERROR,
                    data: {
                        success: false,
                        message: "An unexpected error occurred while processing your request. Please try again later.",
                    },
                };
            }
        });
    }
    // ******************************check car availabilty****************************
    searchCarAvailability(issueDate, returnDate) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const carData = yield this.userRepository.searchCarAvailability(issueDate, returnDate);
                if (carData) {
                    return {
                        status: OK,
                        data: {
                            success: true,
                            data: carData,
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
}
exports.UserServices = UserServices;
