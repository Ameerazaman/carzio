import React, { useEffect, useState } from 'react';
import Navbar, { User } from '../../Pages/Common/Navbar';
import Pagination from '../../Pages/Common/Pagination';
import { useSelector } from 'react-redux';
import { RootState } from '../../App/Store';
import { Booking } from '../../Interface/BookinDetailsInterface';
import { getBookingHistory } from '../../Api/Provider';
import Sidebar from '../../Pages/Provider/Sidebar';
import BookingHistoryProvider from '../../Pages/Provider/BookingHistoryProvider';

function BookingHistoryInProvider() {
  const provider = useSelector((state: RootState) => state.provider.currentProvider) as User | null;
  const [bookingHistory, setBookingHistory] = useState<Booking[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const limit = 10;

  useEffect(() => {
    const fetchBookingHistory = async () => {
      if (provider?._id) {
        try {
          setLoading(true);
          setError(null);
          const result = await getBookingHistory(provider._id, page, limit);
          setBookingHistory(result.data.data || []); // Fallback to an empty array
          setTotalPages(result.data.totalPage || 1);
        } catch (err) {
          setError('Error fetching booking history.');
          setBookingHistory([]); // Ensure state is an array even on error
        } finally {
          setLoading(false);
        }
      }
    };

    fetchBookingHistory();
  }, [provider, page]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      <Navbar />
      <div className="flex flex-1">
      <div className="flex flex-grow"> {/* Add margin-top to push content below the navbar */}
      <Sidebar />
        </div>

        <div className="flex-grow p-6 overflow-y-auto">
          {loading ? (
            <div className="text-center text-lg text-gray-500">Fetching your booking history...</div>
          ) : error ? (
            <div className="text-center text-red-500">{error}</div>
          ) : bookingHistory.length > 0 ? (
            <>
              <BookingHistoryProvider bookingHistory={bookingHistory} />
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </>
          ) : (
            <div className="flex items-center justify-center min-h-full flex-col">
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
          )}
        </div>
      </div>
    </div>
  );
}

export default BookingHistoryInProvider;
