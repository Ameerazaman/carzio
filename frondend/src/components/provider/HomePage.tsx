// HomePage.jsx
import React from 'react';
import Navbar from '../../Pages/Common/Navbar';

import ProfilePage from '../../Pages/Provider/ProfilePage';
import Sidebar from '../../Pages/Provider/Sidebar';

function HomePage() {
  return (
    <div className="flex flex-col h-screen">
      <Navbar />
      <div className="flex flex-grow">
        <Sidebar />
        <div className="flex-grow pt-0 pb-0"> {/* Reduced padding here */} 
          <ProfilePage /> {/* This will now appear at the top of this section */}
        </div>
      </div>
    </div>
  );
}

export default HomePage;


