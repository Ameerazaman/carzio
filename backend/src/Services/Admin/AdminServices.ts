
import { adminInterface } from '../../Interface/AdminInterface';
// Import OtpDocument for OTP-related return type
import Encrypt from '../../Utlis/ComparedPassword';
import { CreateJWT } from '../../Utlis/GenerateToken';
import { AdminRepository } from '../../Repostries/Admin/AdminRepostries';
import { adminAuthResponse } from '../../Interface/AuthServices/AdminAuthInterface';
import { StatusCodes } from 'http-status-codes';
const { BAD_REQUEST, OK, INTERNAL_SERVER_ERROR, UNAUTHORIZED } = StatusCodes;
import bcrypt from 'bcrypt'
import { UserAuthResponse } from '../../Interface/AuthServices/UserAuthServices';
import { UserInterface } from '../../Interface/UserInterface';
import { ProviderInterface } from '../../Interface/ProviderInterface';
import { CarAuthResponse } from '../../Interface/AuthServices/CarAuthInterface';
import { CarDataInterface } from '../../Interface/CarInterface';


export class AdminServices {
  constructor(
    private adminRepostry: AdminRepository,
    private encrypt: Encrypt,
    private createjwt: CreateJWT
  ) { }


  // *******************************refresh access token for admin*******************
  async adminGetById(id: string): Promise<adminAuthResponse | null> {
    try {
      let admin = await this.adminRepostry.getAdminById(id)
      console.log(admin?.id, "get by userId")
      if (!admin) {

        return {
          status: UNAUTHORIZED,
          data: {
            success: false,
            message: 'User not found',
          }
        };
      }
      const newAccessToken = this.createjwt.generateToken(admin.id!);
      return {
        status: OK,
        data: {
          success: true,
          message: 'Success',
          adminId: admin.id,
          token: newAccessToken,
          data: admin

        }
      };
    }
    catch (error) {
      console.log(error as Error);
      return null;
    }

  }

  // Signup logic

  async adminSignIn(adminData: adminInterface): Promise<adminAuthResponse | undefined> {
    try {
      // Call emailPasswordCheck from the repository to get the user by email

      const provider = await this.adminRepostry.emailExistCheck(adminData.email);

      if (!provider) {
        return {
          status: UNAUTHORIZED,
          data: {
            success: false,
            message: 'provider not found',
          }
        };
      }
      // Validate the password
      const isPasswordValid = await bcrypt.compare(adminData.password, provider.password);
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

  async fetchUsers(): Promise<UserAuthResponse | undefined> {
    try {
      const userData = await this.adminRepostry.fetchUsers();
      console.log(userData, "fetch users services");

      if (userData && userData.length > 0) {
        return {
          status: OK,
          data: {
            success: true,
            message: 'Success',
            data: userData, // Return all users
          },
        };
      } else {
        return {
          status: BAD_REQUEST,
          data: {
            success: false,
            message: 'No users found',
          },
        };
      }
    } catch (error) {
      console.error("Error fetching user:", (error as Error).message);
      return {
        status: INTERNAL_SERVER_ERROR,
        data: {
          success: false,
          message: 'Internal server error',
        },
      };
    }
  }

  async fetchProviders(): Promise<UserAuthResponse | undefined> {
    try {
      const providerData = await this.adminRepostry.fetchProviders();
      console.log(providerData, "fetch users services");

      if (providerData && providerData.length > 0) {
        return {
          status: OK,
          data: {
            success: true,
            message: 'Success',
            data: providerData, // Return all users
          },
        };
      } else {
        return {
          status: BAD_REQUEST,
          data: {
            success: false,
            message: 'No providers found',
          },
        };
      }
    } catch (error) {
      console.error("Error fetching provider:", (error as Error).message);
      return {
        status: INTERNAL_SERVER_ERROR,
        data: {
          success: false,
          message: 'Internal server error',
        },
      };
    }
  }


  async editUser(id: string): Promise<UserInterface | null> {
    try {
      console.log("exist user in services")
      return await this.adminRepostry.editUser(id); // Use the repository method for checking
    } catch (error) {
      console.error("Error checking provider address via repository:", error);
      return null;
    }
  }


  async updateUser(userData: UserInterface, id: string): Promise<UserAuthResponse | undefined> {
    try {
      console.log("edit user is services")
      const provider = await this.adminRepostry.updateUser(userData, id);
      // Log the saved provider data

      return {
        status: 200, // Successful save
        data: {
          success: true,
          message: 'user update successfully',
          // data: provider, // Optionally include saved data
        },
      };

    } catch (error) {
      console.error("Error upadting user Data:", (error as Error).message);
      return {
        status: 500, // Internal server error
        data: {
          success: false,
          message: 'Internal server error',
        },
      };
    }
  }

  async updateStatus(id: string): Promise<UserInterface | null> {
    try {
      console.log("exist user in services")
      return await this.adminRepostry.updateStatus(id); // Use the repository method for checking
    } catch (error) {
      console.error("Error checking provider address via repository:", error);
      return null;
    }
  }

  async editProvider(id: string): Promise<ProviderInterface | null> {
    try {
      console.log("exist provider in services")
      return await this.adminRepostry.editProvider(id); // Use the repository method for checking
    } catch (error) {
      console.error("Error checking edit provider via repository:", error);
      return null;
    }
  }


  async updateProvider(providerData: ProviderInterface, id: string): Promise<UserAuthResponse | undefined> {
    try {
      console.log("edit user is services")
      const provider = await this.adminRepostry.updateProvider(providerData, id);
      // Log the saved provider data

      return {
        status: 200, // Successful save
        data: {
          success: true,
          message: 'provider update successfully',
          // data: provider, // Optionally include saved data
        },
      };

    } catch (error) {
      console.error("Error upadting provider Data:", (error as Error).message);
      return {
        status: 500, // Internal server error
        data: {
          success: false,
          message: 'Internal server error',
        },
      };
    }
  }

  async updateStatusProvider(id: string): Promise<ProviderInterface | null> {
    try {
      console.log("exist provider in services")
      return await this.adminRepostry.updateStatusprovider(id); // Use the repository method for checking
    } catch (error) {
      console.error("Error checking provider data via repository:", error);
      return null;
    }
  }

  //*************************/ fetch notification from car Document********************
  async fetchNotification(): Promise<CarAuthResponse | undefined> {
    try {
      const carNotificationData = await this.adminRepostry.fetchNotification();
      console.log(carNotificationData, "fetch users services");

      if (carNotificationData && carNotificationData.length > 0) {
        return {
          status: OK,
          data: {
            success: true,
            message: 'Success',
            data: carNotificationData,
          },
        };
      } else {
        return {
          status: BAD_REQUEST,
          data: {
            success: false,
            message: 'Notification is Empty',
          },
        };
      }
    } catch (error) {
      console.error("Error fetching notification:", (error as Error).message);
      return {
        status: INTERNAL_SERVER_ERROR,
        data: {
          success: false,
          message: 'Internal server error',
        },
      };
    }
  }


  // **************************notification details********************
  async notificationDetails(id: string): Promise<CarDataInterface | null> {
    try {
      console.log("exist provider in services")
      return await this.adminRepostry.carNotificationById(id); // Use the repository method for checking
    } catch (error) {
      console.error("Error checking edit provider via repository:", error);
      return null;
    }
  }


  // ******verify notification (accept or reject the car details in notifiation.add car to car model)***********

  async verifynotification(id: string, value: string): Promise<CarDataInterface | null> {
    try {

      return await this.adminRepostry.verifyNotification(id, value); // Use the repository method for checking
    } catch (error) {
      console.error("Error checking edit provider via repository:", error);
      return null;
    }
  }

  // **************************fetch car for car managementa****************************
  async fetchCars(): Promise<CarAuthResponse | undefined> {
    try {
      const carData = await this.adminRepostry.fetchCars();
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

  //  **********************change car status***********************
  async updateStatusCar(id: string): Promise<CarDataInterface | null> {
    try {
      console.log("car status in services")
      return await this.adminRepostry.updateStatusCar(id); // Use the repository method for checking
    } catch (error) {
      console.error("Error checking provider address via repository:", error);
      return null;
    }
  }

}
