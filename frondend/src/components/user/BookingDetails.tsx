
import React from 'react';
import Navbar from '../../Pages/Common/Navbar';
import BookingPage from '../../Pages/User/LandingPage/BookingPage';
import Footer from '../../Pages/Common/Footer';


function BookingDetails() {
  return (
    <div>
      <Navbar />
      <div className="shadow-xl p-6 mt-4 rounded-lg bg-white">
        <BookingPage />
      </div>
      <Footer/>
    </div>
  );
}

export default BookingDetails;
