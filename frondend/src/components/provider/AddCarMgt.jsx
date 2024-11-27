import React from 'react';
import Navbar from '../../Pages/Common/Navbar';
import AddCar from '../../Pages/Provider/AddCar';

function AddCarMgt() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      {/* Wrapper for AddCar, ensures it takes full width and adjusts accordingly */}
      <div className="flex-grow p-4 md:p-8 bg-gray-100">
        <div className="max-w-screen-lg mx-auto p-4 bg-white rounded-lg shadow-lg">
          <AddCar />
        </div>
      </div>
    </div>
  );
}

export default AddCarMgt;
