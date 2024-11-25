

import React from 'react';
import { Link } from 'react-router-dom';
import { FaClipboardList } from 'react-icons/fa'; // Importing an icon for the empty state
import { Booking } from '../../Interface/BookinDetailsInterface';

interface BookingHistoryUserProps {
  bookingHistory: Booking[]; // Use the Booking interface for typing
}

function BookingHistoryProvider({ bookingHistory }: BookingHistoryUserProps) {
  return (
    <div className="container mx-auto p-6">

      {bookingHistory.length === 0 ? (
        <div className="flex flex-col items-center justify-center mt-10">
          <FaClipboardList className="text-gray-400 text-6xl mb-4" />
          <p className="text-gray-500 text-lg">No bookings found. Start exploring and make your first booking!</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow-lg rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-gray-800 text-white text-sm leading-normal">

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
                <tr
                  key={order._id}
                  className="border-b border-gray-200 hover:bg-gray-100"
                >

                  <td className="py-3 px-6 text-left">
                    {order.bookingDetails.car_name}
                  </td>
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
                  <td className="py-3 px-6 text-center">
                    <Link to={`/provider/view_details/${order._id}`}>
                      <button className="text-blue-500 hover:text-blue-700 font-semibold">
                        View Details
                      </button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default BookingHistoryProvider;
