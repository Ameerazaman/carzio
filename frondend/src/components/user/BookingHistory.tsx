import React, { useEffect, useState } from 'react'
import Navbar, { User } from '../../Pages/Common/Navbar'
import BookingHistoryUser from '../../Pages/User/LandingPage/BookingHistoryUser'
import Pagination from '../../Pages/Common/Pagination'
import { useSelector } from 'react-redux';
import { RootState } from '../../App/Store';
import { Booking } from '../../Interface/BookinDetailsInterface';
import { getBookingHistory } from '../../Api/User';
import Footer from '../../Pages/Common/Footer';
import Loading from '../../Pages/Common/Loading';


function BookingHistory() {
  const user = useSelector((state: RootState) => state.user?.currentUser) as User | null;
  const [bookingHistory, setBookingHistory] = useState<Booking[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  let limit = 10;

  useEffect(() => {
    const fetchBookingHistory = async () => {
      if (user?._id) {
        try {
          const result = await getBookingHistory(user._id, page, limit); // Pass them as separate arguments
          setBookingHistory(result.data.data);

          setTotalPages(result.data.totalPage || 1);
          setLoading(false);
        } catch (error) {
          setError("Error fetching booking history.");
          setLoading(false);

        }
      }
    };

    fetchBookingHistory();
  }, [user, page, limit]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  if (loading) {
    return <div className="text-center"><Loading /></div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }
  return (
    <div>
      <Navbar />
      {loading ? (
        <div className="text-center text-lg text-gray-500">Fetching your booking history...</div>
      ) : bookingHistory && bookingHistory.length > 0 ? (
        <>
          <BookingHistoryUser bookingHistory={bookingHistory} />
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </>
      ) : (
        <div className="flex items-center justify-center min-h-screen flex-col">
          <div className="text-2xl font-semibold text-gray-600 mb-4 animate-pulse">No bookings available yet</div>
          <div className="w-40 h-40 bg-gray-200 rounded-full flex items-center justify-center animate-bounce">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-20 h-20 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4 3C4 2.44772 4.44772 2 5 2H15C15.5523 2 16 2.44772 16 3V17C16 17.5523 15.5523 18 15 18H5C4.44772 18 4 17.5523 4 17V3ZM5 4V16H15V4H5Z" clipRule="evenodd" />
            </svg>
          </div>
          <p className="text-lg text-gray-500 mt-4 animate-fade-in">You haven't made any bookings yet. Once you do, they will show up here!</p>
        </div>
      )}
      <div className="mt-12">
        <Footer />
      </div>
    </div>
  )
}

export default BookingHistory