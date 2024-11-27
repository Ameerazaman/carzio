import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { FaCar, FaMapMarkerAlt } from 'react-icons/fa'; // Add react-icons
import Swal from 'sweetalert2'; // Import SweetAlert
import { Booking } from '../../Interface/BookinDetailsInterface';
import { specificBookingDetails, updateStatusOfBooking } from '../../Api/Provider';

function HistoryDetailsProvider() {
    const [bookingHistory, setBookingHistory] = useState<Booking | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [status, setStatus] = useState<boolean>(false)
    const { bookingId } = useParams<{ bookingId: string }>();

    useEffect(() => {
        const fetchBookingHistory = async () => {
            if (bookingId) {
                try {
                    setLoading(true);
                    const result = await specificBookingDetails(bookingId);
                    setBookingHistory(result.data.data);
                    
                    setLoading(false);
                } catch (error) {
                    setError("Error fetching booking history.");
                    setLoading(false);
                    
                }
            } else {
                setLoading(false);
                setError("Booking ID is missing.");
            }
        };

        fetchBookingHistory();
    }, [status]);

    const handleStatusChange = async (newStatus: string) => {
        setStatus(false)
        if (!bookingId) return;

        try {
            await updateStatusOfBooking(bookingId, newStatus); // Call your API with the new status
            setStatus(true)
        } catch (error) {
            Swal.fire('Error', 'Failed to update booking status', 'error');
    
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;
    if (!bookingHistory) return <div>No booking history available.</div>;

    return (
        <div className="container mx-auto p-6">
            {/* <h6 className="text-3xl font-bold mb-8 text-center text-gray-900">Booking History Details</h6> */}

            <div className="max-w-4xl mx-auto bg-white shadow-2xl rounded-lg overflow-hidden">
                <div className="p-6 space-y-6">
                    <div className="flex justify-between items-center">
                        <div>
                            <h2 className="text-xl font-semibold text-gray-800">Booking ID: #{bookingHistory._id}</h2>
                            <p className="text-gray-600 flex items-center">
                                <FaCar className="mr-2 text-red-500" />
                                Car: <span className="font-semibold">{bookingHistory.bookingDetails.car_name}</span>
                            </p>
                        </div>
                        <div className="text-right">
                        <select
                            className={`font-semibold p-2 rounded-lg shadow-md focus:outline-none
                                 ${bookingHistory?.status === "Completed"
                                    ? "text-green-600 bg-green-100"
                                    : bookingHistory?.status === "Cancelled"
                                        ? "text-red-600 bg-red-100"
                                        : bookingHistory?.status === "Pending"
                                            ? "text-yellow-600 bg-yellow-100"
                                            : "text-gray-500 bg-gray-100"
                                }`}
                            value={bookingHistory?.status}
                            onChange={(e) => handleStatusChange(e.target.value)}>
                            <option value="Completed" disabled={bookingHistory?.status === "Completed"}>
                                Completed
                            </option>
                            <option value="Cancelled" disabled={bookingHistory?.status === "Cancelled"}>
                                Cancelled
                            </option>
                            <option value="Success">
                                Success
                            </option>
                            <option value="Pending">
                                Pending
                            </option>
                        </select>
                    </div>
                    </div>

                    <div className="mb-6 flex justify-between items-start space-x-8">
                        {/* Left Section: Address Details */}
                        <div className="w-1/3 pr-4">
                            <h3 className="text-gray-700 font-semibold mb-2">User Address</h3>
                            <div className="ml-4 space-y-2">
                                <p className="text-gray-600 flex items-center">
                                    <FaMapMarkerAlt className="mr-2" />
                                    House: {bookingHistory.userAddress.houseName}
                                </p>
                                <p className="text-gray-600 flex items-center">
                                    <FaMapMarkerAlt className="mr-2" />
                                    Street: {bookingHistory.userAddress.street}
                                </p>
                                <p className="text-gray-600 flex items-center">
                                    <FaMapMarkerAlt className="mr-2" />
                                    City: {bookingHistory.userAddress.city}
                                </p>
                                <p className="text-gray-600 flex items-center">
                                    <FaMapMarkerAlt className="mr-2" />
                                    District: {bookingHistory.userAddress.district}
                                </p>
                                <p className="text-gray-600 flex items-center">
                                    <FaMapMarkerAlt className="mr-2" />
                                    State: {bookingHistory.userAddress.state}
                                </p>
                                <p className="text-gray-600 flex items-center">
                                    <FaMapMarkerAlt className="mr-2" />
                                    Zip: {bookingHistory.userAddress.zip}
                                </p>
                            </div>
                        </div>

                        {/* Right Section: Image */}
                        <div className="w-1/2">
                            <img
                                src={bookingHistory.bookingDetails.images[0] || "https://via.placeholder.com/600x400"}
                                alt="Car"
                                className="w-full h-64 object-cover rounded-lg shadow-xl"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="flex justify-between items-center">
                            <p className="text-gray-700 font-semibold">Issue Date:</p>
                            <p className="text-gray-600">{bookingHistory.IssueDate}</p>
                        </div>
                        <div className="flex justify-between items-center">
                            <p className="text-gray-700 font-semibold">Return Date:</p>
                            <p className="text-gray-600">{bookingHistory.ReturnDate}</p>
                        </div>
                        <div className="flex justify-between items-center">
                            <p className="text-gray-700 font-semibold">Amount:</p>
                            <p className="text-gray-600">{bookingHistory.total_Amt}</p>
                        </div>
                        <div className="flex justify-between items-center">
                            <p className="text-gray-700 font-semibold">Payment Method:</p>
                            <p className="text-gray-600">{bookingHistory.Payment}</p>
                        </div>
                        <div className="flex justify-between items-center">
                            <p className="text-gray-700 font-semibold">Rental Period:</p>
                            <p className="text-gray-600">{bookingHistory.rentDays}</p>
                        </div>
                        <div className="flex justify-between items-center">
                            <p className="text-gray-700 font-semibold">Pick-Up Time:</p>
                            <p className="text-gray-600">{bookingHistory.PickUpTime}</p>
                        </div>
                    </div>


                   

                </div>
            </div>
        </div>
    );
}

export default HistoryDetailsProvider;

