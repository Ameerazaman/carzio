import React, { useEffect, useState } from 'react';
import Navbar from '../../Pages/Admin/Commons/Navbar';
import BookingHistoryAdmin from '../../Pages/Admin/BookingHistoryAdmin';
import Sidebar from '../../Pages/Admin/Commons/Sidebar';
import { Booking } from '../../Interface/BookinDetailsInterface';
import { getBookingHistory } from '../../Api/Admin';
import Pagination from '../../Pages/Common/Pagination';

function BookingHistoryInAdmin() {
  const [bookingHistory, setBookingHistory] = useState<Booking[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const limit = 5; // Set a reasonable default limit

  useEffect(() => {
    const fetchBookingHistory = async () => {
      setLoading(true);
      try {
        const result = await getBookingHistory(page, limit);
        if (result?.data) {
          setBookingHistory(result.data.data);
          console.log(result.data)
          setTotalPages(result.data.totalPage || 1); // Set total pages dynamically
        } else {
          setBookingHistory([]);
          setTotalPages(1);
        }
        setLoading(false);
      } catch (error) {
        setError("Error fetching booking history.");
        setLoading(false);
        console.error("Error fetching booking history:", error);
      }
    };

    fetchBookingHistory();
  }, [page]); // Add 'page' as a dependency

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
        <div className="flex-grow p-4">
          {loading ? (
            <p className="text-center py-4">Loading...</p>
          ) : error ? (
            <p className="text-center py-4 text-red-600">{error}</p>
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
