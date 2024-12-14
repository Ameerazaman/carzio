import { CarDataInterface } from "../../Interface/CarInterface"

export interface ICarNotificationRepository {

    fetchNotification(): Promise<CarDataInterface[] | null>,

    carNotificationById(id: string): Promise<CarDataInterface | null>

    verifyNotification(id: string, value: string): Promise<CarDataInterface | null>

    addCarDetails(carData:CarDataInterface): Promise<CarDataInterface | null> 

    deleteNotification(id: string): Promise<boolean>
}