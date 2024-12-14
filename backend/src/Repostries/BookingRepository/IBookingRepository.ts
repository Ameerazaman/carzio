import { BookingDateInterface } from "../../Interface/AuthServices/BookingDateAuthInterface"
import { BookingInterface } from "../../Interface/BookingInterface"
import { CarDataInterface } from "../../Interface/CarInterface"


export interface IBookingRepository {

    getBookingHistory(page: number, limit: number): Promise<BookingInterface[] | null>

    specificBookingDetails(bookingId: string): Promise<BookingInterface | null>
    
    updateStatusOfBooking(bookingId: string, status: string): Promise<BookingInterface | null>
 
    CountBookingCar(): Promise<{ carName: string, count: number }[]>

    totalRevenue(): Promise<number | null>

    countBooking(): Promise<number | null>

    revenueByCar(): Promise<{ carName: string, amount: number }[]>

    fetchSalesReport(page: number, limit: number): Promise<BookingInterface[] | null>

    CountBookingCarForProvider(providerId: string): Promise<{ carName: string, count: number }[]>,

    totalRevenueForProvider(providerId: string): Promise<number | null>,
   
    countBookingForProvider(providerId: string): Promise<number | null>,
   
    revenueByCarForProvider(providerId: string): Promise<{ carName: string, amount: number }[]>,
   
    fetchSalesReportForProvider(page: number, limit: number, providerId: string): Promise<BookingInterface[] | null> ,

    getBookingHistoryForProvider(providerId: string, page: number, limit: number): Promise<BookingInterface[] | null>
    
    specificBookingDetailsForProvider(bookingId: string): Promise<BookingInterface | null>
   
    updateStatusOfBookingForProvider(bookingId: string, status: string): Promise<BookingInterface | null>
    
    saveBookingData(bookingData: BookingInterface): Promise<BookingInterface | null>

    getBookingHistoryForUser(userId: string, page: number, limit: number): Promise<BookingInterface[] | null>

    countBookingHistoryForUser(userId: string): Promise<number | null>

    specificBookingDetailsForUser(bookingId: string): Promise<BookingInterface | null>

    cancelBookingByUser(bookingId: string): Promise<BookingInterface | null>

    checkBookedOrNot(carId: string): Promise<BookingDateInterface[] | null>

    findBookedCarIds(startDate: string, endDate: string): Promise<string[]>

}