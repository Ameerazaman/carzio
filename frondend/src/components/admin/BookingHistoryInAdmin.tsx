import React, { useEffect, useState } from 'react';
import Navbar from '../../Pages/Admin/Commons/Navbar';
import Sidebar from '../../Pages/Admin/Commons/Sidebar';
import { Booking } from '../../Interface/BookinDetailsInterface';
import { getBookingHistory } from '../../Api/Admin'; // Adjusted for Admin API
import BookingHistoryAdmin from '../../Pages/Admin/BookingHistoryAdmin';
import Pagination from '../../Pages/Common/Pagination';

function BookingHistoryInAdmin() {
  const [bookingHistory, setBookingHistory] = useState<Booking[]>([]); // Default to empty array
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const limit = 10; // Adjusted limit for better pagination

  useEffect(() => {
    const fetchBookingHistory = async () => {
      setLoading(true);
      try {
        const result = await getBookingHistory(page, limit); // Admin fetch method
        
        // Check if result and result.data are defined, then handle booking history accordingly
        if (result?.data) {
          setBookingHistory(result.data.data || []); // Ensure bookingHistory is always an array
          setTotalPages(result.data.totalPage || 1); // Set total pages dynamically
        } else {
          setBookingHistory([]); // Default to empty array if no data
          setTotalPages(1); // Default to 1 if no pages
        }
      } catch (error) {
        setError('Error fetching booking history.');
        setBookingHistory([]); // Fallback to empty array in case of error
        console.error('Error fetching booking history:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookingHistory();
  }, [page]); // Fetch booking history whenever the page changes

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <Navbar />
      <div className="flex flex-grow">
        <Sidebar />
        <div className="flex-grow p-4 overflow-y-auto">
          {loading ? (
            <p className="text-center py-4">Loading...</p>
          ) : error ? (
            <p className="text-center py-4 text-red-600">{error}</p>
          ) : bookingHistory.length === 0 ? (
            <div className="flex flex-col items-center justify-center min-h-full animate-fade-in">
              <div className="text-2xl font-semibold text-gray-600 mb-4 animate-pulse">
                No bookings available yet
              </div>
              <div className="w-40 h-40 bg-gray-200 rounded-full flex items-center justify-center animate-bounce">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-20 h-20 text-gray-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M4 3C4 2.44772 4.44772 2 5 2H15C15.5523 2 16 2.44772 16 3V17C16 17.5523 15.5523 18 15 18H5C4.44772 18 4 17.5523 4 17V3ZM5 4V16H15V4H5Z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <p className="text-lg text-gray-500 mt-4 animate-fade-in">
                You haven't made any bookings yet. Once you do, they will show up here!
              </p>
            </div>
          ) : (
            <>
              <BookingHistoryAdmin bookingHistory={bookingHistory} />
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default BookingHistoryInAdmin;

