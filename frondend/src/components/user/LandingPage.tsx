import React from 'react'
import Navbar from '../../Pages/Common/Navbar'

import About from '../../Pages/User/LandingPage/About'
import ServicesCard from '../../Pages/User/LandingPage/ServicesCard'
import Carosel from '../../Pages/Common/Carosel'
import Footer from '../../Pages/Common/Footer'
import { CarDataInterface } from '../../Interface/CarInterface'



function LandingPage() {
 
  const handleSearhCar = (data: CarDataInterface[]) => {
  };
  return (
    <div>
      <Navbar />
      <Carosel onEvent={handleSearhCar} /> 
      <About />
      <ServicesCard />
      
      <div className="mt-12">
                <Footer />
            </div>
    </div>
  )
}

export default LandingPage
