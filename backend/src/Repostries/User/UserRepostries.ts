import { BookingInterface } from '../../Interface/BookingInterface';
import { CarDataInterface } from '../../Interface/CarInterface';
import { CouponInterface } from '../../Interface/CouponInterface';
import { OfferDataInterface } from '../../Interface/OfferInterface';
import { ProfileInterface } from '../../Interface/Profileinterface';
import { UserAddressInterface } from '../../Interface/UserAddressInterface';
import { UserInterface } from '../../Interface/UserInterface';
import Coupon from '../../Model/Admin/CouponModel';
import Offer from '../../Model/Admin/OfferModel';
import CarModel from '../../Model/Provider/CarModel';
import UserAddressModel from '../../Model/User/AddressModel';
import BookingModel from '../../Model/User/BookingModel';
import { Otp } from '../../Model/User/OtpModel';
import UserProfileModel from '../../Model/User/ProfileModel';
import userModel from '../../Model/User/UserModel';
import mongoose from 'mongoose';


interface UserLoginResponse {
    exists: boolean;
    userData?: any; // You can replace `any` with a more specific type if you have one
}

export class UserRepository {
    // Check if a user exists by email
    async emailExistCheck(email: string): Promise<UserInterface | null> {
        try {
            const existingUser = await userModel.findOne({ email });

            return existingUser as UserInterface;
        } catch (error) {
            console.log("Error checking email existence:", error);
            return null;
        }
    }

    // Save a new user
    async saveUser(userData: UserInterface): Promise<UserInterface | null> {
        try {
            const newUser = new userModel(userData);

            await newUser.save();
            return newUser as UserInterface;
        } catch (error) {
            console.log("Error saving user:", error);
            return null;
        }
    }

    // Login logic (fetch the user by email)
    async userLogin(email: string): Promise<UserLoginResponse> {
        try {
            const existingUser = await userModel.findOne({ email });
            return existingUser ? { exists: true, userData: existingUser } : { exists: false };
        } catch (error) {
            console.error("Error in user login:", error);
            return { exists: false };
        }
    }
    // check username and password for login
    async emailPasswordCheck(email: string): Promise<UserInterface | null> {
        try {
            const existingUser = await userModel.findOne({ email });
            return existingUser as UserInterface;
        } catch (error) {
            console.log("Error checking email and password:", error);
            return null;
        }
    }

    // check user for tooken validation

    async getUserById(id: string): Promise<UserInterface | null> {
        try {
            const existingUser = await userModel.findById(id);

            return existingUser as UserInterface;
        } catch (error) {
            console.log("Error checking email existence:", error);
            return null;
        }
    }

    // ******************************fetch car for card**********************
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
    // ***********************************Car Details *************************
    async carDetails(carId: string): Promise<CarDataInterface | null> {
        try {
            let car = await CarModel.findOne({ _id: carId, isBlocked: false });

            console.log(car, "check");

            if (car) {
                return {
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
                } as CarDataInterface;
            }
            return null;
        }
        catch (error) {
            console.error("Error fetching Car:", error);
            return null;
        }
    }
    // ***************************filter************************
    async carFilter(engineType?: string[], fuelType?: string[], sortPrice?: string): Promise<CarDataInterface[] | null> {
        try {
            // Create a filter object
            const filters: any = {};

            if (engineType && engineType.length > 0) {
                filters.engineType = { $in: engineType.map(type => new RegExp(type, 'i')) }; // Case-insensitive filter
            }
            if (fuelType && fuelType.length > 0) {
                filters.fuelType = { $in: fuelType.map(type => new RegExp(type, 'i')) }; // Case-insensitive filter
            }

            // Determine sorting order based on sortPrice parameter
            const sortOrder = sortPrice === 'lowToHigh' ? 1 : sortPrice === 'highToLow' ? -1 : undefined;
            console.log(filters, "filters");

            // Execute the query with filters and optional sorting
            const filteredCars = await CarModel.find(filters)
                .sort(sortOrder ? { rentalPrice: sortOrder } : {}) // Sort only if sortOrder is defined
                .exec() as CarDataInterface[]; // Make sure CarModel is defined and imported

            const cars: CarDataInterface[] = filteredCars.map((car: CarDataInterface) => ({
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
            return cars
        } catch (error) {
            console.error("Error fetching cars:", error);
            return null; // Return null on error
        }
    }
    // ******************************search car**********************


    async searchCar(searchQuery: string): Promise<CarDataInterface[] | null> {
        try {
            const regex = new RegExp(searchQuery, "i");
            const result = await CarModel.find({ car_name: { $regex: regex } });
            return result
        } catch (error) {
            console.error("Error searching for cars:", error);
            return null;
        }
    }
    // *************************fetch offer8*******************888
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
                id: offer.id?.toString() || "", // Convert `_id` to string if present
                isActive: offer.isActive ?? true, // Set a default value if `isActive` is undefined
            }));

            return offers;
        } catch (error) {
            console.error("Error fetching offers:", error);
            return null;
        }
    }

    // ***********************check profile******************
    async checkProfile(userId: string): Promise<ProfileInterface | null> {
        const data = await UserProfileModel.findOne({ userId: userId });

        if (data) {
            return {
                _id: data._id,
                userId: data.userId ?? undefined,
                name: data.name ?? undefined,
                email: data.email ?? undefined,
                phone: data.phone ?? undefined,
                adharNo: data.adharNo ?? undefined,
                gender: data.gender ?? undefined
            } as ProfileInterface;
        }
        return null;
    }
    // **********************88save profile********************

    async saveProfile(profileData: ProfileInterface): Promise<ProfileInterface | null> {
        try {

            const savedProfile = await UserProfileModel.create(profileData);
            return savedProfile as ProfileInterface;
        } catch (error) {
            console.error("Error saving profile:", (error as Error).message);
            return null; // Return null if there's an error
        }
    }
    // *************************Edit profile************************

    async editProfile(profileData: ProfileInterface, userId: string): Promise<ProfileInterface | null> {
        try {
            const updatedProfile = await UserProfileModel.findOneAndUpdate(
                { userId: userId },
                profileData,
                { new: true }
            );


            if (updatedProfile) {
                return updatedProfile as ProfileInterface;
            }


            return null;
        } catch (error) {
            console.error("Error updating profile:", error);
            return null;
        }
    }

    //******************** */ check Address**************************
    async checkAddress(userId: string): Promise<UserAddressInterface | null> {
        try {
            const checkAddress = await UserAddressModel.findOne({ userId: userId })

            if (checkAddress) {
                return checkAddress as UserAddressInterface;
            }

            return null;
        } catch (error) {
            console.error("Error updating profile:", error);
            return null;
        }

    }

    // ***************save address*********************8
    async saveAddress(addressData: UserAddressInterface): Promise<UserAddressInterface | null> {
        try {
            console.log(addressData, "addressData")
            const savedAddress = await UserAddressModel.create(addressData);
            return savedAddress as UserAddressInterface;
        } catch (error) {
            console.error("Error saving profile:", (error as Error).message);
            return null; // Return null if there's an error
        }
    }
    // *************************Edit Address************************

    async editAddress(addressData: UserAddressInterface, addressId: string): Promise<UserAddressInterface | null> {
        try {
            const updatedAddress = await UserAddressModel.findOneAndUpdate(
                { _id: addressId },
                addressData,
                { new: true }
            );
            if (updatedAddress) {
                return updatedAddress as UserAddressInterface;
            }
            return null;
        } catch (error) {
            console.error("Error updating Adress:", error);
            return null;
        }
    }

    // **************************fetch coupon************
    async fetchCoupon(userId: string): Promise<CouponInterface[] | null> {
        try {
            console.log(userId, "userId")
            const couponsWithoutUser = await Coupon.find({ userId: { $ne: userId } }) as CouponInterface[];
            if (couponsWithoutUser && couponsWithoutUser.length > 0) {
                return couponsWithoutUser;
            }
            return null;
        } catch (error) {
            console.error("Error fetching coupons:", error);
            return null;
        }
    }

    // ******************check offer for booking******************
    async checkOfferForBooking(carName: string): Promise<OfferDataInterface | null> {
        try {
            console.log(carName, "carname")

            const offer = await Offer.findOne({
                carName: { $regex: new RegExp(`^${carName}$`, 'i') },
            });


            console.log(offer, "offer")
            if (offer) {
                return offer as OfferDataInterface
            }
            return null;
        } catch (error) {
            console.error("Error checking offer for booking:", error);
            return null;
        }
    }
    // **********************************save Booking**********************

    async saveBookingData(bookingData: BookingInterface): Promise<BookingInterface | null> {
        try {
            const savedBooking = await BookingModel.create(bookingData);
            return savedBooking as BookingInterface;
        } catch (error) {
            console.error("Error saving profile:", (error as Error).message);
            return null; // Return null if there's an error
        }
    }
    // **********************update userid in coupon ***********************
    async userIdInCoupon(couponCode: string, userId: string): Promise<CouponInterface | null> {
        try {
            console.log("coupon code:", couponCode, userId);
            const updatedCoupon = await Coupon.findOneAndUpdate(
                { code: couponCode },
                { $push: { userId: userId } },
                { new: true }
            ) as CouponInterface

            if (updatedCoupon) {
                return updatedCoupon;
            }
            return null;
        } catch (error) {
            console.error("Error updating coupon userId:", (error as Error).message);
            return null;  // Return null in case of error
        }
    }

    // ***************************booking history*****************



    async getBookingHistory(userId: string): Promise<BookingInterface[] | null> {
        try {
            console.log(userId, "userId in get booking history");

            const bookingHistory = await BookingModel.aggregate([
                { $match: { UserId: userId } },
                {
                    $addFields: {
                        CarsObjectId: { $toObjectId: "$CarsId" } // Convert CarsId string to ObjectId
                    }
                },
                {
                    $lookup: {
                        from: 'carmodels', // Collection name for CarModel (Mongoose pluralizes by default)
                        localField: 'CarsObjectId', // Use the converted ObjectId field
                        foreignField: '_id',
                        as: 'bookingDetails',
                    },
                },
                { $unwind: '$bookingDetails' } // Flatten the bookingDetails array
            ]);

            console.log(bookingHistory, "booking history");
            return bookingHistory.length ? bookingHistory : null;
        } catch (error) {
            console.error("Error fetching booking history with car details:", (error as Error).message);
            return null;
        }
    }
    // ***************************specific booking details*****************



    async specificBookingDetails(bookingId: string): Promise<BookingInterface | null> {
        try {
            console.log(bookingId, "bookingId in get booking history");

            // Convert bookingId to an ObjectId
            const objectId = new mongoose.Types.ObjectId(bookingId);

            const bookingHistory = await BookingModel.aggregate([
                { $match: { _id: objectId } }, // Match the specific booking by ObjectId
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

    // *******************************update status for booking*****************
    
    async cancelBookingByUser(bookingId: string): Promise<BookingInterface | null> {
        try {
            const updatedBooking = await BookingModel.findByIdAndUpdate(
                bookingId, 
                { status: 'Cancelled' }, 
                { new: true } 
            );
            return updatedBooking as BookingInterface
        } catch (error) {
            console.error("Error fetching booking history with car and address details:", (error as Error).message);
            return null;
        }
    }

}
