import React, { useEffect, useState } from 'react';
import Navbar from '../../Pages/Admin/Commons/Navbar';
import Sidebar from '../../Pages/Admin/Commons/Sidebar';
import Table from '../../Pages/Admin/Commons/Table';
import { carManagementt } from '../../Api/Admin';
import Pagination from '../../Pages/Common/Pagination';

function CarsMgt() {
  const [tableData, setTableData] = useState<Array<{ [key: string]: any }>>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const limit = 10;
  const header: string = 'cars'; // Define whether this is for users or providers

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const result = await carManagementt(page, limit);

        if (result?.data?.data) {
          setTableData(result.data.data);
          setTotalPages(result.data.totalPage || 1);
        } else {
          setError("Cars are Empty");
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
    <div className="flex">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <div className="flex-1 p-6 bg-gray-100">
          <h1 className="text-2xl font-bold mb-4">Car Management</h1>
          <div className="flex-1 bg-white rounded-lg shadow-md">
            {loading ? (
              <p className="text-center py-4">Loading...</p>
            ) : error ? (
              <p className="text-center py-4 text-red-600">{error}</p>
            ) : (
              <>
                <div className="overflow-x-auto max-w-full">
                  <Table tableData={tableData} header={header} />
                </div>
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

export default CarsMgt;
