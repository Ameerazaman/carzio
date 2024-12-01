import React, { useEffect, useState } from 'react';
import Navbar from '../../Pages/Admin/Commons/Navbar'; // Adjust path if necessary
import Sidebar from '../../Pages/Admin/Commons/Sidebar'; // Adjust path if necessary
import Table from '../../Pages/Admin/Commons/Table'; // Adjust path if necessary
import { fetchNotification } from '../../Api/Admin'; // Import provider management API
import Pagination from '../../Pages/Common/Pagination';

function NotificationMgt() {
  const [tableData, setTableData] = useState<Array<{ [key: string]: any }>>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const limit = 10;
  const header: string = 'notification'; // Define whether this is for users or providers

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const result = await fetchNotification(page, limit); // Fetch provider data

        if (result?.data?.data) {
          setTableData(result.data.data);
          setTotalPages(result.data.totalPage || 1);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
     
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

            ) : tableData.length === 0 ? (
              <div className="flex flex-col items-center justify-center min-h-full animate-fade-in">
                <div className="text-2xl font-semibold text-gray-600 mb-4 animate-pulse">
                  No notifications are available yet
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
                <Table tableData={tableData} header={header} />
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

export default NotificationMgt;

