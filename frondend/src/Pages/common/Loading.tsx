import React from 'react';
import { FaCircle, FaCog } from 'react-icons/fa'; // Use FaCog as a steering wheel

function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white">
      <div className="relative flex items-center space-x-6">
        {/* Steering Wheel Icon */}
        <FaCog className="h-16 w-16 text-gray-900 animate-spin" />
      </div>

      <p className="mt-12 text-lg font-semibold text-gray-900">
        Loading your ride...
      </p>
    </div>
  );
}

export default Loading;

