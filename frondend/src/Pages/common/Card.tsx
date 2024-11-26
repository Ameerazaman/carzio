import React from 'react';
import { CarDataInterface } from '../../Interface/CarInterface';
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
      {/* Car card with compact design and hover effect */}
      <Link to={`/car_details/${carData.id} `}>
        <div className="min-w-[240px] max-w-xs w-full bg-white rounded-lg shadow-md overflow-hidden m-4 p-3 transition-transform duration-300 transform hover:scale-105 hover:shadow-xl">


          {/* Aspect Ratio Container for Image */}
          <div className="relative w-full pb-[56.25%] mb-3 overflow-hidden rounded-md"> {/* 16:9 Aspect Ratio */}
            <img
              src={carData.images[0]}
              alt="Car"
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>

          {/* Car Name and Price */}
          <h3 className="text-md font-semibold text-gray-800 mb-1 text-center">{carData.car_name}</h3>
          <p className="text-sm font-medium text-gray-500 text-center">Price: ₹{carData.rentalPrice}/day</p>

          {/* Car Details */}
          <div className="text-xs text-gray-600 mt-3 text-center">
            <p>
              This car is a stylish {carData.model} featuring a sleek {carData.color} exterior.
              Powered by a {carData.engineType} engine and running on {carData.fuelType}, it offers
              an efficient and reliable driving experience.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center items-center mt-5 gap-3">
            {user ? (
              <Link to={`/carlist`}>
                <button className="bg-red-600 text-white py-1.5 px-3 rounded-lg text-xs hover:bg-red-500 transition duration-200 ease-in-out shadow-md hover:shadow-lg">
                  View More
                </button>
              </Link>
            ) : (
              <button className="bg-red-600 text-white py-1.5 px-3 rounded-lg text-xs hover:bg-red-500 transition duration-200 ease-in-out shadow-md hover:shadow-lg">
                View More
              </button>
            )}
            <Link to={`/booking_details/${carData.id}`}>
              <button className="bg-black text-white py-1.5 px-3 rounded-lg text-xs hover:bg-gray-800 transition duration-200 ease-in-out shadow-md hover:shadow-lg">
                Rent a Car
              </button>
              </Link>
          </div>
        </div>
      </Link>
    </div>
  );
}

export default Card;



