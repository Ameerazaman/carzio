import { CarDataInterface } from "../../Interface/CarInterface"

export interface ICarRepository {

    fetchCars(page: number, limit: number): Promise<CarDataInterface[] | null>

    updateStatusCar(carId: string): Promise<CarDataInterface | null>

    countCars(): Promise<number | null>

    checkCarExist(carData: CarDataInterface): Promise<CarDataInterface | null>

    addCarFromNotification(carData: CarDataInterface): Promise<CarDataInterface | null>

    checkCarExist(carData: CarDataInterface): Promise<CarDataInterface | null>

    fetchCarsForProvider(providerId: string, page: number, limit: number): Promise<CarDataInterface[] | null>
    
    updateStatusCarForProvider(carId: string): Promise<CarDataInterface | null>
   
    editCarForProvider(carId: string): Promise<CarDataInterface | null>
   
    updateCarForProvider(carData: CarDataInterface, id: string): Promise<CarDataInterface | null>
   
    updateCarImageForProvider(images: string[], id: string): Promise<CarDataInterface | null>

    countCarsForProvider(providerId: string): Promise<number | null> 

    fetchCarsForUser(page: number, limit: number): Promise<CarDataInterface[] | null>

    countsOfCarForUser(): Promise<number | null>

    carDetailsForUser(carId: string): Promise<CarDataInterface | null>

    carFilter(engineType?: string[], fuelType?: string[], sortPrice?: string): Promise<CarDataInterface[] | null>

    findAvailableCars(excludedCarIds: string[]): Promise<CarDataInterface[]> 

    searchCar(searchQuery: string): Promise<CarDataInterface[] | null>
}

