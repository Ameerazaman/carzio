
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
// Assuming OtpDocument is defined for the Otp schema
interface UserDocument extends Document {
  email: string;
  password: string;
  username?: string;
  _id: string;
  isBlocked: boolean
}

export class AdminRepository {
  // This function checks if an email exists in the provider database
  async emailExistCheck(email: string): Promise<adminInterface | null> {
    try {
      const existingAdmin = await adminModel.findOne({ email });
      console.log(existingAdmin, "repostries")
      return existingAdmin as adminInterface;
    } catch (error) {
      console.log("Error checking email existence:", error);
      return null;
    }
  }
  // ***************************fetch users*************************
  async fetchUsers(page: number, limit: number): Promise<UserInterface[] | null> {
    try {
      const skip = (page - 1) * limit;

      // Use .lean() to return plain JavaScript objects
      const data = await userModel
        .find()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean() as UserInterface[];


      return data as UserInterface[]
    } catch (error) {
      console.error("Error fetching users:", error);
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
      console.error("Error fetching users:", error);
      return null;
    }
  }

  // **********************edit users***********************

  async editUser(userId: string): Promise<UserInterface | null> {
    try {

      console.log(userId, "userId in editUser");

      let check = await userModel.findById(userId);

      console.log(check, "check");

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
      console.error("Error fetching user:", error);
      return null;
    }
  }
  // *************************update user************************

  async updateUser(userData: UserInterface, id: string): Promise<UserInterface | null> {
    try {
      console.log("repostry in edit Profile", userData)
      const editUser = await userModel.findByIdAndUpdate(
        { _id: id },
        {
          username: userData.username,
          email: userData.email,

        },
        { new: true }
      ).lean<UserInterface>();

      console.log(editUser, "editUser after saving");
      return editUser;
    } catch (error) {
      console.error("Error saving user:", error);
      return null;
    }
  }

  // *********************8update status*******************

  async updateStatus(userId: string): Promise<UserInterface | null> {
    try {

      console.log(userId, "userId in updateStatus");

      let user = await userModel.findById(userId);

      if (!user) {
        console.error("User not found");
        return null;
      }

      const updateUser = await userModel.findByIdAndUpdate(
        { _id: userId },
        { isBlocked: !user.isBlocked },
        { new: true }
      );

      return updateUser as UserInterface;
    } catch (error) {
      console.error("Error updating user status:", error);
      return null;
    }
  }

  // **********************edit provider*********************

  async editProvider(providerId: string): Promise<ProviderInterface | null> {
    try {

      console.log(providerId, "provider in editUser");

      let check = await providerModel.findById(providerId);

      console.log(check, "check");

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
      console.error("Error fetching provider:", error);
      return null;
    }
  }
  // ***************************update provider************************

  async updateProvider(providerData: ProviderInterface, id: string): Promise<ProviderInterface | null> {
    try {
      console.log("repostry in edit provider", providerData)
      const editProvider = await providerModel.findByIdAndUpdate(
        { _id: id },
        {
          username: providerData.username,
          email: providerData.email,

        },
        { new: true }
      ).lean<ProviderInterface>();

      console.log(editProvider, "editProvider after saving");
      return editProvider;
    } catch (error) {
      console.error("Error saving provider:", error);
      return null;
    }
  }

  // *****************************update ststus provider**************

  async updateStatusprovider(providerId: string): Promise<ProviderInterface | null> {
    try {

      console.log(providerId, "providerId in updateStatus");

      let provider = await providerModel.findById(providerId);
      console.log(provider, "provider when find")
      if (!provider) {
        console.error("provider not found");
        return null;
      }
      const updateProvider = await providerModel.findByIdAndUpdate(
        providerId,
        { isBlocked: !provider.isBlocked },
        { new: true }
      );

      console.log(updateProvider, "update provider")

      return updateProvider as ProviderInterface;
    } catch (error) {
      console.error("Error updating user status:", error);
      return null;
    }
  }

  // *****************8get adminby Id*********************8

  async getAdminById(id: string): Promise<adminInterface | null> {
    try {
      console.log(id, "refresh tojken id")
      const existingUser = await adminModel.findById(id);
      console.log(existingUser, "exist user")
      return existingUser as adminInterface;
    } catch (error) {
      console.log("Error checking email existence:", error);
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
      console.log(notification, "notifications")
      return notification;
    } catch (error) {
      console.error("Error fetching car data:", error);
      return null;
    }
  }
  // ******************************get car details for notification*******************
  async carNotificationById(id: string): Promise<CarDataInterface | null> {
    try {

      const carDocumentExist = await CarNotification.findById(id);
      console.log(carDocumentExist, "car document")
      return carDocumentExist as CarDataInterface;
    } catch (error) {
      console.log("Error checking email existence:", error);
      return null;
    }
  }
  //**********************verify notification(car notification details addto car model and deleted notifcation***********)
  async verifyNotification(id: string, value: string): Promise<CarDataInterface | null> {
    try {
      let carDocument;

      if (value === "Accept") {
        carDocument = await CarNotification.findById(id);
        console.log(carDocument, "car document in notification");

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
      console.log("Error verifying notification:", error); // More detailed log
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
      console.error("Error fetching cars:", error);
      return null;
    }
  }

  // *******************************change status of car*****************
  async updateStatusCar(carId: string): Promise<CarDataInterface | null> {
    try {

      console.log(carId, "providerId in updateStatus");


      let car = await CarModel.findById(carId);
      console.log(car, "provider when find")
      if (!car) {
        console.error("provider not found");
        return null;
      }


      const updateCar = await CarModel.findByIdAndUpdate(
        car,
        { isBlocked: !car.isBlocked },
        { new: true }
      );

      console.log(updateCar, "update car")

      return updateCar as CarDataInterface;
    } catch (error) {
      console.error("Error updating car status:", error);
      return null;
    }
  }
  // *******************************Add Offer******************
  async addOffer(offer: OfferDataInterface): Promise<OfferDataInterface | null> {
    try {
      console.log(offer, "offer in repostry")
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
        isActive: savedOffer?.isActive // Convert `_id` to string
      };
    } catch (error) {
      console.error("Error adding offer in repository:", error);
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


      console.log("Offers in management:", data);

      const offers: OfferDataInterface[] = data.map((offer: OfferDataInterface) => ({
        carName: offer.carName,
        offerTitle: offer.offerTitle,
        startDate: offer.startDate,
        endDate: offer.endDate,
        discountPercentage: offer.discountPercentage,
        id: offer.id?.toString() || "",
        isActive: offer?.isActive// Convert `_id` to string if present
      }));

      return offers;
    } catch (error) {
      console.error("Error fetching offers:", error);
      return null;
    }
  }
  // **************************edit Offer*************************8
  async editOffer(offerId: string): Promise<OfferDataInterface | null> {
    try {

      console.log(offerId, "offer in offer mgt");

      let check = await Offer.findById(offerId);

      console.log(check, "check");

      if (check) {
        return {
          carName: check.carName,
          offerTitle: check.offerTitle,
          startDate: check.startDate,
          endDate: check.endDate,
          discountPercentage: check.discountPercentage,
          id: check._id?.toString() || "",
          isActive: check?.isActive // Convert `_id` to string
        }
      }
      return null;
    }
    catch (error) {
      console.error("Error fetching offer:", error);
      return null;
    }
  }

  // *******************************update Offer********************
  async updateOffer(offerData: OfferDataInterface, id: string): Promise<OfferDataInterface | null> {
    try {
      console.log("Updating offer data:", offerData);


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

      console.log(updatedOffer, "Updated offer after saving");
      return updatedOffer;
    } catch (error) {
      console.error("Error updating offer:", error);
      return null;
    }
  }
  // ***********************updateStatus offer********************88
  async updateStatusOffer(offerId: string): Promise<OfferDataInterface | null> {
    try {

      console.log(offerId, "offerId in updateStatus");


      let offer = await Offer.findById(offerId);
      console.log(offer, "offer when find")
      if (!offer) {
        console.error("offer not found");
        return null;
      }


      const updateOffer = await Offer.findByIdAndUpdate(
        offer,
        { isActive: !offer.isActive },
        { new: true }
      );

      console.log(updateOffer, "update car")

      return updateOffer as OfferDataInterface;
    } catch (error) {
      console.error("Error updating car status:", error);
      return null;
    }
  }
  // **************************add coupon*****************
  async addCoupon(coupon: CouponInterface): Promise<CouponInterface | null> {
    try {
      console.log(coupon, "coupon in repository");

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
        id: savedCoupon.id?.toString() || "", // Convert `_id` to string
      };
    } catch (error) {
      console.error("Error adding coupon in repository:", error);
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

      console.log("coupon in management:", data);

      const coupons: CouponInterface[] = data.map((coupon: any) => ({
        code: coupon.code ?? null,
        discountPercentage: coupon.discountPercentage ?? null,
        startDate: coupon.startDate ?? null,
        endDate: coupon.endDate ?? null,
        isActive: coupon.isActive ?? false,
        minRentalAmount: coupon.minRentalAmount ?? null,
        userId: coupon.userId ?? [],
        id: coupon._id?.toString() || "", // Convert `_id` to string
      }));

      return coupons;
    } catch (error) {
      console.error("Error fetching offers:", error);
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
      console.error("Error fetching offer:", error);
      return null;
    }
  }

  // *******************************update coupon********************
  async updateCoupon(couponData: CouponInterface, id: string): Promise<CouponInterface | null> {
    try {
      console.log("Updating couponData", couponData);

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

      console.log(updatedCoupon, "Updated offer after saving");
      return updatedCoupon;
    } catch (error) {
      console.error("Error updating offer:", error);
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
      console.error("Error updating car status:", error);
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
      console.log(bookingHistory, "booking history");
      return bookingHistory.length ? bookingHistory : null;
    } catch (error) {
      console.error("Error fetching booking history with car details:", (error as Error).message);
      return null;
    }
  }
  // / ***************************specific booking details*****************

  async specificBookingDetails(bookingId: string): Promise<BookingInterface | null> {
    try {
      // Convert bookingId to an ObjectId
      const objectId = new mongoose.Types.ObjectId(bookingId);

      const bookingHistory = await BookingModel.aggregate([
        { $match: { _id: objectId } },
        {
          $addFields: {
            CarsObjectId: { $toObjectId: "$CarsId" }, // Convert CarsId to ObjectId
            UserAddressObjectId: { $toObjectId: "$UserAddressId" } // Convert UserAddressId to ObjectId
          }
        },
        {
          $lookup: {
            from: 'carmodels', // Collection name for CarModel
            localField: 'CarsObjectId',
            foreignField: '_id',
            as: 'bookingDetails'
          }
        },
        { $unwind: '$bookingDetails' }, // Flatten bookingDetails array
        {
          $lookup: {
            from: 'useraddressmodels', // Collection name for UserAddress
            localField: 'UserAddressObjectId',
            foreignField: '_id',
            as: 'userAddress'
          }
        },
        { $unwind: '$userAddress' } // Flatten userAddress array
      ]);

      console.log(bookingHistory, "booking history");
      return bookingHistory[0] || null; // Return the first matched result or null if none found
    } catch (error) {
      console.error("Error fetching booking history with car and address details:", (error as Error).message);
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
      console.error("Error fetching booking history with car and address details:", (error as Error).message);
      return null;


    }

  }

  // ******************************get total cars********************
  async countCars(): Promise<number | null> {
    try {
      const countCars = await CarModel.find().countDocuments();;
      return countCars;
    } catch (error) {
      console.error("Error fetching car count:", (error as Error).message);
      return null;
    }
  }
  // ********************************count users**********************

  async countUsers(): Promise<number | null> {
    try {
      const countUsers = await userModel.countDocuments();
      return countUsers;
    } catch (error) {
      console.error("Error fetching user count:", (error as Error).message);
      return null;
    }
  }

  //**********************/ Count Providers*******************
  async countProviders(): Promise<number | null> {
    try {
      const countProviders = await providerModel.countDocuments();
      return countProviders;
    } catch (error) {
      console.error("Error fetching provider count:", (error as Error).message);
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
            from: 'carmodels',          // The collection to join with
            localField: 'CarsId',       // The field in bookings to match with cars
            foreignField: '_id',        // The field in cars to match with
            as: 'carDetails',           // The alias for the joined data
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

      console.log(bookingCountByCar, "bookingCountByCar"); // Log the results

      return bookingCountByCar;
    } catch (error) {
      console.error("Error fetching booking count by car:", (error as Error).message);
      return [];
    }
  }

  // ********************************revenue based on each car*******************
  async totalRevenue(): Promise<number | null> {
    try {
      const bookings = await BookingModel.find();
      const totalCompletedAmount = bookings
        .filter((booking) => booking.status === "Completed")  // Filter by status
        .reduce((sum, booking) => sum + booking.total_Amt, 0);
      return totalCompletedAmount / 2;
    } catch (error) {
      console.error("Error fetching provider count:", (error as Error).message);
      return null;
    }
  }
  // ***************************total Bookings*******************************
  async countBooking(): Promise<number | null> {
    try {
      const countBooking = await BookingModel.countDocuments();
      return countBooking;
    } catch (error) {
      console.error("Error fetching provider count:", (error as Error).message);
      return null;
    }
  }
  // ***************************total opffers*******************************
  async countOffers(): Promise<number | null> {
    try {
      const countOffers = await Offer.countDocuments();
      return countOffers;
    } catch (error) {
      console.error("Error fetching provider count:", (error as Error).message);
      return null;
    }
  }
  // ***************************total opffers*******************************
  async countNotification(): Promise<number | null> {
    try {
      const countNotification = await CarNotification.countDocuments();
      return countNotification;
    } catch (error) {
      console.error("Error fetching provider count:", (error as Error).message);
      return null;
    }
  }
  // ***************************total Coupons*******************************
  async countCoupon(): Promise<number | null> {
    try {
      const countCoupon = await Coupon.countDocuments();
      return countCoupon;
    } catch (error) {
      console.error("Error fetching provider count:", (error as Error).message);
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

      console.log(bookingCountByCar, "bookingCountByCar");

      return bookingCountByCar;
    } catch (error) {
      console.error("Error fetching revenue by car", (error as Error).message);
      return [];
    }
  }

  // **********************************Sales Report****************
  async  fetchSalesReport(page: number, limit: number): Promise<BookingInterface[] | null> {
    try {
      const skip = (page - 1) * limit;
      const completedBookings = await BookingModel.find({ status: 'Completed' })
        .sort({ createdAt: -1 }) 
        .skip(skip)
        .limit(limit) as BookingInterface[];
      return completedBookings; 
    } catch (error) {
      console.error("Error fetching sales report", (error as Error).message);
      return null; 
    }
  }
  


}
