
import React, { useState, useEffect } from 'react';
import { FaCalendarAlt, FaCalendarCheck, FaMoneyBillWave } from 'react-icons/fa';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../../App/Store';
import { User } from '../../Common/Navbar';
import { carDetail, checkOffer, fetchCoupon, checkAddress, BookingConfirm, } from '../../../Api/User';
import { BookingFormData } from '../../../Interface/BookingInterface';
import { CarDataInterface } from '../../../Interface/CarInterface';
import { CouponFormData } from '../../../Interface/CouponFormData';
import { AddressInterface } from '../../../Interface/AddressInterface';
import AddressMgtInBooking from './AddressMgtInBooking';
import { OfferFormData } from '../../../Interface/OfferInterface';
import toast from 'react-hot-toast';

interface BookingDetails {
  date: string;
  status: string;
  amount: number;
}

function BookingPage() {
const navigate=useNavigate()
  const user = useSelector((state: RootState) => state.user.currentUser) as User | null;
  const { carId } = useParams<string>();
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<BookingDetails | null>(null);
  const [carData, setCarData] = useState<CarDataInterface | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [offerData, setOfferData] = useState<OfferFormData | null>(null)
  const [couponData, setCouponData] = useState<CouponFormData[] | null>(null)
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
    ManualCoupon: '',
    PickUpTime: '',
    offerAmt: 0,
    rentDays: 1,
    total_Amt: 0,
    AmtOndays: 0
  });

  useEffect(() => {
    const fetchCarData = async () => {
      try {
        setLoading(true);
        if (carId) {
          const result = await carDetail(carId);
          console.log(result?.data, "result car data");

          // Set carData with fetched data
          const carDetails = result?.data;
          setCarData(carDetails);

          if (carDetails) {
            setFormData((prevData) => {
              const rentalPrice = carDetails.rentalPrice ?? 0; // Use 0 if rentalPrice is undefined
              const rentDays = prevData.rentDays || 1;

              return {
                ...prevData,
                Amount: rentalPrice,
                AmtOndays: rentDays * rentalPrice,
                total_Amt: rentalPrice,  // Ensure total_Amt is a number
              };
            });
          }
        }
      } catch (err: any) {
        console.error("Error fetching car data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCarData();
  }, [carId]);  // Only depend on carId

  useEffect(() => {
    const fetchCouponAndOfferData = async () => {
      try {
        setLoading(true);

        // Ensure user and carData are available before fetching data
        if (user?._id && carData?.car_name) {

          // Fetch coupon data
          const couponData = await fetchCoupon(user?._id);
          setCouponData(couponData?.data?.data);
          console.log(couponData, "couponData");

          // Fetch offer data and access discountPercentage
          const offerData = await checkOffer(carData.car_name);
          console.log(offerData?.data?.data?.data, "result offerData");

          if (offerData?.data?.data) {
            const offer = offerData?.data?.data;  // Assuming the offer data is in 'data.data' path
            console.log(offer, "offer data");

            // Access discountPercentage from offerData and handle missing data
            const discountPercentage = offer.discountPercentage || 0;
            console.log(discountPercentage, "discountPercentage");

            // Update the form data with the offer amount calculation
            setFormData((prevData) => ({
              ...prevData,
              offerAmt: (discountPercentage * prevData.AmtOndays) / 100,  // Ensure calculation is correct
            }));
          }
        }

      } catch (err: any) {
        console.error("Error fetching coupon and offer data:", err);
      } finally {
        setLoading(false);
      }
    };

    // Call the function
    fetchCouponAndOfferData();
  }, [user, carData?.car_name]);  // Dependencies: runs when user or carData changes
  // Depend on carData and user._id




  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => {
      const updatedData = { ...prevData, [name]: value };

      // Calculate rental days if both IssueDate and ReturnDate are provided
      if (name === 'IssueDate' || name === 'ReturnDate') {
        const { IssueDate, ReturnDate } = updatedData;
        if (IssueDate && ReturnDate) {
          const issueDate = new Date(IssueDate);
          const returnDate = new Date(ReturnDate);
          const timeDifference = returnDate.getTime() - issueDate.getTime();
          const daysDifference = Math.max(Math.ceil(timeDifference / (1000 * 3600 * 24)), 1); // Minimum 1 day
          updatedData.rentDays = daysDifference;
          updatedData.AmtOndays = updatedData.rentDays * updatedData.Amount

        }

      }
      console.log(updatedData, "updatedData")
      return updatedData;
    });
  };



  // *************************validation for form submission**************
  const validateFormData = () => {
    const errors: { [key: string]: string } = {};
    const today = new Date().toISOString().split("T")[0]; // Today's date in YYYY-MM-DD format

    // Date validations
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

    // Other validations
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

  // ***************************save form*****************
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errors = validateFormData();
    setFormErrors(errors);

    if (Object.keys(errors).length > 0) {
      toast.error("Please fix the errors before submitting.");
      return;
    }
  if(formData.Payment==="Online payment"){
    setFormData((prevaData) => {
      return {
        ...prevaData,
        total_Amt: prevaData.AmtOndays - prevaData.offerAmt - prevaData.CouponAmt,
        status:"pending"
      }
    })
    navigate('/checkOut')
  }
    setFormData((prevaData) => {
      return {
        ...prevaData,
        total_Amt: prevaData.AmtOndays - prevaData.offerAmt - prevaData.CouponAmt,
        status:"pending"
      }
    })
    const result=await BookingConfirm(formData)
    console.log("Form submitted successfully:", formData);
    // Proceed with submission logic
  };

  // ************8adrress id setting in form Data*************
  const handleAddressId = (id: string) => {
    setFormData((prevData) => ({
      ...prevData,
      UserAddressId: id,
    }));
  };

  // ********************applay Coupon************
  const handleCouponApply = () => {
    if (couponData && Array.isArray(couponData)) {  // Check if couponData is not null
      const selectedCoupon = couponData.find((coupon) => coupon.code === formData.Coupon);

      if (selectedCoupon) {
        const discountAmount = (selectedCoupon.discountPercentage / 100) * formData.AmtOndays;
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





  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-blue-100 via-blue-200 to-blue-100 p-4">
      <form onSubmit={handleSubmit} className="flex flex-wrap w-full max-w-5xl bg-white shadow-lg rounded-2xl p-8">
        {/* Left Side: Car Image and Booking Details */}
        <div className="w-full md:w-1/2 pr-6 flex flex-col space-y-6">
          <div className="flex space-x-6 items-center shadow-lg p-4 rounded-lg bg-white">
            <img src={carData?.images[0]} className="h-40 w-40 object-contain rounded-lg" />
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">{carData?.car_name}</h2>
              <div className="space-y-3">
                {/* Issue Date Input */}{formData.AmtOndays}
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
            <AddressMgtInBooking onAddressIdChange={handleAddressId} />
          </div>
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

        </div>
        {/* Right Side: Payment and Coupon Code */}
        <div className="w-full md:w-1/2 pl-6 flex flex-col space-y-6 mt-8 md:mt-0">
          {/* Payment Section */}
          <div className="bg-white rounded-lg shadow-lg p-6 space-y-4">
            <label className="block text-lg font-semibold text-gray-800">Payment Method:</label>
            {['Cash on issue date', 'Online payment', 'Cash on return date'].map((method) => (
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

                ₹{(formData.AmtOndays || 0) - (formData.CouponAmt || 0) - (formData.offerAmt || 0)}
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
