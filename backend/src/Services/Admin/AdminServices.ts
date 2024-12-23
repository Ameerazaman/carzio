
import { adminInterface } from '../../Interface/AdminInterface';
import Encrypt from '../../Utlis/ComparedPassword';
import { CreateJWT } from '../../Utlis/GenerateToken';

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
import { IAdminRepository } from '../../Repostries/Admin/IAdminRepostry';
import { ICouponRepository } from '../../Repostries/Coupon/ICouponRepository';
import { IOfferRepository } from '../../Repostries/Offer/IOfferRepository';
import { ICarRepository } from '../../Repostries/Car/ICarRepository';
import { ICarNotificationRepository } from '../../Repostries/CarNotification/ICarNotification';
import { IBookingRepository } from '../../Repostries/BookingRepository/IBookingRepository';
import { IUserRepository } from '../../Repostries/User/IUserRepostry';
import { IProviderRepository } from '../../Repostries/Provider/IProviderRepostry';
import { IAdminServices } from './IAdminServices';


export class AdminServices implements IAdminServices {
  constructor(
    private adminRepostry: IAdminRepository,
    private couponRepository: ICouponRepository,
    private offerRepository: IOfferRepository,
    private carRepository: ICarRepository,
    private carNotificationRepostry: ICarNotificationRepository,
    private bookingRepository: IBookingRepository,
    private userRepostry: IUserRepository,
    private providerRepository: IProviderRepository,
    private encrypt: Encrypt,
    private createjwt: CreateJWT
  ) { }


  // *******************************refresh access token for admin*******************
  async adminGetById(id: string): Promise<adminAuthResponse | null> {
    try {
      let admin = await this.adminRepostry.getAdminById(id)

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

      const refreshToken = this.createjwt.generateRefreshToken(provider.id!);


      return {
        status: OK,
        data: {
          success: true,
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
      const userData = await this.userRepostry.fetchUsers(page, limit);
      const totalPage = (await this.userRepostry.countUsers()) || 0;
      if (userData && userData.length > 0) {
        return {
          status: OK,
          data: {
            success: true,

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

      return await this.userRepostry.editUser(id);
    } catch (error) {

      return null;
    }
  }

  // ****************************update users*********************

  async updateUser(userData: UserInterface, id: string): Promise<UserAuthResponse | undefined> {
    try {

      const provider = await this.userRepostry.updateUser(userData, id);
      return {
        status: 200,
        data: {
          success: true,
          message: 'user update successfully',

        },
      };

    } catch (error) {

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

      return await this.userRepostry.updateStatus(id);
    } catch (error) {

      return null;
    }
  }

  // **********************************fetch providers**********************

  async fetchProviders(page: number, limit: number): Promise<UserAuthResponse | undefined> {
    try {
      const providerData = await this.providerRepository.fetchProviders(page, limit);
      const totalPage = (await this.providerRepository.countProviders()) || 0;

      if (providerData && providerData.length > 0) {
        return {
          status: OK,
          data: {
            success: true,

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

      return await this.providerRepository.editProvider(id);
    } catch (error) {

      return null;
    }
  }

  // *******************************update providers**********************

  async updateProvider(providerData: ProviderInterface, id: string): Promise<UserAuthResponse | undefined> {
    try {

      const provider = await this.providerRepository.updateProvider(providerData, id);

      return {
        status: 200,
        data: {
          success: true,
          message: 'provider update successfully',
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

  // *******************************update status of providers*******************

  async updateStatusProvider(id: string): Promise<ProviderInterface | null> {
    try {
      return await this.providerRepository.updateStatusprovider(id);
    } catch (error) {
      return null;
    }
  }

  //*************************/ fetch notification from car Document********************

  async fetchNotification(): Promise<CarAuthResponse | undefined> {
    try {
      const carNotificationData = await this.carNotificationRepostry.fetchNotification();
      if (carNotificationData && carNotificationData.length > 0) {
        return {
          status: OK,
          data: {
            success: true,
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

      return await this.carNotificationRepostry.carNotificationById(id);
    } catch (error) {

      return null;
    }
  }


  // ******verify notification (accept or reject the car details in notifiation.add car to car model)***********

  async verifynotification(id: string, value: string): Promise<CarDataInterface | null> {
    try {
      
      const carNotification = await this.carNotificationRepostry.verifyNotification(id, value);
  
      if (!carNotification) {
        throw new Error("Notification not found or failed to process");
      }

      if (value === "Accept") {
        const addedCar = await this.carRepository.addCarFromNotification(carNotification);
  
        if (!addedCar) {
          throw new Error("Failed to add car from notification");
        }
  
        return addedCar; 
      }
      const isDeleted = await this.carNotificationRepostry.deleteNotification(id);
  
      if (!isDeleted) {
        throw new Error("Failed to delete notification");
      }
  
      return null; 
    } catch (error) {
      console.error("Error verifying notification:", error);
      return null;
    }
  }
  

  // **************************fetch car for car managementa****************************
  async fetchCars(page: number, limit: number): Promise<CarAuthResponse | undefined> {
    try {
      const carData = await this.carRepository.fetchCars(page, limit);
      console.log(carData, "cardata services")
      const totalPage = (await this.carRepository.countCars()) || 0;

      if (carData && carData.length > 0) {
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
      return await this.carRepository.updateStatusCar(id);
    } catch (error) {
      return null;
    }
  }

  //  ***************************Add offer********************************88
  async addOffer(offer: OfferDataInterface): Promise<OfferAuthResponse | null> {
    try {

      const offerData = await this.offerRepository.addOffer(offer)

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
            message: 'Offers are not found',
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
  // *******************88fetch User*******************8
  async fetchOffer(page: number, limit: number): Promise<OfferAuthResponse | undefined> {
    try {
      const offerData = await this.offerRepository.fetchOffer(page, limit);
      const totalPage = (await this.offerRepository.countOffers()) || 0;

      if (offerData && offerData.length > 0) {
        return {
          status: OK,
          data: {
            success: true,
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

      return await this.offerRepository.editOffer(id);
    } catch (error) {

      return null;
    }
  }
  // ************************update Offer*************8888
  async updateOffer(offerData: OfferDataInterface, id: string): Promise<OfferAuthResponse | undefined> {
    try {

      const provider = await this.offerRepository.updateOffer(offerData, id);
      return {
        status: 200,
        data: {
          success: true,
          message: 'Offer update successfully',

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

  // ***********************delete Offer****************
  async updateStatusOffer(id: string): Promise<OfferDataInterface | null> {
    try {
      return await this.offerRepository.updateStatusOffer(id);
    } catch (error) {
      return null;
    }
  }

  // ***********************add coupon******************
  async addCoupon(coupon: CouponInterface): Promise<CouponAuthResponse | null> {
    try {

      coupon.code = generateRandomCouponCode(8);

      const offerData = await this.couponRepository.addCoupon(coupon);

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
            message: 'Offers are not found',
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

  // *******************88fetch Coupon*******************8
  async fetchCoupon(page: number, limit: number): Promise<CouponAuthResponse | undefined> {
    try {
      const couponData = await this.couponRepository.fetchCoupon(page, limit);
      const totalPage = (await this.couponRepository.countCoupon()) || 0;

      if (couponData && couponData.length > 0) {
        return {
          status: OK,
          data: {
            success: true,
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

      return await this.couponRepository.editCoupon(id);
    } catch (error) {
      return null;
    }
  }

  // ************************update Coupon*************8888
  async updateCoupon(couponData: CouponInterface, id: string): Promise<CouponAuthResponse | undefined> {
    try {
      const updatedCoupon = await this.couponRepository.updateCoupon(couponData, id);


      return {
        status: 200,
        data: {
          success: true,
          message: 'Coupon update successfully',
        },
      };

    } catch (error) {
      console.error("Error upadting offer Data:", (error as Error).message);
      return {
        status: 500,
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
      return await this.couponRepository.updateStatusCoupon(id);
    } catch (error) {
      return null;
    }
  }

  // ************************* booking page************************

  async getBookingHistory(page: number, limit: number): Promise<BookingAuthResponse | undefined> {
    try {

      const bookingHistory = await this.bookingRepository.getBookingHistory(page, limit);
      const totalPage = (await this.bookingRepository.countBooking()) || 0;

      if (bookingHistory && bookingHistory.length > 0) {
        return {
          status: OK,
          data: {
            success: true,
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
      const bookingHistory = await this.bookingRepository.specificBookingDetails(bookingId);
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
      const updateStatus = await this.bookingRepository.updateStatusOfBooking(bookingId, status);
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


  // *****************************get dashboard const data******************88
  async getConstDashboardData(): Promise<DashboardAuthInterface | null> {
    try {
      const totalCars = (await this.carRepository.countCars()) || 0;
      const totalProviders = (await this.providerRepository.countProviders()) || 0;
      const totalUsers = (await this.userRepostry.countUsers()) || 0;
      const totalBookingCount = await this.bookingRepository.CountBookingCar();
      const revenue = (await this.bookingRepository.totalRevenue()) ?? 0;
      const totalBooking = (await this.bookingRepository.countBooking()) ?? 0;
      const revenueByCar = (await this.bookingRepository.revenueByCar()) ?? 0;
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
      return null;
    }
  }

  // *********************************Sales Report**********************
  async fetchSalesReport(page: number, limit: number): Promise<BookingAuthResponse | undefined> {
    try {

      const salesReport = await this.bookingRepository.fetchSalesReport(page, limit);

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

