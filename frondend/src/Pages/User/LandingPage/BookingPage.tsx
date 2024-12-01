import React, { useState, useEffect, useCallback } from 'react';
import {  useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../../App/Store';
import { User } from '../../Common/Navbar';
import { carDetail, checkOffer, fetchCoupon, BookingConfirm, checkingBookedOrNot, userIdStoredInCoupon, checkBalanceUpdateWallet } from '../../../Api/User';
import { CarDataInterface } from '../../../Interface/CarInterface';
import { CouponFormData } from '../../../Interface/CouponFormData';
import { OfferFormData } from '../../../Interface/OfferInterface';
import toast from 'react-hot-toast';
import { MdError } from 'react-icons/md';
import UserAddress from './UserAdress';

interface BookingDetails {
  date: string;
  status: string;
  amount: number;
}

function BookingPage() {
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.user.currentUser) as User | null;
  const { carId } = useParams<string>();
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);
  const [carData, setCarData] = useState<CarDataInterface | null>(null);
  const [couponData, setCouponData] = useState<CouponFormData[] | null>(null);
  const [formData, setFormData] = useState({
    IssueDate: '',
    ReturnDate: '',
    Amount: 0,
    Payment: '',
    AdhaarNo: '',
    UserId: user?._id,
    CarsId: carId,
    UserAddressId: '',
    CouponAmt: 0,
    Coupon: '',
    ProviderId: '',
    PickUpTime: '',
    offerAmt: 0,
    rentDays: 1,
    total_Amt: 0,
    AmtOnDays: 0,
  });

  useEffect(() => {
    const fetchCarData = async () => {
      try {
        setLoading(true);
        if (carId) {
          const result = await carDetail(carId);
          const carDetails = result?.data?.data;
          setCarData(carDetails);

          if (carDetails) {
            setFormData((prevData) => {
              const rentalPrice = carDetails.rentalPrice ?? 0;
              const rentDays = prevData.rentDays || 1;

              return {
                ...prevData,
                Amount: rentalPrice,
                AmtOnDays: rentDays * rentalPrice,
                total_Amt: rentalPrice,
                ProviderId: carDetails.providerId,
              };
            });
          }
        }
      } catch (err: any) {

      } finally {
        setLoading(false);
      }
    };

    fetchCarData();
  }, [carId]);

  useEffect(() => {
    const fetchCouponAndOfferData = async () => {
      try {
        setLoading(true);

        if (user?._id && carData?.car_name) {

          const couponData = await fetchCoupon(user?._id);
          const couponsArray = couponData?.data?.data || [];
          const validCoupons = couponsArray.filter(
            (coupon: CouponFormData) => formData.AmtOnDays >= coupon.minRentalAmount
          );

          if (validCoupons.length > 0) {
            setCouponData(validCoupons);
          }

          const offerData = await checkOffer(carData.car_name);
          if (offerData?.data?.data) {
            const offer = offerData.data.data;
            const discountPercentage = offer.discountPercentage || 0;
            setFormData((prevData) => ({
              ...prevData,
              offerAmt: (discountPercentage * prevData.AmtOnDays) / 100,
            }));

          }
        }
      } catch (err: any) {

      } finally {
        setLoading(false);
      }
    };

    fetchCouponAndOfferData();
  }, [user, carData?.car_name, formData.AmtOnDays]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => {
      const updatedData = { ...prevData, [name]: value };

      if (name === 'IssueDate' || name === 'ReturnDate') {
        const { IssueDate, ReturnDate } = updatedData;
        if (IssueDate && ReturnDate) {
          const issueDate = new Date(IssueDate);
          const returnDate = new Date(ReturnDate);
          const timeDifference = returnDate.getTime() - issueDate.getTime();
          const daysDifference = Math.max(Math.ceil(timeDifference / (1000 * 3600 * 24)), 1);
          updatedData.rentDays = daysDifference;
          updatedData.AmtOnDays = updatedData.rentDays * updatedData.Amount;
        }
      }

      return updatedData;
    });
  };

  const validateFormData = () => {
    const errors: { [key: string]: string } = {};
    const today = new Date().toISOString().split("T")[0];

    if (!formData.IssueDate) {
      errors.IssueDate = "Issue Date is required.";
    } else if (formData.IssueDate <= today) {
      errors.IssueDate = "Issue Date must be a future date.";
    }

    if (!formData.ReturnDate) {
      errors.ReturnDate = "Return Date is required.";
    } else if (formData.ReturnDate <= today) {
      errors.ReturnDate = "Return Date must be a future date.";
    } else if (formData.ReturnDate <= formData.IssueDate) {
      errors.ReturnDate = "Return Date must be after Issue Date.";
    }

    if (formData.Amount <= 0) errors.Amount = "Amount must be greater than zero.";
    if (!formData.Payment) errors.Payment = "Payment method is required.";
    if (!formData.AdhaarNo || formData.AdhaarNo.length !== 12) errors.AdhaarNo = "Aadhaar number must be 12 digits.";
    if (!formData.UserId) errors.UserId = "User ID is required.";
    if (!formData.CarsId) errors.CarsId = "Car ID is required.";
    if (!formData.UserAddressId) errors.UserAddressId = "User Address ID is required.";
    if (formData.CouponAmt < 0) errors.CouponAmt = "Coupon Amount must be zero or positive.";
    if (formData.offerAmt < 0) errors.offerAmt = "Offer Amount must be zero or positive.";
    if (formData.rentDays <= 0) errors.rentDays = "Rent days must be at least 1.";
    if (formData.total_Amt <= 0) errors.total_Amt = "Total Amount must be greater than zero.";
    if (!formData.PickUpTime) errors.PickUpTime = "Pick up time is required.";

    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const errors = validateFormData();
    setFormErrors(errors);

    if (Object.keys(errors).length > 0) {
      toast.error("Please fix the errors before submitting.");
      return;
    }

    // Validate required fields before proceeding
    if (!formData.UserId) {
      toast.error("User ID is required.");
      return;
    }
    if (!formData.CarsId) {
      toast.error("Car ID is required.");
      return;
    }

    const adjustedFormData = {
      ...formData,
      UserId: formData.UserId, // UserId is validated to be a string
      CarsId: formData.CarsId, // CarsId is validated to be a string
      providerId: carData?.providerId || '',
      total_Amt: formData.AmtOnDays - formData.offerAmt - formData.CouponAmt,
      status: "pending",
    };

    try {
      const result = await checkingBookedOrNot(formData.IssueDate, formData.ReturnDate, formData.CarsId);
      console.log(result, "result in checkingBookedOrNot");

      if (result.data.data.success) {
        if (formData.Payment === "Online payment") {
          adjustedFormData.status = "success";
          navigate('/checkOut', { state: { bookingData: adjustedFormData } });
          return;
        }
        if (formData.Payment === "Wallet" && formData.UserId) {
          const walletResult = await checkBalanceUpdateWallet(adjustedFormData.total_Amt, formData.UserId);
          if (!walletResult.data.data.success) {
            toast.error(walletResult.data.data.message);
            return;
          }
        }
        const bookingResult = await BookingConfirm(adjustedFormData);
        if (bookingResult) {
          if (adjustedFormData.Coupon) {
            await userIdStoredInCoupon(adjustedFormData.Coupon, adjustedFormData.UserId);
          }
          navigate('/success');
        }
        console.log("Form submitted successfully:", bookingResult);
      } else {
        toast.error(result.data.data.message);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Error submitting form. Please try again.");
    }
  };


  const handleAddressId = useCallback((id: string) => {
    setFormData((prevData) => ({
      ...prevData,
      UserAddressId: id,
    }));
  }, []);

  const handleCouponApply = () => {
    if (couponData && Array.isArray(couponData)) {  // Check if couponData is not null
      const selectedCoupon = couponData.find((coupon) => coupon.code === formData.Coupon);

      if (selectedCoupon) {
        const discountAmount = (selectedCoupon.discountPercentage / 100) * formData.AmtOnDays;
        console.log(discountAmount, "discount")
        setFormData((prevData) => {
          const newTotalAmt = prevData.Amount * prevData.rentDays - discountAmount; // Calculate the new total amount

          return {
            ...prevData,
            CouponAmt: discountAmount,
            total_Amt: Math.max(newTotalAmt, 0)  // Ensure total_Amt doesn't go below 0
          };
        });


      } else {
        toast.error("Please select a valid coupon.");
      }
    } else {
      toast.error("Coupon data is not available.");
    }
  };




  if (!carData) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center">
        <MdError className="text-red-500 text-6xl mb-4" />
        <p className="text-red-500 text-2xl font-semibold">
          Car Not Found or Blocked
        </p>
        <p className="text-gray-500 mt-2">
          We're sorry, but the car you're looking for is either unavailable or has been blocked.
        </p>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-screen via-blue-200 to-blue-100 p-4">
      <form onSubmit={handleSubmit} className="flex flex-wrap w-full max-w-5xl bg-white shadow-lg rounded-2xl p-8">
        {/* Left Side: Car Image and Booking Details */}
        <div className="w-full md:w-1/2 pr-6 flex flex-col space-y-6">
          <div className="flex space-x-6 items-center shadow-lg p-4 rounded-lg bg-white">
            <img src={carData?.images[0]} className="h-40 w-40 object-contain rounded-lg" />
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">{carData?.car_name}</h2>
              <div className="space-y-3">
                {/* Issue Date Input */}
                <div key="IssueDate" className="relative">
                  <input
                    type="date"
                    name="IssueDate"
                    value={formData.IssueDate || ''}
                    onChange={handleChange}

                    className="peer block w-full p-2 text-sm border border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
                  />
                  <label className="absolute left-3 top-2.5 z-10 origin-[0] -translate-y-4 scale-75 transform select-none bg-white px-2 text-sm text-gray-500 transition-all peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4 peer-focus:text-blue-500">
                    Issue Date
                  </label>
                  {formErrors.IssueDate && <p className="text-red-500">{formErrors.IssueDate}</p>}
                </div>

                {/* Return Date Input */}
                <div key="ReturnDate" className="relative">
                  <input
                    type="date"
                    name="ReturnDate"
                    value={formData.ReturnDate || ''}
                    onChange={handleChange}

                    className="peer block w-full p-2 text-sm border border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
                  />
                  <label className="absolute left-3 top-2.5 z-10 origin-[0] -translate-y-4 scale-75 transform select-none bg-white px-2 text-sm text-gray-500 transition-all peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4 peer-focus:text-blue-500">
                    Return Date
                  </label>
                  {formErrors.ReturnDate && <p className="text-red-500">{formErrors.ReturnDate}</p>}

                </div>

                {/* Aadhaar No. and Pick-Up Time in one row */}
                <div className="flex space-x-4">
                  <div key="AdhaarNo" className="relative w-1/2">
                    <input
                      type="text"
                      name="AdhaarNo"
                      value={formData.AdhaarNo || ''}
                      onChange={handleChange}
                      maxLength={12}

                      className="peer block w-full p-2 text-sm border border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
                    />
                    <label className="absolute left-3 top-2.5 z-10 origin-[0] -translate-y-4 scale-75 transform select-none bg-white px-2 text-sm text-gray-500 transition-all peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4 peer-focus:text-blue-500">
                      Aadhaar No.
                    </label>
                    {formErrors.AdhaarNo && <p className="text-red-500">{formErrors.AdhaarNo}</p>}

                  </div>

                  <div key="PickUpTime" className="relative w-1/2">
                    <input
                      type="time"
                      name="PickUpTime"
                      value={formData.PickUpTime || ''}
                      onChange={handleChange}

                      className="peer block w-full p-2 text-sm border border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
                    />
                    <label className="absolute left-3 top-2.5 z-10 origin-[0] -translate-y-4 scale-75 transform select-none bg-white px-2 text-sm text-gray-500 transition-all peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4 peer-focus:text-blue-500">
                      Pick up time
                    </label>
                    {formErrors.PickUpTime && <p className="text-red-500">{formErrors.PickUpTime}</p>}

                  </div>
                </div>
              </div>
            </div>
          </div>
          <div>
            <UserAddress onAddressIdChange={handleAddressId} />
          </div>
          {couponData &&
            <div className="bg-white rounded-lg shadow-lg p-6 space-y-4">
              <label className="block text-lg font-semibold text-gray-800">Coupon Code:</label>
              <div className="flex items-center space-x-4">
                <select
                  name="Coupon"
                  value={formData?.Coupon}
                  onChange={handleChange}
                  className="p-2 text-sm border border-gray-300 rounded-lg shadow-sm w-full md:w-2/3"
                >
                  <option value="">Select Coupon</option>
                  {Array.isArray(couponData) && couponData.map((coupon) => (
                    <option key={coupon.code} value={coupon.code}>
                      {coupon.code} - {coupon.discountPercentage}% Off
                    </option>
                  ))}
                </select>

                <button
                  type="button"
                  onClick={handleCouponApply}
                  className="ml-4 p-2 bg-green-500 text-white text-sm font-medium rounded-lg hover:bg-green-600"
                >
                  Apply
                </button>
                {formErrors.Coupon && <p className="text-red-500">{formErrors.Coupon}</p>}

              </div>
            </div>
          }
        </div>
        {/* Right Side: Payment and Coupon Code */}
        <div className="w-full md:w-1/2 pl-6 flex flex-col space-y-6 mt-8 md:mt-0">
          {/* Payment Section */}
          <div className="bg-white rounded-lg shadow-lg p-6 space-y-4">
            <label className="block text-lg font-semibold text-gray-800">Payment Method:</label>
            {['Cash on issue date', 'Online payment', 'Cash on return date', "Wallet"].map((method) => (
              <div key={method} className="flex items-center">
                <input
                  type="radio"
                  name="Payment"
                  value={method}
                  checked={formData.Payment === method}
                  onChange={handleChange}
                  id={method.toLowerCase().replace(" ", "")}
                  // required
                  className="form-radio h-4 w-4 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor={method.toLowerCase().replace(" ", "")} className="ml-2 text-sm text-gray-700">{method}</label>
              </div>
            ))}
            {formErrors.Payment && <p className="text-red-500">{formErrors.Payment}</p>}


          </div>



          {/* Pricing Summary */}
          <div className="bg-white rounded-lg shadow-lg p-6 space-y-4">
            <label className="block text-lg font-semibold text-gray-800">Pricing Summary</label>

            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">Car Rent Amt/day(₹{carData?.rentalPrice || 0})</span>
              <span className="text-sm text-gray-900">₹{carData?.rentalPrice || 0}({formData.rentDays}days)</span>
              <input type="number" name='car_rent_amt' value={carData?.rentalPrice} hidden />
              {formErrors.rentalPrice && <p className="text-red-500">{formErrors.rentalPrice}</p>}
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">Offers Deduction</span>
              <span className="text-sm text-green-600">- {formData.offerAmt || 0}%</span>
              {formErrors.offerAmt && <p className="text-red-500">{formErrors.offerAmt}</p>}
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">Coupon Code Deduction</span>
              <span className="text-sm text-green-600">- ₹{formData.CouponAmt}</span>
              {formErrors.discountPercentage && <p className="text-red-500">{formErrors.discountPercentage}</p>}
            </div>

            <div className="flex items-center justify-between mt-4 font-semibold">
              <span className="text-lg text-gray-800">Total Amount</span>
              <span className="text-lg text-blue-600">

                ₹{(formData.AmtOnDays || 0) - (formData.CouponAmt || 0) - (formData.offerAmt || 0)}
                {formErrors.total_Amt && <p className="text-red-500">{formErrors.total_Amt}</p>}

              </span>
            </div>
          </div>

          {/* Confirm Booking Button */}
          <button
            type="submit"
            className="p-2 bg-blue-600 text-white text-lg font-medium rounded-lg shadow-lg hover:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-200 mt-8"
          >
            Confirm Booking
          </button>
        </div>

      </form>
    </div>
  );
}
export default BookingPage;
