import React from 'react'
import Navbar from '../../Pages/Common/Navbar'
import BookingHistoryProvider from '../../Pages/Provider/BookingHistoryProvider'
import Sidebar from '../../Pages/Provider/Sidebar'

function BookingHistoryInProvider() {
  return (
    <div className="flex flex-col h-screen">
      <Navbar />
      <div className="flex flex-grow">
        <Sidebar />
        <div className="flex-grow pt-0 pb-0"> {/* Reduced padding here */} 
        <BookingHistoryProvider/> {/* This will now appear at the top of this section */}
        </div>
      </div>
    </div>
   
  )
}

export default BookingHistoryInProvider