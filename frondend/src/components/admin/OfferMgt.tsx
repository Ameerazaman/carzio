import React, { useEffect, useState } from 'react';
import { FaPlus } from 'react-icons/fa';
import Navbar from '../../Pages/Admin/Commons/Navbar';
import Sidebar from '../../Pages/Admin/Commons/Sidebar';
import Table from '../../Pages/Admin/Commons/Table';
import { fetchOffer } from '../../Api/Admin';
import { Link } from 'react-router-dom';
import Pagination from '../../Pages/Common/Pagination';

function OfferMgt() {
  const [tableData, setTableData] = useState<Array<{ [key: string]: any }>>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const limit = 10;
  const header: string = 'offers'; // Define whether this is for users or providers

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const result = await fetchOffer(page, limit);
        console.log(result, "Fetched car data");

        if (result && result.data && result.data.data) {
          setTableData(result.data.data);
          setTotalPages(result.data.totalPage || 1);
        } else {
          setError("Cars are Empty");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Error fetching user data.");
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
          <h1 className="text-2xl font-bold mb-4">Offer Management</h1>
          <div className="overflow-x-auto bg-white rounded-lg shadow-md p-4">
            <div className="flex justify-end mb-4">
              <Link to="/admin/add_offer">
                <button className="flex items-center px-4 py-2 text-white bg-gray-800 hover:bg-red-600 rounded transition duration-300 shadow-lg">
                  <FaPlus className="mr-2" />
                  Add Offer
                </button>
              </Link>
            </div>
            {loading ? (
              <p className="text-center py-4">Loading...</p>
            ) : error ? (
              <div className="flex flex-col items-center justify-center min-h-full animate-fade-in">
                <div className="text-2xl font-semibold text-gray-600 mb-4 animate-shake">
                  No offers are created yet
                </div>
                <div className="w-40 h-40 bg-gray-200 rounded-full flex items-center justify-center animate-pulse">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-20 h-20 text-gray-400 animate-bounce"
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
                <p className="text-lg text-gray-500 mt-4 animate-wiggle">
                  {error || "Create some offers to display them here!"}
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

export default OfferMgt;
