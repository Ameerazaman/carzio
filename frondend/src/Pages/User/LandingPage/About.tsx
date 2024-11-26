import React from 'react';

function About() {
  return (
    <div className="flex flex-col lg:flex-row items-center justify-between px-6 py-8">
      {/* Left side - About details */}
      <div className="lg:w-1/2">
        {/* Heading */}
 
        <h5 className="text-2xl font-medium mb-4 text-red-600 text-left">About Us</h5>
        <h6 className="text-2xl font-medium mb-4 text-grey-600 text-left">Welcome to CarZio</h6>
        <p className="text-gray-700 mb-6 text-left">
          Rent a Car is a versatile and user-friendly platform that bridges the gap between car owners and individuals looking to rent vehicles for various durations. The platform simplifies the process of finding, booking, and managing car rentals, making it accessible for both users and car providers.
        </p>
        {/* Signature Section */}
        <div className="mt-4 text-left">
          <div className="flex items-center space-x-2">
            <img 
              src="/images/Gauto - Car Rental HTML Template Preview - ThemeForest_files/signature.png" 
              alt="Signature" 
              className="h-10" 
            />
          </div>
            <p className="text-lg font-semibold text-black">- CarZio Team</p>
        </div>
      </div>

      {/* Right side - Car picture */}
      <div className="lg:w-1/2 flex justify-center lg:justify-end mt-8 lg:mt-0">
        <img src="/images/about.png" alt="Car" className="max-w-full h-auto rounded-lg shadow-lg" />
      </div>
    </div>
  );
}

export default About;
