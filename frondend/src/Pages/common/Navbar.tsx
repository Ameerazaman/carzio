import React, { useEffect, useState } from 'react';
import { FaUser, FaUserPlus, FaPhone, FaBars, FaTimes } from 'react-icons/fa'; 
import { RootState } from '../../App/Store';
import { useSelector, useDispatch } from 'react-redux';
import { userLogout } from '../../Api/User';
import Swal from 'sweetalert2';
import { toast } from 'react-hot-toast';
import { signOut } from '../../App/Slice/UserSlice';
import { useNavigate, Link } from 'react-router-dom';
import { providerLogout } from '../../Api/Provider';
import { signOutProvider } from '../../App/Slice/ProviderSlice';

export interface User {
  email: string;
  username: string;
  _id: string;
}

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector((state: RootState) => state.user?.currentUser) as User | null;
  const provider = useSelector((state: RootState) => state.provider?.currentProvider) as User | null;

  const logoutUser = async () => {
    try {
      Swal.fire({
        title: "Are you sure?",
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes",
      }).then((result) => {
        if (result.isConfirmed) {
          if (user) {
            userLogout();
            dispatch(signOut());
            navigate('/');
          } else if (provider) {
            providerLogout();
            dispatch(signOutProvider());
            navigate('/');
          }
        }
      });
    } catch (error) {
      toast.error("Logout failed");
    }
  };

  return (
    <header>
      {/* First Dark Red Navigation Bar */}
      <nav className="relative bg-red-800 p-4 shadow-md flex justify-between items-center">
        <div className="flex items-center space-x-4 text-white">

          <FaPhone />
          <span className="hover:text-red-900 transition duration-300"> +123 456 7890</span>
        </div>

        <button
          className="text-white lg:hidden focus:outline-none"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>

        <div
          className={`${menuOpen ? 'block' : 'hidden'
            } lg:flex lg:items-center space-x-6`}
        >
          {!user && !provider ? (
            <>
              <Link to="/login" className="text-white hover:text-gray-300 flex items-center">
                <FaUser className="mr-2" /> Login
              </Link>
              <Link to="/signup" className="text-white hover:text-gray-300 flex items-center">
                <FaUserPlus className="mr-2" /> Signup
              </Link>
            </>
          ) : (
            <div className="flex items-center space-x-6">
              <Link to="/profile" className="text-white flex items-center">
                <FaUser className="mr-2" /> {user ? user.username : provider?.username}
              </Link>
              <a
                onClick={logoutUser}
                className="text-white hover:text-gray-300 cursor-pointer flex items-center"
              >
                <FaUserPlus className="mr-2" /> Logout
              </a>
            </div>
          )}
        </div>
      </nav>

      {/* Second White Navigation Bar */}
      <nav className="bg-white p-3 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <img src="/images/carzio.png" alt="Logo" className="h-10" />
          </div>

          <div className="flex items-center space-x-2">
            <img
              src="\images\Gauto - Car Rental HTML Template Preview - ThemeForest_files\clock.png"
              alt="Clock"
              className="h-6 w-auto"
            />
            <span className="text-black-600">9:00 AM to 10:00 PM</span>
          </div>

          {/* Globe and Location */}
          <div className="flex items-center space-x-2">
            <img
              src="\images\Gauto - Car Rental HTML Template Preview - ThemeForest_files\globe.png"
              alt="Globe"
              className="h-6 w-auto"
            />
            <span className="text-black-600">Malappuram, Palakkad, Calicut</span>
          </div>

          {!user && !provider ?
            <button className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded transition duration-300">
              <a href="/provider/login">Provider Signup</a>
            </button> : ""
          }
          {provider && !user ?
            < button className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded transition duration-300">
              <a href="/provider/Home">Provider Home</a>
            </button> : ""}
        </div>
      </nav>

      {/* Black Navigation Bar */}
      {
        user ? (
          <div className="bg-black p-2">
            <div className="container mx-auto flex justify-between items-center">
              <div className="flex space-x-8">
                <a href="/home" className="text-white hover:text-red-400 transition duration-300 font-semibold">Home</a>
                <a href="/booking_history" className="text-white hover:text-red-400 transition duration-300 font-semibold">History</a>
                <a href="/carList" className="text-white hover:text-red-400 transition duration-300 font-semibold">Cars</a>
                <a href="/offers" className="text-white hover:text-red-400 transition duration-300 font-semibold flex items-center">Offer </a>
                <a href="/wallet" className="text-white hover:text-red-400 transition duration-300 font-semibold flex items-center"> Wallet </a>
              </div>
            </div>
          </div>
        ) : (
          <hr style={{ backgroundColor: 'black', height: '2px' }} />
        )
      }
    </header>
  );
}

export default Navbar;
