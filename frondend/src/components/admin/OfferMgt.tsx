import React, { useEffect, useState } from 'react';
import { FaPlus } from 'react-icons/fa';
import Navbar from '../../Pages/Admin/Commons/Navbar';
import Sidebar from '../../Pages/Admin/Commons/Sidebar';
import Table from '../../Pages/Admin/Commons/Table';
import { carManagementt, fetchOffer } from '../../Api/Admin';
import { Link } from 'react-router-dom';

function OfferMgt() {
  const [tableData, setTableData] = useState<Array<{ [key: string]: any }>>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const header: string = 'offers'; // Define whether this is for users or providers

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const result = await fetchOffer();
        console.log(result, "Fetched car data");
  
        if (result && result.data && result.data.data) {
          setTableData(result.data.data);
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
  }, []);
  
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
              <p className="text-center py-4 text-red-600">{error}</p>
            ) : (
              <Table tableData={tableData} header={header} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default OfferMgt;
