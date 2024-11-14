
export interface BookingFormData {
  IssueDate: string;
  ReturnDate: string;
  Amount: number;
  Payment: string;
  AdhaarNo: string;
  UserId: string;
  CarsId: string;
  UserAddressId: string;
  Coupon?: string;
  PickUpTime: string;
  TotalOffersDeduction?: number;
  CouponDeduction?: number;
  AmtOnDays: number,
  status?: string,
  providerId: string
}

