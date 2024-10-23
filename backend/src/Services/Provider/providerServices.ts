import { ProviderInterface, ProviderAdressInterface } from '../../Interface/ProviderInterface';
import { ProviderRepository } from '../../Repostries/Provider/ProviderRepostries';
import { OtpDocument } from '../../Model/User/OtpModel'; // Import OtpDocument for OTP-related return type
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

export class ProviderServices {
    constructor(
        private providerRepostry: ProviderRepository,
        private encrypt: Encrypt,
        private createjwt: CreateJWT
    ) { }
    // refresh access token
    async providerGetById(id: string): Promise<ProviderAuthResponse | null> {
        try {
            console.log(id, "providergetby id")
            let provider = await this.providerRepostry.getProviderById(id)
            console.log(provider?.id, "get by userId")
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
            console.log(error as Error);
            return null;
        }

    }
    // *******************************8Signup logic************************8
    async userSignup(providerData: ProviderInterface): Promise<ProviderInterface | null> {
        try {
            console.log("signup services", providerData)
            return await this.providerRepostry.emailExistCheck(providerData.email);
        } catch (error) {
            console.log(error as Error);
            return null;
        }
    }

    //********************************8 */ OTP creation logic**************************
    async createOtp(email: string, otp: number): Promise<OtpDocument | null> {
        try {
            return await this.providerRepostry.createOtp(otp, email); // Ensure correct type
        } catch (error) {
            console.log(error as Error);
            return null;
        }
    }

    //    ***********************************Verify otp******************************
    async verifyOtp(email: string, otp: string): Promise<OtpDocument | null> {
        try {
            return await this.providerRepostry.findOtp(email, otp)
        }
        catch (error) {
            console.log(error as Error);
            return null;
        }
    }

    // ******************************************save Provider*****************************
    async saveProvider(providerData: ProviderInterface): Promise<ProviderAuthResponse | undefined> {
        try {
            providerData.password = await this.encrypt.hashPassword(providerData.password);

            const provider = await this.providerRepostry.saveProvider(providerData);
            console.log(provider, "saveUser in services", provider)
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
            // Call emailPasswordCheck from the repository to get the user by email

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
            console.log(token, "token"); // Assert that `id` exists after saving
            const refreshToken = this.createjwt.generateRefreshToken(provider.id!);
            console.log(refreshToken, "refreshtoken");

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

    // ************************************check provider Address********************
    async checkProviderAddress(id: string): Promise<ProviderAdressInterface | null> {
        try {
            return await this.providerRepostry.checkProviderAddress(id); // Use the repository method for checking
        } catch (error) {
            console.error("Error checking provider address via repository:", error);
            return null;
        }
    }

    // ********************************************save Profile******************************

    async saveProfile(providerData: ProviderAdressInterface): Promise<ProviderAuthResponse | undefined> {
        try {

            const provider = await this.providerRepostry.saveProfile(providerData);
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

    // *********************************Edit profile**************************
    async editProfile(providerData: ProviderAdressInterface, id: string): Promise<ProviderAuthResponse | undefined> {
        try {
         
            const provider = await this.providerRepostry.editProfile(providerData, id);
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
            // Saving car data along with image URLs if the upload was successful
            const saveCar = await this.providerRepostry.addCarDetails(
                carData,
                // Assuming carData has a field to save image URLs
            );

            if (saveCar) {
                return {
                    status: 200, // Successful save
                    data: {
                        success: true,
                        message: 'Car data saved successfully',
                        data: saveCar, // Optionally include saved data
                    },
                };
            }
        } catch (error) {
            console.error('Error saving provider profile:', (error as Error).message);
            return {
                status: 500, // Internal server error
                data: {
                    success: false,
                    message: 'Internal server error',
                },
            };
        }
    }
    // **************************fetch car for car managementa****************************
    async fetchCars(): Promise<CarAuthResponse | undefined> {
        try {
            const carData = await this.providerRepostry.fetchCars();
          

            if (carData && carData.length > 0) {
                return {
                    status: OK,
                    data: {
                        success: true,
                        message: 'Success',
                        data: carData, // Return all users
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

    //  **********************change car status***********************
    async updateStatusCar(id: string): Promise<CarDataInterface | null> {
        try {
           
            return await this.providerRepostry.updateStatusCar(id); // Use the repository method for checking
        } catch (error) {
            console.error("Error checking provider address via repository:", error);
            return null;
        }
    }
    // *************************fetch car for edit in  car mgt*********************
    async editCar(id: string): Promise<CarDataInterface | null> {
        try {
           
            return await this.providerRepostry.editCar(id); // Use the repository method for checking
        } catch (error) {
            console.error("Error checking edit car via repository:", error);
            return null;
        }
    }
    // ***********************************update car in edit management************************
    async updateCar( carData: CarDataInterface, id: string): Promise<CarAuthResponse | undefined> {
        try {
            
            // const result = await uploadImageToCloudinary(files);
            // if (!result.success) {
            //     return {
            //         status: 400,
            //         data: {
            //             success: false,
            //             message: 'Image upload failed',
            //         },
            //     };
            // }

            // const images = result?.results?.map((obj: any) => obj?.url) || [];

            // console.log(images, 'Images in add car details repository');
            // carData.images = images
          
            const provider = await this.providerRepostry.updateCar(carData, id);
            return {
                status: 200,
                data: {
                    success: true,
                    message: 'car update successfully',
                },
            };

        } catch (error) {
            console.error("Error upadting car Data:", (error as Error).message);
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
    
            // Extract image URLs from the result
            const images = result?.results?.map((obj: any) => obj?.url) || [];
    
            console.log(images, 'Images in add car details repository');
    
            // Ensure you're passing an array of images
            const provider = await this.providerRepostry.updateCarImage(images, id);
    
            return {
                status: 200,
                data: {
                    success: true,
                    message: 'Car updated successfully',
                },
            };
        } catch (error) {
            console.error("Error updating car data:", (error as Error).message);
            return {
                status: 500,
                data: {
                    success: false,
                    message: 'Internal server error',
                },
            };
        }
    }
    
}






