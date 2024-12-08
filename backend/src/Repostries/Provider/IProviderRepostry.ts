import { BookingInterface } from "../../Interface/BookingInterface";
import { CarDataInterface } from "../../Interface/CarInterface";
import { ProviderAdressInterface, ProviderInterface } from "../../Interface/ProviderInterface";
import { IChat } from "../../Model/User/ChatModel";
import { OtpDocument } from "../../Model/User/OtpModel";

export interface IProviderRepository {
    
    getProviderById(id: string): Promise<ProviderInterface | null> ,

    emailExistCheck(email: string): Promise<ProviderInterface | null>,

    changePassword(email: string, password: string): Promise<ProviderInterface | null> ,

    createOtp(otp: number, email: string): Promise<OtpDocument | null>,

    findOtp(email: string, otp: string): Promise<OtpDocument | null>,

    saveProvider(providerData: ProviderInterface): Promise<ProviderInterface | null>,

    checkProviderAddress(providerId: string): Promise<ProviderAdressInterface | null>,

    saveProfile(providerData: ProviderAdressInterface): Promise<ProviderAdressInterface | null>,

    editProfile(providerData: ProviderAdressInterface, id: string): Promise<ProviderAdressInterface | null> ,
   
    updateprofileImage(images: string, id: string): Promise<ProviderAdressInterface | null>
   
    addCarDetails(carData: CarDataInterface): Promise<CarDataInterface | undefined>
    
    fetchCars(providerId: string, page: number, limit: number): Promise<CarDataInterface[] | null>
    
    updateStatusCar(carId: string): Promise<CarDataInterface | null>
   
    editCar(carId: string): Promise<CarDataInterface | null>
   
    updateCar(carData: CarDataInterface, id: string): Promise<CarDataInterface | null>
   
    updateCarImage(images: string[], id: string): Promise<CarDataInterface | null>
    
    getBookingHistory(providerId: string, page: number, limit: number): Promise<BookingInterface[] | null>
    
    updateStatusOfBooking(bookingId: string, status: string): Promise<BookingInterface | null>
    
    fetchUsersChat(providerId: string): Promise<IChat[] | null>,
   
    fetchChatHistory(recieverId: string, senderId: string): Promise<IChat[] | null>,
   
    countCars(providerId: string): Promise<number | null>,
   
    CountBookingCar(providerId: string): Promise<{ carName: string, count: number }[]>,
   
    totalRevenue(providerId: string): Promise<number | null>,
   
    countBooking(providerId: string): Promise<number | null>,
   
    revenueByCar(providerId: string): Promise<{ carName: string, amount: number }[]>,
   
    fetchSalesReport(page: number, limit: number, providerId: string): Promise<BookingInterface[] | null> ,

}