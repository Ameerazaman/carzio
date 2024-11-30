import React, { useEffect, useState } from "react";
import CarFilter from "../../Pages/User/LandingPage/CarFilter";
import Navbar from "../../Pages/Common/Navbar";
import Card from "../../Pages/Common/Card";
import { fetchCars } from "../../Api/User";
import { CarDataInterface } from "../../Interface/CarInterface";
import { BiError } from "react-icons/bi";
import Pagination from "../../Pages/Common/Pagination";
import Footer from "../../Pages/Common/Footer";

function CarList() {
    const [carData, setCarData] = useState<CarDataInterface[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState<number>(1);
    const limit = 10


    const filterData = (data: CarDataInterface[] | { message: string }) => {
        if (Array.isArray(data)) {
            if (data.length === 0) {

                setCarData([]);
                setError("No cars match your Searching."); // Set a message for empty data
            } else {

                setCarData(data); // Update car data if `data` is a non-empty array
                setError(null); // Clear any previous error messages
            }
        } else if (data.message) {
            console.log(data.message, "filtered data as message");
            setCarData([]); // Clear car data
            setError(data.message); // Set error from the response message
        }
    };


    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const result = await fetchCars(page, limit);


                if (result?.data?.data) {
                    setCarData(result.data.data);

                    setTotalPages(result.data.totalPage || 1);
                } else {
                    setError('No car data returned.');
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
        <div>
            <Navbar />
            <div className="container mx-auto flex flex-col md:flex-row mt-4">
                <div className="w-full md:w-1/4 p-4">
                    <CarFilter filteredData={filterData} />
                </div>
                <div className="w-full md:w-3/4 p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {loading ? (
                        <div className="flex items-center justify-center w-full text-gray-600 text-lg font-medium bg-gray-100 p-4 rounded-md col-span-full">
                            <span className="animate-spin mr-2">🔄</span> {/* Loading icon or spinner */}
                            Loading cars...
                        </div>
                    ) : error ? (
                        <div className="flex items-center justify-center w-full text-red-700 bg-red-100 p-4 rounded-md col-span-full">
                            <BiError className="text-2xl mr-2" /> {/* Error icon */}
                            <span className="text-lg font-semibold">{error}</span>
                        </div>
                    ) : (
                        carData.map((car, index) => (
                            <Card key={index} carData={car} />
                        ))
                    )}
                </div>
            </div>
            <Pagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={handlePageChange}
            />
            <div className="mt-12">
                <Footer />
            </div>

        </div>
    );
}

export default CarList;
