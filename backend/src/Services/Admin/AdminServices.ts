
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
import { BookingAuthResponse } from '../../Interface/AuthServices/BookingAuthInterface';
import { DashboardAuthInterface } from '../../Interface/AuthServices/DashboardAuthInterface';


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

  // ***************************Signup logic*********************************

  async adminSignIn(adminData: adminInterface): Promise<adminAuthResponse | undefined> {
    try {
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

// *****************************8fetch users*****************************

  async fetchUsers(page: number, limit: number): Promise<UserAuthResponse | undefined> {
    try {
      const userData = await this.adminRepostry.fetchUsers(page, limit);
      console.log(userData, "fetch users services");
      const totalPage = (await this.adminRepostry.countUsers()) || 0;
      if (userData && userData.length > 0) {
        return {
          status: OK,
          data: {
            success: true,
            message: 'Success',
            data: userData,
            page: page,
            totalPage: Math.ceil(totalPage / limit) ?? 1 
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

 

// ***************************edit user*****************************

  async editUser(id: string): Promise<UserInterface | null> {
    try {
      console.log("exist user in services")
      return await this.adminRepostry.editUser(id);
    } catch (error) {
      console.error("Error checking provider address via repository:", error);
      return null;
    }
  }

  // ****************************update users*********************

  async updateUser(userData: UserInterface, id: string): Promise<UserAuthResponse | undefined> {
    try {
      console.log("edit user is services")
      const provider = await this.adminRepostry.updateUser(userData, id);
      return {
        status: 200,
        data: {
          success: true,
          message: 'user update successfully',
        
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

  // ********************************update status**********************

  async updateStatus(id: string): Promise<UserInterface | null> {
    try {
      console.log("exist user in services")
      return await this.adminRepostry.updateStatus(id); 
    } catch (error) {
      console.error("Error checking provider address via repository:", error);
      return null;
    }
  }

   // **********************************fetch providers**********************

   async fetchProviders(page:number,limit:number): Promise<UserAuthResponse | undefined> {
    try {
      const providerData = await this.adminRepostry.fetchProviders(page,limit);
      const totalPage = (await this.adminRepostry.countProviders()) || 0;
      console.log(providerData, "fetch users services");

      if (providerData && providerData.length > 0) {
        return {
          status: OK,
          data: {
            success: true,
            message: 'Success',
            data: providerData,
            page: page,
            totalPage: Math.ceil(totalPage / limit) ?? 1 
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

  // *****************************edit provider*************************
  async editProvider(id: string): Promise<ProviderInterface | null> {
    try {
      console.log("exist provider in services")
      return await this.adminRepostry.editProvider(id); 
    } catch (error) {
      console.error("Error checking edit provider via repository:", error);
      return null;
    }
  }

// *******************************update providers**********************

  async updateProvider(providerData: ProviderInterface, id: string): Promise<UserAuthResponse | undefined> {
    try {
      console.log("edit user is services")
      const provider = await this.adminRepostry.updateProvider(providerData, id);
    
      return {
        status: 200, 
        data: {
          success: true,
          message: 'provider update successfully',
        },
      };

    } catch (error) {
      console.error("Error upadting provider Data:", (error as Error).message);
      return {
        status: 500, 
        data: {
          success: false,
          message: 'Internal server error',
        },
      };
    }
  }

// *******************************update status of providers*******************

  async updateStatusProvider(id: string): Promise<ProviderInterface | null> {
    try {
      console.log("exist provider in services")
      return await this.adminRepostry.updateStatusprovider(id); 
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
  async fetchCars(page:number,limit:number): Promise<CarAuthResponse | undefined> {
    try {
      const carData = await this.adminRepostry.fetchCars(page,limit);
      const totalPage = (await this.adminRepostry.countCars()) || 0;
      console.log(carData, "fetch users services");

      if (carData && carData.length > 0) {
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
  async fetchOffer(page:number,limit:number): Promise<OfferAuthResponse | undefined> {
    try {
      const offerData = await this.adminRepostry.fetchOffer(page,limit);
      const totalPage = (await this.adminRepostry.countOffers()) || 0;
      console.log(offerData, "fetch users services");

      if (offerData && offerData.length > 0) {
        return {
          status: OK,
          data: {
            success: true,
            message: 'Success',
            data: offerData,
            page: page,
            totalPage: Math.ceil(totalPage / limit) ?? 1 
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
  async fetchCoupon(page:number,limit:number): Promise<CouponAuthResponse | undefined> {
    try {
      const couponData = await this.adminRepostry.fetchCoupon(page,limit);
      const totalPage = (await this.adminRepostry.countCoupon()) || 0;
      console.log(couponData, "fetch users services");

      if (couponData && couponData.length > 0) {
        return {
          status: OK,
          data: {
            success: true,
            message: 'Success',
            data: couponData,
            page: page,
            totalPage: Math.ceil(totalPage / limit) ?? 1 
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

  // ************************* booking page************************

  async getBookingHistory(page:number,limit:number): Promise<BookingAuthResponse | undefined> {
    try {

      const bookingHistory = await this.adminRepostry.getBookingHistory(page,limit);
      const totalPage = (await this.adminRepostry.countBooking()) || 0;
      console.log(bookingHistory, "fetch users services");

      if (bookingHistory && bookingHistory.length > 0) {
        return {
          status: OK,
          data: {
            success: true,
            message: 'Success',
            data: bookingHistory,
            page: page,
            totalPage: Math.ceil(totalPage / limit) ?? 1 
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
      const bookingHistory = await this.adminRepostry.specificBookingDetails(bookingId);
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

  async updateStatusOfBooking(bookingId: string, status: string): Promise<BookingAuthResponse | undefined> {
    try {
      console.log("update booking status", bookingId)
      const updateStatus = await this.adminRepostry.updateStatusOfBooking(bookingId, status);
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


  // *****************************get dashboard const data******************88
  async getConstDashboardData(): Promise<DashboardAuthInterface | null> {
    try {
      const totalCars = (await this.adminRepostry.countCars()) || 0;
      const totalProviders = (await this.adminRepostry.countProviders()) || 0;
      const totalUsers = (await this.adminRepostry.countUsers()) || 0;
      const totalBookingCount = await this.adminRepostry.CountBookingCar();
      const revenue = (await this.adminRepostry.totalRevenue()) ?? 0;
      const totalBooking = (await this.adminRepostry.countBooking()) ?? 0;
      const revenueByCar = (await this.adminRepostry.revenueByCar()) ?? 0;
      console.log(revenueByCar, "revunue by car")
      return {
        status: 200,
        data: {
          success: true,
          data: {
            totalCars,
            totalProviders,
            totalUsers,
            revenue,
            totalBookingCount,
            totalBooking,
            revenueByCar
          },
        },
      };
    } catch (error) {
      console.error("Error fetching dashboard data:", (error as Error).message);
      return null;
    }
  }



}

