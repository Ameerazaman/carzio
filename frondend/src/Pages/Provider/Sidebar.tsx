import React, { useState } from 'react';
import { FaUser, FaCar, FaCog, FaCalendarAlt, FaComments, FaFileAlt, FaBars } from 'react-icons/fa';
import { NavLink } from 'react-router-dom'; 

function Sidebar() {
  const [isOpen, setIsOpen] = useState(true); 

  const toggleSidebar = () => {
    setIsOpen(!isOpen); 
  };

  return (
    <div className={`relative bg-gray-900 text-white h-screen p-4 shadow-lg transition-all duration-300 ease-in-out ${isOpen ? 'w-64' : 'w-20'}`}>
      <button
        onClick={toggleSidebar}
        className="absolute top-4 right-4 md:hidden text-white p-2 hover:bg-red-600 rounded-full"
      >
        <FaBars />
      </button>

      <ul className="space-y-4 mt-8">
        <li>
          <NavLink
            to="/provider/home"
            className={({ isActive }) =>
              `flex items-center p-2 rounded transition duration-300  hover:scale-105 ${
                isActive ? 'bg-red-600' : 'hover:bg-red-600'
              }`
            }
          >
            <FaUser className="mr-2" />
            {isOpen && <span>Profile</span>}
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/provider/sales_report"
            className={({ isActive }) =>
              `flex items-center p-2 rounded transition duration-200 hover:bg-red-600 ${
                isActive ? 'bg-red-600' : ''
              }`
            }
          >
            <FaFileAlt className="mr-2" />
            {isOpen && <span>Report</span>}
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/provider/cars"
            className={({ isActive }) =>
              `flex items-center p-2 rounded transition duration-200 hover:bg-red-600 ${
                isActive ? 'bg-red-600' : ''
              }`
            }
          >
            <FaCar className="mr-2" />
            {isOpen && <span>My Cars</span>}
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/provider/dashboard"
            className={({ isActive }) =>
              `flex items-center p-2 rounded transition duration-200 hover:bg-red-600 ${
                isActive ? 'bg-red-600' : ''
              }`
            }
          >
            <FaCog className="mr-2" />
            {isOpen && <span>Dashboard</span>}
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/provider/booking"
            className={({ isActive }) =>
              `flex items-center p-2 rounded transition duration-200 hover:bg-red-600 ${
                isActive ? 'bg-red-600' : ''
              }`
            }
          >
            <FaCalendarAlt className="mr-2" />
            {isOpen && <span>Booking</span>}
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/provider/chat"
            className={({ isActive }) =>
              `flex items-center p-2 rounded transition duration-200 hover:bg-red-600 ${
                isActive ? 'bg-red-600' : ''
              }`
            }
          >
            <FaComments className="mr-2" />
            {isOpen && <span>Chat</span>}
          </NavLink>
        </li>
      </ul>
    </div>
  );
}

export default Sidebar;

