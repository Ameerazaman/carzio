import React, { useEffect, useState } from "react";
import Pagination from "../../Pages/Common/Pagination";
import Report from "../../Pages/Common/Report";
import Sidebar from "../../Pages/Provider/Sidebar";
import Navbar, { User } from "../../Pages/Common/Navbar";
import { fetchSalesReport } from "../../Api/Provider";
import { useSelector } from "react-redux";
import { RootState } from "../../App/Store";

function BookingReportProvider() {
  const provider = useSelector(
    (state: RootState) => state.provider.currentProvider
  ) as User | null;

  const [tableData, setTableData] = useState<Array<{ [key: string]: any }>>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const limit = 10;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        if (provider) {
          const result = await fetchSalesReport(page, limit, provider?._id);
          if (result?.data) {
            setTableData(result.data || []); // Adjust as needed to match the API response structure
            setTotalPages(result.data.totalPage || 1);
          } else {
            setError("Sales report is not retrieved.");
          }
        }
      } catch (error) {
        setError("Failed to fetch the sales report.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [page, provider]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <Navbar /> {/* Navbar remains fixed at the top */}
      <div className="flex flex-grow"> {/* Add margin-top to push content below the navbar */}
        <Sidebar />
        <div className="flex-1 p-6 bg-gray-100 overflow-y-auto">
          <div className="overflow-x-auto bg-white rounded-lg shadow-md ">
            {loading ? (
              <p className="text-center py-4">Loading...</p>
            ) : error ? (
              <div className="flex flex-col items-center justify-center min-h-[300px]">
                <div className="w-32 h-32 bg-red-200 rounded-full flex items-center justify-center animate-pulse">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-16 w-16 text-red-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M12 3v18m9-9H3"
                    />
                  </svg>
                </div>
                <p className="text-red-600 mt-4 text-lg font-semibold">
                  {error}
                </p>
                <p className="text-gray-500 text-sm">
                  Please try refreshing or check back later.
                </p>
              </div>
            ) : tableData.length === 0 ? (
              <div className="flex flex-col items-center justify-center min-h-[300px]">
                <div className="w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center animate-bounce">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-16 w-16 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M8 16l-4-4m0 0l4-4m-4 4h16m-5 4l4-4m0 0l-4-4m4 4H3"
                    />
                  </svg>
                </div>
                <p className="text-gray-600 mt-4 text-lg font-semibold">
                  No data available
                </p>
                <p className="text-gray-500 text-sm">
                  Once bookings are made, they will appear here.
                </p>
              </div>
            ) : (
              <>
                <Report tableData={tableData} />
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
    </div>
  );
}

export default BookingReportProvider;
