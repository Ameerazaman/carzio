import React, { useEffect } from 'react';
import { FaSignOutAlt } from 'react-icons/fa'; // You may want to include only the icons you use
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../../App/Store';
import { User } from '../../Common/Navbar';
import { adminLogout } from '../../../Api/Admin';
import { signOutAdmin } from '../../../App/Slice/AdminSlice';
import toast from 'react-hot-toast';

function Navbar() {
  const admin = useSelector((state: RootState) => state.admin.currentAdmin) as User | null;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (!admin) {
      navigate("/admin/login")
    }
  }, [admin,navigate]); 

  const logoutUser = async () => {
    try {
      Swal.fire({
        title: "Are you sure?",
        text: "",
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes",
      }).then(async (result) => {
        if (result.isConfirmed && admin) {
          try {
            const response = await adminLogout();

            if (response) {
              dispatch(signOutAdmin()); // Clear admin from Redux store

              navigate('/admin/login'); // Navigate to login page
            } else {
              throw new Error("Logout failed");
            }
          } catch (error) {

            toast.error("Logout failed. Please try again.");
          }
        } else {
          navigate('/admin/dashboard'); // If canceled, remain on dashboard
        }
      });
    } catch (error) {
      console.log(error as Error);
    }

  }
  return (
    <nav className="bg-gray-900 p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-white text-lg font-bold">
          <img
            src="/images/car white.png" // Replace with your logo path
            alt="Logo"
            className="h-12 w-auto max-h-[48px]" // Adjusted height and width
          />
        </div>
        <div className="flex items-center">
          <button
            onClick={logoutUser}
            className="flex items-center text-white hover:text-red-500 transition duration-300"
          >
            <FaSignOutAlt className="mr-2" />
            Logout
          </button>
        </div>
      </div>
    </nav>

  );
}

export default Navbar;
