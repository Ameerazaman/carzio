import { BookingAuthResponse } from "../../Interface/AuthServices/BookingAuthInterface"
import { CarAuthResponse } from "../../Interface/AuthServices/CarAuthInterface"
import { chatAuthInterface } from "../../Interface/AuthServices/ChatAuthResponse"
import { DashboardAuthInterface } from "../../Interface/AuthServices/DashboardAuthInterface"
import { ProviderAuthResponse } from "../../Interface/AuthServices/ProviderAuthServices"
import { CarDataInterface } from "../../Interface/CarInterface"
import { ProviderAdressInterface, ProviderInterface } from "../../Interface/ProviderInterface"
import { OtpDocument } from "../../Model/User/OtpModel"

export interface IProviderServices {

    providerGetById(id: string): Promise<ProviderAuthResponse | null>

    emailExistCheck(email: string): Promise<ProviderInterface | null>

    changePassword(email: string, password: string): Promise<ProviderInterface | null>

    createOtp(email: string, otp: string): Promise<OtpDocument | null> 

    verifyOtp(email: string, otp: string): Promise<OtpDocument | null>

    deleteOtp(email: string): Promise<OtpDocument | null> 

    updateOtp(email: string, otp: string): Promise<OtpDocument | null>

    saveProvider(providerData: ProviderInterface): Promise<ProviderAuthResponse | undefined>

    providerSignIn(providerData: ProviderInterface): Promise<ProviderAuthResponse | undefined>

    checkProviderAddress(id: string): Promise<ProviderAdressInterface | null>

    saveProfile(providerData: ProviderAdressInterface): Promise<ProviderAuthResponse | undefined>

    editProfile(providerData: ProviderAdressInterface, id: string): Promise<ProviderAuthResponse | undefined> 

    updateProfileImage<T>(file: T, id: string): Promise<CarAuthResponse | undefined>

    addCarDetails<T>(files: T, carData: CarDataInterface): Promise<CarAuthResponse | undefined>

    fetchCars(providerId: string, page: number, limit: number): Promise<CarAuthResponse | undefined>
    
    updateStatusCar(id: string): Promise<CarDataInterface | null>

    editCar(id: string): Promise<CarDataInterface | null>

    updateCar(carData: CarDataInterface, id: string): Promise<CarAuthResponse | undefined>

    updateCarImage<T>(files: T, id: string): Promise<CarAuthResponse | undefined>

    getBookingHistory(providerId: string, page: number, limit: number): Promise<BookingAuthResponse | undefined> 

    specificBookingDetails(bookingId: string): Promise<BookingAuthResponse | undefined>

    updateStatusOfBooking(bookingId: string, status: string): Promise<BookingAuthResponse | undefined>

    fetchUsersChat(providerId: string): Promise<chatAuthInterface> 

    fetchChatHistory(userId: string, providerId: string): Promise<chatAuthInterface | undefined>

    getConstDashboardData(providerId: string): Promise<DashboardAuthInterface | null>

    fetchSalesReport(page: number, limit: number, providerId: string): Promise<BookingAuthResponse | undefined>
}