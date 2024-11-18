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
            console.log(user?.id, "get by userId")
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
                    message: 'Success',
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
    // Signup logic
    async userSignup(userData: UserInterface): Promise<UserInterface | null> {
        try {
            return await this.userRepository.emailExistCheck(userData.email);
        } catch (error) {
            console.log(error as Error);
            return null;
        }

    }

    // Save user logic
    async saveUser(userData: UserInterface): Promise<UserAuthResponse | undefined> {
        try {
            userData.password = await this.encrypt.hashPassword(userData.password);

            const user = await this.userRepository.saveUser(userData);
            console.log(user, "saveUser in services", user)
            return {
                status: OK,
                data: {
                    success: true,
                    message: 'Success',

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


    async userSignIn(userData: UserInterface): Promise<UserAuthResponse | undefined> {
        try {
            // Call emailPasswordCheck from the repository to get the user by email

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
            console.log(token, "token"); // Assert that `id` exists after saving
            const refreshToken = this.createjwt.generateRefreshToken(user.id!);
            console.log(refreshToken, "refreshtoken");

            return {
                status: OK,
                data: {
                    success: true,
                    message: 'Success',
                    userId: user.id,
                    token: token,
                    data: user,
                    refreshToken,
                }
            };

        } catch (error) {
            console.error("Error login user:", (error as Error).message);
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
            console.log(carData, "fetch cars services");

            if (carData && carData.length > 0 && totalPage) {
                return {
                    status: OK,
                    data: {
                        success: true,
                        message: 'Success',
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
            console.error("Error fetching cars:", (error as Error).message);
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
            console.log("Fetching car details in services");

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
                    message: "Car details fetched successfully.",
                    data: carDetails,
                    ratings: averageRating ?? 0, // Default to 0 if no average rating
                    review: reviews.length > 0 ? reviews : [], // Default to an empty array if no reviews
                },
            };
        } catch (error) {
            console.error("Error fetching car details:", error);
            return null;
        }
    }

    // ******************************car filter*******************
    async carFilter(engineType?: string[], fuelType?: string[], sortPrice?: string): Promise<CarDataInterface[] | null> {
        try {
            return await this.userRepository.carFilter(engineType, fuelType, sortPrice);
        } catch (error) {
            console.error("Error checking edit car via repository:", error);
            return null;
        }
    }
    // ******************************search Car****************************
    async searchCar(searchQuery: string): Promise<CarDataInterface[] | null> {
        try {
            return await this.userRepository.searchCar(searchQuery)
        }
        catch (error) {
            console.error("Error checking edit car via repository:", error);
            return null;
        }
    }

    // *******************fetch User*******************8
    async fetchOffer(): Promise<OfferAuthResponse | undefined> {
        try {
            const offerData = await this.userRepository.fetchOffer();
            console.log(offerData, "fetch offerData services");

            if (offerData && offerData.length > 0) {
                return {
                    status: OK,
                    data: {
                        success: true,
                        message: 'Success',
                        data: offerData, // Return all users
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
            console.error("Error fetching offerData:", (error as Error).message);
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
            return await this.userRepository.checkProfile(id); // Use the repository method for checking
        } catch (error) {
            console.error("Error checking provider address via repository:", error);
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
            console.error("Error saving provider profile:", (error as Error).message);
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
            // Log the saved provider data

            return {
                status: 200, // Successful save
                data: {
                    success: true,
                    message: 'Profile saved successfully',
                    // data: provider, // Optionally include saved data
                },
            };

        } catch (error) {
            console.error("Error saving provider profile:", (error as Error).message);
            return {
                status: 500, // Internal server error
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
            return await this.userRepository.checkAddress(id); // Use the repository method for checking
        } catch (error) {
            console.error("Error checking user address via repository:", error);
            return null;
        }
    }
    // ********************************************save Address******************************

    async saveAddress(addressData: UserAddressInterface): Promise<UserAddressAuthResponse | undefined> {
        try {

            const provider = await this.userRepository.saveAddress(addressData);
            // Log the saved provider data

            return {
                status: 200, // Successful save
                data: {
                    success: true,
                    message: 'Address saved successfully',
                    // data: provider, // Optionally include saved data
                },
            };

        } catch (error) {
            console.error("Error saving provider profile:", (error as Error).message);
            return {
                status: 500, // Internal server error
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
            // Log the saved provider data

            return {
                status: 200, // Successful save
                data: {
                    success: true,
                    message: 'Address saved successfully',
                    // data: provider, // Optionally include saved data
                },
            };

        } catch (error) {
            console.error("Error saving user Address:", (error as Error).message);
            return {
                status: 500, // Internal server error
                data: {
                    success: false,
                    message: 'Internal server error',
                },
            };
        }
    }

    // *******************get Car details and user address for booking details***************
    // async getBookingPage(userId: string, carId: string): Promise<UserAddressAuthResponse | undefined> {
    //     try {
    //         const result = await this.userRepository.getBookingPage(carId, userId)
    //         console.log(result, "result")
    //     }
    //     catch (error) {
    //         return
    //     }
    // }

    // *******************88fetch Coupon*******************8
    async fetchCoupon(userId: string): Promise<CouponAuthResponse | undefined> {
        try {
            const couponData = await this.userRepository.fetchCoupon(userId);
            console.log(couponData, "fetch offerData services");

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
            console.error("Error fetching couponData:", (error as Error).message);
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
            console.log(offerData, "fetch offerData services");

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
            console.error("Error fetching couponData:", (error as Error).message);
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
            // Call saveBookingData and handle the possibility of null return
            const savedBookingData = await this.userRepository.saveBookingData(bookingData);

            console.log(savedBookingData, "fetch bookingData services");

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
            console.error("Error fetching couponData:", (error as Error).message);
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
            console.log(updateCoupon, "fetch updateCoupon services");
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
            console.error("Error fetching updateCoupon:", (error as Error).message);
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
            console.log("getbooking history", userId)
            const bookingHistory = await this.userRepository.getBookingHistory(userId, page, limit);
            console.log(bookingHistory, "booking history and documents",)
            const historyDocuments = await this.userRepository.countBookingHistory(userId)
            console.log(historyDocuments, "documents")
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
            console.error("Error fetching updateCoupon:", (error as Error).message);
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
            console.log("getbooking history", bookingId)
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
            console.error("Error fetching updateCoupon:", (error as Error).message);
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
            console.log("update booking status", bookingId)
            const updateStatus = await this.userRepository.cancelBookingByUser(bookingId);
            console.log(updateStatus, "updatestaus")
            const updateWallet = await this.userRepository.cancelBookingUpdateWallet(bookingId, userId, amount)
            console.log(updateWallet, 'update wallet')
            if (updateStatus && updateWallet) {
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
            console.error("Error fetching updateCoupon:", (error as Error).message);
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
            console.log(checkBooking, "checkBooking");

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
            console.error("Error fetching booking data:", (error as Error).message);
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
            console.log(result, "check wallet and update")
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
            console.error("Error fetching booking data:", (error as Error).message);
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
                let totalPrice = lastTransaction?.TotalAmt ?? 0;  // Default to 0 if TotalAmt is null or undefined

                return {
                    status: OK,
                    data: {
                        success: true,
                        data: walletPage,
                        page: page,
                        totalPage: Math.ceil(walletDocuments / limit) ?? 1,
                        totalAmount: totalPrice,  // Ensure it's always a number
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
            console.error("Error fetching updateCoupon:", (error as Error).message);
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
            console.error("Error creating review:", (error as Error).message);

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
            console.error("Error creating review:", (error as Error).message);

            return {
                status: INTERNAL_SERVER_ERROR,
                data: {
                    success: false,
                    message: "An unexpected error occurred while processing your request. Please try again later.",
                },
            };
        }
    }


}    
