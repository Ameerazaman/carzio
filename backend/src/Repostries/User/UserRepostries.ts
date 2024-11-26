import { BookingDateInterface } from '../../Interface/AuthServices/BookingDateAuthInterface';
import { BookingInterface } from '../../Interface/BookingInterface';
import { CarDataInterface } from '../../Interface/CarInterface';
import { CouponInterface } from '../../Interface/CouponInterface';
import { OfferDataInterface } from '../../Interface/OfferInterface';
import { ProfileInterface } from '../../Interface/Profileinterface';
import { UserAddressInterface } from '../../Interface/UserAddressInterface';
import { UserInterface } from '../../Interface/UserInterface';
import { WalletInterface } from '../../Interface/WalletInterface';
import Coupon from '../../Model/Admin/CouponModel';
import Offer from '../../Model/Admin/OfferModel';
import CarModel from '../../Model/Provider/CarModel';
import UserAddressModel from '../../Model/User/AddressModel';
import BookingModel from '../../Model/User/BookingModel';
import { Otp } from '../../Model/User/OtpModel';
import UserProfileModel from '../../Model/User/ProfileModel';
import userModel from '../../Model/User/UserModel';
import mongoose from 'mongoose';
import WalletModel from '../../Model/User/WalletModel';
import { ReviewDataInterface } from '../../Interface/ReviewInterface';
import ReviewModel from '../../Model/User/ReviewModel';
import ChatModel, { IChat } from '../../Model/User/ChatModel';


interface UserLoginResponse {
    exists: boolean;
    userData?: any;
}



export class UserRepository {

    // *************************email Exist**************************
    async emailExistCheck(email: string): Promise<UserInterface | null> {
        try {
            const existingUser = await userModel.findOne({ email });

            return existingUser as UserInterface;
        } catch (error) {
            console.log("Error checking email existence:", error);
            return null;
        }
    }
    //********************** */ Save a new user***************************8
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

    //****************Login logic (fetch the user by email)*****************
    async userLogin(email: string): Promise<UserLoginResponse> {
        try {
            const existingUser = await userModel.findOne({ email });
            return existingUser ? { exists: true, userData: existingUser } : { exists: false };
        } catch (error) {
            console.error("Error in user login:", error);
            return { exists: false };
        }
    }
    //*****************check username and password for login*************
    async emailPasswordCheck(email: string): Promise<UserInterface | null> {
        try {
            const existingUser = await userModel.findOne({ email });
            return existingUser as UserInterface;
        } catch (error) {
            console.log("Error checking email and password:", error);
            return null;
        }
    }

    //*****************check user for tooken validation**********************

    async getUserById(id: string): Promise<UserInterface | null> {
        try {
            const existingUser = await userModel.findById(id);

            return existingUser as UserInterface;
        } catch (error) {

            return null;
        }
    }

    // ******************************fetch car for card**********************

    async fetchCars(page: number, limit: number): Promise<CarDataInterface[] | null> {
        try {

            const skip = (page - 1) * limit;
            const carDocuments = await CarModel.find()
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
                id: car.id,

            }));

            return cars;
        } catch (error) {

            return null;
        }
    }
    // *******************************fetch cout for Total Page in FetchCar*****************
    async countsOfCar(): Promise<number | null> {
        try {
            const total = await CarModel.countDocuments();
            return total
        } catch (error) {
            return null;
        }
    }
    // ***********************************Car Details *************************
    async carDetails(carId: string): Promise<CarDataInterface | null> {
        try {
            const result = await CarModel.findById(carId)
            return result as CarDataInterface
        }
        catch (error) {
            return null;
        }
    }

    // ************************car ratings(star) in carDetails*****************
    async getReviewAndRatings(carId: string): Promise<{ averageRating: number | null; reviews: string[] }> {
        try {
            const result = await ReviewModel.aggregate([
                { $match: { carId: carId } },
                {
                    $group: {
                        _id: null, // Group all matched documents
                        averageRating: { $avg: "$rating" }, // Calculate average rating
                        reviews: { $push: "$review" }, // Collect review texts
                    },
                },
            ]);
            if (result.length === 0) {
                return { averageRating: null, reviews: [] };
            }

            return {
                averageRating: result[0].averageRating,
                reviews: result[0].reviews,
            };
        } catch (error) {
            return { averageRating: null, reviews: [] };
        }
    }

    // ***************************filter************************

    async carFilter(engineType?: string[], fuelType?: string[], sortPrice?: string): Promise<CarDataInterface[] | null> {
        try {

            const filters: any = {};

            if (engineType && engineType.length > 0) {
                filters.engineType = { $in: engineType.map(type => new RegExp(type, 'i')) }; // Case-insensitive filter
            }
            if (fuelType && fuelType.length > 0) {
                filters.fuelType = { $in: fuelType.map(type => new RegExp(type, 'i')) }; // Case-insensitive filter
            }

            const sortOrder = sortPrice === 'lowToHigh' ? 1 : sortPrice === 'highToLow' ? -1 : undefined;

            const filteredCars = await CarModel.find(filters)
                .sort(sortOrder ? { rentalPrice: sortOrder } : {})
                .exec() as CarDataInterface[];

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
            return null;
        }
    }
    // ******************************search car**********************


    async searchCar(searchQuery: string): Promise<CarDataInterface[] | null> {
        try {
            const regex = new RegExp(searchQuery, "i");
            const result = await CarModel.find({ car_name: { $regex: regex } });
            return result
        } catch (error) {

            return null;
        }
    }
    // *************************fetch offer8*******************888
    async fetchOffer(): Promise<OfferDataInterface[] | null> {
        try {

            const data = await Offer.find().sort({ createdAt: -1 }) as OfferDataInterface[]; // Array of OfferDataInterface documents

            const offers: OfferDataInterface[] = data.map((offer: OfferDataInterface) => ({
                carName: offer.carName,
                offerTitle: offer.offerTitle,
                startDate: offer.startDate,
                endDate: offer.endDate,
                discountPercentage: offer.discountPercentage,
                id: offer.id?.toString() || "",
                isActive: offer.isActive ?? true,
            }));

            return offers;
        } catch (error) {
            return null;
        }
    }

    // ***********************check profile******************
    async checkProfile(userId: string): Promise<ProfileInterface | null> {
        const data = await UserProfileModel.findOne({ userId: userId })
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
            const savedProfile = await UserProfileModel.create(profileData)
            return savedProfile as ProfileInterface;
        } catch (error) {

            return null;
        }
    }
    // *************************Edit profile************************

    async editProfile(profileData: ProfileInterface, profileId: string): Promise<ProfileInterface | null> {
        try {

            const updatedProfile = await UserProfileModel.findOneAndUpdate(
                { _id: profileId },
                profileData,
                { new: true }
            );
            if (updatedProfile) {
                return updatedProfile as ProfileInterface;
            }
            return null;
        } catch (error) {

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
            return null;
        }
    }

    // ***************save address*********************8
    async saveAddress(addressData: UserAddressInterface): Promise<UserAddressInterface | null> {
        try {

            const savedAddress = await UserAddressModel.create(addressData);
            return savedAddress as UserAddressInterface;
        } catch (error) {

            return null;
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
            return null;
        }
    }

    // **************************fetch coupon************
    async fetchCoupon(userId: string): Promise<CouponInterface[] | null> {
        try {
            const couponsWithoutUser = await Coupon.find({ userId: { $ne: userId } }) as CouponInterface[];
            if (couponsWithoutUser && couponsWithoutUser.length > 0) {
                return couponsWithoutUser;
            }
            return null;
        } catch (error) {
            return null;
        }
    }

    // ******************check offer for booking******************
    async checkOfferForBooking(carName: string): Promise<OfferDataInterface | null> {
        try {
            const offer = await Offer.findOne({
                carName: { $regex: new RegExp(`^${carName}$`, 'i') },
            });
            if (offer) {
                return offer as OfferDataInterface
            }
            return null;
        } catch (error) {
            return null;
        }
    }
    // **********************************save Booking**********************

    async saveBookingData(bookingData: BookingInterface): Promise<BookingInterface | null> {
        try {
            const savedBooking = await BookingModel.create(bookingData);
            return savedBooking as BookingInterface;
        } catch (error) {

            return null;
        }
    }
    // **********************update userid in coupon ***********************
    async userIdInCoupon(couponCode: string, userId: string): Promise<CouponInterface | null> {
        try {
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

            return null;
        }
    }

    // ***************************booking history*****************



    async getBookingHistory(userId: string, page: number, limit: number): Promise<BookingInterface[] | null> {
        try {

            const bookingHistory = await BookingModel.aggregate([
                { $match: { UserId: userId } },
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
                { $limit: limit },
            ]);

            return bookingHistory
        } catch (error) {
            return null;
        }
    }

    // ******************************count bookingHistory****************

    async countBookingHistory(userId: string): Promise<number | null> {
        try {
            const total = await BookingModel.aggregate([
                { $match: { UserId: userId } }])
            return total.length;
        } catch (error) {

            return null;
        }
    }

    // ***************************specific booking details*****************



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
            return null;
        }
    }

    // ***************************canceled booking amount credited to walet**********8
    async creditToWallet(userId: string, amount: number): Promise<WalletInterface | null> {
        try {
            const lastTransaction = await WalletModel.findOne({ UserId: userId }).sort({ createdAt: -1 });
            const lastTotalAmt = lastTransaction && typeof lastTransaction.TotalAmt === 'number' ? lastTransaction.TotalAmt : 0;

            if (isNaN(amount)) {
                throw new Error("Invalid amount provided");
            }

            const updatedTotal = lastTotalAmt + amount;

            // Create a new wallet transaction entry
            const result = await WalletModel.create({
                UserId: userId,
                TransactionType: 'Credit',
                Amount: amount,
                Description: "Canceled booked car",

                TotalAmt: updatedTotal,
            });


            return result as WalletInterface;

        } catch (error) {
            return null;
        }
    }

    // ****************************check booked or not **********************
    async checkBookedOrNot(carId: string): Promise<BookingDateInterface[] | null> {
        try {
            const check = await BookingModel.find({ CarsId: carId })

            const result = await BookingModel.find({ CarsId: carId }, { IssueDate: 1, ReturnDate: 1 }).lean();

            const transformedResult = result.map(doc => ({
                issueDate: doc.IssueDate,
                returnDate: doc.ReturnDate
            }));

            return transformedResult;
        } catch (error) {

            return null;
        }
    }

    // *************************check balnce and update*********************
    async checkBalanceAndUpdateWallet(userId: string, amount: number): Promise<WalletInterface | null> {
        try {
            const lastTransaction = await WalletModel.findOne({ UserId: userId }).sort({ createdAt: -1 });
            const lastTotalAmt = lastTransaction && typeof lastTransaction.TotalAmt === 'number' ? lastTransaction.TotalAmt : 0;

            if (isNaN(amount) || amount <= 0) {
                throw new Error("Invalid or negative amount provided");
            }
            if (lastTotalAmt >= amount) {
                const updatedTotal = lastTotalAmt - amount;

                const result = await WalletModel.create({
                    UserId: userId,
                    TransactionType: 'Debit',
                    Amount: amount,
                    Description: "Booked car using wallet amount",

                    TotalAmt: updatedTotal,
                });

                return result as WalletInterface;
            } else {

                return null;
            }

        } catch (error) {
            return null;
        }
    }



    // ***************get Wallet********************************
    async getWalletPage(userId: string, page: number, limit: number): Promise<WalletInterface[] | null> {
        try {

            const walletData = await WalletModel.aggregate([
                { $match: { UserId: userId } },
                { $skip: (page - 1) * limit },
                { $limit: limit },
            ]);

            return walletData
        } catch (error) {
            return null;
        }
    }

    // ******************************count bookingHistory************************

    async countWalletDocuments(userId: string): Promise<number | null> {
        try {
           
            const total = await WalletModel.aggregate([
                { $match: { UserId: userId } }])
           
            return total.length;
        } catch (error) {
           
            return null;
        }
    }

    // **************************create Review and ratings*********************

    async createReviewData(reviewData: ReviewDataInterface): Promise<ReviewDataInterface | null> {
        try {
            const saveReview = await ReviewModel.create(reviewData);
            return saveReview as ReviewDataInterface;
        } catch (error) {
            return null;
        }
    }

    // **********************check bookId in review*******************
    async checkBookidInReview(bookId: string): Promise<ReviewDataInterface | null> {
        try {
            let result = await ReviewModel.findOne({ bookingId: bookId })
            return result as ReviewDataInterface
        } catch (error) {
            return null;
        }
    }
    // *************************fetch chat History******************************
    async fetchChatHistory(userId: string, providerId: string): Promise<IChat[] | null> {
        try {
            let result = await ChatModel.find({
                $or: [
                    {
                        receiverId: userId, senderId: providerId
                    },
                    {
                        receiverId: providerId, senderId: userId
                    },
                ],
            });
            return result as IChat[]
        } catch (error) {
            return null;
        }
    }

    // ************************************car availabilty in date***************************
    async searchCarAvailability(startDate: string, endDate: string): Promise<CarDataInterface[]> {
        try {

            const start = new Date(startDate);
            const end = new Date(endDate);

            const bookedCars = await BookingModel.find({
                $or: [
                    { IssueDate: { $lte: endDate }, ReturnDate: { $gte: startDate } },
                ],
            }).select('CarsId');

            const bookedCarIds = bookedCars.map((booking) => booking.CarsId);
            const availableCars = await CarModel.find({
                _id: { $nin: bookedCarIds },
            });

            const cars: CarDataInterface[] = availableCars.map((car: CarDataInterface) => ({
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
                id: car.id,
            }));

            return cars;
        } catch (error) {

            throw error; 
        }
    }


}
