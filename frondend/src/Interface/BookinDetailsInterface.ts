interface BookingDetails {
    _id: string;
    car_name: string;
    model: string;
    rentalPrice: number;
    engineType: string;
    images: string[];
  }
  
  interface UserAddress {
    _id: string;
    userId: string;
    houseName: string;
    street: string;
    city: string;
    state: string;
    district: string;
    zip: string;
}

  export interface Booking {
    _id: string;
    IssueDate: string;
    ReturnDate: string;
    Amount: number;
    AmtOnDays: number;
    Payment: string;
    status: string;
    AdhaarNo: string;
    CarsId: string;
    CarsObjectId: string;
    Coupon: string;
    PickUpTime: string;
    userAddress:UserAddress;
    UserAddressId: string;
    UserId: string;
    bookingDetails: BookingDetails;
    offerAmt: number;
    providerId: string;
    rentDays: number;
    total_Amt: number;
    __v: number;
  }