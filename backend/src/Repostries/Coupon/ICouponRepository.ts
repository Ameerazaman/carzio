import { CouponInterface } from "../../Interface/CouponInterface"

export interface ICouponRepository {

    addCoupon(coupon: CouponInterface): Promise<CouponInterface | null>

    fetchCoupon(page: number, limit: number): Promise<CouponInterface[] | null>

    editCoupon(couponId: string): Promise<CouponInterface | null>

    updateCoupon(couponData: CouponInterface, id: string): Promise<CouponInterface | null>

    updateStatusCoupon(couponId: string): Promise<CouponInterface | null>

    countCoupon(): Promise<number | null>

    fetchCouponForUser(userId: string): Promise<CouponInterface[] | null>

    userIdInCoupon(couponCode: string, userId: string): Promise<CouponInterface | null>

}
