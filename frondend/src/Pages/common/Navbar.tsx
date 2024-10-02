import React, { useEffect } from 'react';
import { FaUser, FaUserPlus, FaPhone, FaMapMarkerAlt } from 'react-icons/fa'; // Import icons
import { RootState } from '../../app/store';
import { useSelector } from 'react-redux';
import { userLogout } from '../../Api/user';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { signOut } from '../../app/slice/userSlice';
import { useNavigate } from 'react-router-dom';
import { providerLogout } from '../../Api/provider';
import { signOutProvider } from '../../app/slice/providerSlice';

interface User {
  email: string;
  username: string;
  // other user fields
}

function Navbar() {
  let dispatch = useDispatch()
  let navigate = useNavigate()
  const user = useSelector((state: RootState) => state.user.currentUser) as User | null;
  const provider = useSelector((state: RootState) => state.provider.currentProvider) as User | null;

  const token = localStorage.getItem('token');

  useEffect(() => {
    if (user) {
      console.log(user.email, "mount");
    }
  }, [user]);

  // Function to handle user logout
  // const logoutUser = async () => {
  //   if (token) {
  //     try {
  //       const result = await userLogout(token);
  //       if (result.success) {
  //         console.log('Logout successful');
  //         // Optionally clear the token from local storage and navigate to login
  //         localStorage.removeItem('token');
  //       } else {
  //         console.log('Logout failed:', result.message);
  //       }
  //     } catch (error) {
  //       console.error('Error during logout:', error);
  //     }
  //   } else {
  //     console.error('No token found for logout');
  //   }
  // };


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
          if(user){

            userLogout().then(() => console.log(''))
            dispatch(signOut());
            toast.success("You are logged out!")
            navigate('/')
          }
          else if(provider){
            providerLogout().then(() => console.log(''))
            dispatch(signOutProvider());
            toast.success("You are logged out!")
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
          {! user && !provider ? ( // If user is null or undefined, show login/signup links
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
              <span className="text-white flex items-center">
                <FaUser className="mr-2" /> {/* User Icon */}
                {user ? user.email : provider?.email}{/* Show username */}
              </span>
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
          {!user &&
            <button className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded transition duration-300">
              <a href="/provider/login">Provider Signup</a>
            </button>
          }
        </div>
      </nav>

      {/* Third Reduced Height Black Navigation Bar with Navigation Links */}
      <div className="bg-black p-2">
        <div className="container mx-auto flex justify-between items-center">
          {/* Navigation Links */}
          <div className="flex space-x-8">
            <a href="#" className="text-white hover:text-red-400 transition duration-300 font-semibold">Home</a>
            <a href="#" className="text-white hover:text-red-400 transition duration-300 font-semibold">About</a>
            <a href="#" className="text-white hover:text-red-400 transition duration-300 font-semibold">Cars</a>
            <a href="#" className="text-white hover:text-red-400 transition duration-300 font-semibold flex items-center">
              <FaMapMarkerAlt className="mr-2" /> {/* Location Icon */}
              Location
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
