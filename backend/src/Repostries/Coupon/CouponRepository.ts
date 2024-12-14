import { ObjectId } from "mongoose";
import { CouponInterface } from "../../Interface/CouponInterface";
import Coupon from "../../Model/Admin/CouponModel";
import { BaseRepository } from "../BaseRepostry";
import { ICouponRepository } from "./ICouponRepository";

export class CouponRepository extends BaseRepository<typeof Coupon> implements ICouponRepository {
    constructor() {
        super(Coupon);
    }
    async addCoupon(coupon: CouponInterface): Promise<CouponInterface | null> {
        try {
            const newCoupon = new Coupon({
                discountPercentage: coupon.discountPercentage ?? 0,
                minRentalAmount: coupon.minRentalAmount ?? 0,
                startDate: new Date(coupon.startDate),
                endDate: new Date(coupon.endDate),
                isActive: coupon.isActive ?? true,
                userId: coupon.userId || [],
                code: coupon.code
            });

            const savedCoupon = (await newCoupon.save()) as unknown as CouponInterface
            console.log(savedCoupon);

            return {
                code: savedCoupon.code ?? "",
                discountPercentage: savedCoupon.discountPercentage,
                minRentalAmount: savedCoupon.minRentalAmount,
                startDate: savedCoupon.startDate,
                endDate: savedCoupon.endDate,
                isActive: savedCoupon.isActive,
                userId: savedCoupon.userId,
                id: savedCoupon.id?.toString() || "",
            };
        } catch (error) {

            return null;
        }
    }
    // ********************************fetch coupon*********************
    async fetchCoupon(page: number, limit: number): Promise<CouponInterface[] | null> {
        try {
            const skip = (page - 1) * limit;

            const data = await this.model.find()
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean();

            const coupons: CouponInterface[] = data.map((coupon: any) => ({
                code: coupon.code ?? null,
                discountPercentage: coupon.discountPercentage ?? null,
                startDate: coupon.startDate ?? null,
                endDate: coupon.endDate ?? null,
                isActive: coupon.isActive ?? false,
                minRentalAmount: coupon.minRentalAmount ?? null,
                userId: coupon.userId ?? [],
                id: coupon._id?.toString() || "",
            }));

            return coupons;
        } catch (error) {
            return null;
        }
    }

    // **************************edit Offer*************************8
    async editCoupon(couponId: string): Promise<CouponInterface | null> {
        try {
            let coupon = await this.model.findById(couponId);
            if (coupon) {
                return {
                    code: coupon.code ?? "",
                    discountPercentage: coupon.discountPercentage ?? 0,
                    minRentalAmount: coupon.minRentalAmount ?? 0,
                    startDate: coupon.startDate ?? "",
                    endDate: coupon.endDate ?? "",
                    isActive: coupon.isActive ?? false,
                    userId: coupon.userId ?? [],
                    id: coupon.id?.toString() || "",
                } as CouponInterface;
            }
            return null;
        }
        catch (error) {

            return null;
        }
    }

    // *******************************update coupon********************
    async updateCoupon(couponData: CouponInterface, id: string): Promise<CouponInterface | null> {
        try {
            const updatedCoupon = await Coupon.findByIdAndUpdate(
                id,
                {
                    code: couponData.code ?? "",
                    discountPercentage: couponData.discountPercentage ?? 0,
                    minRentalAmount: couponData.minRentalAmount ?? 0,
                    startDate: couponData.startDate ?? "",
                    endDate: couponData.endDate ?? "",
                    isActive: couponData.isActive ?? false,
                    userId: couponData.userId ?? [],
                },
                { new: true }
            ).lean<CouponInterface>();
            return updatedCoupon;
        } catch (error) {

            return null;
        }
    }

    // ***********************updateStatus oupon********************88
    async updateStatusCoupon(couponId: string): Promise<CouponInterface | null> {
        try {
            let coupon = await this.model.findById(couponId);
            if (!coupon) {
                return null;
            }
            const updateCoupon = await this.model.findByIdAndUpdate(
                couponId,
                { isActive: !coupon.isActive },
                { new: true }
            );

            if (updateCoupon) {
                return {
                    code: updateCoupon.code ?? "",
                    discountPercentage: updateCoupon.discountPercentage ?? 0,
                    minRentalAmount: updateCoupon.minRentalAmount ?? 0,
                    startDate: updateCoupon.startDate ? updateCoupon.startDate.toISOString() : "",
                    endDate: updateCoupon.endDate ? updateCoupon.endDate.toISOString() : "",
                    isActive: updateCoupon.isActive ?? false,
                    userId: updateCoupon.userId?.map((id: ObjectId) => id.toString()) ?? [],
                    id: updateCoupon._id.toString(),
                } as CouponInterface;
            }

            return null;
        } catch (error) {
            return null;
        }
    }

    // ***************************total Coupons*******************************
    async countCoupon(): Promise<number | null> {
        try {
            const countCoupon = await this.model.countDocuments();
            return countCoupon;
        } catch (error) {
            return null;
        }
    }
    // **************************fetch coupon************
    async fetchCouponForUser(userId: string): Promise<CouponInterface[] | null> {
        try {
            const couponsWithoutUser = await this.model.find({ userId: { $ne: userId } }) as CouponInterface[];
            if (couponsWithoutUser && couponsWithoutUser.length > 0) {
                return couponsWithoutUser;
            }
            return null;
        } catch (error) {
            return null;
        }
    }

    // // **********************update userid in coupon ***********************
    async userIdInCoupon(couponCode: string, userId: string): Promise<CouponInterface | null> {
        try {
            const updatedCoupon = await this.model.findOneAndUpdate(
                { code: couponCode },
                { $push: { userId: userId } },
                { new: true }
            ) as CouponInterface

            if (updatedCoupon) {
                return updatedCoupon;
            }
            return null;
        } catch (error) {

            return null;
        }
    }

}