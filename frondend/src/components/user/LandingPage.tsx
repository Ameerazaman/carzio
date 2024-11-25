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
 
  const handleSearhCar = (data: CarDataInterface[]) => {
    console.log("Data received in Home:", data);
    // setCarData(data); 
    // setTotalPages(1)
  };
  return (
    <div>
      <Navbar />
      <Carosel onEvent={handleSearhCar} /> 
      <About />
      <ServicesCard />
      
      <Footer />
    </div>
  )
}

export default LandingPage
