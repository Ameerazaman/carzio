import React, { useState } from 'react';
import { FaTachometerAlt, FaCar, FaUser, FaCog, FaBell, FaTags, FaTicketAlt, FaCalendarAlt, FaFileAlt, FaBars } from 'react-icons/fa';
import { NavLink } from 'react-router-dom'; // Use NavLink from react-router-dom

function Sidebar() {
  const [isOpen, setIsOpen] = useState(true); // state to handle the toggling of sidebar

  const toggleSidebar = () => {
    setIsOpen(!isOpen); // toggle sidebar state
  };

  return (
    <div className={`relative bg-gray-900 text-white h-screen p-4 shadow-lg transition-all duration-300 ease-in-out ${isOpen ? 'w-64' : 'w-20'}`}>
      <button
        onClick={toggleSidebar}
        className="absolute top-4 right-4 md:hidden text-white p-2 hover:bg-red-600 rounded-full"
      >
        <FaBars />
      </button>

      <h2 className={`text-lg font-bold mb-4 ${!isOpen && 'hidden'}`}>Admin Dashboard</h2>
      <ul className="space-y-2 mt-8">
        <li>
          <NavLink
            to="/admin/dashboard"
            className={({ isActive }) =>
              `font-bold flex items-center p-2 rounded transition duration-300 transform hover:scale-105 shadow-md ${
                isActive ? 'bg-red-600' : 'hover:bg-red-600'
              }`
            }
          >
            <FaTachometerAlt className="mr-2" />
            {isOpen && <span>Dashboard</span>}
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/admin/sales_report"
            className={({ isActive }) =>
              `font-bold flex items-center p-2 rounded transition duration-300 transform hover:scale-105 shadow-md ${
                isActive ? 'bg-red-600' : 'hover:bg-red-600'
              }`
            }
          >
            <FaFileAlt className="mr-2" />
            {isOpen && <span>Report</span>}
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/admin/cars"
            className={({ isActive }) =>
              `font-bold flex items-center p-2 rounded transition duration-300 transform hover:scale-105 shadow-md ${
                isActive ? 'bg-red-600' : 'hover:bg-red-600'
              }`
            }
          >
            <FaCar className="mr-2" />
            {isOpen && <span>Cars</span>}
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/admin/users"
            className={({ isActive }) =>
              `font-bold flex items-center p-2 rounded transition duration-300 transform hover:scale-105 shadow-md ${
                isActive ? 'bg-red-600' : 'hover:bg-red-600'
              }`
            }
          >
            <FaUser className="mr-2" />
            {isOpen && <span>Users</span>}
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/admin/providers"
            className={({ isActive }) =>
              `font-bold flex items-center p-2 rounded transition duration-300 transform hover:scale-105 shadow-md ${
                isActive ? 'bg-red-600' : 'hover:bg-red-600'
              }`
            }
          >
            <FaCog className="mr-2" />
            {isOpen && <span>Providers</span>}
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/admin/notifications"
            className={({ isActive }) =>
              `font-bold flex items-center p-2 rounded transition duration-300 transform hover:scale-105 shadow-md ${
                isActive ? 'bg-red-600' : 'hover:bg-red-600'
              }`
            }
          >
            <FaBell className="mr-2" />
            {isOpen && <span>Notifications</span>}
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/admin/offers"
            className={({ isActive }) =>
              `font-bold flex items-center p-2 rounded transition duration-300 transform hover:scale-105 shadow-md ${
                isActive ? 'bg-red-600' : 'hover:bg-red-600'
              }`
            }
          >
            <FaTags className="mr-2" />
            {isOpen && <span>Offer</span>}
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/admin/booking"
            className={({ isActive }) =>
              `font-bold flex items-center p-2 rounded transition duration-300 transform hover:scale-105 shadow-md ${
                isActive ? 'bg-red-600' : 'hover:bg-red-600'
              }`
            }
          >
            <FaCalendarAlt className="mr-2" />
            {isOpen && <span>Booking</span>}
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/admin/coupon"
            className={({ isActive }) =>
              `font-bold flex items-center p-2 rounded transition duration-300 transform hover:scale-105 shadow-md ${
                isActive ? 'bg-red-600' : 'hover:bg-red-600'
              }`
            }
          >
            <FaTicketAlt className="mr-2" />
            {isOpen && <span>Coupon</span>}
          </NavLink>
        </li>
      </ul>
    </div>
  );
}
export default Sidebar;
