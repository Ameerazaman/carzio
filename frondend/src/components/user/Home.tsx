import React, { useEffect, useState } from 'react';
import Navbar from '../../Pages/Common/Navbar';
import Carosel from '../../Pages/Common/Carosel';
import Card from '../../Pages/Common/Card';
import Footer from '../../Pages/Common/Footer';
import { fetchCars } from '../../Api/User';
import { CarDataInterface } from '../../Interface/CarInterface';
import { useNavigate } from 'react-router-dom';
import ServicesCard from '../../Pages/User/LandingPage/ServicesCard';
import Pagination from '../../Pages/Common/Pagination';
import Loading from '../../Pages/Common/Loading';

function Home() {
  const [carData, setCarData] = useState<CarDataInterface[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const limit = 6;

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
      } catch (err) {
        setError('Error fetching car data.');
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

  const handleSearhCar = (data: CarDataInterface[]) => {

    setCarData(data);
    setTotalPages(1)
  };



  return (
    <div>
      <Navbar />
      <Carosel onEvent={handleSearhCar} />
      <ServicesCard />
      
      <div className="text-center mb-1">
        <h3 className="text-3xl font-bold text-gray-800 mb-1">Come with</h3>
        <h4 className="text-lg font-semibold text-red-600">Our Products</h4>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
        {loading ? (
          <Loading/>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          carData.map((car, index) => <Card key={index} carData={car} />)
        )}
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

export default Home;
