import React, { useEffect } from 'react';
import Navbar from '../../Pages/Admin/Commons/Navbar'; // Adjust path if necessary
import Sidebar from '../../Pages/Admin/Commons/Sidebar'; // Adjust path if necessary
import { useSelector } from 'react-redux';
import { RootState } from '../../App/Store';
import { User } from '../../Pages/Common/Navbar';
import { useNavigate } from 'react-router-dom';
import AdminDashboard from '../../Pages/Admin/AdminDashboard';

function Dashboard() {
  const admin = useSelector((state: RootState) => state.admin.currentAdmin) as User | null;
  let navigate = useNavigate();

  useEffect(() => {
    if (admin) {
      navigate('/admin/dashboard');
    } else {
      navigate("/admin/login");
    }
  }, [admin]); // Dependency array to log admin info only when it changes

  return (
    <div className="flex">
      {/* Sidebar */}
      <div className="fixed top-0 left-0 w-64 h-full bg-gray-800 text-white">
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col ml-64">
        {/* Top Navbar */}
        <div className="fixed top-0 left-0 w-full z-10 bg-white shadow-md">
          <Navbar />
        </div>

        {/* Content Area */}
        <div className="flex-1 p-6 mt-16 overflow-y-auto bg-gray-100">
          <div className="overflow-x-auto bg-white rounded-lg shadow-md">
            <AdminDashboard />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
