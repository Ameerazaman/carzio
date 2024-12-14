import { ProviderInterface, ProviderAdressInterface } from '../../Interface/ProviderInterface';
import { ProviderRepository } from '../../Repostries/Provider/ProviderRepostries';
import { OtpDocument } from '../../Model/User/OtpModel';
import Encrypt from '../../Utlis/ComparedPassword';
import { CreateJWT } from '../../Utlis/GenerateToken';
import { ProviderAuthResponse } from '../../Interface/AuthServices/ProviderAuthServices';
import { StatusCodes } from 'http-status-codes';
const { BAD_REQUEST, OK, INTERNAL_SERVER_ERROR, UNAUTHORIZED } = StatusCodes;
import bcrypt from 'bcrypt'
import { CarDataInterface } from '../../Interface/CarInterface';
import { CarAuthResponse } from '../../Interface/AuthServices/CarAuthInterface';
import { uploadImageToCloudinary } from '../../Utlis/Uploads';
import { BookingAuthResponse } from '../../Interface/AuthServices/BookingAuthInterface';
import { chatAuthInterface } from '../../Interface/AuthServices/ChatAuthResponse';
import { DashboardAuthInterface } from '../../Interface/AuthServices/DashboardAuthInterface';
import { IProviderRepository } from '../../Repostries/Provider/IProviderRepostry';
import { IProviderServices } from './IProviderServices';
import { IProviderProfileRepository } from '../../Repostries/ProviderProfile/IProviderProfile';
import { IOtpRepository } from '../../Repostries/Otp/IOtpRepository';
import { ICarRepository } from '../../Repostries/Car/ICarRepository';
import { ICarNotificationRepository } from '../../Repostries/CarNotification/ICarNotification';
import { IBookingRepository } from '../../Repostries/BookingRepository/IBookingRepository';
import { IChatRepository } from '../../Repostries/Chat/IChatRepository';

export class ProviderServices implements IProviderServices {
    constructor(
        private providerRepostry: IProviderRepository,
        private profileRepository: IProviderProfileRepository,
        private otpRepository: IOtpRepository,
        private carRepository: ICarRepository,
        private carNotificationRepository: ICarNotificationRepository,
        private bookingRepository:IBookingRepository,
        private chatRepository:IChatRepository,
        private encrypt: Encrypt,
        private createjwt: CreateJWT

    ) { }
    // refresh access token
    async providerGetById(id: string): Promise<ProviderAuthResponse | null> {
        try {

            let provider = await this.providerRepostry.getProviderById(id)
            if (!provider) {

                return {
                    status: UNAUTHORIZED,
                    data: {
                        success: false,
                        message: 'User not found',
                    }
                };
            }
            const newAccessToken = this.createjwt.generateToken(provider.id!);
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

    }
    async emailExistCheck(email: string): Promise<ProviderInterface | null> {
        try {
            return await this.providerRepostry.emailExistCheck(email);
        } catch (error) {
            console.log(error as Error);
            return null;
        }

    }

    // ********************************change password******************************

    async changePassword(email: string, password: string): Promise<ProviderInterface | null> {
        try {
            const hashedPassword = await this.encrypt.hashPassword(password);
            return await this.providerRepostry.changePassword(email, hashedPassword);
        } catch (error) {
            return null;
        }
    }


    //********************************8 */ OTP creation logic**************************
    async createOtp(email: string, otp: string): Promise<OtpDocument | null> {
        try {
            return await this.otpRepository.createOtp(otp, email);
        } catch (error) {
            return null;
        }
    }

    // //    ***********************************Verify otp******************************
    async verifyOtp(email: string, otp: string): Promise<OtpDocument | null> {
        try {
            return await this.otpRepository.findOtp(email, otp)
        }
        catch (error) {

            return null;
        }
    }
    // // *************************************Delete Otp***************************
    async deleteOtp(email: string): Promise<OtpDocument | null> {
        try {
            return await this.otpRepository.deleteOtp(email)
        }
        catch (error) {
            return null;
        }
    }
    // // **********************************update Otp**************************
    async updateOtp(email: string, otp: string): Promise<OtpDocument | null> {
        try {
            return await this.otpRepository.updateOtp(email, otp)
        }
        catch (error) {
            return null;
        }
    }
    // ******************************************save Provider*****************************
    async saveProvider(providerData: ProviderInterface): Promise<ProviderAuthResponse | undefined> {
        try {
            providerData.password = await this.encrypt.hashPassword(providerData.password);

            const provider = await this.providerRepostry.saveProvider(providerData);
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

    // ***************************************provider SignIn****************************
    async providerSignIn(providerData: ProviderInterface): Promise<ProviderAuthResponse | undefined> {
        try {
            const provider = await this.providerRepostry.emailExistCheck(providerData.email);

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
                }
            };

            // Validate the password
            const isPasswordValid = await bcrypt.compare(providerData.password, provider.password);
            if (!isPasswordValid) {
                return {
                    status: BAD_REQUEST,
                    data: {
                        success: false,
                        message: 'Incorrect Password, Try again',
                    }
                };
            }

            const token = this.createjwt.generateToken(provider.id!);
            const refreshToken = this.createjwt.generateRefreshToken(provider.id!);
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

    // ************************************check provider Address********************
    async checkProviderAddress(id: string): Promise<ProviderAdressInterface | null> {
        try {
            return await this.profileRepository.checkProviderAddress(id);
        } catch (error) {
            return null;
        }
    }

    // ********************************************save Profile******************************

    async saveProfile(providerData: ProviderAdressInterface): Promise<ProviderAuthResponse | undefined> {
        try {

            const provider = await this.profileRepository.saveProfile(providerData);
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
    async editProfile(providerData: ProviderAdressInterface, id: string): Promise<ProviderAuthResponse | undefined> {
        try {

            const provider = await this.profileRepository.editProfile(providerData, id);
            return {
                status: 200,
                data: {
                    success: true,
                    message: 'Profile edit successfully',
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

    // **************************************update car Image***********************
    async updateProfileImage<T>(file: T, id: string): Promise<CarAuthResponse | undefined> {
        try {

            const result = await uploadImageToCloudinary(file);

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

            const provider = await this.profileRepository.updateprofileImage(imageUrl, id);

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


    // **********************************add car details***********************
    async addCarDetails<T>(files: T, carData: CarDataInterface): Promise<CarAuthResponse | undefined> {
        try {
            // Check if the car already exists
            const carExist = await this.carRepository.checkCarExist(carData);
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
            const result = await uploadImageToCloudinary(files);
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
            const images = result?.results?.map((obj: any) => obj?.url) || [];
            carData.images = images;

            // Save car details in the repository
            const saveCar = await this.carNotificationRepository.addCarDetails(carData);

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
        } catch (error) {
            // Handle unexpected errors
            return {
                status: 500,
                data: {
                    success: false,
                    message: "Internal server error",
                },
            };
        }
    }

    // **************************fetch car for car managementa****************************
    async fetchCars(providerId: string, page: number, limit: number): Promise<CarAuthResponse | undefined> {
        try {
            const carData = await this.carRepository.fetchCarsForProvider(providerId, page, limit);
            const totalPage = await this.carRepository.countCarsForProvider(providerId)
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
    //  **********************change car status***********************
    async updateStatusCar(id: string): Promise<CarDataInterface | null> {
        try {

            return await this.carRepository.updateStatusCarForProvider(id);
        } catch (error) {

            return null;
        }
    }
    // *************************fetch car for edit in  car mgt*********************
    async editCar(id: string): Promise<CarDataInterface | null> {
        try {
            return await this.carRepository.editCarForProvider(id);
        } catch (error) {
            return null;
        }
    }
    // ***********************************update car in edit management************************
    async updateCar(carData: CarDataInterface, id: string): Promise<CarAuthResponse | undefined> {
        try {

            const provider = await this.carRepository.updateCarForProvider(carData, id);
            return {
                status: 200,
                data: {
                    success: true,
                    message: 'car update successfully',
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

    // ***********************update Car Image*************************88
    async updateCarImage<T>(files: T, id: string): Promise<CarAuthResponse | undefined> {
        try {
            const result = await uploadImageToCloudinary(files);
            if (!result.success) {
                return {
                    status: 400,
                    data: {
                        success: false,
                        message: 'Image upload failed',
                    },
                };
            }

            const images = result?.results?.map((obj: any) => obj?.url) || [];

            const provider = await this.carRepository.updateCarImageForProvider(images, id);

            return {
                status: 200,
                data: {
                    success: true,

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

    // ************************* booking page************************


    async getBookingHistory(providerId: string, page: number, limit: number): Promise<BookingAuthResponse | undefined> {
        try {

            const bookingHistory = await this.bookingRepository.getBookingHistoryForProvider(providerId, page, limit);

            const historyDocuments = await this.bookingRepository.countBookingForProvider(providerId)

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

            const bookingHistory = await this.bookingRepository.specificBookingDetailsForProvider(bookingId);
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
                        message: "Booking history is not retrieved"
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

    async updateStatusOfBooking(bookingId: string, status: string): Promise<BookingAuthResponse | undefined> {
        try {

            const updateStatus = await this.bookingRepository.updateStatusOfBookingForProvider(bookingId, status);
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
                        message: "Status updation is failed"
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
    // ***********************************fetch users chat by provider********************
    async fetchUsersChat(providerId: string): Promise<chatAuthInterface> {
        try {

            const usersChat = await this.chatRepository.fetchUsersChat(providerId);

            if (usersChat) {
                return {
                    status: OK,
                    data: {
                        success: true,
                        data: usersChat,
                    },
                };
            } else {

                return {
                    status: BAD_REQUEST,
                    data: {
                        success: false,
                        message: "No chat history found for the given receiver ID.",
                    },
                };
            }
        } catch (error) {

            return {
                status: INTERNAL_SERVER_ERROR,
                data: {
                    success: false,
                    message: "Internal server error occurred while fetching chat history.",
                },
            };
        }
    }
    // ********************************fetch chat history***********************
    async fetchChatHistory(userId: string, providerId: string): Promise<chatAuthInterface | undefined> {
        try {
            const reviewDocument = await this.chatRepository.fetchChatHistory(userId, providerId);

            if (reviewDocument) {
                return {
                    status: OK,
                    data: {
                        success: true,
                        data: reviewDocument,
                        message: "Fetch Chat History successfully",
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

    // *****************************get dashboard const data******************88
    async getConstDashboardData(providerId: string): Promise<DashboardAuthInterface | null> {
        try {
            const totalCars = (await this.carRepository.countCarsForProvider(providerId)) || 0;
            const totalBookingCount = (await this.bookingRepository.CountBookingCarForProvider(providerId)) || [];
            const revenue = (await this.bookingRepository.totalRevenueForProvider(providerId)) ?? 0;
            const totalBooking = (await this.bookingRepository.countBookingForProvider(providerId)) ?? 0;
            const revenueByCar = (await this.bookingRepository.revenueByCarForProvider(providerId)) ?? 0;
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
        } catch (error) {

            return null;
        }
    }

    // *********************************Sales Report**********************
    async fetchSalesReport(page: number, limit: number, providerId: string): Promise<BookingAuthResponse | undefined> {
        try {

            const salesReport = await this.bookingRepository.fetchSalesReportForProvider(page, limit, providerId);

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
            } else {
                return {
                    status: BAD_REQUEST,
                    data: {
                        success: false,
                        message: "Sales report not retrieved",
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






