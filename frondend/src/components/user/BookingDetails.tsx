
import React from 'react';
import Navbar from '../../Pages/Common/Navbar';
import BookingPage from '../../Pages/User/LandingPage/BookingPage';


function BookingDetails() {
  return (
    <div>
      <Navbar />
      <div className="shadow-xl p-6 mt-4 rounded-lg bg-white">
        <BookingPage />
      </div>
    </div>
  );
}

export default BookingDetails;
