import { BookingDateInterface } from "../../Interface/AuthServices/BookingDateAuthInterface"
import { BookingInterface } from "../../Interface/BookingInterface"
import { CarDataInterface } from "../../Interface/CarInterface"
import { CouponInterface } from "../../Interface/CouponInterface"
import { OfferDataInterface } from "../../Interface/OfferInterface"
import { ProfileInterface } from "../../Interface/Profileinterface"
import { ReviewDataInterface } from "../../Interface/ReviewInterface"
import { UserAddressInterface } from "../../Interface/UserAddressInterface"
import { UserInterface } from "../../Interface/UserInterface"
import { WalletInterface } from "../../Interface/WalletInterface"
import { IChat } from "../../Model/User/ChatModel"
import { OtpDocument } from "../../Model/User/OtpModel"
import { UserLoginResponse } from "./UserRepostries"

export interface IUserRepository {

    emailExistCheck(email: string): Promise<UserInterface | null>

    fetchUsers(page: number, limit: number): Promise<UserInterface[] | null>,

    editUser(userId: string): Promise<UserInterface | null>

    updateUser(userData: UserInterface, id: string): Promise<UserInterface | null>

    updateStatus(userId: string): Promise<UserInterface | null>

    countUsers(): Promise<number | null>

    // createOtp(otp: string, email: string): Promise<OtpDocument | null>

    // deleteOtp(email: string): Promise<OtpDocument | null> 

    // updateOtp(email: string, otp: string): Promise<OtpDocument | null> 

    saveUser(userData: UserInterface): Promise<UserInterface | null>

    userLogin(email: string): Promise<UserLoginResponse>

    changePassword(email: string, password: string): Promise<UserInterface | null>

    // findOtp(email: string, otp: string): Promise<OtpDocument | null>

    getUserById(id: string): Promise<UserInterface | null>

    // fetchCarsForUser(page: number, limit: number): Promise<CarDataInterface[] | null>

    // countsOfCarForUser(): Promise<number | null>

    // carDetailsForUser(carId: string): Promise<CarDataInterface | null>

    // getReviewAndRatings(carId: string): Promise<{ averageRating: number | null; reviews: string[] }>

    // carFilter(engineType?: string[], fuelType?: string[], sortPrice?: string): Promise<CarDataInterface[] | null>

    // searchCar(searchQuery: string): Promise<CarDataInterface[] | null>

    // fetchOfferForUser(): Promise<OfferDataInterface[] | null>

    // checkProfile(userId: string): Promise<ProfileInterface | null>

    // saveProfile(profileData: ProfileInterface): Promise<ProfileInterface | null>

    // editProfile(profileData: ProfileInterface, profileId: string): Promise<ProfileInterface | null>

    // checkAddress(userId: string): Promise<UserAddressInterface | null>

    // saveAddress(addressData: UserAddressInterface): Promise<UserAddressInterface | null>

    // editAddress(addressData: UserAddressInterface, addressId: string): Promise<UserAddressInterface | null>

    // fetchCoupon(userId: string): Promise<CouponInterface[] | null>

    // checkOfferForBooking(carName: string): Promise<OfferDataInterface | null>

    // saveBookingData(bookingData: BookingInterface): Promise<BookingInterface | null>

    // userIdInCoupon(couponCode: string, userId: string): Promise<CouponInterface | null>

    // getBookingHistory(userId: string, page: number, limit: number): Promise<BookingInterface[] | null>

    // countBookingHistory(userId: string): Promise<number | null>

    // specificBookingDetails(bookingId: string): Promise<BookingInterface | null>

    // cancelBookingByUser(bookingId: string): Promise<BookingInterface | null>

    // creditToWallet(userId: string, amount: number): Promise<WalletInterface | null>

    // checkBookedOrNot(carId: string): Promise<BookingDateInterface[] | null>

    // checkBalanceAndUpdateWallet(userId: string, amount: number): Promise<WalletInterface | null>

    // getWalletPage(userId: string, page: number, limit: number): Promise<WalletInterface[] | null>

    // countWalletDocuments(userId: string): Promise<number | null>

    // createReviewData(reviewData: ReviewDataInterface): Promise<ReviewDataInterface | null>

    // checkBookidInReview(bookId: string): Promise<ReviewDataInterface | null>

    // fetchChatHistory(userId: string, providerId: string): Promise<IChat[] | null>

    // searchCarAvailability(startDate: string, endDate: string): Promise<CarDataInterface[]>


}