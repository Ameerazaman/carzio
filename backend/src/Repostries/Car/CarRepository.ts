import { CarDataInterface } from "../../Interface/CarInterface";
import CarModel from "../../Model/Provider/CarModel";
import { BaseRepository } from "../BaseRepostry";
import { ICarRepository } from "./ICarRepository";

export class CarRepository extends BaseRepository<typeof CarModel> implements ICarRepository {
    constructor() {
        super(CarModel);
    }

    // ******************************fetch car for car management**********************
    async fetchCars(page: number, limit: number): Promise<CarDataInterface[] | null> {
        try {
            const skip = (page - 1) * limit;
            const carDocuments = await this.model
                .find()
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit) as CarDataInterface[];
            console.log(carDocuments, "cardocumnets")
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
                isBlocked: car.isBlocked,
                createdAt: car.createdAt,
                id: car.id
            }));
            console.log(cars, "cars")
            return cars;
        } catch (error) {
            return null;
        }
    }

    // *******************************change status of car*****************
    async updateStatusCar(carId: string): Promise<CarDataInterface | null> {
        try {

            let car = await this.model.findById(carId);
            if (!car) {

                return null;
            }


            const updateCar = await this.model.findByIdAndUpdate(
                car,
                { isBlocked: !car.isBlocked },
                { new: true }
            );

            return updateCar as CarDataInterface;
        } catch (error) {

            return null;
        }
    }
    // *******************count Car**********************
    async countCars(): Promise<number | null> {
        try {
            const countCars = await this.model.find().countDocuments();;
            return countCars;
        } catch (error) {
            return null;
        }
    }
    // **************************check car exist or not *******************************
    async checkCarExist(carData: CarDataInterface): Promise<CarDataInterface | null> {
        try {
            let carExist = await this.model.findOne({
                providerId: carData.providerId,
                rcNumber: carData.rcNumber
            });
            return carExist
        } catch (error) {
            return null;
        }
    }

    // *************************add car from notification************************************

    async addCarFromNotification(carData: CarDataInterface): Promise<CarDataInterface | null> {
        try {
            // Create a new car from notification details
            const newCar = new this.model({
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
                isBlocked: false,
            });

            return await newCar.save();
        } catch (error) {
            console.error("Error adding car from notification:", error);
            return null;
        }
    }

    // ******************************fetch car for car management**********************
    async fetchCarsForProvider(providerId: string, page: number, limit: number): Promise<CarDataInterface[] | null> {
        try {

            const skip = (page - 1) * limit;
            const carDocuments = await this.model.find({ providerId })
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
                isBlocked: car.isBlocked,
                createdAt: car.createdAt,
                id: car.id,

            }));

            return cars;
        } catch (error) {

            return null;
        }
    }

    // *******************************change status of car*****************
    async updateStatusCarForProvider(carId: string): Promise<CarDataInterface | null> {
        try {

            let car = await this.model.findById(carId);

            if (!car) {

                return null;
            }


            const updateCar = await this.model.findByIdAndUpdate(
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

    async editCarForProvider(carId: string): Promise<CarDataInterface | null> {
        try {
            let car = await this.model.findById(carId);

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
                    isBlocked: car.isBlocked,
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
    async updateCarForProvider(carData: CarDataInterface, id: string): Promise<CarDataInterface | null> {
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

            const editCar = await this.model.findByIdAndUpdate(id, updateData, { new: true }).lean();


            return editCar as CarDataInterface;
        } catch (error) {

            return null;
        }
    }
    // **********************************update Car image*************************
    async updateCarImageForProvider(images: string[], id: string): Promise<CarDataInterface | null> {
        try {
            const car = await this.model.findById(id);
            if (!car) {
                return null;
            }

            const updatedCar = await this.model.findByIdAndUpdate(
                id,
                { images: images },
                { new: true }
            );

            return updatedCar;
        } catch (error) {
            return null;
        }
    }


    // **********************************count cars****************************
    async countCarsForProvider(providerId: string): Promise<number | null> {
        try {
            const countCars = await this.model.find({ providerId: providerId }).countDocuments();;
            return countCars;
        } catch (error) {
            return null;
        }
    }

    // ******************************fetch car for card**********************

    async fetchCarsForUser(page: number, limit: number): Promise<CarDataInterface[] | null> {
        try {

            const skip = (page - 1) * limit;
            const carDocuments = await this.model.find({ isBlocked: false })
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .exec() as CarDataInterface[];


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
                isBlocked: car.isBlocked,
                createdAt: car.createdAt,
                id: car.id,

            }));

            return cars;
        } catch (error) {

            return null;
        }
    }
    // *******************************fetch cout for Total Page in FetchCar*****************
    async countsOfCarForUser(): Promise<number | null> {
        try {
            const total = await this.model.countDocuments();
            return total
        } catch (error) {
            return null;
        }
    }
    // ***********************************Car Details *************************
    async carDetailsForUser(carId: string): Promise<CarDataInterface | null> {
        try {
            const result = await this.model.findById(carId)
            return result as CarDataInterface
        }
        catch (error) {
            return null;
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

            const filteredCars = await this.model.find(filters)
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
                isBlocked: car.isBlocked,
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
            const result = await this.model.find({ car_name: { $regex: regex } });
            return result
        } catch (error) {

            return null;
        }
    }

    // *****************************search available cars ***************************

    async findAvailableCars(excludedCarIds: string[]): Promise<CarDataInterface[]> {
        const availableCars = await this.model.find({
            _id: { $nin: excludedCarIds },
        });

        return availableCars.map((car:CarDataInterface) => ({
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
            isBlocked: car.isBlocked,
            createdAt: car.createdAt,
            id: car.id,
        }));
    }

}