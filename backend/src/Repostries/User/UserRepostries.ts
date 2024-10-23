import { CarDataInterface } from '../../Interface/CarInterface';
import { UserInterface } from '../../Interface/UserInterface';
import CarModel from '../../Model/Provider/CarModel';
import { Otp } from '../../Model/User/OtpModel';
import userModel from '../../Model/User/UserModel';

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
            // Log the providerId to ensure it's passed correctly
            console.log(carId, "provider in editUser");

            // Pass userId directly to findById (no need for an object)
            let car = await CarModel.findById(carId);

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
}
