

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import { FaCar, FaMapMarkerAlt } from 'react-icons/fa';
import { Booking } from '../../../Interface/BookinDetailsInterface';
import { cancelBookingByUser, checkBookidInReview, specificBookingDetails, storeCancelAmtToWallet } from '../../../Api/User';
import ReviewModal from './ReviewModal';


function HistoryDetail() {
    const [bookingHistory, setBookingHistory] = useState<Booking | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [cancel, setCancel] = useState<boolean>(false);
    const [isReviewModalOpen, setIsReviewModalOpen] = useState<boolean>(false);

    const { bookingId } = useParams<{ bookingId: string }>();

    useEffect(() => {
        const fetchBookingHistory = async () => {
            if (bookingId) {
                try {
                    setLoading(true);
                    const result = await specificBookingDetails(bookingId);
                    setBookingHistory(result.data.data);

                    if (result.data.data.status === "Completed") {
                        const result = await checkBookidInReview(bookingId)
                        
                        if (!result.data.success) {
                            setIsReviewModalOpen(true);
                        }
                    }

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
    }, [bookingId, cancel]);

    const handleCancelBooking = async () => {
        Swal.fire({
            title: 'Are you sure?',
            text: 'Do you really want to cancel this booking?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, cancel it!',
        }).then(async (result) => {
            if (result.isConfirmed) {
                if (bookingId && bookingHistory) {
                    console.log(bookingId, "bookingId");
                    await cancelBookingByUser(
                        bookingId,
                        bookingHistory?.UserId,
                        bookingHistory?.total_Amt
                    );
                    if (bookingHistory.Payment === "Wallet" || bookingHistory.Payment === "Online payment") {
                       await storeCancelAmtToWallet(bookingHistory?.UserId, bookingHistory?.total_Amt)
                    }

                    setCancel(true);
                    Swal.fire(
                        'Cancelled!',
                        'Your booking has been cancelled.',
                        'success'
                    );
                }
            }
        });
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;
    if (!bookingHistory) return <div>No booking history available.</div>;

    return (
        <div className="container mx-auto p-6">
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
                            <p className="text-gray-600 flex items-center">
                                <span className={`font-semibold ${bookingHistory.status === "Completed" ? "text-green-500" : "text-yellow-500"}`}>
                                    {bookingHistory.status}
                                </span>
                            </p>
                        </div>
                    </div>

                    <div className="mb-6 flex justify-between items-start space-x-8">                         {/* Left Section: Address Details */}
                        <div className="w-1/3 pr-4">
                            <h3 className="text-gray-700 font-semibold mb-2">User Address</h3>
                            <div className="ml-4 space-y-2">
                                <p className="text-gray-600 flex items-center">
                                    <FaMapMarkerAlt className="mr-2" />
                                    House: {bookingHistory.userAddress.houseName}                                 </p>
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
                                    <FaMapMarkerAlt className="mr-2" />                                     Zip: {bookingHistory.userAddress.zip}
                                </p>
                            </div>
                        </div>

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
                    <div className="flex justify-end space-x-4">
                        {bookingHistory.status !== "Cancelled" && bookingHistory.status !== "Completed" ? (
                            <button
                                className="bg-red-500 text-white py-2 px-6 rounded-lg shadow-md hover:bg-red-600 focus:outline-none transform transition duration-300 hover:scale-105"
                                onClick={handleCancelBooking}
                            >
                                Cancel Booking
                            </button>
                        ) : null}

                    </div>

                </div>
            </div>
            {
                isReviewModalOpen && (
                    <ReviewModal
                        isOpen={isReviewModalOpen}
                        onClose={() => setIsReviewModalOpen(false)}
                        bookingId={bookingId!}
                        carId={bookingHistory.bookingDetails._id}
                    />
                )
            }
        </div >
    );
}

export default HistoryDetail;
