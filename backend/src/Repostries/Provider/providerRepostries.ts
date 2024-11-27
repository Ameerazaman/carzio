import mongoose from "mongoose";
import { CarAuthResponse } from "../../Interface/AuthServices/CarAuthInterface";
import { BookingInterface } from "../../Interface/BookingInterface";
import { CarDataInterface } from "../../Interface/CarInterface";
import { ProviderInterface, ProviderAdressInterface } from "../../Interface/ProviderInterface";
import CarModel from "../../Model/Provider/CarModel";
import CarNotification from "../../Model/Provider/CarNotification";
import providerProfile from "../../Model/Provider/ProviderAddressModel";
import providerAddress from "../../Model/Provider/ProviderAddressModel";
import providerModel from "../../Model/Provider/ProviderModel";
import BookingModel from "../../Model/User/BookingModel";
import { Otp, OtpDocument } from "../../Model/User/OtpModel";
import ChatModel, { IChat } from "../../Model/User/ChatModel";


export class ProviderRepository {

    //*******************check provider for tooken validation*************

    async getProviderById(id: string): Promise<ProviderInterface | null> {
        try {

            const existingProvider = await providerModel.findById(id);

            return existingProvider as ProviderInterface;
        } catch (error) {

            return null;
        }
    }
    //****This function checks if an email exists in the provider database********
    async emailExistCheck(email: string): Promise<ProviderInterface | null> {
        try {
            const existingUser = await providerModel.findOne({ email });

            return existingUser as ProviderInterface;
        } catch (error) {

            return null;
        }
    }

    //*******This function creates or updates an OTP for a given email*************
    async createOtp(otp: number, email: string): Promise<OtpDocument | null> {
        try {
            let existUserOtp = await Otp.findOne({ email });

            if (existUserOtp) {

                const updatedOtp = await Otp.findOneAndUpdate(
                    { email },
                    { otp },
                    { new: true }
                );
                return updatedOtp;
            } else {
                const newOtp = await Otp.create({ email, otp });
                return newOtp;
            }
        } catch (error) {
            return null;
        }
    }

    // ***********************find Otp*****************************88
    async findOtp(email: string, otp: string): Promise<OtpDocument | null> {
        try {
            const existProviderOtp = await Otp.findOne({ email });
            if (existProviderOtp && existProviderOtp.otp.toString() === otp) {
                await Otp.deleteOne({ email })
                return existProviderOtp;
            }

            return null;
        } catch (error) {
            return null;
        }
    }

    // *************************Save provider***************************

    async saveProvider(providerData: ProviderInterface): Promise<ProviderInterface | null> {
        try {
            console.log(providerData, "providerdata")
            const newUser = new providerModel(providerData);

            await newUser.save();
            return newUser as ProviderInterface;
        } catch (error) {

            return null;
        }
    }
    // *******************************check provider Address********************
    async checkProviderAddress(providerId: string): Promise<ProviderAdressInterface | null> {
        try {

            const check = await providerProfile.findOne({ providerId });
            console.log(check, "check profile")
            if (check) {

                return {
                    _id: check._id.toString(),
                    name: check.name,
                    email: check.email,
                    phone: check.phone,
                    city: check.city,
                    state: check.state,
                    pinNumber: check.pinNumber,
                    image: check.image
                } as ProviderAdressInterface;
            }
            return null;
        } catch (error) {

            return null;
        }
    }

    // ***********************************save profile for provider*****************************
    async saveProfile(providerData: ProviderAdressInterface): Promise<ProviderAdressInterface | null> {
        try {

            const newUser = new providerProfile({
                name: providerData.name,
                providerId: providerData.providerId,
                email: providerData.email,
                city: providerData.city,
                state: providerData.state,
                pinNumber: providerData.pinNumber,
                phone: providerData.phone,
            });

            const savedUser = await newUser.save();

            return {
                _id: savedUser._id.toString(),
                name: savedUser.name,
                email: savedUser.email,
                phone: savedUser.phone,
                city: savedUser.city,
                state: savedUser.state,
                pinNumber: savedUser.pinNumber,

            } as ProviderAdressInterface;
        } catch (error) {
            ;
            return null;
        }
    }

    // *********************************edit profile******************************

    async editProfile(providerData: ProviderAdressInterface, id: string): Promise<ProviderAdressInterface | null> {
        try {

            const editAddress = await providerProfile.findByIdAndUpdate(
                { _id: id },
                {
                    name: providerData.name,
                    providerId: providerData.providerId,
                    email: providerData.email,
                    city: providerData.city,
                    state: providerData.state,
                    pinNumber: providerData.pinNumber,
                    phone: providerData.phone,
                },
                { new: true }
            ).lean<ProviderAdressInterface>();

            return editAddress;
        } catch (error) {
            return null;
        }
    }
    // *********************************update Image**********************
    async updateprofileImage(images: string, id: string): Promise<ProviderAdressInterface | null> {
        try {
            const profile = await providerProfile.findById(id);
            if (!profile) {
                return null;
            }

            const updatedProfile = await providerProfile.findByIdAndUpdate(
                id,
                { image: images },
                { new: true }
            );

            return updatedProfile as ProviderAdressInterface;
        } catch (error) {

            return null;
        }
    }

    // ************************add car details****************************

    async addCarDetails(carData: CarDataInterface): Promise<CarDataInterface | undefined> {
        try {

            let carExist = await CarModel.findOne({
                providerId: carData.providerId,
                rcNumber: carData.rcNumber
            });

            if (carExist) {

                return undefined;
            }

            const newCar = new CarNotification({
                car_name: carData.car_name,
                model: carData.model,
                rentalPrice: Number(carData.rentalPrice),
                engineType: carData.engineType,
                fuelType: carData.fuelType,
                color: carData.color,
                images: carData.images.length > 0 ? carData.images : [],
                rcExpiry: new Date(carData.rcExpiry),
                rcNumber: carData.rcNumber,
                insurancePolicyNumber: carData.insurancePolicyNumber,
                insuranceExpiry: new Date(carData.insuranceExpiry),
                pollutionCertificateNumber: carData.pollutionCertificateNumber,
                pollutionExpiry: new Date(carData.pollutionExpiry),
                providerId: carData.providerId,
            });

            const car = await newCar.save();

            return car.toObject() as CarDataInterface;

        } catch (error) {
            return undefined;
        }
    }

    // ******************************fetch car for car management**********************
    async fetchCars(providerId: string, page: number, limit: number): Promise<CarDataInterface[] | null> {
        try {

            const skip = (page - 1) * limit;
            const carDocuments = await CarModel.find({ providerId })
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
    //***********************fetch car for eedit in car mgt************************************

    async editCar(carId: string): Promise<CarDataInterface | null> {
        try {
            let car = await CarModel.findById(carId);

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
    // ******************************update car in car management*************************
    async updateCar(carData: CarDataInterface, id: string): Promise<CarDataInterface | null> {
        try {
            const updateData: Partial<CarDataInterface> = {
                car_name: carData.car_name,
                model: carData.model,
                rentalPrice: carData.rentalPrice,
                engineType: carData.engineType,
                fuelType: carData.fuelType,
                color: carData.color,
                images: carData.images,
                rcNumber: carData.rcNumber,
                rcExpiry: carData.rcExpiry,
                insurancePolicyNumber: carData.insurancePolicyNumber,
                insuranceExpiry: carData.insuranceExpiry,
                pollutionCertificateNumber: carData.pollutionCertificateNumber,
                pollutionExpiry: carData.pollutionExpiry,
                providerId: carData.providerId,

            };

            const editCar = await CarModel.findByIdAndUpdate(id, updateData, { new: true }).lean();


            return editCar as CarDataInterface;
        } catch (error) {

            return null;
        }
    }
    // **********************************update Car image*************************
    async updateCarImage(images: string[], id: string): Promise<CarDataInterface | null> {
        try {
            const car = await CarModel.findById(id);
            if (!car) {
                return null;
            }

            const updatedCar = await CarModel.findByIdAndUpdate(
                id,
                { images: images },
                { new: true }
            );

            return updatedCar;
        } catch (error) {
            return null;
        }
    }
    // ***************************booking history*****************

    async getBookingHistory(providerId: string, page: number, limit: number): Promise<BookingInterface[] | null> {
        try {
            const bookingHistory = await BookingModel.aggregate([
                { $match: { providerId: providerId } },
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
    // *******************************update status for booking**********************

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

    // *****************************fetch users chat by provider*********************
    async fetchUsersChat(providerId: string): Promise<IChat[] | null> {
        try {
            const result = await ChatModel.find({
                receiverId: providerId
            })
                .sort({ timestamp: -1 });
            return result as IChat[];
        } catch (error) {
            return null;
        }
    }

    // *************************fetch chat History******************************
    async fetchChatHistory(recieverId: string, senderId: string): Promise<IChat[] | null> {
        try {
            let result = await ChatModel.find({
                $or: [
                    {
                        receiverId: senderId, senderId: recieverId
                    },
                    {
                        receiverId: recieverId, senderId: senderId
                    },
                ],
            });
            return result as IChat[];
        } catch (error) {
            return null;
        }
    }
    // **********************************count cars****************************
    async countCars(providerId: string): Promise<number | null> {
        try {
            const countCars = await CarModel.find({ providerId: providerId }).countDocuments();;
            return countCars;
        } catch (error) {
            return null;
        }
    }

    // **************************car bookings based one car***********************
    async CountBookingCar(providerId: string): Promise<{ carName: string, count: number }[]> {
        try {
            const bookingCountByCar = await BookingModel.aggregate([
                {
                    $match: {
                        providerId: providerId,
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
    async totalRevenue(providerId: string): Promise<number | null> {
        try {

            const bookings = await BookingModel.find({
                providerId: providerId,
                status: "Completed"
            });


            const totalCompletedAmount = bookings.reduce(
                (sum, booking) => sum + booking.total_Amt,
                0
            );

            return totalCompletedAmount / 2;
        } catch (error) {
            return null;
        }
    }

    // ***************************total Bookings*******************************
    async countBooking(providerId: string): Promise<number | null> {
        try {

            const countBooking = await BookingModel.countDocuments({ providerId: providerId });
            return countBooking;
        } catch (error) {
            return null;
        }
    }

    // *************************************revenue based on car**********************

    async revenueByCar(providerId: string): Promise<{ carName: string, amount: number }[]> {
        try {
            const bookingCountByCar = await BookingModel.aggregate([
                {
                    $match: {
                        status: 'Completed',
                        providerId: providerId,
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

    async fetchSalesReport(page: number, limit: number, providerId: string): Promise<BookingInterface[] | null> {
        try {
            const skip = (page - 1) * limit;
            const completedBookings = await BookingModel.find({ status: 'Completed', providerId: providerId })
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit) as BookingInterface[];
            return completedBookings;
        } catch (error) {
            return null;
        }
    }
}








