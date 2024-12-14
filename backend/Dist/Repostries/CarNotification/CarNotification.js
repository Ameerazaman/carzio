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
exports.CarNotificationRepository = void 0;
const CarNotification_1 = __importDefault(require("../../Model/Provider/CarNotification"));
const BaseRepostry_1 = require("../BaseRepostry");
class CarNotificationRepository extends BaseRepostry_1.BaseRepository {
    constructor() {
        super(CarNotification_1.default);
    }
    fetchNotification() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield this.model.find();
                const notification = data.map((carDocument) => {
                    var _a;
                    return ({
                        id: (_a = carDocument._id) === null || _a === void 0 ? void 0 : _a.toString(),
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
                        isBlocked: carDocument.isBlocked,
                        providerId: carDocument.providerId ? carDocument.providerId.toString() : undefined,
                        createdAt: carDocument.createdAt,
                    });
                });
                return notification;
            }
            catch (error) {
                return null;
            }
        });
    }
    // ******************************get car details for notification*******************
    carNotificationById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const carDocumentExist = yield this.model.findById(id);
                return carDocumentExist;
            }
            catch (error) {
                return null;
            }
        });
    }
    //**********************verify notification(car notification details addto car model and deleted notifcation***********)
    // carNotificationRepository.ts
    verifyNotification(id, value) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Fetch the notification document
                const carDocument = value === "Accept" ? yield this.model.findById(id) : null;
                // Return carDocument for further processing if required
                return carDocument;
            }
            catch (error) {
                console.error("Error in verifyNotification:", error);
                return null;
            }
        });
    }
    // **********************delete Notification*********************
    deleteNotification(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Delete the notification document
                const result = yield this.model.deleteOne({ _id: id });
                return result.deletedCount > 0;
            }
            catch (error) {
                console.error("Error deleting notification:", error);
                return false;
            }
        });
    }
    // *******************************add car details car notification***********************
    addCarDetails(carData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const newCar = new CarNotification_1.default({
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
                const car = yield newCar.save();
                return car.toObject();
            }
            catch (error) {
                return null;
            }
        });
    }
}
exports.CarNotificationRepository = CarNotificationRepository;
