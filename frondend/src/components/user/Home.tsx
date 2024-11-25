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

function Home() {
  const [carData, setCarData] = useState<CarDataInterface[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const limit = 2;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const result = await fetchCars(page, limit);
        console.log(result, 'Fetched car data');

        if (result?.data?.data) {
          setCarData(result.data.data);
          console.log(result.data.data.totalPage, "totalPage")
          setTotalPages(result.data.totalPage || 1);
        } else {
          setError('No car data returned.');
        }
      } catch (err) {
        console.error('Error fetching data:', err);
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
    console.log("Data received in Home:", data);
    setCarData(data); 
    setTotalPages(1)
  };
  
  

  return (
    <div>
      <Navbar />
      <Carosel onEvent={handleSearhCar} /> 
      <ServicesCard />
      {page}page{totalPages}
      <div className="text-center mb-1">
        <h3 className="text-3xl font-bold text-gray-800 mb-1">Come with</h3>
        <h4 className="text-lg font-semibold text-red-600">Our Products</h4>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {loading ? (
          <p>Loading...</p>
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
      <Footer />
    </div>
  );
}

export default Home;
