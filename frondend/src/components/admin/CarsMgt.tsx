import React, { useEffect, useState } from 'react';
import Navbar from '../../Pages/Admin/Commons/Navbar';
import Sidebar from '../../Pages/Admin/Commons/Sidebar';
import Table from '../../Pages/Admin/Commons/Table';
import { carManagementt, userManagement } from '../../Api/Admin';

function CarsMgt() {
  const [tableData, setTableData] = useState<Array<{ [key: string]: any }>>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const header: string = 'cars'; // Define whether this is for users or providers

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const result = await carManagementt();
        console.log(result?.data?.data, "Fetched car data");

        if (result?.data?.data) {
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
          <h1 className="text-2xl font-bold mb-4">User Management</h1>
          <div className="overflow-x-auto bg-white rounded-lg shadow-md">
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

export default CarsMgt;
