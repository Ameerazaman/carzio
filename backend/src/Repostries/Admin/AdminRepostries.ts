
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
import { ObjectId } from "mongoose";
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

  async fetchUsers(): Promise<UserInterface[] | null> {
    try {
      // Fetch users from the database, providing the expected document type
      const data = await userModel.find() as UserDocument[]; // This returns an array of Mongoose documents

      console.log("Users in management", data);

      // Map the documents to UserInterface
      const users: UserInterface[] = data.map((user: UserDocument) => ({
        id: user._id.toString(), // Convert ObjectId to string for 'id'
        email: user.email, // Access fields directly, since they're strongly typed
        password: user.password,
        username: user.username || undefined,
        isBlocked: user.isBlocked  // Optional field
      }));

      return users;
    } catch (error) {
      console.error("Error fetching users:", error);
      return null;
    }
  }

  async fetchProviders(): Promise<UserInterface[] | null> {
    try {
      // Fetch users from the database, providing the expected document type
      const data = await providerModel.find() as UserDocument[]; // This returns an array of Mongoose documents


      console.log()
      // Map the documents to UserInterface
      const providers: UserInterface[] = data.map((provider: UserDocument) => ({
        id: provider._id.toString(), // Convert ObjectId to string for 'id'
        email: provider.email, // Access fields directly, since they're strongly typed
        password: provider.password,
        username: provider.username || undefined,
        isBlocked: provider.isBlocked // Optional field
      }));

      return providers;
    } catch (error) {
      console.error("Error fetching provider:", error);
      return null;
    }
  }

  async editUser(userId: string): Promise<UserInterface | null> {
    try {
      // Log the userId to ensure it's passed correctly
      console.log(userId, "userId in editUser");

      // Pass userId directly to findById (no need for an object)
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


  async updateUser(userData: UserInterface, id: string): Promise<UserInterface | null> {
    try {
      console.log("repostry in edit Profile", userData)
      const editUser = await userModel.findByIdAndUpdate(
        { _id: id },
        {
          username: userData.username,
          email: userData.email,

        },
        { new: true } // To return the updated document
      ).lean<UserInterface>(); // Convert to plain JS object

      console.log(editUser, "editUser after saving");
      return editUser; // Return the updated object as the correct type
    } catch (error) {
      console.error("Error saving user:", error);
      return null; // Return null on error
    }
  }

  async updateStatus(userId: string): Promise<UserInterface | null> {
    try {
      // Log the userId to ensure it's passed correctly
      console.log(userId, "userId in updateStatus");

      // Find the user by ID
      let user = await userModel.findById(userId);

      if (!user) {
        console.error("User not found");
        return null;
      }

      // Toggle the `isBlocked` status
      const updateUser = await userModel.findByIdAndUpdate(
        { _id: userId },
        { isBlocked: !user.isBlocked }, // Flip the isBlocked status
        { new: true } // Return the updated user document
      );

      return updateUser as UserInterface;
    } catch (error) {
      console.error("Error updating user status:", error);
      return null;
    }
  }


  async editProvider(providerId: string): Promise<ProviderInterface | null> {
    try {
      // Log the providerId to ensure it's passed correctly
      console.log(providerId, "provider in editUser");

      // Pass userId directly to findById (no need for an object)
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


  async updateProvider(providerData: ProviderInterface, id: string): Promise<ProviderInterface | null> {
    try {
      console.log("repostry in edit provider", providerData)
      const editProvider = await providerModel.findByIdAndUpdate(
        { _id: id },
        {
          username: providerData.username,
          email: providerData.email,

        },
        { new: true } // To return the updated document
      ).lean<ProviderInterface>(); // Convert to plain JS object

      console.log(editProvider, "editProvider after saving");
      return editProvider; // Return the updated object as the correct type
    } catch (error) {
      console.error("Error saving provider:", error);
      return null; // Return null on error
    }
  }

  async updateStatusprovider(providerId: string): Promise<ProviderInterface | null> {
    try {
      // Log the userId to ensure it's passed correctly
      console.log(providerId, "providerId in updateStatus");

      // Find the provider by ID
      let provider = await providerModel.findById(providerId);
      console.log(provider, "provider when find")
      if (!provider) {
        console.error("provider not found");
        return null;
      }


      const updateProvider = await providerModel.findByIdAndUpdate(
        providerId, // pass the providerId directly
        { isBlocked: !provider.isBlocked }, // Flip the isBlocked status
        { new: true } // Return the updated provider document
      );

      console.log(updateProvider, "update provider")

      return updateProvider as ProviderInterface;
    } catch (error) {
      console.error("Error updating user status:", error);
      return null;
    }
  }

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
      // Fetch car documents from the database
      const data = await CarNotification.find() as CarDataInterface[]; // This returns an array of Mongoose documents

      // Map the car documents to CarDataInterface
      const notification: CarDataInterface[] = data.map((carDocument: any) => ({
        id: carDocument._id?.toString(), // Ensure _id exists, and convert it to string
        car_name: carDocument.car_name,
        model: carDocument.model,
        rentalPrice: carDocument.rentalPrice,
        engineType: carDocument.engineType,
        fuelType: carDocument.fuelType,
        color: carDocument.color,
        images: carDocument.images, // Assuming 'images' is an array
        rcNumber: carDocument.rcNumber,
        rcExpiry: carDocument.rcExpiry,
        insurancePolicyNumber: carDocument.insurancePolicyNumber,
        insuranceExpiry: carDocument.insuranceExpiry,
        pollutionCertificateNumber: carDocument.pollutionCertificateNumber,
        pollutionExpiry: carDocument.pollutionExpiry,
        isStatus: carDocument.isStatus,
        providerId: carDocument.providerId ? carDocument.providerId.toString() : undefined, // Handle optional providerId
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
          // Create a new CarModel document, mapping only the relevant fields
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
            isBlocked: false, // Default value as per your schema
          });

          // Save the new car document to CarModel
          await newCar.save();
        }
      }

      // Delete the notification once the process is complete
      const result = await CarNotification.deleteOne({ _id: id });

      return result;
    } catch (error) {
      console.log("Error verifying notification:", error); // More detailed log
      return null;
    }
  }


  // ******************************fetch car for car management**********************
  async fetchCars(): Promise<CarDataInterface[] | null> {
    try {
      const carDocuments = await CarModel.find() as CarDataInterface[]; // Fetch car documents

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
      // Log the carId to ensure it's passed correctly
      console.log(carId, "providerId in updateStatus");

      // Find the provider by ID
      let car = await CarModel.findById(carId);
      console.log(car, "provider when find")
      if (!car) {
        console.error("provider not found");
        return null;
      }


      const updateCar = await CarModel.findByIdAndUpdate(
        car, // pass the providerId directly
        { isBlocked: !car.isBlocked }, // Flip the isBlocked status
        { new: true } // Return the updated provider document
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
  async fetchOffer(): Promise<OfferDataInterface[] | null> {
    try {
      // Fetch offers from the database, with type assertion
      const data = await Offer.find() as OfferDataInterface[]; // Array of OfferDataInterface documents

      console.log("Offers in management:", data);

      // Map the documents to the OfferReturnData type
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
      // Log the providerId to ensure it's passed correctly
      console.log(offerId, "offer in offer mgt");

      // Pass userId directly to findById (no need for an object)
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

      // Update the offer using its ID
      const updatedOffer = await Offer.findByIdAndUpdate(
        id, // Pass the ID directly
        {
          carName: offerData.carName,
          offerTitle: offerData.offerTitle,
          startDate: offerData.startDate,
          endDate: offerData.endDate,
          discountPercentage: offerData.discountPercentage,
        },
        { new: true } // To return the updated document
      ).lean<OfferDataInterface>(); // Convert to plain JS object

      console.log(updatedOffer, "Updated offer after saving");
      return updatedOffer; // Return the updated offer as the correct type
    } catch (error) {
      console.error("Error updating offer:", error);
      return null; // Return null on error
    }
  }
  // ***********************updateStatus offer********************88
  async updateStatusOffer(offerId: string): Promise<OfferDataInterface | null> {
    try {
      // Log the carId to ensure it's passed correctly
      console.log(offerId, "offerId in updateStatus");

      // Find the provider by ID
      let offer = await Offer.findById(offerId);
      console.log(offer, "offer when find")
      if (!offer) {
        console.error("offer not found");
        return null;
      }


      const updateOffer = await Offer.findByIdAndUpdate(
        offer, // pass the providerId directly
        { isActive: !offer.isActive }, // Flip the isBlocked status
        { new: true } // Return the updated provider document
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

      // Create a new Coupon instance based on the provided data
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

      // Return the saved coupon data
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
  async fetchCoupon(): Promise<CouponInterface[] | null> {
    try {
      const data = await Coupon.find() as CouponInterface[];

      console.log("coupon in management:", data);

      // Map the documents to the OfferReturnData type
      const coupons: CouponInterface[] = data.map((coupon: CouponInterface) => ({
        code: coupon.code,
        discountPercentage: coupon.discountPercentage,
        startDate: coupon.startDate,
        endDate: coupon.endDate,
        isActive: coupon.isActive,
        minRentalAmount: coupon.minRentalAmount,
        userId: coupon.userId,
        id: coupon.id?.toString() || "", // Convert `_id` to string if present
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

      // Update the offer using its ID
      const updatedCoupon = await Coupon.findByIdAndUpdate(
        id, // Pass the ID directly
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
  
}
