import React from 'react';
import { CarDataInterface } from '../../Interface/CarInterface';
import { FaCar, FaGasPump, FaCogs, FaPalette } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { RootState } from '../../App/Store';
import { User } from './Navbar';
import { Link } from 'react-router-dom';

interface CardProps {
  carData: CarDataInterface;
}

function Card({ carData }: CardProps) {
  const user = useSelector((state: RootState) => state.user.currentUser) as User | null;

  return (
    <div className="flex flex-col items-center mt-8">
      {/* Center the headings */}


      {/* Car card with hover effect and adjusted size */}
      <div className="min-w-[280px] max-w-xs w-full bg-white rounded-lg shadow-md overflow-hidden m-4 p-4 transition-transform duration-300 transform hover:scale-105 hover:shadow-xl">
        {/* Car Image */}
        <img
          src={carData.images[0]}
          alt="Car"
          className="w-full h-32 object-cover mb-4 rounded-lg"
        />

        {/* Car Name and Price */}
        <h3 className="text-lg font-semibold text-gray-800 mb-1 text-center">{carData.car_name}</h3>
        <p className="text-md font-medium text-gray-500 text-center">Price: ₹{carData.rentalPrice}/day</p>

        {/* Car Details with Icons and Color Coding in Two Rows */}
        <div className="flex justify-center mt-4 text-sm text-gray-600 space-x-8">
          <div className="flex items-center space-x-1">
            <FaCar className="text-blue-600" />
            <span>{carData.model}</span>
          </div>
          <div className="flex items-center space-x-1">
            <FaGasPump className="text-green-600" />
            <span>{carData.fuelType}</span>
          </div>
        </div>
        <div className="flex justify-center mt-2 text-sm text-gray-600 space-x-8">
          <div className="flex items-center space-x-1">
            <FaCogs className="text-yellow-600" />
            <span>{carData.engineType}</span>
          </div>
          <div className="flex items-center space-x-1">
            <FaPalette className="text-purple-600" />
            <span>{carData.color}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center items-center mt-6 gap-4">
          {user ? (
            <Link to={`/car_details/${carData.id}`}> {/* Use backticks for template literals */}
              <button className="bg-red-600 text-white py-2 px-4 rounded-lg text-sm hover:bg-red-500 transition duration-200 ease-in-out shadow-md hover:shadow-lg">
                View Details
              </button>
            </Link>
          ) : (
            <button className="bg-red-600 text-white py-2 px-4 rounded-lg text-sm hover:bg-red-500 transition duration-200 ease-in-out shadow-md hover:shadow-lg">
              View Details
            </button>
          )}


          <button className="bg-black text-white py-2 px-4 rounded-lg text-sm hover:bg-gray-800 transition duration-200 ease-in-out shadow-md hover:shadow-lg">
            Rent a Car
          </button>
        </div>
      </div >
    </div >
  );
}

export default Card;
