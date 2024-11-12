export interface CouponFormData {
    code?: string;
    discountPercentage: number;
    maxDiscountAmount: number;
    minRentalAmount: number;
    startDate: string;
    endDate: string;
    isActive: boolean;
    userId: string;
    maxUsageLimit: number;
}