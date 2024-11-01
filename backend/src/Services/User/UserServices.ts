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
    async fetchCars(): Promise<CarAuthResponse | undefined> {
        try {
            const carData = await this.userRepository.fetchCars();
            console.log(carData, "fetch cars services");

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
    // ********************************car Details ********************
    async carDetails(id: string): Promise<CarDataInterface | null> {
        try {
            console.log("exist car in services")
            return await this.userRepository.carDetails(id); // Use the repository method for checking
        } catch (error) {
            console.error("Error checking edit car via repository:", error);
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

     // *******************88fetch User*******************8
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
}

