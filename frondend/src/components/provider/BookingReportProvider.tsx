import React, { useEffect, useState } from 'react';
import Pagination from '../../Pages/Common/Pagination';
import Report from '../../Pages/Common/Report';
import Sidebar from '../../Pages/Provider/Sidebar';
import Navbar, { User } from '../../Pages/Common/Navbar';
import { fetchSalesReport } from '../../Api/Provider';
import { useSelector } from 'react-redux';
import { RootState } from '../../App/Store';


function BookingReportProvider() {
  
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
 
                if (provider) {
                    const result = await fetchSalesReport(page, limit, provider?._id);
                    if (result?.data) {
                        setTableData(result.data);
                        setTotalPages(result.data.totalPage || 1);
                    } else {
                        setError("sales report is not retrieved");
                    }
                }
            } catch (error) {

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
        <div className="flex flex-col h-screen">
            <Navbar />
            <div className="flex flex-grow">
                <Sidebar />

                <div className="flex-1 p-6 bg-gray-100">
                    <div className="overflow-x-auto bg-white rounded-lg shadow-md">
                        {loading ? (
                            <p className="text-center py-4">Loading...</p>
                        ) : error ? (
                            <p className="text-center py-4 text-red-600">{error}</p>
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
