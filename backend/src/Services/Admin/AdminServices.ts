
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
import { OfferDataInterface } from '../../Interface/OfferInterface';
import { OfferAuthResponse } from '../../Interface/AuthServices/OfferAuthInterface';
import { generateRandomCouponCode } from '../../Utlis/CouponGenerator';
import { CouponInterface } from '../../Interface/CouponInterface';
import { CouponAuthResponse } from '../../Interface/AuthServices/CouponAuthInterface';


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
  //  ***************************Add offer********************************88
  async addOffer(offer: OfferDataInterface): Promise<OfferAuthResponse | null> {
    try {
      console.log("offer save in services")
      const offerData = await this.adminRepostry.addOffer(offer)
      console.log("offerdata service", offerData)
      if (offerData) {
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
            message: 'Offers are not found',
          },
        };
      }
    } catch (error) {
      console.error("Error saving offer:", (error as Error).message);
      return {
        status: INTERNAL_SERVER_ERROR,
        data: {

          success: false,
          message: 'Internal server error',
        },
      };
    }
  }
  // *******************88fetch User*******************8
  async fetchOffer(): Promise<OfferAuthResponse | undefined> {
    try {
      const offerData = await this.adminRepostry.fetchOffer();
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
  // *****************************Edit Offer************************8
  async editOffer(id: string): Promise<OfferDataInterface | null> {
    try {
      console.log("exist provider in services")
      return await this.adminRepostry.editOffer(id); // Use the repository method for checking
    } catch (error) {
      console.error("Error checking edit provider via repository:", error);
      return null;
    }
  }
  // ************************update Offer*************8888
  async updateOffer(offerData: OfferDataInterface, id: string): Promise<OfferAuthResponse | undefined> {
    try {
      console.log("edit offer is services")
      const provider = await this.adminRepostry.updateOffer(offerData, id);


      return {
        status: 200, // Successful save
        data: {
          success: true,
          message: 'Offer update successfully',
         
        },
      };

    } catch (error) {
      console.error("Error upadting offer Data:", (error as Error).message);
      return {
        status: 500, // Internal server error
        data: {
          success: false,
          message: 'Internal server error',
        },
      };
    }
  }

  // ***********************delete Offer****************
  async updateStatusOffer(id: string): Promise<OfferDataInterface | null> {
    try {
      return await this.adminRepostry.updateStatusOffer(id); // Use the repository method for checking
    } catch (error) {
      console.error("Error  deletee offer:", error);
      return null;
    }
  }

  // ***********************add coupon******************
  async addCoupon(coupon: CouponInterface): Promise<CouponAuthResponse | null> {
    try {
      console.log("Generating random coupon code");
      coupon.code = generateRandomCouponCode(8); // e.g., 8 characters long
      console.log("Coupon code generated:", coupon.code);
      console.log(coupon, "in services coupo")
      const offerData = await this.adminRepostry.addCoupon(coupon);
      console.log("Coupon data service", offerData);

      if (offerData) {
        return {
          status: OK,
          data: {
            success: true,
            message: 'Success',
            data: offerData,
          },
        };
      } else {
        return {
          status: BAD_REQUEST,
          data: {
            success: false,
            message: 'Offers are not found',
          },
        };
      }
    } catch (error) {
      console.error("Error saving offer:", (error as Error).message);
      return {
        status: INTERNAL_SERVER_ERROR,
        data: {
          success: false,
          message: 'Internal server error',
        },
      };
    }
  }

   // *******************88fetch Coupon*******************8
   async fetchCoupon(): Promise<CouponAuthResponse| undefined> {
    try {
      const couponData = await this.adminRepostry.fetchCoupon();
      console.log(couponData, "fetch offerData services");

      if (couponData && couponData.length > 0) {
        return {
          status: OK,
          data: {
            success: true,
            message: 'Success',
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

  // *****************************Edit Coupon************************8
  async editCoupon(id: string): Promise<CouponInterface | null> {
    try {
      console.log("exist Coupon in services")
      return await this.adminRepostry.editCoupon(id); // Use the repository method for checking
    } catch (error) {
      console.error("Error checking edit Coupon via repository:", error);
      return null;
    }
  }

   // ************************update Coupon*************8888
   async updateCoupon(couponData: CouponInterface, id: string): Promise<CouponAuthResponse | undefined> {
    try {
      const updatedCoupon = await this.adminRepostry.updateCoupon(couponData, id);


      return {
        status: 200, // Successful save
        data: {
          success: true,
          message: 'Coupon update successfully',
        },
      };

    } catch (error) {
      console.error("Error upadting offer Data:", (error as Error).message);
      return {
        status: 500, // Internal server error
        data: {
          success: false,
          message: 'Internal server error',
        },
      };
    }
  }

  // ***********************delete or update status of coupon****************
  async updateStatusCoupon(id: string): Promise<CouponInterface | null> {
    try {
      return await this.adminRepostry.updateStatusCoupon(id); // Use the repository method for checking
    } catch (error) {
      console.error("Error  deletee offer:", error);
      return null;
    }
  }

}