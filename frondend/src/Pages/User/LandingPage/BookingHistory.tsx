import React from 'react';

function BookingHistory() {
  const orders = [
    {
      id: 'ORD001',
      date: '2024-11-12',
      car: 'Toyota Corolla',
      rentalPeriod: '3 days',
      amount: '$150',
      status: 'Completed',
    },
    {
      id: 'ORD002',
      date: '2024-11-08',
      car: 'Honda Civic',
      rentalPeriod: '1 week',
      amount: '$300',
      status: 'Pending',
    },
    // Add more sample data as needed
  ];

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Booking History</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-lg rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-gray-800 text-white text-sm leading-normal">
              <th className="py-3 px-6 text-left">Order ID</th>
              <th className="py-3 px-6 text-left">Date</th>
              <th className="py-3 px-6 text-left">Car</th>
              <th className="py-3 px-6 text-left">Rental Period</th>
              <th className="py-3 px-6 text-left">Amount</th>
              <th className="py-3 px-6 text-left">Status</th>
              <th className="py-3 px-6 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm font-light">
            {orders.map((order) => (
              <tr key={order.id} className="border-b border-gray-200 hover:bg-gray-100">
                <td className="py-3 px-6 text-left whitespace-nowrap">{order.id}</td>
                <td className="py-3 px-6 text-left">{order.date}</td>
                <td className="py-3 px-6 text-left">{order.car}</td>
                <td className="py-3 px-6 text-left">{order.rentalPeriod}</td>
                <td className="py-3 px-6 text-left">{order.amount}</td>
                <td className="py-3 px-6 text-left">
                  <span
                    className={`py-1 px-3 rounded-full text-xs font-semibold ${
                      order.status === 'Completed'
                        ? 'bg-green-200 text-green-600'
                        : 'bg-yellow-200 text-yellow-600'
                    }`}
                  >
                    {order.status}
                  </span>
                </td>
                <td className="py-3 px-6 text-center">
                  <button className="text-blue-500 hover:text-blue-700 font-semibold">
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default BookingHistory;
