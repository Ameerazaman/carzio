import { UserInterface } from '../Interface/userInterface';
import { UserRepository } from '../Repostries/userRepostries';
import { UserAuthResponse } from '../Interface/authServices/userAuthServices';
import Encrypt from '../utlis/comparedPassword';
import { CreateJWT } from '../utlis/generateToken';
import { STATUS_CODES } from '../constants/httpStatusCode';
import bcrypt from 'bcrypt';




const { OK, INTERNAL_SERVER_ERROR, UNAUTHORIZED,BAD_REQUEST } = STATUS_CODES;

export class UserServices {
    constructor(
        private userRepository: UserRepository,
        private encrypt: Encrypt,
        private createjwt: CreateJWT
    ) { }

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
                    // userId: user.id,
                    // token: token,
                    // data: user,
                    // refreshToken
                }
            };
            // if (user) {
            //     const token = this.createjwt.generateToken(user.id!); 
            //     console.log(token,"token")// Assert that `id` exists after saving
            //     const refreshToken = this.createjwt.generateRefreshToken(user.id!);
            //     console.log(refreshToken,"refreshtoken")
            //     return {
            //         status: OK,
            //         data: {
            //             success: true,
            //             message: 'Success',
            //             userId: user.id,
            //             token: token,
            //             data: user,
            //             refreshToken
            //         }
            //     };
            // }
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
    
}

