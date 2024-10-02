import React from 'react';
import { FaSignOutAlt } from 'react-icons/fa';

function Navbar() {
  return (
    <nav className="bg-gray-900 p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-white text-lg font-bold">
          <img
            src="/path/to/your/logo.png" // Replace with your logo path
            alt="Logo"
            className="h-8"
          />
        </div>
        <div className="flex items-center">
          <button className="flex items-center text-white hover:text-red-500 transition duration-300">
            <FaSignOutAlt className="mr-2" />
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
