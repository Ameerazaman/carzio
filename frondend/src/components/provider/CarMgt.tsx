import React, { useEffect, useState } from 'react';
import Navbar, { User } from '../../Pages/Common/Navbar';
import CarMgtTable from '../../Pages/Provider/CarMgtTable';
import { carManagement } from '../../Api/Provider';
import Sidebar from '../../Pages/Provider/Sidebar';
import Pagination from '../../Pages/Common/Pagination';
import { useSelector } from 'react-redux';
import { RootState } from '../../App/Store';

function CarMgt() {
    const provider = useSelector((state: RootState) => state.provider.currentProvider) as User | null;
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

                <div className="flex-1 p-6 bg-gray-100">
                    <h1 className="text-2xl font-bold mb-4">Car Management</h1>
                    <div className="overflow-x-auto bg-white rounded-lg shadow-md">
                        {loading ? (
                            <p className="text-center py-4">Loading...</p>
                        ) : error ? (
                            <p className="text-center py-4 text-red-600">{error}</p>
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

