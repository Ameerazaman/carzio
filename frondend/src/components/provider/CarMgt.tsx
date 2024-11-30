import React, { useEffect, useState } from "react";
import Navbar, { User } from "../../Pages/Common/Navbar";
import CarMgtTable from "../../Pages/Provider/CarMgtTable";
import { carManagement } from "../../Api/Provider";
import Sidebar from "../../Pages/Provider/Sidebar";
import Pagination from "../../Pages/Common/Pagination";
import { useSelector } from "react-redux";
import { RootState } from "../../App/Store";

function CarMgt() {
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
        if (provider?._id) {
          const result = await carManagement(provider?._id, page, limit);
          if (result?.data?.data) {
            setTableData(result.data.data);
            setTotalPages(result.data.totalPage || 1);
          } else {
            setError("No car data returned.");
          }
        }
      } catch (error) {
        setError("Error fetching car data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [page]);

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
        <div className="flex-1 p-6 bg-gray-100 overflow-y-auto">

          <div className="overflow-x-auto bg-white rounded-lg shadow-md">
            {loading ? (
              <p className="text-center py-4">Loading...</p>
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
                      d="M3 10h18M9 21V10m6 0v11M5 10L5 5a2 2 0 012-2h10a2 2 0 012 2v5"
                    />
                  </svg>
                </div>
                <p className="text-gray-600 mt-4 text-lg font-semibold">
                  No cars found.
                </p>
                <p className="text-gray-500 text-sm">
                  Add your first car to see it here.
                </p>
              </div>
            ) : (
              <>
                <CarMgtTable tableData={tableData} />
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

export default CarMgt;
