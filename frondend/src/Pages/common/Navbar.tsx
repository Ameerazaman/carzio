import React, { useEffect } from 'react';
import { FaUser, FaUserPlus, FaPhone, FaMapMarkerAlt } from 'react-icons/fa'; // Import icons
import { RootState } from '../../App/Store';
import { useSelector } from 'react-redux';
import { userLogout } from '../../Api/User';
import Swal from 'sweetalert2';
// import { toast } from 'react-toastify';
import { toast } from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { signOut } from '../../App/Slice/UserSlice';
import { useNavigate } from 'react-router-dom';
import { providerLogout } from '../../Api/Provider';
import { signOutProvider } from '../../App/Slice/ProviderSlice';
import { Link } from 'react-router-dom';

export interface User {
  email: string;
  username: string;
  _id: string;
  // other user fields
}

// 
function Navbar() {
  let dispatch = useDispatch()
  let navigate = useNavigate()
  const user = useSelector((state: RootState) => state.user.currentUser) as User | null;
  const provider = useSelector((state: RootState) => state.provider.currentProvider) as User | null;
  if (user?._id) {
    localStorage.setItem('userId', user._id);
  }
  const token = localStorage.getItem('token');

  const logoutUser = async () => {
    try {
      console.log("logout in swt alert")
      Swal.fire({
        title: "Are you sure?",
        text: "",
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes"
      }).then((result) => {
        if (result.isConfirmed) {
          if (user) {

            userLogout().then(() => console.log(''))
            dispatch(signOut());

            navigate('/')
          }
          else if (provider) {
            providerLogout().then(() => console.log(''))
            dispatch(signOutProvider());

            navigate('/')
          }

        }
        else {
          navigate('/login')
        }
      });
    } catch (error) {
      console.log(error as Error);
    }
  }

  return (
    <header>
      {/* First Dark Red Navigation Bar */}
      <nav className="relative bg-red-800 p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          {/* Need help and phone number */}
          <div className="relative z-10 flex items-center space-x-4 text-white">
            <span>Need help: </span>
            <FaPhone className="text-white" /> {/* Phone Icon */}
            <span className="hover:text-red-400 transition duration-300"> +123 456 7890</span>
          </div>

          {/* Login/Signup Links */}
          {!user && !provider ? ( // If user is null or undefined, show login/signup links
            <div className="relative z-10 space-x-6 flex items-center">
              <a href="/login" className="text-white hover:text-gray-300 transition duration-300 flex items-center">
                <FaUser className="mr-2" /> {/* Login Icon */}
                Login
              </a>
              <a href="/signup" className="text-white hover:text-gray-300 transition duration-300 flex items-center">
                <FaUserPlus className="mr-2" /> {/* Signup Icon */}
                Signup
              </a>
            </div>
          ) : ( // If user is not null, show username and logout link
            <div className="relative z-10 space-x-6 flex items-center">

              <Link to='/profile'>
                <span className="text-white flex items-center">
                  <FaUser className="mr-2" /> {/* User Icon */}
                  {user ? user.username : provider?.username}{/* Show username */}
                </span>
              </Link>
              {/* Use an inline function to call logoutUser */}
              <a
                onClick={() => logoutUser()}
                className="text-white hover:text-gray-300 transition duration-300 flex items-center cursor-pointer"
              >
                <FaUserPlus className="mr-2" /> {/* Logout Icon */}
                Logout
              </a>
            </div>
          )}
        </div>
      </nav>

      {/* Second White Navigation Bar with Logo, Clock, Globe and Provider Signup */}
      <nav className="bg-white p-3 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center space-x-4">
            <img
              src="\images\Gauto - Car Rental HTML Template Preview - ThemeForest_files\logo.png"
              alt="Logo"
              className="h-10 w-auto"
            />
          </div>

          {/* Clock and Time */}
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

          {/* Provider Signup Button */}
          {!user && !provider ?
            <button className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded transition duration-300">
              <a href="/provider/login">Provider Signup</a>
            </button> : ""
          }
          {provider ?
            <button className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded transition duration-300">
              <a href="/provider/Home">Provider Home</a>
            </button>:""}
        </div>
      </nav>
      {user ? (
        <div className="bg-black p-2">
          <div className="container mx-auto flex justify-between items-center">
            <div className="flex space-x-8">
              <a href="/home" className="text-white hover:text-red-400 transition duration-300 font-semibold">Home</a>
              <a href="/booking_history" className="text-white hover:text-red-400 transition duration-300 font-semibold">History</a>
              <a href="/carList" className="text-white hover:text-red-400 transition duration-300 font-semibold">Cars</a>
              <a href="/offers" className="text-white hover:text-red-400 transition duration-300 font-semibold flex items-center">

                Offers
              </a>
            </div>
          </div>
        </div>
      ) : (
        <hr style={{ backgroundColor: 'black', height: '2px' }} />
      )}
    </header>
  )
}

export default Navbar;

