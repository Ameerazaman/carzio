import React from 'react';
import { FaUser, FaCar, FaCog, FaSignOutAlt } from 'react-icons/fa';

function Sidebar() {
  return (
    <div className="bg-gray-900 text-white w-64 h-screen p-4 shadow-lg">
      {/* <h2 className="text-lg font-bold mb-4 text-red-500">Provider Dashboard</h2> */}
      <ul className="space-y-4">
        <li>
          <a href="/provider/home" className="flex items-center p-2 hover:bg-red-600 rounded transition duration-200">
            <FaUser className="mr-2" />
            Profile
          </a>
        </li>
        <li>
          <a href="/provider/cars" className="flex items-center p-2 hover:bg-red-600 rounded transition duration-200">
            <FaCar className="mr-2" />
            My Cars
          </a>
        </li>
        <li>
          <a href="/settings" className="flex items-center p-2 hover:bg-red-600 rounded transition duration-200">
            <FaCog className="mr-2" />
            Dashboard
          </a>
        </li>
        <li>
          <a href="/logout" className="flex items-center p-2 hover:bg-red-600 rounded transition duration-200">
            <FaSignOutAlt className="mr-2" />
            Logout
          </a>
        </li>
      </ul>
    </div>
  );
}

export default Sidebar;
