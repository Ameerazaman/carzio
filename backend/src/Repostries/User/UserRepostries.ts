import { CarDataInterface } from '../../Interface/CarInterface';
import { OfferDataInterface, OfferReturnData } from '../../Interface/OfferInterface';
import { UserInterface } from '../../Interface/UserInterface';
import Offer from '../../Model/Admin/OfferModel';
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


async  searchCar(searchQuery: string): Promise<CarDataInterface[] | null> {
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
async fetchOffer(): Promise<OfferReturnData[] | null> {
    try {
        // Fetch offers from the database, with type assertion
        const data = await Offer.find() as OfferDataInterface[]; // Array of OfferDataInterface documents

        console.log("Offers in management:", data);

        // Map the documents to the OfferReturnData type
        const offers: OfferReturnData[] = data.map((offer: OfferDataInterface) => ({
            carName: offer.carName,
            offerTitle: offer.offerTitle,
            startDate: offer.startDate,
            endDate: offer.endDate,
            discountPercentage: offer.discountPercentage,
            id: offer._id?.toString() || "", // Convert `_id` to string if present
        }));

        return offers;
    } catch (error) {
        console.error("Error fetching offers:", error);
        return null;
    }
}
}