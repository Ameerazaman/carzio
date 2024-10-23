import React, { useEffect, useState } from 'react';
import Navbar from '../../Pages/Common/Navbar';
import Sidebar from '../../Pages/Provider/Sidebar';
import CarMgtTable from '../../Pages/Provider/CarMgtTable';
import { carManagement } from '../../Api/Provider';

function CarMgt() {
    const [tableData, setTableData] = useState<Array<{ [key: string]: any }>>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const result = await carManagement(); // Assuming this is your API call to fetch data
                console.log(result?.data?.data, "Fetched car data");

                if (result?.data?.data) {
                    setTableData(result.data.data);
                } else {
                    setError("No car data returned.");
                }
            } catch (error) {
                console.error("Error fetching data:", error);
                setError("Error fetching car data.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="flex flex-col h-screen">
            <Navbar />
            <div className="flex flex-grow">
                <Sidebar />
            
            <div className="flex-1 p-6 bg-gray-100">
                <h1 className="text-2xl font-bold mb-4">Car Management</h1>
                <div className="overflow-x-auto bg-white rounded-lg shadow-md">
                    {loading ? (
                        <p className="text-center py-4">Loading...</p>
                    ) : error ? (
                        <p className="text-center py-4 text-red-600">{error}</p>
                    ) : (
                        <CarMgtTable tableData={tableData} />
                    )}
                </div>
                </div>
            </div>
        </div>
    );
}

export default CarMgt;
