import { adminInterface } from "../../Interface/AdminInterface";
import { adminAuthResponse } from "../../Interface/AuthServices/AdminAuthInterface";
import { BookingAuthResponse } from "../../Interface/AuthServices/BookingAuthInterface";
import { CarAuthResponse } from "../../Interface/AuthServices/CarAuthInterface";
import { CouponAuthResponse } from "../../Interface/AuthServices/CouponAuthInterface";
import { DashboardAuthInterface } from "../../Interface/AuthServices/DashboardAuthInterface";
import { OfferAuthResponse } from "../../Interface/AuthServices/OfferAuthInterface";
import { UserAuthResponse } from "../../Interface/AuthServices/UserAuthServices";
import { CarDataInterface } from "../../Interface/CarInterface";
import { CouponInterface } from "../../Interface/CouponInterface";
import { OfferDataInterface } from "../../Interface/OfferInterface";
import { ProviderInterface } from "../../Interface/ProviderInterface";
import { UserInterface } from "../../Interface/UserInterface";

export interface IAdminServices {

    adminGetById(id: string): Promise<adminAuthResponse | null>

    adminSignIn(adminData: adminInterface): Promise<adminAuthResponse | undefined>

    fetchUsers(page: number, limit: number): Promise<UserAuthResponse | undefined>

    editUser(id: string): Promise<UserInterface | null>

    updateUser(userData: UserInterface, id: string): Promise<UserAuthResponse | undefined> 

    updateStatus(id: string): Promise<UserInterface | null>

    fetchProviders(page:number,limit:number): Promise<UserAuthResponse | undefined>

    editProvider(id: string): Promise<ProviderInterface | null>

    updateProvider(providerData: ProviderInterface, id: string): Promise<UserAuthResponse | undefined>

    updateStatusProvider(id: string): Promise<ProviderInterface | null>

    fetchNotification(): Promise<CarAuthResponse | undefined>

    notificationDetails(id: string): Promise<CarDataInterface | null>

    verifynotification(id: string, value: string): Promise<CarDataInterface | null>

    fetchCars(page:number,limit:number): Promise<CarAuthResponse | undefined>

    updateStatusCar(id: string): Promise<CarDataInterface | null>

    addOffer(offer: OfferDataInterface): Promise<OfferAuthResponse | null>

    fetchOffer(page:number,limit:number): Promise<OfferAuthResponse | undefined>

    editOffer(id: string): Promise<OfferDataInterface | null>

    updateOffer(offerData: OfferDataInterface, id: string): Promise<OfferAuthResponse | undefined>

    updateStatusOffer(id: string): Promise<OfferDataInterface | null>

    addCoupon(coupon: CouponInterface): Promise<CouponAuthResponse | null>

    fetchCoupon(page:number,limit:number): Promise<CouponAuthResponse | undefined>

    editCoupon(id: string): Promise<CouponInterface | null>

    updateCoupon(couponData: CouponInterface, id: string): Promise<CouponAuthResponse | undefined>

    updateStatusCoupon(id: string): Promise<CouponInterface | null>

    getBookingHistory(page:number,limit:number): Promise<BookingAuthResponse | undefined>

    specificBookingDetails(bookingId: string): Promise<BookingAuthResponse | undefined>

    updateStatusOfBooking(bookingId: string, status: string): Promise<BookingAuthResponse | undefined>

    getConstDashboardData(): Promise<DashboardAuthInterface | null>

    fetchSalesReport(page: number, limit: number): Promise<BookingAuthResponse | undefined>
}