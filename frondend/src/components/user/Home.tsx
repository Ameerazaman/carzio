import React from 'react'
import Navbar from '../../Pages/common/Navbar'

import About from '../../Pages/User/LandingPage/About'
import ServicesCard from '../../Pages/User/LandingPage/ServicesCard'
import Carosel from '../../Pages/common/Carosel'
import Card from '../../Pages/common/Card'
import Footer from '../../Pages/common/Footer'



function Home() {
  // Specify the state type for useSelector
  
  return (
    <div>
      <Navbar />
      <Carosel />
      <Card />
      <Footer />
    </div>
  );
}

export default Home;