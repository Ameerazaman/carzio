"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CarRepository = void 0;
const CarModel_1 = __importDefault(require("../../Model/Provider/CarModel"));
const BaseRepostry_1 = require("../BaseRepostry");
class CarRepository extends BaseRepostry_1.BaseRepository {
    constructor() {
        super(CarModel_1.default);
    }
    // ******************************fetch car for car management**********************
    fetchCars(page, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const skip = (page - 1) * limit;
                const carDocuments = yield this.model
                    .find()
                    .sort({ createdAt: -1 })
                    .skip(skip)
                    .limit(limit);
                console.log(carDocuments, "cardocumnets");
                const cars = carDocuments.map((car) => ({
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
                console.log(cars, "cars");
                return cars;
            }
            catch (error) {
                return null;
            }
        });
    }
    // *******************************change status of car*****************
    updateStatusCar(carId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let car = yield this.model.findById(carId);
                if (!car) {
                    return null;
                }
                const updateCar = yield this.model.findByIdAndUpdate(car, { isBlocked: !car.isBlocked }, { new: true });
                return updateCar;
            }
            catch (error) {
                return null;
            }
        });
    }
    // *******************count Car**********************
    countCars() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const countCars = yield this.model.find().countDocuments();
                ;
                return countCars;
            }
            catch (error) {
                return null;
            }
        });
    }
    // **************************check car exist or not *******************************
    checkCarExist(carData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let carExist = yield this.model.findOne({
                    providerId: carData.providerId,
                    rcNumber: carData.rcNumber
                });
                return carExist;
            }
            catch (error) {
                return null;
            }
        });
    }
    // *************************add car from notification************************************
    addCarFromNotification(carData) {
        return __awaiter(this, void 0, void 0, function* () {
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
                return yield newCar.save();
            }
            catch (error) {
                console.error("Error adding car from notification:", error);
                return null;
            }
        });
    }
    // ******************************fetch car for car management**********************
    fetchCarsForProvider(providerId, page, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const skip = (page - 1) * limit;
                const carDocuments = yield this.model.find({ providerId })
                    .sort({ createdAt: -1 })
                    .skip(skip)
                    .limit(limit);
                const cars = carDocuments.map((car) => ({
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
            }
            catch (error) {
                return null;
            }
        });
    }
    // *******************************change status of car*****************
    updateStatusCarForProvider(carId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let car = yield this.model.findById(carId);
                if (!car) {
                    return null;
                }
                const updateCar = yield this.model.findByIdAndUpdate(car, { isBlocked: !car.isBlocked }, { new: true });
                return updateCar;
            }
            catch (error) {
                return null;
            }
        });
    }
    //***********************fetch car for eedit in car mgt************************************
    editCarForProvider(carId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let car = yield this.model.findById(carId);
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
                    };
                }
                return null;
            }
            catch (error) {
                console.error("Error fetching Car:", error);
                return null;
            }
        });
    }
    // ******************************update car in car management*************************
    updateCarForProvider(carData, id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const updateData = {
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
                const editCar = yield this.model.findByIdAndUpdate(id, updateData, { new: true }).lean();
                return editCar;
            }
            catch (error) {
                return null;
            }
        });
    }
    // **********************************update Car image*************************
    updateCarImageForProvider(images, id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const car = yield this.model.findById(id);
                if (!car) {
                    return null;
                }
                const updatedCar = yield this.model.findByIdAndUpdate(id, { images: images }, { new: true });
                return updatedCar;
            }
            catch (error) {
                return null;
            }
        });
    }
    // **********************************count cars****************************
    countCarsForProvider(providerId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const countCars = yield this.model.find({ providerId: providerId }).countDocuments();
                ;
                return countCars;
            }
            catch (error) {
                return null;
            }
        });
    }
    // ******************************fetch car for card**********************
    fetchCarsForUser(page, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const skip = (page - 1) * limit;
                const carDocuments = yield this.model.find({ isBlocked: false })
                    .sort({ createdAt: -1 })
                    .skip(skip)
                    .limit(limit)
                    .exec();
                const cars = carDocuments.map((car) => ({
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
            }
            catch (error) {
                return null;
            }
        });
    }
    // *******************************fetch cout for Total Page in FetchCar*****************
    countsOfCarForUser() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const total = yield this.model.countDocuments();
                return total;
            }
            catch (error) {
                return null;
            }
        });
    }
    // ***********************************Car Details *************************
    carDetailsForUser(carId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.model.findById(carId);
                return result;
            }
            catch (error) {
                return null;
            }
        });
    }
    // ***************************filter************************
    carFilter(engineType, fuelType, sortPrice) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const filters = {};
                if (engineType && engineType.length > 0) {
                    filters.engineType = { $in: engineType.map(type => new RegExp(type, 'i')) }; // Case-insensitive filter
                }
                if (fuelType && fuelType.length > 0) {
                    filters.fuelType = { $in: fuelType.map(type => new RegExp(type, 'i')) }; // Case-insensitive filter
                }
                const sortOrder = sortPrice === 'lowToHigh' ? 1 : sortPrice === 'highToLow' ? -1 : undefined;
                const filteredCars = yield this.model.find(filters)
                    .sort(sortOrder ? { rentalPrice: sortOrder } : {})
                    .exec();
                const cars = filteredCars.map((car) => ({
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
                return cars;
            }
            catch (error) {
                return null;
            }
        });
    }
    // ******************************search car**********************
    searchCar(searchQuery) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const regex = new RegExp(searchQuery, "i");
                const result = yield this.model.find({ car_name: { $regex: regex } });
                return result;
            }
            catch (error) {
                return null;
            }
        });
    }
    // *****************************search available cars ***************************
    findAvailableCars(excludedCarIds) {
        return __awaiter(this, void 0, void 0, function* () {
            const availableCars = yield this.model.find({
                _id: { $nin: excludedCarIds },
            });
            return availableCars.map((car) => ({
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
        });
    }
}
exports.CarRepository = CarRepository;
