import React, { useEffect, useState } from 'react';
import Navbar from '../../Pages/Common/Navbar';
import Carosel from '../../Pages/Common/Carosel';
import Card from '../../Pages/Common/Card';
import Footer from '../../Pages/Common/Footer';
import { fetchCars } from '../../Api/User';
import { CarDataInterface } from '../../Interface/CarInterface'; // Import CarDataInterface
import { useNavigate } from 'react-router-dom';
import ServicesCard from '../../Pages/User/LandingPage/ServicesCard';

function Home() {
  const [carData, setCarData] = useState<CarDataInterface[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate(); // Define navigate using useNavigate

  useEffect(() => {
    // Define the handleBackButton function inside useEffect to ensure it has access to navigate
    const handleBackButton = (event: PopStateEvent) => {
      navigate(2); // Pushes the user forward, preventing the back action
    };

    // Attach the popstate event listener to handle the back button
    window.addEventListener('popstate', handleBackButton);

    const fetchData = async () => {
      try {
        setLoading(true);
        const result = await fetchCars(); // Assuming this is your API call to fetch data
        console.log(result?.data?.data, "Fetched car data");

        if (result?.data?.data) {
          setCarData(result.data.data);
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

    // Fetch car data
    fetchData();

    // Cleanup the event listener on unmount
    return () => {
      window.removeEventListener('popstate', handleBackButton);
    };
  }, [navigate]); // Adding navigate as a dependency

  return (
    <div>
      <Navbar />
      <Carosel />
      <ServicesCard />
      <div className="text-center mb-1">
        <h3 className="text-3xl font-bold text-gray-800 mb-1">Come with</h3>
        <h4 className="text-lg font-semibold text-red-600">Our Products</h4> {/* Updated color to red */}
      </div>
      <div className="grid grid-cols-3 gap-2">
        {/* Render the Card component with proper car data */}
        {carData.map((car, index) => (
          <Card key={index} carData={car} />
        ))}
      </div>
      <Footer />
    </div>
  );
}

export default Home;
