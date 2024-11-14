import React from 'react';
import { FaTachometerAlt, FaCar, FaUser, FaCog, FaBell, FaTags, FaTicketAlt, FaCalendarAlt} from 'react-icons/fa';



function Sidebar() {
  return (
    <div className="bg-gray-900 text-white w-64 h-screen p-4 shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
      <h2 className="text-lg font-bold mb-4">Admin Dashboard</h2>
      <ul className="space-y-2">
        <li>
          <a href="/admin/dashboard" className="flex items-center p-2 hover:bg-red-600 rounded transition duration-300 transform hover:scale-105 shadow-md">
            <FaTachometerAlt className="mr-2" />
            Dashboard
          </a>
        </li>
        <li>
          <a href="/admin/cars" className="flex items-center p-2 hover:bg-red-600 rounded transition duration-300 transform hover:scale-105 shadow-md">
            <FaCar className="mr-2" />
            Cars
          </a>
        </li>
        <li>
          <a href="/admin/users" className="flex items-center p-2 hover:bg-red-600 rounded transition duration-300 transform hover:scale-105 shadow-md">
            <FaUser className="mr-2" />
            Users
          </a>
        </li>
        <li>
          <a href="/admin/providers" className="flex items-center p-2 hover:bg-red-600 rounded transition duration-300 transform hover:scale-105 shadow-md">
            <FaCog className="mr-2" />
            Providers
          </a>
        </li>
        <li>
          <a href="/admin/notifications" className="flex items-center p-2 hover:bg-red-600 rounded transition duration-300 transform hover:scale-105 shadow-md">
            <FaBell className="mr-2" />
            Notifications
          </a>
        </li>
        <li>
          <a href="/admin/offers" className="flex items-center p-2 hover:bg-red-600 rounded transition duration-300 transform hover:scale-105 shadow-md">
            <FaTags className="mr-2" />
            Offer
          </a>
        </li>
        <li>
          <a href="/admin/booking" className="flex items-center p-2 hover:bg-red-600 rounded transition duration-300 transform hover:scale-105 shadow-md">
          <FaCalendarAlt className="mr-2" />
            Booking
          </a>
        </li>
        <li>
          <a href="/admin/coupon" className="flex items-center p-2 hover:bg-red-600 rounded transition duration-300 transform hover:scale-105 shadow-md">
            <FaTicketAlt className="mr-2" />
            Coupon
          </a>
        </li>

      </ul>
    </div>
  );
}

export default Sidebar;
