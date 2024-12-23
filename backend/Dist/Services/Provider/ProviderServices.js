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
exports.ProviderServices = void 0;
const http_status_codes_1 = require("http-status-codes");
const { BAD_REQUEST, OK, INTERNAL_SERVER_ERROR, UNAUTHORIZED } = http_status_codes_1.StatusCodes;
const bcrypt_1 = __importDefault(require("bcrypt"));
const Uploads_1 = require("../../Utlis/Uploads");
class ProviderServices {
    constructor(providerRepostry, profileRepository, otpRepository, carRepository, carNotificationRepository, bookingRepository, chatRepository, encrypt, createjwt) {
        this.providerRepostry = providerRepostry;
        this.profileRepository = profileRepository;
        this.otpRepository = otpRepository;
        this.carRepository = carRepository;
        this.carNotificationRepository = carNotificationRepository;
        this.bookingRepository = bookingRepository;
        this.chatRepository = chatRepository;
        this.encrypt = encrypt;
        this.createjwt = createjwt;
    }
    // refresh access token
    providerGetById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let provider = yield this.providerRepostry.getProviderById(id);
                if (!provider) {
                    return {
                        status: UNAUTHORIZED,
                        data: {
                            success: false,
                            message: 'User not found',
                        }
                    };
                }
                const newAccessToken = this.createjwt.generateToken(provider.id);
                return {
                    status: OK,
                    data: {
                        success: true,
                        providerId: provider.id,
                        token: newAccessToken,
                        data: provider
                    }
                };
            }
            catch (error) {
                return null;
            }
        });
    }
    emailExistCheck(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.providerRepostry.emailExistCheck(email);
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
                return yield this.providerRepostry.changePassword(email, hashedPassword);
            }
            catch (error) {
                return null;
            }
        });
    }
    //********************************8 */ OTP creation logic**************************
    createOtp(email, otp) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.otpRepository.createOtp(otp, email);
            }
            catch (error) {
                return null;
            }
        });
    }
    // //    ***********************************Verify otp******************************
    verifyOtp(email, otp) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.otpRepository.findOtp(email, otp);
            }
            catch (error) {
                return null;
            }
        });
    }
    // // *************************************Delete Otp***************************
    deleteOtp(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.otpRepository.deleteOtp(email);
            }
            catch (error) {
                return null;
            }
        });
    }
    // // **********************************update Otp**************************
    updateOtp(email, otp) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.otpRepository.updateOtp(email, otp);
            }
            catch (error) {
                return null;
            }
        });
    }
    // ******************************************save Provider*****************************
    saveProvider(providerData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                providerData.password = yield this.encrypt.hashPassword(providerData.password);
                const provider = yield this.providerRepostry.saveProvider(providerData);
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
    // ***************************************provider SignIn****************************
    providerSignIn(providerData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const provider = yield this.providerRepostry.emailExistCheck(providerData.email);
                if (!provider) {
                    return {
                        status: UNAUTHORIZED,
                        data: {
                            success: false,
                            message: 'provider not found',
                        }
                    };
                }
                if (provider.isBlocked) {
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
                const isPasswordValid = yield bcrypt_1.default.compare(providerData.password, provider.password);
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
                        message: 'Success',
                        providerId: provider.id,
                        token: token,
                        data: provider,
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
    // ************************************check provider Address********************
    checkProviderAddress(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.profileRepository.checkProviderAddress(id);
            }
            catch (error) {
                return null;
            }
        });
    }
    // ********************************************save Profile******************************
    saveProfile(providerData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const provider = yield this.profileRepository.saveProfile(providerData);
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
    editProfile(providerData, id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const provider = yield this.profileRepository.editProfile(providerData, id);
                return {
                    status: 200,
                    data: {
                        success: true,
                        message: 'Profile edit successfully',
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
    // **************************************update car Image***********************
    updateProfileImage(file, id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield (0, Uploads_1.uploadImageToCloudinary)(file);
                if (!result.success || !result.results || result.results.length === 0) {
                    return {
                        status: 400,
                        data: {
                            success: false,
                            message: 'Image upload failed: No valid results returned',
                        },
                    };
                }
                const imageUrl = result.results[0].url;
                if (!imageUrl) {
                    return {
                        status: 400,
                        data: {
                            success: false,
                            message: 'Image upload failed: No URL returned',
                        },
                    };
                }
                const provider = yield this.profileRepository.updateprofileImage(imageUrl, id);
                if (!provider) {
                    return {
                        status: 404,
                        data: {
                            success: false,
                            message: 'Provider not found or update failed',
                        },
                    };
                }
                return {
                    status: 200,
                    data: {
                        success: true,
                        message: 'Profile image updated successfully',
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
    // **********************************add car details***********************
    addCarDetails(files, carData) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                // Check if the car already exists
                const carExist = yield this.carRepository.checkCarExist(carData);
                if (carExist) {
                    return {
                        status: 400,
                        data: {
                            success: false,
                            message: "Car already exists",
                        },
                    };
                }
                // Upload images to Cloudinary
                const result = yield (0, Uploads_1.uploadImageToCloudinary)(files);
                if (!result.success) {
                    return {
                        status: 400,
                        data: {
                            success: false,
                            message: "Image upload failed",
                        },
                    };
                }
                // Extract image URLs
                const images = ((_a = result === null || result === void 0 ? void 0 : result.results) === null || _a === void 0 ? void 0 : _a.map((obj) => obj === null || obj === void 0 ? void 0 : obj.url)) || [];
                carData.images = images;
                // Save car details in the repository
                const saveCar = yield this.carNotificationRepository.addCarDetails(carData);
                if (saveCar) {
                    return {
                        status: 200,
                        data: {
                            success: true,
                            message: "Car data saved successfully",
                            data: saveCar,
                        },
                    };
                }
                // Handle unexpected save failure
                return {
                    status: 500,
                    data: {
                        success: false,
                        message: "Failed to save car data",
                    },
                };
            }
            catch (error) {
                // Handle unexpected errors
                return {
                    status: 500,
                    data: {
                        success: false,
                        message: "Internal server error",
                    },
                };
            }
        });
    }
    // **************************fetch car for car managementa****************************
    fetchCars(providerId, page, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const carData = yield this.carRepository.fetchCarsForProvider(providerId, page, limit);
                const totalPage = yield this.carRepository.countCarsForProvider(providerId);
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
                return yield this.carRepository.updateStatusCarForProvider(id);
            }
            catch (error) {
                return null;
            }
        });
    }
    // *************************fetch car for edit in  car mgt*********************
    editCar(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.carRepository.editCarForProvider(id);
            }
            catch (error) {
                return null;
            }
        });
    }
    // ***********************************update car in edit management************************
    updateCar(carData, id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const provider = yield this.carRepository.updateCarForProvider(carData, id);
                return {
                    status: 200,
                    data: {
                        success: true,
                        message: 'car update successfully',
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
    // ***********************update Car Image*************************88
    updateCarImage(files, id) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const result = yield (0, Uploads_1.uploadImageToCloudinary)(files);
                if (!result.success) {
                    return {
                        status: 400,
                        data: {
                            success: false,
                            message: 'Image upload failed',
                        },
                    };
                }
                const images = ((_a = result === null || result === void 0 ? void 0 : result.results) === null || _a === void 0 ? void 0 : _a.map((obj) => obj === null || obj === void 0 ? void 0 : obj.url)) || [];
                const provider = yield this.carRepository.updateCarImageForProvider(images, id);
                return {
                    status: 200,
                    data: {
                        success: true,
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
    // ************************* booking page************************
    getBookingHistory(providerId, page, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const bookingHistory = yield this.bookingRepository.getBookingHistoryForProvider(providerId, page, limit);
                const historyDocuments = yield this.bookingRepository.countBookingForProvider(providerId);
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
                const bookingHistory = yield this.bookingRepository.specificBookingDetailsForProvider(bookingId);
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
                            message: "Booking history is not retrieved"
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
                const updateStatus = yield this.bookingRepository.updateStatusOfBookingForProvider(bookingId, status);
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
    // ***********************************fetch users chat by provider********************
    fetchUsersChat(providerId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const usersChat = yield this.chatRepository.fetchUsersChat(providerId);
                if (usersChat) {
                    return {
                        status: OK,
                        data: {
                            success: true,
                            data: usersChat,
                        },
                    };
                }
                else {
                    return {
                        status: BAD_REQUEST,
                        data: {
                            success: false,
                            message: "No chat history found for the given receiver ID.",
                        },
                    };
                }
            }
            catch (error) {
                return {
                    status: INTERNAL_SERVER_ERROR,
                    data: {
                        success: false,
                        message: "Internal server error occurred while fetching chat history.",
                    },
                };
            }
        });
    }
    // ********************************fetch chat history***********************
    fetchChatHistory(userId, providerId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const reviewDocument = yield this.chatRepository.fetchChatHistory(userId, providerId);
                if (reviewDocument) {
                    return {
                        status: OK,
                        data: {
                            success: true,
                            data: reviewDocument,
                            message: "Fetch Chat History successfully",
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
    // *****************************get dashboard const data******************88
    getConstDashboardData(providerId) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c;
            try {
                const totalCars = (yield this.carRepository.countCarsForProvider(providerId)) || 0;
                const totalBookingCount = (yield this.bookingRepository.CountBookingCarForProvider(providerId)) || [];
                const revenue = (_a = (yield this.bookingRepository.totalRevenueForProvider(providerId))) !== null && _a !== void 0 ? _a : 0;
                const totalBooking = (_b = (yield this.bookingRepository.countBookingForProvider(providerId))) !== null && _b !== void 0 ? _b : 0;
                const revenueByCar = (_c = (yield this.bookingRepository.revenueByCarForProvider(providerId))) !== null && _c !== void 0 ? _c : 0;
                return {
                    status: 200,
                    data: {
                        success: true,
                        data: {
                            totalCars,
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
    fetchSalesReport(page, limit, providerId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const salesReport = yield this.bookingRepository.fetchSalesReportForProvider(page, limit, providerId);
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
exports.ProviderServices = ProviderServices;
