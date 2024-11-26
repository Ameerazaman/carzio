
import { adminInterface } from "../../Interface/AdminInterface";
import { UserInterface } from "../../Interface/UserInterface";
import userModel from "../../Model/User/UserModel";
import Offer from '../../Model/Admin/OfferModel'
import adminModel from "../../Model/Admin/AdminModel";
import providerModel from "../../Model/Provider/ProviderModel";
import { ProviderInterface } from "../../Interface/ProviderInterface";
import { CarDataInterface } from "../../Interface/CarInterface";
import CarNotification from "../../Model/Provider/CarNotification";
import CarModel from "../../Model/Provider/CarModel";
import { OfferDataInterface } from "../../Interface/OfferInterface";
import Coupon from "../../Model/Admin/CouponModel";
import { CouponInterface } from "../../Interface/CouponInterface";
import mongoose, { ObjectId } from "mongoose";
import { BookingInterface } from "../../Interface/BookingInterface";
import BookingModel from "../../Model/User/BookingModel";


interface UserDocument extends Document {
  email: string;
  password: string;
  username?: string;
  _id: string;
  isBlocked: boolean
}

export class AdminRepository {
  async emailExistCheck(email: string): Promise<adminInterface | null> {
    try {
      const existingAdmin = await adminModel.findOne({ email });

      return existingAdmin as adminInterface;

    } catch (error) {

      return null;
    }
  }

  // ***************************fetch users*************************
  async fetchUsers(page: number, limit: number): Promise<UserInterface[] | null> {
    try {
      const skip = (page - 1) * limit;
      const data = await userModel
        .find()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean() as UserInterface[];


      return data as UserInterface[]
    } catch (error) {
      return null;
    }
  }

  // ***************************fetch providers******************
  async fetchProviders(page: number, limit: number): Promise<UserInterface[] | null> {
    try {
      const skip = (page - 1) * limit;

      const data = await providerModel
        .find()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean() as UserInterface[];

      return data as UserInterface[]
    } catch (error) {
      return null;
    }
  }

  // **********************edit users***********************

  async editUser(userId: string): Promise<UserInterface | null> {
    try {

      let check = await userModel.findById(userId);

      if (check) {
        return {
          _id: check._id.toString(),
          username: check.username,
          email: check.email,
          password: check.password
        } as UserInterface;
      }
      return null;
    }
    catch (error) {
      return null;
    }
  }
  // *************************update user************************

  async updateUser(userData: UserInterface, id: string): Promise<UserInterface | null> {
    try {
      const editUser = await userModel.findByIdAndUpdate(
        { _id: id },
        {
          username: userData.username,
          email: userData.email,

        },
        { new: true }
      ).lean<UserInterface>();

      return editUser;
    } catch (error) {

      return null;
    }
  }

  // *********************8update status*******************

  async updateStatus(userId: string): Promise<UserInterface | null> {
    try {

      let user = await userModel.findById(userId);

      if (!user) {

        return null;
      }

      const updateUser = await userModel.findByIdAndUpdate(
        { _id: userId },
        { isBlocked: !user.isBlocked },
        { new: true }
      );

      return updateUser as UserInterface;
    } catch (error) {

      return null;
    }
  }

  // **********************edit provider*********************

  async editProvider(providerId: string): Promise<ProviderInterface | null> {
    try {

      let check = await providerModel.findById(providerId);

      if (check) {
        return {
          _id: check._id.toString(),
          username: check.username,
          email: check.email,
          password: check.password
        } as ProviderInterface;
      }
      return null;
    }
    catch (error) {
      return null;
    }
  }
  // ***************************update provider************************

  async updateProvider(providerData: ProviderInterface, id: string): Promise<ProviderInterface | null> {
    try {

      const editProvider = await providerModel.findByIdAndUpdate(
        { _id: id },
        {
          username: providerData.username,
          email: providerData.email,

        },
        { new: true }
      ).lean<ProviderInterface>();

      return editProvider;
    } catch (error) {

      return null;
    }
  }

  // *****************************update ststus provider**************

  async updateStatusprovider(providerId: string): Promise<ProviderInterface | null> {
    try {
      let provider = await providerModel.findById(providerId);

      if (!provider) {

        return null;
      }
      const updateProvider = await providerModel.findByIdAndUpdate(
        providerId,
        { isBlocked: !provider.isBlocked },
        { new: true }
      );

      return updateProvider as ProviderInterface;
    } catch (error) {
      return null;
    }
  }

  // *****************8get adminby Id*********************8

  async getAdminById(id: string): Promise<adminInterface | null> {
    try {

      const existingUser = await adminModel.findById(id);

      return existingUser as adminInterface;
    } catch (error) {

      return null;
    }
  }

  // *******************fetch Notifications from Car Documents***************
  async fetchNotification(): Promise<CarDataInterface[] | null> {
    try {

      const data = await CarNotification.find() as CarDataInterface[];

      const notification: CarDataInterface[] = data.map((carDocument: any) => ({
        id: carDocument._id?.toString(),
        car_name: carDocument.car_name,
        model: carDocument.model,
        rentalPrice: carDocument.rentalPrice,
        engineType: carDocument.engineType,
        fuelType: carDocument.fuelType,
        color: carDocument.color,
        images: carDocument.images,
        rcNumber: carDocument.rcNumber,
        rcExpiry: carDocument.rcExpiry,
        insurancePolicyNumber: carDocument.insurancePolicyNumber,
        insuranceExpiry: carDocument.insuranceExpiry,
        pollutionCertificateNumber: carDocument.pollutionCertificateNumber,
        pollutionExpiry: carDocument.pollutionExpiry,
        isStatus: carDocument.isStatus,
        providerId: carDocument.providerId ? carDocument.providerId.toString() : undefined,
        createdAt: carDocument.createdAt,
      }));

      return notification;
    } catch (error) {

      return null;
    }
  }
  // ******************************get car details for notification*******************
  async carNotificationById(id: string): Promise<CarDataInterface | null> {
    try {

      const carDocumentExist = await CarNotification.findById(id);

      return carDocumentExist as CarDataInterface;
    } catch (error) {

      return null;
    }
  }
  //**********************verify notification(car notification details addto car model and deleted notifcation***********)
  async verifyNotification(id: string, value: string): Promise<CarDataInterface | null> {
    try {
      let carDocument;

      if (value === "Accept") {
        carDocument = await CarNotification.findById(id);

        if (carDocument) {

          const newCar = new CarModel({
            car_name: carDocument.car_name,
            model: carDocument.model,
            rentalPrice: carDocument.rentalPrice,
            engineType: carDocument.engineType,
            fuelType: carDocument.fuelType,
            color: carDocument.color,
            images: carDocument.images,
            rcNumber: carDocument.rcNumber,
            rcExpiry: carDocument.rcExpiry,
            insurancePolicyNumber: carDocument.insurancePolicyNumber,
            insuranceExpiry: carDocument.insuranceExpiry,
            pollutionCertificateNumber: carDocument.pollutionCertificateNumber,
            pollutionExpiry: carDocument.pollutionExpiry,
            providerId: carDocument.providerId,
            isBlocked: false,
          });

          await newCar.save();
        }
      }

      const result = await CarNotification.deleteOne({ _id: id });

      return result;
    } catch (error) {

      return null;
    }
  }


  // ******************************fetch car for car management**********************
  async fetchCars(page: number, limit: number): Promise<CarDataInterface[] | null> {
    try {
      const skip = (page - 1) * limit;
      const carDocuments = await CarModel
        .find()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit) as CarDataInterface[];

      const cars: CarDataInterface[] = carDocuments.map((car: CarDataInterface) => ({
        car_name: car.car_name,
        model: car.model,
        rentalPrice: car.rentalPrice,
        engineType: car.engineType,
        fuelType: car.fuelType,
        color: car.color,
        images: car.images,
        rcNumber: car.rcNumber,
        rcExpiry: car.rcExpiry,
        insurancePolicyNumber: car.insurancePolicyNumber,
        insuranceExpiry: car.insuranceExpiry,
        pollutionCertificateNumber: car.pollutionCertificateNumber,
        pollutionExpiry: car.pollutionExpiry,
        providerId: car.providerId,
        isStatus: car.isStatus,
        createdAt: car.createdAt,
        id: car.id
      }));

      return cars;
    } catch (error) {
      return null;
    }
  }

  // *******************************change status of car*****************
  async updateStatusCar(carId: string): Promise<CarDataInterface | null> {
    try {

      let car = await CarModel.findById(carId);
      if (!car) {

        return null;
      }


      const updateCar = await CarModel.findByIdAndUpdate(
        car,
        { isBlocked: !car.isBlocked },
        { new: true }
      );

      return updateCar as CarDataInterface;
    } catch (error) {

      return null;
    }
  }
  // *******************************Add Offer******************
  async addOffer(offer: OfferDataInterface): Promise<OfferDataInterface | null> {
    try {

      const newOffer = new Offer({
        carName: offer.carName,
        offerTitle: offer.offerTitle,
        startDate: new Date(offer.startDate),
        endDate: new Date(offer.endDate),
        discountPercentage: offer.discountPercentage,
      });
      const savedOffer = (await newOffer.save()) as unknown as OfferDataInterface;
      console.log(savedOffer)
      return {
        carName: savedOffer.carName,
        offerTitle: savedOffer.offerTitle,
        startDate: savedOffer.startDate,
        endDate: savedOffer.endDate,
        discountPercentage: savedOffer.discountPercentage,
        id: savedOffer.id?.toString() || "",
        isActive: savedOffer?.isActive
      };
    } catch (error) {

      return null;
    }
  }
  // ********************************fetch offers*********************
  async fetchOffer(page: number, limit: number): Promise<OfferDataInterface[] | null> {
    try {

      const skip = (page - 1) * limit;
      const data = await Offer
        .find()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit) as OfferDataInterface[];

      const offers: OfferDataInterface[] = data.map((offer: OfferDataInterface) => ({
        carName: offer.carName,
        offerTitle: offer.offerTitle,
        startDate: offer.startDate,
        endDate: offer.endDate,
        discountPercentage: offer.discountPercentage,
        id: offer.id?.toString() || "",
        isActive: offer?.isActive
      }));

      return offers;
    } catch (error) {
      return null;
    }
  }
  // **************************edit Offer*************************8
  async editOffer(offerId: string): Promise<OfferDataInterface | null> {
    try {
      let check = await Offer.findById(offerId);
      if (check) {
        return {
          carName: check.carName,
          offerTitle: check.offerTitle,
          startDate: check.startDate,
          endDate: check.endDate,
          discountPercentage: check.discountPercentage,
          id: check._id?.toString() || "",
          isActive: check?.isActive
        }
      }
      return null;
    }
    catch (error) {

      return null;
    }
  }

  // *******************************update Offer********************
  async updateOffer(offerData: OfferDataInterface, id: string): Promise<OfferDataInterface | null> {
    try {

      const updatedOffer = await Offer.findByIdAndUpdate(
        id,
        {
          carName: offerData.carName,
          offerTitle: offerData.offerTitle,
          startDate: offerData.startDate,
          endDate: offerData.endDate,
          discountPercentage: offerData.discountPercentage,
        },
        { new: true }
      ).lean<OfferDataInterface>();
      return updatedOffer;
    } catch (error) {

      return null;
    }
  }
  // ***********************updateStatus offer********************88
  async updateStatusOffer(offerId: string): Promise<OfferDataInterface | null> {
    try {
      let offer = await Offer.findById(offerId);

      if (!offer) {

        return null;
      }
      const updateOffer = await Offer.findByIdAndUpdate(
        offer,
        { isActive: !offer.isActive },
        { new: true }
      );

      return updateOffer as OfferDataInterface;
    } catch (error) {

      return null;
    }
  }
  // **************************add coupon*****************
  async addCoupon(coupon: CouponInterface): Promise<CouponInterface | null> {
    try {
      const newCoupon = new Coupon({
        discountPercentage: coupon.discountPercentage ?? 0,
        minRentalAmount: coupon.minRentalAmount ?? 0,
        startDate: new Date(coupon.startDate),
        endDate: new Date(coupon.endDate),
        isActive: coupon.isActive ?? true,
        userId: coupon.userId || [],
        code: coupon.code
      });

      const savedCoupon = (await newCoupon.save()) as unknown as CouponInterface
      console.log(savedCoupon);

      return {
        code: savedCoupon.code ?? "",
        discountPercentage: savedCoupon.discountPercentage,
        minRentalAmount: savedCoupon.minRentalAmount,
        startDate: savedCoupon.startDate,
        endDate: savedCoupon.endDate,
        isActive: savedCoupon.isActive,
        userId: savedCoupon.userId,
        id: savedCoupon.id?.toString() || "",
      };
    } catch (error) {

      return null;
    }
  }
  // ********************************fetch coupon*********************
  async fetchCoupon(page: number, limit: number): Promise<CouponInterface[] | null> {
    try {
      const skip = (page - 1) * limit;

      const data = await Coupon.find()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean();

      const coupons: CouponInterface[] = data.map((coupon: any) => ({
        code: coupon.code ?? null,
        discountPercentage: coupon.discountPercentage ?? null,
        startDate: coupon.startDate ?? null,
        endDate: coupon.endDate ?? null,
        isActive: coupon.isActive ?? false,
        minRentalAmount: coupon.minRentalAmount ?? null,
        userId: coupon.userId ?? [],
        id: coupon._id?.toString() || "",
      }));

      return coupons;
    } catch (error) {
      return null;
    }
  }

  // **************************edit Offer*************************8
  async editCoupon(couponId: string): Promise<CouponInterface | null> {
    try {
      let coupon = await Coupon.findById(couponId);
      if (coupon) {
        return {
          code: coupon.code ?? "",
          discountPercentage: coupon.discountPercentage ?? 0,
          minRentalAmount: coupon.minRentalAmount ?? 0,
          startDate: coupon.startDate ?? "",
          endDate: coupon.endDate ?? "",
          isActive: coupon.isActive ?? false,
          userId: coupon.userId ?? [],
          id: coupon.id?.toString() || "",
        } as CouponInterface;
      }
      return null;
    }
    catch (error) {

      return null;
    }
  }

  // *******************************update coupon********************
  async updateCoupon(couponData: CouponInterface, id: string): Promise<CouponInterface | null> {
    try {
      const updatedCoupon = await Coupon.findByIdAndUpdate(
        id,
        {
          code: couponData.code ?? "",
          discountPercentage: couponData.discountPercentage ?? 0,
          minRentalAmount: couponData.minRentalAmount ?? 0,
          startDate: couponData.startDate ?? "",
          endDate: couponData.endDate ?? "",
          isActive: couponData.isActive ?? false,
          userId: couponData.userId ?? [],
        },
        { new: true }
      ).lean<CouponInterface>();
      return updatedCoupon;
    } catch (error) {

      return null;
    }
  }

  // ***********************updateStatus oupon********************88
  async updateStatusCoupon(couponId: string): Promise<CouponInterface | null> {
    try {
      let coupon = await Coupon.findById(couponId);
      if (!coupon) {
        return null;
      }
      const updateCoupon = await Coupon.findByIdAndUpdate(
        couponId,
        { isActive: !coupon.isActive },
        { new: true }
      );

      if (updateCoupon) {
        return {
          code: updateCoupon.code ?? "",
          discountPercentage: updateCoupon.discountPercentage ?? 0,
          minRentalAmount: updateCoupon.minRentalAmount ?? 0,
          startDate: updateCoupon.startDate ? updateCoupon.startDate.toISOString() : "",
          endDate: updateCoupon.endDate ? updateCoupon.endDate.toISOString() : "",
          isActive: updateCoupon.isActive ?? false,
          userId: updateCoupon.userId?.map((id: ObjectId) => id.toString()) ?? [],
          id: updateCoupon._id.toString(),
        } as CouponInterface;
      }

      return null;
    } catch (error) {
      return null;
    }
  }
  // ***************************booking history*****************

  async getBookingHistory(page: number, limit: number): Promise<BookingInterface[] | null> {
    try {
      const skip = (page - 1) * limit;

      const bookingHistory = await BookingModel.aggregate([
        {
          $addFields: {
            CarsObjectId: { $toObjectId: "$CarsId" }
          }
        },
        {
          $lookup: {
            from: 'carmodels',
            localField: 'CarsObjectId',
            foreignField: '_id',
            as: 'bookingDetails',
          },
        },
        { $unwind: '$bookingDetails' },
        { $sort: { createdAt: -1 } },
        { $skip: (page - 1) * limit },
        { $limit: limit }
      ]);
      return bookingHistory.length ? bookingHistory : null;
    } catch (error) {
      return null;
    }
  }
  // / ***************************specific booking details*****************

  async specificBookingDetails(bookingId: string): Promise<BookingInterface | null> {
    try {

      const objectId = new mongoose.Types.ObjectId(bookingId);

      const bookingHistory = await BookingModel.aggregate([
        { $match: { _id: objectId } },
        {
          $addFields: {
            CarsObjectId: { $toObjectId: "$CarsId" },
            UserAddressObjectId: { $toObjectId: "$UserAddressId" }
          }
        },
        {
          $lookup: {
            from: 'carmodels',
            localField: 'CarsObjectId',
            foreignField: '_id',
            as: 'bookingDetails'
          }
        },
        { $unwind: '$bookingDetails' },
        {
          $lookup: {
            from: 'useraddressmodels',
            localField: 'UserAddressObjectId',
            foreignField: '_id',
            as: 'userAddress'
          }
        },
        { $unwind: '$userAddress' }
      ]);

      return bookingHistory[0] || null;
    } catch (error) {
      return null;
    }
  }
  //  // *******************************update status for booking*****************

  async updateStatusOfBooking(bookingId: string, status: string): Promise<BookingInterface | null> {
    try {
      const updatedBooking = await BookingModel.findByIdAndUpdate(
        bookingId,
        { status: status },
        { new: true }
      );
      return updatedBooking as BookingInterface
    } catch (error) {
      return null;
    }

  }

  // ******************************get total cars********************
  async countCars(): Promise<number | null> {
    try {
      const countCars = await CarModel.find().countDocuments();;
      return countCars;
    } catch (error) {
      return null;
    }
  }
  // ********************************count users**********************

  async countUsers(): Promise<number | null> {
    try {
      const countUsers = await userModel.countDocuments();
      return countUsers;
    } catch (error) {
      return null;
    }
  }

  //**********************/ Count Providers*******************
  async countProviders(): Promise<number | null> {
    try {
      const countProviders = await providerModel.countDocuments();
      return countProviders;
    } catch (error) {
      return null;
    }
  }
  // **************************car bookings based one car***********************


  async CountBookingCar(): Promise<{ carName: string, count: number }[]> {
    try {
      const bookingCountByCar = await BookingModel.aggregate([
        {
          $addFields: {
            CarsId: { $toObjectId: '$CarsId' },
          },
        },
        {
          $lookup: {
            from: 'carmodels',
            localField: 'CarsId',
            foreignField: '_id',
            as: 'carDetails',
          },
        },
        {
          $unwind: '$carDetails',
        },
        {
          $group: {
            _id: '$carDetails.car_name',
            count: { $sum: 1 },
          },
        },

        {
          $project: {
            carName: '$_id',
            count: 1,
            _id: 0,
          },
        },

        {
          $sort: {
            count: -1,
          },
        },
      ]);
      return bookingCountByCar;
    } catch (error) {
      return [];
    }
  }

  // ********************************revenue based on each car*******************
  async totalRevenue(): Promise<number | null> {
    try {
      const bookings = await BookingModel.find();
      const totalCompletedAmount = bookings
        .filter((booking) => booking.status === "Completed")
        .reduce((sum, booking) => sum + booking.total_Amt, 0);
      return totalCompletedAmount / 2;
    } catch (error) {

      return null;
    }
  }
  // ***************************total Bookings*******************************
  async countBooking(): Promise<number | null> {
    try {
      const countBooking = await BookingModel.countDocuments();
      return countBooking;
    } catch (error) {
      return null;
    }
  }
  // ***************************total opffers*******************************
  async countOffers(): Promise<number | null> {
    try {
      const countOffers = await Offer.countDocuments();
      return countOffers;
    } catch (error) {
      return null;
    }
  }
  // ***************************total opffers*******************************
  async countNotification(): Promise<number | null> {
    try {
      const countNotification = await CarNotification.countDocuments();
      return countNotification;
    } catch (error) {
      return null;
    }
  }
  // ***************************total Coupons*******************************
  async countCoupon(): Promise<number | null> {
    try {
      const countCoupon = await Coupon.countDocuments();
      return countCoupon;
    } catch (error) {
      return null;
    }
  }
  // **************************revenue based on car*********************

  async revenueByCar(): Promise<{ carName: string, amount: number }[]> {
    try {
      const bookingCountByCar = await BookingModel.aggregate([

        {
          $match: {
            status: 'Completed',
          },
        },

        {
          $addFields: {
            CarsId: { $toObjectId: '$CarsId' },
          },
        },

        {
          $lookup: {
            from: 'carmodels',
            localField: 'CarsId',
            foreignField: '_id',
            as: 'carDetails',
          },
        },

        {
          $unwind: '$carDetails',
        },

        {
          $group: {
            _id: '$carDetails.car_name',
            count: { $sum: 1 },
            amount: { $sum: '$total_Amt' },
          },
        },

        {
          $project: {
            carName: '$_id',
            count: 1,
            amount: 1,
            _id: 0,
          },
        },

        {
          $sort: {
            amount: -1,
          },
        },
      ]);

      return bookingCountByCar;
    } catch (error) {

      return [];
    }
  }

  // **********************************Sales Report****************
  async fetchSalesReport(page: number, limit: number): Promise<BookingInterface[] | null> {
    try {
      const skip = (page - 1) * limit;
      const completedBookings = await BookingModel.find({ status: 'Completed' })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit) as BookingInterface[];
      return completedBookings;
    } catch (error) {

      return null;
    }
  }



}
