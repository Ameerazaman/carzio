import React, { useEffect, useState } from 'react'
import Navbar from '../../Pages/Common/Navbar'

import About from '../../Pages/User/LandingPage/About'
import ServicesCard from '../../Pages/User/LandingPage/ServicesCard'
import Carosel from '../../Pages/Common/Carosel'
import Card from '../../Pages/Common/Card'
import Footer from '../../Pages/Common/Footer'
import { CarDataInterface } from '../../Interface/CarInterface'
import { fetchCars } from '../../Api/User'



function LandingPage() {
  // const [carData, setCarData] = useState<CarDataInterface[]>([]);
  // const [loading, setLoading] = useState<boolean>(true);
  // const [error, setError] = useState<string | null>(null);

  // useEffect(() => {
  //     const fetchData = async () => {
  //         try {
  //             setLoading(true);
  //             const result = await fetchCars(); // Assuming this is your API call to fetch data
  //             console.log(result?.data?.data, "Fetched car data");

  //             if (result?.data?.data) {
  //                 // Ensure the data returned matches the CarDataInterface structure
  //                 setCarData(result.data.data);
  //             } else {
  //                 setError("No car data returned.");
  //             }
  
  //         } catch (error) {
  //             console.error("Error fetching data:", error);
  //             setError("Error fetching car data.");
  //         } finally {
  //             setLoading(false);
  //         }
  //     };

  //     fetchData();
  // }, []);

  return (
    <div>
      <Navbar />
      <Carosel />
      <About />
      <ServicesCard />
      
      <Footer />
    </div>
  )
}

export default LandingPage
