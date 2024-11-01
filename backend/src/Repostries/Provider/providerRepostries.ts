import { CarAuthResponse } from "../../Interface/AuthServices/CarAuthInterface";
import { CarDataInterface } from "../../Interface/CarInterface";
import { ProviderInterface, ProviderAdressInterface } from "../../Interface/ProviderInterface";
import CarModel from "../../Model/Provider/CarModel";
import CarNotification from "../../Model/Provider/CarNotification";
import providerProfile from "../../Model/Provider/ProviderAddressModel";
import providerAddress from "../../Model/Provider/ProviderAddressModel";
import providerModel from "../../Model/Provider/ProviderModel";
import { Otp, OtpDocument } from "../../Model/User/OtpModel"; // Assuming OtpDocument is defined for the Otp schema


export class ProviderRepository {


    // check provider for tooken validation

    async getProviderById(id: string): Promise<ProviderInterface | null> {
        try {

            const existingProvider = await providerModel.findById(id);

            return existingProvider as ProviderInterface;
        } catch (error) {
            console.log("Error checking email existence:", error);
            return null;
        }
    }
    // This function checks if an email exists in the provider database
    async emailExistCheck(email: string): Promise<ProviderInterface | null> {
        try {
            const existingUser = await providerModel.findOne({ email });
            console.log(existingUser, "repostries")
            return existingUser as ProviderInterface;
        } catch (error) {
            console.log("Error checking email existence:", error);
            return null;
        }
    }

    // This function creates or updates an OTP for a given email
    async createOtp(otp: number, email: string): Promise<OtpDocument | null> {
        try {
            let existUserOtp = await Otp.findOne({ email });

            if (existUserOtp) {
                // Use findOneAndUpdate to get the updated document
                const updatedOtp = await Otp.findOneAndUpdate(
                    { email },
                    { otp },
                    { new: true } // Return the updated document
                );
                return updatedOtp;
            } else {
                const newOtp = await Otp.create({ email, otp });
                return newOtp;
            }
        } catch (error) {
            console.log("Error creating or updating OTP:", error);
            return null;
        }
    }


    async findOtp(email: string, otp: string): Promise<OtpDocument | null> {
        try {
            const existProviderOtp = await Otp.findOne({ email });
            console.log(existProviderOtp, otp, "check otp")
            // Check if existProviderOtp is not null and compare OTPs
            if (existProviderOtp && existProviderOtp.otp.toString() === otp) {
                await Otp.deleteOne({ email })
                return existProviderOtp;
            }

            return null; // If no match or null, return null
        } catch (error) {
            console.log("Error checking email existence:", error);
            return null;
        }
    }


    async saveProvider(providerData: ProviderInterface): Promise<ProviderInterface | null> {
        try {
            const newUser = new providerModel(providerData);

            await newUser.save();
            return newUser as ProviderInterface;
        } catch (error) {
            console.log("Error saving user:", error);
            return null;
        }
    }

    async checkProviderAddress(providerId: string): Promise<ProviderAdressInterface | null> {
        try {

            const check = await providerProfile.findOne({ providerId });
            console.log(check, "check profile")
            if (check) {
                // Convert the Mongoose document to a plain object
                return {
                    _id: check._id.toString(), // Convert ObjectId to string
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
            console.error("Error checking provider address:", error);
            return null;
        }
    }


    async saveProfile(providerData: ProviderAdressInterface): Promise<ProviderAdressInterface | null> {
        try {

            // Create a new instance of your Mongoose model
            const newUser = new providerProfile({
                name: providerData.name,
                providerId: providerData.providerId, // Use providerData._id directly
                email: providerData.email,
                city: providerData.city,
                state: providerData.state,
                pinNumber: providerData.pinNumber,
                phone: providerData.phone,
            });

            // Save the new user to the database
            const savedUser = await newUser.save();
            // Log what was saved

            return {
                _id: savedUser._id.toString(), // Convert ObjectId to string
                name: savedUser.name,
                email: savedUser.email,
                phone: savedUser.phone,
                city: savedUser.city,
                state: savedUser.state,
                pinNumber: savedUser.pinNumber,
                // isBlocked: savedUser.isBlocked || false // Handle optional
            } as ProviderAdressInterface; // Return the saved object as the correct type
        } catch (error) {
            console.error("Error saving user:", error);
            return null; // Return null on error
        }
    }
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
                { new: true } // To return the updated document
            ).lean<ProviderAdressInterface>(); // Convert to plain JS object

            console.log(editAddress, "editAddress after saving");
            return editAddress; // Return the updated object as the correct type
        } catch (error) {
            console.error("Error saving user:", error);
            return null; // Return null on error
        }
    }
    // *********************************update Image**********************
    async updateprofileImage(images: string, id: string): Promise<ProviderAdressInterface | null> {
        try {
            const profile = await providerProfile.findById(id);
            if (!profile) {
                console.error("profile not found");
                return null;
            }

            // Update the car's images (array of strings)
            const updatedProfile = await providerProfile.findByIdAndUpdate(
                id,
                { image: images }, // Assign the array of images
                { new: true } // Return the updated car document
            );
            console.log(updatedProfile, "update profile")
            return updatedProfile as ProviderAdressInterface;
        } catch (error) {
            console.error("Error updating car images:", error);
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

                return undefined; // Return undefined instead of null
            }

            const newCar = new CarNotification({
                car_name: carData.car_name,
                model: carData.model,
                rentalPrice: Number(carData.rentalPrice), // Convert to Number
                engineType: carData.engineType,
                fuelType: carData.fuelType,
                color: carData.color,
                images: carData.images.length > 0 ? carData.images : [], // Ensure images are populated
                rcExpiry: new Date(carData.rcExpiry), // Ensure it's a Date
                rcNumber: carData.rcNumber,
                insurancePolicyNumber: carData.insurancePolicyNumber,
                insuranceExpiry: new Date(carData.insuranceExpiry), // Ensure it's a Date
                pollutionCertificateNumber: carData.pollutionCertificateNumber,
                pollutionExpiry: new Date(carData.pollutionExpiry), // Ensure it's a Date
                providerId: carData.providerId,
            });

            // Save the car
            const car = await newCar.save();
            // Log saved car
            return car.toObject() as CarDataInterface; // Return as CarDataInterface

        } catch (error) {
            console.error("Error saving car:", error instanceof Error ? error.message : error);
            return undefined; // Return undefined on error instead of null
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

            let car = await CarModel.findById(carId);

            if (!car) {
                console.error("provider not found");
                return null;
            }


            const updateCar = await CarModel.findByIdAndUpdate(
                car, // pass the providerId directly
                { isBlocked: !car.isBlocked }, // Flip the isBlocked status
                { new: true } // Return the updated provider document
            );


            return updateCar as CarDataInterface;
        } catch (error) {
            console.error("Error updating car status:", error);
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
                // Include any additional fields as needed
            };

            const editCar = await CarModel.findByIdAndUpdate(id, updateData, { new: true }).lean();


            return editCar as CarDataInterface;
        } catch (error) {
            console.error("Error saving provider:", error);
            return null; // Return null on error
        }
    }
    // **********************************update Car image*************************
    async updateCarImage(images: string[], id: string): Promise<CarDataInterface | null> {
        try {
            const car = await CarModel.findById(id);
            if (!car) {
                console.error("Car not found");
                return null;
            }

            // Update the car's images (array of strings)
            const updatedCar = await CarModel.findByIdAndUpdate(
                id,
                { images: images }, // Assign the array of images
                { new: true } // Return the updated car document
            );

            return updatedCar;
        } catch (error) {
            console.error("Error updating car images:", error);
            return null;
        }
    }

}








