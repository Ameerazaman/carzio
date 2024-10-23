import React from 'react';
import { AiOutlineWarning } from 'react-icons/ai'; // React Icon for error

const InternalServerError = () => {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-900 text-white">
      <AiOutlineWarning className="text-7xl text-red-500 animate-bounce mb-4" />
      <h1 className="text-4xl font-bold mb-2">500 - Internal Server Error</h1>
      <p className="text-lg text-gray-400 mb-6">
        Oops! Something went wrong on our end. Please try again later.
      </p>
      <button
        onClick={() => window.location.reload()}
        className="px-6 py-3 bg-red-600 text-white rounded-md shadow-md hover:bg-red-700 transition-all duration-300 ease-in-out transform hover:scale-105"
      >
        Refresh Page
      </button>
    </div>
  );
};

export default InternalServerError;
