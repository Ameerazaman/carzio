import { adminInterface } from "../../Interface/AdminInterface";
import { BookingInterface } from "../../Interface/BookingInterface";
import { CarDataInterface } from "../../Interface/CarInterface";
import { CouponInterface } from "../../Interface/CouponInterface";
import { OfferDataInterface } from "../../Interface/OfferInterface";
import { ProviderInterface } from "../../Interface/ProviderInterface";
import { UserInterface } from "../../Interface/UserInterface";

export interface IAdminRepository {
    emailExistCheck(email: string): Promise<adminInterface | null>,

    fetchUsers(page: number, limit: number): Promise<UserInterface[] | null>,

    fetchProviders(page: number, limit: number): Promise<UserInterface[] | null>

    editUser(userId: string): Promise<UserInterface | null>

    updateUser(userData: UserInterface, id: string): Promise<UserInterface | null>

    updateStatus(userId: string): Promise<UserInterface | null>

    editProvider(providerId: string): Promise<ProviderInterface | null>

    updateProvider(providerData: ProviderInterface, id: string): Promise<ProviderInterface | null>,

    updateStatusprovider(providerId: string): Promise<ProviderInterface | null>

    getAdminById(id: string): Promise<adminInterface | null>

    fetchNotification(): Promise<CarDataInterface[] | null>,

    carNotificationById(id: string): Promise<CarDataInterface | null>

    verifyNotification(id: string, value: string): Promise<CarDataInterface | null>

    fetchCars(page: number, limit: number): Promise<CarDataInterface[] | null>

    updateStatusCar(carId: string): Promise<CarDataInterface | null>

    addOffer(offer: OfferDataInterface): Promise<OfferDataInterface | null>

    fetchOffer(page: number, limit: number): Promise<OfferDataInterface[] | null>

    editOffer(offerId: string): Promise<OfferDataInterface | null>

    updateOffer(offerData: OfferDataInterface, id: string): Promise<OfferDataInterface | null>

    updateStatusOffer(offerId: string): Promise<OfferDataInterface | null>

    addCoupon(coupon: CouponInterface): Promise<CouponInterface | null>

    fetchCoupon(page: number, limit: number): Promise<CouponInterface[] | null>

    editCoupon(couponId: string): Promise<CouponInterface | null>

    updateCoupon(couponData: CouponInterface, id: string): Promise<CouponInterface | null>

    updateStatusCoupon(couponId: string): Promise<CouponInterface | null>

    getBookingHistory(page: number, limit: number): Promise<BookingInterface[] | null>

    specificBookingDetails(bookingId: string): Promise<BookingInterface | null>
    
    updateStatusOfBooking(bookingId: string, status: string): Promise<BookingInterface | null>

    countCars(): Promise<number | null>

    countUsers(): Promise<number | null>

    countProviders(): Promise<number | null>

    CountBookingCar(): Promise<{ carName: string, count: number }[]>

    totalRevenue(): Promise<number | null>

    countBooking(): Promise<number | null>

    countOffers(): Promise<number | null>

    countNotification(): Promise<number | null>

    countCoupon(): Promise<number | null>

    revenueByCar(): Promise<{ carName: string, amount: number }[]>

    fetchSalesReport(page: number, limit: number): Promise<BookingInterface[] | null>
}