export interface BookingInterface {
    IssueDate: string;
    ReturnDate: string;
    Amount: number;
    Payment: string;
    AdhaarNo: string;
    UserId: string;
    CarsId: string;
    UserAddressId: string;
    Coupon?: string; // Optional
    PickUpTime?: string; // Optional, based on schema
    TotalOffersDeduction?: number; // Optional
    CouponDeduction?: number; // Optional
    AmtOnDays: number; // Required
    rentDays: number; // Required
    total_Amt: number; // Required
    offerAmt?: number; // Optional
    providerId: string; // Required
    status: string; // Required
    createdAt?: Date; // Added for timestamps
    updatedAt?: Date; // Added for timestamps
  }
  