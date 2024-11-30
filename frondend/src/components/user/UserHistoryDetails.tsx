import React from 'react'

import Navbar from '../../Pages/Common/Navbar'
import HistoryDetail from '../../Pages/User/LandingPage/HistoryDetail'
import Footer from '../../Pages/Common/Footer'

function UserHistoryDetails() {
  return (
    <div>
        <Navbar/>
        <HistoryDetail/>
        <div className="mt-12">
                <Footer />
            </div>
    </div>
  )
}

export default UserHistoryDetails