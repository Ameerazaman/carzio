import React from 'react'
import Navbar from '../../Pages/Admin/Commons/Navbar'

import BookingHistoryAdmin from '../../Pages/Admin/BookingHistoryAdmin'
import Sidebar from '../../Pages/Admin/Commons/Sidebar'

function BookingHistoryInAdmin() {
  return (
    <div className="flex flex-col h-screen">
      <Navbar />
      <div className="flex flex-grow">
        <Sidebar />
        <div className="flex-grow pt-0 pb-0"> {/* Reduced padding here */} 
        <BookingHistoryAdmin/> {/* This will now appear at the top of this section */}
        </div>
      </div>
    </div>
   
  )
}

export default BookingHistoryInAdmin