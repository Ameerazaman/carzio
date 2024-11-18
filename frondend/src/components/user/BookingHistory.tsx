import React, { useEffect, useState } from 'react'
import Navbar, { User } from '../../Pages/Common/Navbar'
import BookingHistoryUser from '../../Pages/User/LandingPage/BookingHistoryUser'
import Pagination from '../../Pages/Common/Pagination'
import { useSelector } from 'react-redux';
import { RootState } from '../../App/Store';
import { Booking } from '../../Interface/BookinDetailsInterface';
import { getBookingHistory } from '../../Api/User';


function BookingHistory() {
  const user = useSelector((state: RootState) => state.user.currentUser) as User | null;
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
          console.log(result.data.totalPage , "result data")
          setTotalPages(result.data.totalPage || 1);
          setLoading(false);
        } catch (error) {
          setError("Error fetching booking history.");
          setLoading(false);
          console.error("Error fetching booking history:", error);
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
    return <div className="text-center">Loading booking history...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }
  return (
    <div>
      <Navbar />
      <BookingHistoryUser bookingHistory={bookingHistory} />
      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  )
}

export default BookingHistory