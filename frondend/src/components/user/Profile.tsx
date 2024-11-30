import React from 'react';
import Navbar from '../../Pages/Common/Navbar';
import UserProfile from '../../Pages/User/LandingPage/UserProfile';
import Footer from '../../Pages/Common/Footer';

function Profile() {
  return (
    <div className="flex flex-col h-screen">
      <Navbar />
      <div className="flex flex-grow">
        <div className="flex-grow pt-0 pb-0">
          <UserProfile />
        </div>
      </div>
      <div className="mt-12">
                <Footer />
            </div>
    </div>
  );
}

export default Profile;