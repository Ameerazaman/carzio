import React from 'react';
import Navbar from '../../Pages/Admin/Commons/Navbar'; // Adjust path if necessary
import Sidebar from '../../Pages/Admin/Commons/Sidebar'; // Adjust path if necessary
import Table from '../../Pages/Admin/Commons/Table'; // Adjust path if necessary

function Dashboard() {
  return (
    <div className="flex">
      {/* Sidebar */}
      <Sidebar />

      <div className="flex-1 flex flex-col">
        {/* Top Navbar */}
        <Navbar />

        <div className="flex-1 p-6 bg-gray-100">
          <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
          <div className="overflow-x-auto bg-white rounded-lg shadow-md">
            <Table />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;

