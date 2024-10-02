import React from 'react'
import Navbar from '../../Pages/common/Navbar'

import About from '../../Pages/User/LandingPage/About'
import ServicesCard from '../../Pages/User/LandingPage/ServicesCard'
import Carosel from '../../Pages/common/Carosel'
import Card from '../../Pages/common/Card'
import Footer from '../../Pages/common/Footer'



function LandingPage() {
  return (
    <div>
      <Navbar />
     <Carosel/>
      <About />
      <ServicesCard />
      <Card/>
      <Footer/>
    </div>
  )
}

export default LandingPage
