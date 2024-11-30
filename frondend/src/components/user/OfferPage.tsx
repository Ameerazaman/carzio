import React from 'react'
import Navbar from '../../Pages/Common/Navbar'
import OfferCard from '../../Pages/User/LandingPage/OfferCard'
import Footer from '../../Pages/Common/Footer'

function OfferPage() {
  return (
    <div>
      <Navbar />
      <OfferCard />
      <div className="mt-12">
        <Footer />
      </div>
    </div>
  )
}

export default OfferPage