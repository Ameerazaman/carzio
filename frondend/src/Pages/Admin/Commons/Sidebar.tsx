import React from 'react';
import { FaTachometerAlt, FaCar, FaUser, FaCog } from 'react-icons/fa';
import { FaSignOutAlt } from 'react-icons/fa';

function Sidebar() {
  return (
    <div className="bg-gray-900 text-white w-64 h-screen p-4 shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
      <h2 className="text-lg font-bold mb-4">Admin Dashboard</h2>
      <ul className="space-y-2">
        <li>
          <a href="/dashboard" className="flex items-center p-2 hover:bg-red-600 rounded transition duration-300 transform hover:scale-105 shadow-md">
            <FaTachometerAlt className="mr-2" />
            Dashboard
          </a>
        </li>
        <li>
          <a href="/cars" className="flex items-center p-2 hover:bg-red-600 rounded transition duration-300 transform hover:scale-105 shadow-md">
            <FaCar className="mr-2" />
            Cars
          </a>
        </li>
        <li>
          <a href="/users" className="flex items-center p-2 hover:bg-red-600 rounded transition duration-300 transform hover:scale-105 shadow-md">
            <FaUser className="mr-2" />
            Users
          </a>
        </li>
        <li>
          <a href="/providers" className="flex items-center p-2 hover:bg-red-600 rounded transition duration-300 transform hover:scale-105 shadow-md">
            <FaCog className="mr-2" />
            Providers
          </a>
        </li>
        <li>
          <a href="/logout" className="flex items-center p-2 hover:bg-red-600 rounded transition duration-300 transform hover:scale-105 shadow-md">
            <FaSignOutAlt className="mr-2" />
            Logout
          </a>
        </li>
      </ul>
    </div>
  );
}

export default Sidebar;
