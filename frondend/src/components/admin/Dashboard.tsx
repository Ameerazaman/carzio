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
  const navigate = useNavigate();

  useEffect(() => {
    if (admin) {
      navigate('/admin/dashboard');
    } else {
      navigate('/admin/login');
    }
  }, [admin, navigate]);

  return (
    <div className="flex min-h-screen">
      {/* Sidebar on the left side */}
      <div >
        <Sidebar />
      </div>

      {/* Main content area */}
      <div className="flex-1 flex flex-col">
        {/* Navbar at the top */}
        <div className="bg-gray-900">
          <Navbar />
        </div>

        {/* Main content */}
        <div className="flex-1 p-4 lg:p-6 bg-gray-100 overflow-y-auto">
          {/* Dashboard Heading */}
          <h1 className="text-2xl font-bold mb-4 text-center lg:text-left">Admin Dashboard</h1>

          {/* Dashboard Content */}
          <div className="bg-white rounded-lg shadow-md p-4">
            <AdminDashboard />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;

