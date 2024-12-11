import { BookingAuthResponse } from "../../Interface/AuthServices/BookingAuthInterface"
import { BookingDateAuthInterface } from "../../Interface/AuthServices/BookingDateAuthInterface"
import { CarAuthResponse } from "../../Interface/AuthServices/CarAuthInterface"
import { chatAuthInterface } from "../../Interface/AuthServices/ChatAuthResponse"
import { CouponAuthResponse } from "../../Interface/AuthServices/CouponAuthInterface"
import { OfferAuthResponse } from "../../Interface/AuthServices/OfferAuthInterface"
import { ProfileAuthResponse } from "../../Interface/AuthServices/ProfileAuthInterface"
import { ReviewAuthInterface } from "../../Interface/AuthServices/ReviewAuthResponse"
import { UserAddressAuthResponse } from "../../Interface/AuthServices/UserAddressAuthResponse"
import { UserAuthResponse } from "../../Interface/AuthServices/UserAuthServices"
import { WalletAuthInterface } from "../../Interface/AuthServices/WalletAuthInterface"
import { BookingInterface } from "../../Interface/BookingInterface"
import { CarDataInterface } from "../../Interface/CarInterface"
import { ProfileInterface } from "../../Interface/Profileinterface"
import { ReviewDataInterface } from "../../Interface/ReviewInterface"
import { UserAddressInterface } from "../../Interface/UserAddressInterface"
import { UserInterface } from "../../Interface/UserInterface"
import { OtpDocument } from "../../Model/User/OtpModel"

export interface IUserServices {
    userGetById(id: string): Promise<UserAuthResponse | null>

    emailExistCheck(email: string): Promise<UserInterface | null>

    changePassword(email: string, password: string): Promise<UserInterface | null>

    createOtp(email: string, otp: string): Promise<OtpDocument | null>

    verifyOtp(email: string, otp: string): Promise<OtpDocument | null>

    deleteOtp(email: string): Promise<OtpDocument | null>

    updateOtp(email: string, otp: string): Promise<OtpDocument | null>

    saveUser(userData: UserInterface): Promise<UserAuthResponse | undefined>

    userSignIn(userData: UserInterface): Promise<UserAuthResponse | undefined>

    fetchCars(page: number, limit: number): Promise<CarAuthResponse | undefined>

    carDetails(id: string): Promise<CarAuthResponse | null>

    carFilter(engineType?: string[], fuelType?: string[], sortPrice?: string): Promise<CarDataInterface[] | null>

    searchCar(searchQuery: string): Promise<CarDataInterface[] | null>

    fetchOffer(): Promise<OfferAuthResponse | undefined>

    checkProfile(id: string): Promise<ProfileInterface | null>

    saveProfile(profileData: ProfileInterface): Promise<ProfileAuthResponse | undefined>

    editProfile(profileData: ProfileInterface, id: string): Promise<ProfileAuthResponse | undefined>

    checkAddress(id: string): Promise<UserAddressInterface | null>

    saveAddress(addressData: UserAddressInterface): Promise<UserAddressAuthResponse | undefined>

    editAddress(addressData: UserAddressInterface, id: string): Promise<UserAddressAuthResponse | undefined>

    fetchCoupon(userId: string): Promise<CouponAuthResponse | undefined>

    checkOfferForBookiing(carName: string): Promise<OfferAuthResponse | undefined>

    saveBookingData(bookingData: BookingInterface): Promise<BookingAuthResponse | undefined>

    userIdInCoupon(coupon: string, userId: string): Promise<CouponAuthResponse | undefined>

    getBookingHistory(userId: string, page: number, limit: number): Promise<BookingAuthResponse | undefined>

    specificBookingDetails(bookingId: string): Promise<BookingAuthResponse | undefined>

    cancelBookingByUser(bookingId: string, userId: string, amount: number): Promise<BookingAuthResponse | undefined>

    creditToWallet(userId: string, amount: number): Promise<WalletAuthInterface | undefined>

    checkBookedOrNot(issueDate: string, returnDate: string, carId: string): Promise<BookingDateAuthInterface | undefined>

    checkWalletAndUpdate(userId: string, amount: number): Promise<WalletAuthInterface | undefined>
    
    getWalletPage(userId: string, page: number, limit: number): Promise<WalletAuthInterface | undefined>

    createReviewData(reviewData: ReviewDataInterface): Promise<ReviewAuthInterface | undefined>

    checkBookidInReview(bookId: string): Promise<ReviewAuthInterface | undefined>

    fetchChatHistory(userId: string, providerId: string): Promise<chatAuthInterface | undefined> 

    searchCarAvailability(issueDate: string, returnDate: string): Promise<CarAuthResponse | undefined>
}