import React, { useEffect, useState } from 'react';
import { getBookingHistory } from '../../../Api/User';
import { useSelector } from 'react-redux';
import { RootState } from '../../../App/Store';
import { User } from '../../Common/Navbar';
import { Link } from 'react-router-dom';
import { Booking } from '../../../Interface/BookinDetailsInterface';



function BookingHistoryUser() {
  const user = useSelector((state: RootState) => state.user.currentUser) as User | null;
  const [bookingHistory, setBookingHistory] = useState<Booking[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBookingHistory = async () => {
      if (user?._id) {
        try {
          const result = await getBookingHistory(user._id);
          setBookingHistory(result.data.data);
          setLoading(false);
        } catch (error) {
          setError("Error fetching booking history.");
          setLoading(false);
          console.error("Error fetching booking history:", error);
        }
      }
    };

    fetchBookingHistory();
  }, [user]);
  
  if (loading) {
    return <div className="text-center">Loading booking history...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Booking History</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-lg rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-gray-800 text-white text-sm leading-normal">
              <th className="py-3 px-6 text-left">Booking ID</th>
              <th className="py-3 px-6 text-left">Car Name</th>
              <th className="py-3 px-6 text-left">Car Image</th>
              <th className="py-3 px-6 text-left">Issue Date</th>
              <th className="py-3 px-6 text-left">Return Date</th>
              <th className="py-3 px-6 text-left">Amount</th>
              <th className="py-3 px-6 text-left">Payment</th>
              <th className="py-3 px-6 text-left">Status</th>
              <th className="py-3 px-6 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm font-light">
            {bookingHistory.map((order) => (
              <tr key={order._id} className="border-b border-gray-200 hover:bg-gray-100">
                <td className="py-3 px-6 text-left whitespace-nowrap">{order._id}</td>
                <td className="py-3 px-6 text-left">{order.bookingDetails.car_name}</td>

                <td className="py-3 px-6 text-left">
                  {order.bookingDetails?.images ? (
                    <img
                      src={order.bookingDetails.images[0]}
                      alt="Car"
                      className="w-16 h-10 rounded"
                    />
                  ) : (
                    <span>No Image</span>
                  )}
                </td>
                <td className="py-3 px-6 text-left">{order.IssueDate}</td>
                <td className="py-3 px-6 text-left">{order.ReturnDate}</td>
                <td className="py-3 px-6 text-left">{order.total_Amt}</td>
                <td className="py-3 px-6 text-left">{order.Payment}</td>
                <td className="py-3 px-6 text-left">
                  <span
                    className={`py-1 px-3 rounded-full text-xs font-semibold ${order.status === 'success'
                        ? 'bg-green-200 text-green-600'
                        : 'bg-yellow-200 text-yellow-600'
                      }`}
                  >
                    {order.status}
                  </span>
                </td>
                <Link to={`/view_details/${order._id}`}>
                  <button className="text-blue-500 hover:text-blue-700 font-semibold">
                    View Details
                  </button>
                </Link>

              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default BookingHistoryUser;

