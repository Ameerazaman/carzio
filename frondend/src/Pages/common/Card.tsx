import React from 'react';

function Card() {
  return (
    <div className="flex flex-col items-center mt-8"> {/* Added margin-top of 8 */}
      {/* Heading Section with increased size */}
      <h3 className="text-2xl font-bold text-gray-800 mb-2 text-center">Come with</h3>
      <h4 className="text-lg font-semibold text-gray-600 mb-4 text-center">Products</h4>

      {/* Adjusted the width from max-w-xs to a custom width */}
      <div className="w-72 bg-white rounded-lg shadow-lg overflow-hidden m-4 p-4 border border-gray-300 transform transition-transform duration-300 hover:scale-105 hover:shadow-2xl">
        {/* Car Image with reduced size */}
        <img
          src="/images/Gauto - Car Rental HTML Template Preview - ThemeForest_files/bmw-offer.png"
          alt="Car Image"
          className="w-full h-32 object-cover mb-4" // Reduced height to h-32
        />

        {/* Car Name and Price */}
        <h3 className="text-xl font-bold text-gray-700 mb-1">BMW 5 Series</h3> {/* Grey text */}
        <p className="text-md font-semibold text-gray-500">Price: $100/day</p> {/* Grey text */}

        {/* Action Buttons */}
        <div className="flex justify-center items-center mt-4 gap-4"> {/* Center buttons and add spacing */}
          <button className="bg-red-600 text-white py-2 px-4 rounded-lg text-sm">
            View Details
          </button>
          <button className="bg-black text-white py-2 px-4 rounded-lg text-sm">
            Rent a Car
          </button>
        </div>
      </div>
    </div>
  );
}

export default Card;
