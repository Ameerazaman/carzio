import { CarDataInterface } from "../../Interface/CarInterface";
import CarModel from "../../Model/Provider/CarModel";
import CarNotification from "../../Model/Provider/CarNotification";
import { BaseRepository } from "../BaseRepostry";
import { ICarNotificationRepository } from "./ICarNotification";


export class CarNotificationRepository extends BaseRepository<typeof CarNotification> implements ICarNotificationRepository {
    constructor() {
        super(CarNotification);
    }

    async fetchNotification(): Promise<CarDataInterface[] | null> {
        try {

            const data = await this.model.find() as CarDataInterface[];
            const notification: CarDataInterface[] = data.map((carDocument: any) => ({
                id: carDocument._id?.toString(),
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
            }));
            return notification;
        } catch (error) {

            return null;
        }
    }
    // ******************************get car details for notification*******************
    async carNotificationById(id: string): Promise<CarDataInterface | null> {
        try {

            const carDocumentExist = await this.model.findById(id);

            return carDocumentExist as CarDataInterface;
        } catch (error) {

            return null;
        }
    }
    //**********************verify notification(car notification details addto car model and deleted notifcation***********)
    // carNotificationRepository.ts

    async verifyNotification(id: string, value: string): Promise<CarDataInterface | null> {
        try {
            // Fetch the notification document
            const carDocument = value === "Accept" ? await this.model.findById(id) : null;

            // Return carDocument for further processing if required
            return carDocument;
        } catch (error) {
            console.error("Error in verifyNotification:", error);
            return null;
        }
    }
// **********************delete Notification*********************
    async deleteNotification(id: string): Promise<boolean> {
        try {
            // Delete the notification document
            const result = await this.model.deleteOne({ _id: id });
            return result.deletedCount > 0;
        } catch (error) {
            console.error("Error deleting notification:", error);
            return false;
        }
    }


    // *******************************add car details car notification***********************
    async addCarDetails(carData: CarDataInterface): Promise<CarDataInterface | null> {

        try {
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
            return null;
        }
    }
}