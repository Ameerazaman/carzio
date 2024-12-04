import { UserInterface } from '../../Interface/UserInterface';
import { UserRepository } from '../../Repostries/User/UserRepostries';
import { UserAuthResponse } from '../../Interface/AuthServices/UserAuthServices';
import Encrypt from '../../Utlis/ComparedPassword';
import { CreateJWT } from '../../Utlis/GenerateToken';
import { STATUS_CODES } from '../../Constants/HttpStatusCode';
import bcrypt from 'bcrypt';
import { CarAuthResponse } from '../../Interface/AuthServices/CarAuthInterface';
import { CarDataInterface } from '../../Interface/CarInterface';
import { OfferAuthResponse } from '../../Interface/AuthServices/OfferAuthInterface';
import { ProfileInterface } from '../../Interface/Profileinterface';
import { ProfileAuthResponse } from '../../Interface/AuthServices/ProfileAuthInterface';
import { UserAddressInterface } from '../../Interface/UserAddressInterface';
import { UserAddressAuthResponse } from '../../Interface/AuthServices/UserAddressAuthResponse';
import { CouponAuthResponse } from '../../Interface/AuthServices/CouponAuthInterface';
import { BookingInterface } from '../../Interface/BookingInterface';
import { BookingAuthResponse } from '../../Interface/AuthServices/BookingAuthInterface';
import { BookingDateAuthInterface, BookingDateInterface } from '../../Interface/AuthServices/BookingDateAuthInterface';
import { WalletInterface } from '../../Interface/WalletInterface';
import { WalletAuthInterface } from '../../Interface/AuthServices/WalletAuthInterface';
import { useDeprecatedInvertedScale } from 'framer-motion';
import { ReviewDataInterface } from '../../Interface/ReviewInterface';
import { ReviewAuthInterface } from '../../Interface/AuthServices/ReviewAuthResponse';
import { chatAuthInterface } from '../../Interface/AuthServices/ChatAuthResponse';
import { OtpDocument } from '../../Model/User/OtpModel';




const { OK, INTERNAL_SERVER_ERROR, UNAUTHORIZED, BAD_REQUEST } = STATUS_CODES;

export class UserServices {
    constructor(
        private userRepository: UserRepository,
        private encrypt: Encrypt,
        private createjwt: CreateJWT
    ) { }
    //    user get by id
    async userGetById(id: string): Promise<UserAuthResponse | null> {
        try {
            let user = await this.userRepository.getUserById(id)
            if (!user) {

                return {
                    status: UNAUTHORIZED,
                    data: {
                        success: false,
                        message: 'User not found',
                    }
                };
            }
            const newAccessToken = this.createjwt.generateToken(user.id!);
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
            console.log(error as Error);
            return null;
        }

    }
    // *********************************Signup logic***************************

    async emailExistCheck(email: string): Promise<UserInterface | null> {
        try {
            return await this.userRepository.emailExistCheck(email);
        } catch (error) {
            console.log(error as Error);
            return null;
        }

    }

    // ********************************change password******************************

    async changePassword(email: string, password: string): Promise<UserInterface | null> {
        try {
            const hashedPassword = await this.encrypt.hashPassword(password);
            return await this.userRepository.changePassword(email, hashedPassword);
        } catch (error) {
            return null;
        }
    }

    //*********************************/ OTP creation logic**************************
    async createOtp(email: string, otp: number): Promise<OtpDocument | null> {
        try {
            return await this.userRepository.createOtp(otp, email);
        } catch (error) {
            return null;
        }
    }
    //    ***********************************Verify otp******************************
    async verifyOtp(email: string, otp: string): Promise<OtpDocument | null> {
        try {
            return await this.userRepository.findOtp(email, otp)
        }
        catch (error) {

            return null;
        }
    }

    // ********************************Save user logic************************

    async saveUser(userData: UserInterface): Promise<UserAuthResponse | undefined> {
        try {
            userData.password = await this.encrypt.hashPassword(userData.password);

            const user = await this.userRepository.saveUser(userData);
            return {
                status: OK,
                data: {
                    success: true,

                }
            };


        } catch (error) {
            console.error("Error saving user:", (error as Error).message);
            return {
                status: INTERNAL_SERVER_ERROR,
                data: {
                    success: false,
                    message: 'Internal server error'
                }
            };
        }
    }

    // ******************************user Sign in*****************************

    async userSignIn(userData: UserInterface): Promise<UserAuthResponse | undefined> {
        try {
            const user = await this.userRepository.emailPasswordCheck(userData.email);

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
                }
            };
            // Validate the password
            const isPasswordValid = await bcrypt.compare(userData.password, user.password);
            if (!isPasswordValid) {
                return {
                    status: BAD_REQUEST,
                    data: {
                        success: false,
                        message: 'Incorrect Password, Try again',
                    }
                };
            }

            const token = this.createjwt.generateToken(user.id!);
            const refreshToken = this.createjwt.generateRefreshToken(user.id!);
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

        } catch (error) {

            return {
                status: INTERNAL_SERVER_ERROR,
                data: {
                    success: false,
                    message: 'Internal server error'
                }
            };
        }
    }


    // *****************************************fetch cars for card****************************
    async fetchCars(page: number, limit: number): Promise<CarAuthResponse | undefined> {
        try {
            const carData = await this.userRepository.fetchCars(page, limit);
            const totalPage = await this.userRepository.countsOfCar()
            if (carData && carData.length > 0 && totalPage) {
                return {
                    status: OK,
                    data: {
                        success: true,
                        data: carData,
                        page: page,
                        totalPage: Math.ceil(totalPage / limit) ?? 1
                    },
                };
            } else {
                return {
                    status: BAD_REQUEST,
                    data: {
                        success: false,
                        message: 'No cars found',
                    },
                };
            }
        } catch (error) {
            return {
                status: INTERNAL_SERVER_ERROR,
                data: {

                    success: false,
                    message: 'Internal server error',
                },
            };
        }
    }
    // ********************************car Details ********************
    async carDetails(id: string): Promise<CarAuthResponse | null> {
        try {

            const carDetails = await this.userRepository.carDetails(id);

            if (!carDetails) {
                return {
                    status: 400,
                    data: {
                        success: false,
                        message: "No car found with the given ID.",
                    },
                };
            }

            const { averageRating, reviews } = await this.userRepository.getReviewAndRatings(id);

            return {
                status: 200,
                data: {
                    success: true,
                    data: carDetails,
                    ratings: averageRating ?? 0,
                    review: reviews.length > 0 ? reviews : [],
                },
            };
        } catch (error) {
            return null;
        }
    }

    // ******************************car filter*******************
    async carFilter(engineType?: string[], fuelType?: string[], sortPrice?: string): Promise<CarDataInterface[] | null> {
        try {
            return await this.userRepository.carFilter(engineType, fuelType, sortPrice);
        } catch (error) {

            return null;
        }
    }
    // ******************************search Car****************************
    async searchCar(searchQuery: string): Promise<CarDataInterface[] | null> {
        try {
            return await this.userRepository.searchCar(searchQuery)
        }
        catch (error) {

            return null;
        }
    }

    // *******************fetch User*******************8
    async fetchOffer(): Promise<OfferAuthResponse | undefined> {
        try {
            const offerData = await this.userRepository.fetchOffer();

            if (offerData && offerData.length > 0) {
                return {
                    status: OK,
                    data: {
                        success: true,
                        data: offerData,
                    },
                };
            } else {
                return {
                    status: BAD_REQUEST,
                    data: {
                        success: false,
                        message: 'offers are not found',
                    },
                };
            }
        } catch (error) {

            return {
                status: INTERNAL_SERVER_ERROR,
                data: {

                    success: false,
                    message: 'Internal server error',
                },
            };
        }
    }
    //   ***********************************check profile****************************
    async checkProfile(id: string): Promise<ProfileInterface | null> {
        try {
            return await this.userRepository.checkProfile(id);
        } catch (error) {
            return null;
        }
    }

    // ********************************************save Profile******************************

    async saveProfile(profileData: ProfileInterface): Promise<ProfileAuthResponse | undefined> {
        try {

            const provider = await this.userRepository.saveProfile(profileData);
            return {
                status: 200,
                data: {
                    success: true,
                    message: 'Profile saved successfully',
                },
            };

        } catch (error) {
            return {
                status: 500,
                data: {
                    success: false,
                    message: 'Internal server error',
                },
            };
        }
    }

    // *********************************Edit profile**************************
    async editProfile(profileData: ProfileInterface, id: string): Promise<ProfileAuthResponse | undefined> {
        try {
            const provider = await this.userRepository.editProfile(profileData, id);
            return {
                status: 200,
                data: {
                    success: true,
                    message: 'Profile Edit Successfully',
                },
            };

        } catch (error) {

            return {
                status: 500,
                data: {
                    success: false,
                    message: 'Internal server error',
                },
            };
        }
    }
    //   ***********************************check profile****************************
    async checkAddress(id: string): Promise<UserAddressInterface | null> {
        try {
            return await this.userRepository.checkAddress(id);
        } catch (error) {

            return null;
        }
    }
    // ********************************************save Address******************************

    async saveAddress(addressData: UserAddressInterface): Promise<UserAddressAuthResponse | undefined> {
        try {

            const provider = await this.userRepository.saveAddress(addressData);

            return {
                status: 200,
                data: {
                    success: true,
                    message: 'Address saved successfully'
                },
            };

        } catch (error) {

            return {
                status: 500,
                data: {
                    success: false,
                    message: 'Internal server error',
                },
            };
        }
    }

    // *********************************Edit Address**************************
    async editAddress(addressData: UserAddressInterface, id: string): Promise<UserAddressAuthResponse | undefined> {
        try {

            const provider = await this.userRepository.editAddress(addressData, id);

            return {
                status: 200,
                data: {
                    success: true,
                    message: 'Address Edit Successfully',
                },
            };

        } catch (error) {
            return {
                status: 500,
                data: {
                    success: false,
                    message: 'Internal server error',
                },
            };
        }
    }

    // *******************88fetch Coupon*******************8
    async fetchCoupon(userId: string): Promise<CouponAuthResponse | undefined> {
        try {
            const couponData = await this.userRepository.fetchCoupon(userId);

            if (couponData && couponData.length > 0) {
                return {
                    status: OK,
                    data: {
                        success: true,
                        data: couponData,
                    },
                };
            } else {
                return {
                    status: BAD_REQUEST,
                    data: {
                        success: false,
                        message: 'coupons are not found',
                    },
                };
            }
        } catch (error) {
            return {
                status: INTERNAL_SERVER_ERROR,
                data: {

                    success: false,
                    message: 'Internal server error',
                },
            };
        }
    }

    //   ******************************fetch offeer for booking******************8

    async checkOfferForBookiing(carName: string): Promise<OfferAuthResponse | undefined> {
        try {
            const offerData = await this.userRepository.checkOfferForBooking(carName);
            if (offerData) {
                return {
                    status: OK,
                    data: {
                        success: true,
                        data: offerData,
                    },
                };
            } else {
                return {
                    status: BAD_REQUEST,
                    data: {
                        success: false,
                        message: 'Offers are not available',
                    },
                };
            }
        } catch (error) {
            return {
                status: INTERNAL_SERVER_ERROR,
                data: {

                    success: false,
                    message: 'Internal server error',
                },
            };
        }
    }

    // ********************************booking confirm************************

    async saveBookingData(bookingData: BookingInterface): Promise<BookingAuthResponse | undefined> {
        try {

            const savedBookingData = await this.userRepository.saveBookingData(bookingData);

            if (savedBookingData) {
                return {
                    status: OK,
                    data: {
                        success: true,
                        data: savedBookingData,
                    },
                };
            } else {
                return {
                    status: BAD_REQUEST,
                    data: {
                        success: false,
                        message: 'Offers are not available',
                    },
                };
            }
        } catch (error) {

            return {
                status: INTERNAL_SERVER_ERROR,
                data: {
                    success: false,
                    message: 'Internal server error',
                },
            };
        }
    }
    // **********************************updated userId i coupon*****************
    async userIdInCoupon(coupon: string, userId: string): Promise<CouponAuthResponse | undefined> {
        try {
            const updateCoupon = await this.userRepository.userIdInCoupon(coupon, userId);

            if (updateCoupon) {
                return {
                    status: OK,
                    data: {
                        success: true,
                        data: updateCoupon,
                    },
                };
            } else {
                return {
                    status: BAD_REQUEST,
                    data: {
                        success: false,
                    },
                };
            }
        } catch (error) {

            return {
                status: INTERNAL_SERVER_ERROR,
                data: {
                    success: false,
                    message: 'Internal server error',
                },
            };
        }
    }

    // ************************* booking page************************

    async getBookingHistory(userId: string, page: number, limit: number): Promise<BookingAuthResponse | undefined> {
        try {

            const bookingHistory = await this.userRepository.getBookingHistory(userId, page, limit);

            const historyDocuments = await this.userRepository.countBookingHistory(userId)

            if (bookingHistory && historyDocuments) {
                return {
                    status: OK,
                    data: {
                        success: true,
                        data: bookingHistory,
                        page: page,
                        totalPage: Math.ceil(historyDocuments / limit) ?? 1
                    },
                };
            } else {
                return {
                    status: BAD_REQUEST,
                    data: {
                        success: false,
                        message: "Booking history is not get"
                    },
                };
            }
        } catch (error) {

            return {
                status: INTERNAL_SERVER_ERROR,
                data: {
                    success: false,
                    message: 'Internal server error',
                },
            };
        }
    }
    // ************************* specif booking details************************

    async specificBookingDetails(bookingId: string): Promise<BookingAuthResponse | undefined> {
        try {

            const bookingHistory = await this.userRepository.specificBookingDetails(bookingId);
            if (bookingHistory) {
                return {
                    status: OK,
                    data: {
                        success: true,
                        data: bookingHistory,
                    },
                };
            } else {
                return {
                    status: BAD_REQUEST,
                    data: {
                        success: false,
                        message: "Booking history is not get"
                    },
                };
            }
        } catch (error) {

            return {
                status: INTERNAL_SERVER_ERROR,
                data: {
                    success: false,
                    message: 'Internal server error',
                },
            };
        }
    }

    // *******************************update status for booking*****************

    async cancelBookingByUser(bookingId: string, userId: string, amount: number): Promise<BookingAuthResponse | undefined> {
        try {

            const updateStatus = await this.userRepository.cancelBookingByUser(bookingId);

            if (updateStatus) {
                return {
                    status: OK,
                    data: {
                        success: true,
                        data: updateStatus,
                    },
                };
            } else {
                return {
                    status: BAD_REQUEST,
                    data: {
                        success: false,
                        message: "Booking cancel not working"
                    },
                };
            }
        } catch (error) {

            return {
                status: INTERNAL_SERVER_ERROR,
                data: {
                    success: false,
                    message: 'Internal server error',
                },
            };
        }
    }
    // *******************************update wallet after cancel the booking *****************

    async creditToWallet(userId: string, amount: number): Promise<WalletAuthInterface | undefined> {
        try {

            const updateWallet = await this.userRepository.creditToWallet(userId, amount)

            if (updateWallet) {
                return {
                    status: OK,
                    data: {
                        success: true,
                        data: updateWallet,
                    },
                };
            } else {
                return {
                    status: BAD_REQUEST,
                    data: {
                        success: false,
                        message: "Booking cancel not working"
                    },
                };
            }
        } catch (error) {

            return {
                status: INTERNAL_SERVER_ERROR,
                data: {
                    success: false,
                    message: 'Internal server error',
                },
            };
        }
    }

    // ***************************check booked or not****************
    async checkBookedOrNot(issueDate: string, returnDate: string, carId: string): Promise<BookingDateAuthInterface | undefined> {
        try {
            const checkBooking: BookingDateInterface[] | null = await this.userRepository.checkBookedOrNot(carId);
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

                return (
                    (issueDateObj <= bookingReturnDate && returnDateObj >= bookingIssueDate)
                );
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
        } catch (error) {

            return {
                status: INTERNAL_SERVER_ERROR,
                data: {
                    success: false,
                    message: "Internal server error.",
                },
            };
        }
    }

    // *************************check wallet and update ****************
    async checkWalletAndUpdate(userId: string, amount: number): Promise<WalletAuthInterface | undefined> {
        try {
            let result = await this.userRepository.checkBalanceAndUpdateWallet(userId, amount)
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


        } catch (error) {

            return {
                status: INTERNAL_SERVER_ERROR,
                data: {
                    success: false,
                    message: "Internal server error.",
                },
            };
        }
    }


    // ************************* walle page************************

    async getWalletPage(userId: string, page: number, limit: number): Promise<WalletAuthInterface | undefined> {
        try {
            const walletPage = await this.userRepository.getWalletPage(userId, page, limit);
            const walletDocuments = await this.userRepository.countWalletDocuments(userId);

            if (walletPage && walletDocuments) {
                const lastTransaction = walletPage[walletPage.length - 1];
                let totalPrice = lastTransaction?.TotalAmt ?? 0;

                return {
                    status: OK,
                    data: {
                        success: true,
                        data: walletPage,
                        page: page,
                        totalPage: Math.ceil(walletDocuments / limit) ?? 1,
                        totalAmount: totalPrice,
                    },
                };
            } else {
                return {
                    status: BAD_REQUEST,
                    data: {
                        success: false,
                        message: "Booking history is not found",
                    },
                };
            }
        } catch (error) {

            return {
                status: INTERNAL_SERVER_ERROR,
                data: {
                    success: false,
                    message: 'Internal server error',
                },
            };
        }
    }

    // **************************create Review and ratings*********************

    async createReviewData(reviewData: ReviewDataInterface): Promise<ReviewAuthInterface | undefined> {
        try {
            const reviewDocument = await this.userRepository.createReviewData(reviewData);

            if (reviewDocument) {
                return {
                    status: OK,
                    data: {
                        success: true,
                        data: reviewDocument,
                        message: "Review added successfully.",
                    },
                };
            } else {
                return {
                    status: BAD_REQUEST,
                    data: {
                        success: false,
                        message: "Failed to add review. Please check the provided data and try again.",
                    },
                };
            }
        } catch (error) {

            return {
                status: INTERNAL_SERVER_ERROR,
                data: {
                    success: false,
                    message: "An unexpected error occurred while processing your request. Please try again later.",
                },
            };
        }
    }

    // **********************************check booki Id in reviewer***********************
    async checkBookidInReview(bookId: string): Promise<ReviewAuthInterface | undefined> {
        try {
            const reviewDocument = await this.userRepository.checkBookidInReview(bookId);

            if (reviewDocument) {
                return {
                    status: OK,
                    data: {
                        success: true,
                        data: reviewDocument,
                        message: "Review added successfully.",
                    },
                };
            } else {
                return {
                    status: BAD_REQUEST,
                    data: {
                        success: false,
                        message: "Failed to add review. Please check the provided data and try again.",
                    },
                };
            }
        } catch (error) {
            return {
                status: INTERNAL_SERVER_ERROR,
                data: {
                    success: false,
                    message: "An unexpected error occurred while processing your request. Please try again later.",
                },
            };
        }
    }

    // ********************************fetch chat history***********************
    async fetchChatHistory(userId: string, providerId: string): Promise<chatAuthInterface | undefined> {
        try {
            const reviewDocument = await this.userRepository.fetchChatHistory(userId, providerId);

            if (reviewDocument) {
                return {
                    status: OK,
                    data: {
                        success: true,
                        data: reviewDocument,
                    },
                };
            } else {
                return {
                    status: BAD_REQUEST,
                    data: {
                        success: false,
                        message: "Failed to fetch chat history",
                    },
                };
            }
        } catch (error) {
            return {
                status: INTERNAL_SERVER_ERROR,
                data: {
                    success: false,
                    message: "An unexpected error occurred while processing your request. Please try again later.",
                },
            };
        }
    }

    // ******************************check car availabilty****************************
    async searchCarAvailability(issueDate: string, returnDate: string): Promise<CarAuthResponse | undefined> {
        try {
            const carData = await this.userRepository.searchCarAvailability(issueDate, returnDate);

            if (carData) {
                return {
                    status: OK,
                    data: {
                        success: true,
                        data: carData,

                    },
                };
            } else {
                return {
                    status: BAD_REQUEST,
                    data: {
                        success: false,
                        message: 'No cars found',
                    },
                };
            }
        } catch (error) {
            return {
                status: INTERNAL_SERVER_ERROR,
                data: {

                    success: false,
                    message: 'Internal server error',
                },
            };
        }
    }
}    
