import { ProviderInterface, ProviderAdressInterface } from '../../Interface/ProviderInterface';
import { ProviderRepository } from '../../Repostries/Provider/ProviderRepostries';
import { OtpDocument } from '../../Model/User/OtpModel';
import Encrypt from '../../Utlis/ComparedPassword';
import { CreateJWT } from '../../Utlis/GenerateToken';
import { UserRepository } from '../../Repostries/User/UserRepostries';
import { ProviderAuthResponse } from '../../Interface/AuthServices/ProviderAuthServices';
import { StatusCodes } from 'http-status-codes';
const { BAD_REQUEST, OK, INTERNAL_SERVER_ERROR, UNAUTHORIZED } = StatusCodes;
import bcrypt from 'bcrypt'
import providerAddress from '../../Model/Provider/ProviderAddressModel';
import { CarDataInterface } from '../../Interface/CarInterface';
import { CarAuthResponse } from '../../Interface/AuthServices/CarAuthInterface';
import { uploadImageToCloudinary } from '../../Utlis/Uploads';
import { BookingAuthResponse } from '../../Interface/AuthServices/BookingAuthInterface';
import { chatAuthInterface } from '../../Interface/AuthServices/ChatAuthResponse';
import { DashboardAuthInterface } from '../../Interface/AuthServices/DashboardAuthInterface';

export class ProviderServices {
    constructor(
        private providerRepostry: ProviderRepository,
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
                    message: 'Success',
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
    // *******************************8Signup logic************************8
    async userSignup(providerData: ProviderInterface): Promise<ProviderInterface | null> {
        try {
            return await this.providerRepostry.emailExistCheck(providerData.email);
        } catch (error) {
            return null;
        }
    }

    //********************************8 */ OTP creation logic**************************
    async createOtp(email: string, otp: number): Promise<OtpDocument | null> {
        try {
            return await this.providerRepostry.createOtp(otp, email); 
        } catch (error) {
            return null;
        }
    }

    //    ***********************************Verify otp******************************
    async verifyOtp(email: string, otp: string): Promise<OtpDocument | null> {
        try {
            return await this.providerRepostry.findOtp(email, otp)
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
            return await this.providerRepostry.checkProviderAddress(id); 
        } catch (error) {
            return null;
        }
    }

    // ********************************************save Profile******************************

    async saveProfile(providerData: ProviderAdressInterface): Promise<ProviderAuthResponse | undefined> {
        try {

            const provider = await this.providerRepostry.saveProfile(providerData);
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

            const provider = await this.providerRepostry.editProfile(providerData, id);
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

            const provider = await this.providerRepostry.updateprofileImage(imageUrl, id);

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


            carData.images = images
            const saveCar = await this.providerRepostry.addCarDetails(
                carData,
            );

            if (saveCar) {
                return {
                    status: 200, 
                    data: {
                        success: true,
                        message: 'Car data saved successfully',
                        data: saveCar,
                    },
                };
            }
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
    // **************************fetch car for car managementa****************************
    async fetchCars(providerId: string, page: number, limit: number): Promise<CarAuthResponse | undefined> {
        try {
            const carData = await this.providerRepostry.fetchCars(page, limit);
            const totalPage = await this.providerRepostry.countCars(providerId)
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

            return await this.providerRepostry.updateStatusCar(id); 
        } catch (error) {

            return null;
        }
    }
    // *************************fetch car for edit in  car mgt*********************
    async editCar(id: string): Promise<CarDataInterface | null> {
        try {
            return await this.providerRepostry.editCar(id); 
        } catch (error) {
            return null;
        }
    }
    // ***********************************update car in edit management************************
    async updateCar(carData: CarDataInterface, id: string): Promise<CarAuthResponse | undefined> {
        try {

            const provider = await this.providerRepostry.updateCar(carData, id);
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

            const provider = await this.providerRepostry.updateCarImage(images, id);

            return {
                status: 200,
                data: {
                    success: true,
                    message: 'Car updated successfully',
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

            const bookingHistory = await this.providerRepostry.getBookingHistory(providerId, page, limit);
   
            const historyDocuments = await this.providerRepostry.countBooking(providerId)
    
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
            
            const bookingHistory = await this.providerRepostry.specificBookingDetails(bookingId);
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

    async updateStatusOfBooking(bookingId: string, status: string): Promise<BookingAuthResponse | undefined> {
        try {
            
            const updateStatus = await this.providerRepostry.updateStatusOfBooking(bookingId, status);
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

            const usersChat = await this.providerRepostry.fetchUsersChat(providerId);

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
            const reviewDocument = await this.providerRepostry.fetchChatHistory(userId, providerId);

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
            const totalCars = (await this.providerRepostry.countCars(providerId)) || 0;
            const totalBookingCount = (await this.providerRepostry.CountBookingCar(providerId)) || [];
            const revenue = (await this.providerRepostry.totalRevenue(providerId)) ?? 0;
            const totalBooking = (await this.providerRepostry.countBooking(providerId)) ?? 0;
            const revenueByCar = (await this.providerRepostry.revenueByCar(providerId)) ?? 0;
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

            const salesReport = await this.providerRepostry.fetchSalesReport(page, limit,providerId);

            if (salesReport && salesReport.length > 0) {
                return {
                    status: OK,
                    data: {
                        success: true,
                        message: 'Sales report retrieved successfully',
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






