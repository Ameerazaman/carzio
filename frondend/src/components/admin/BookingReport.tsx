import React, { useEffect, useState } from 'react';
import Navbar from '../../Pages/Admin/Commons/Navbar';
import Sidebar from '../../Pages/Admin/Commons/Sidebar';
import { carManagementt, fetchSalesReport, userManagement } from '../../Api/Admin';
import Pagination from '../../Pages/Common/Pagination';
import Report from '../../Pages/Common/Report';


function BookingReport() {
  const [tableData, setTableData] = useState<Array<{ [key: string]: any }>>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const limit = 2;


  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        console.log(page, limit,"page limit")
        const result = await fetchSalesReport(page, limit);
        console.log(result,"fetch Sales Report");

        if (result?.data) {
          setTableData(result.data);
          setTotalPages(result.data.totalPage || 1);
        } else {
          setError("sales report is not retrieved");
        }
      } catch (error) {
        console.error("sales report is not retrieved:", error);
        setError("sales report is not retrieved.");
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
    <div className="flex">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <div className="flex-1 p-6 bg-gray-100">
          <div className="overflow-x-auto bg-white rounded-lg shadow-md">
            {loading ? (
              <p className="text-center py-4">Loading...</p>
            ) : error ? (
              <p className="text-center py-4 text-red-600">{error}</p>
            ) : (
              <>
                <Report tableData={tableData}/>
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

export default BookingReport;