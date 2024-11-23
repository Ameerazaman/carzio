import React from 'react'
import Navbar from '../../Pages/Common/Navbar'
import Sidebar from '../../Pages/Provider/Sidebar'
import ProviderDashboard from '../../Pages/Provider/ProviderDashboard'

function DashboardProvider() {
  return (
    <div className="flex flex-col h-screen">
      <Navbar />
      <div className="flex flex-grow">
        <Sidebar />
        <div className="flex-grow pt-0 pb-0"> 
        <ProviderDashboard/>
        </div>
      </div>
    </div>
  )
}
export default DashboardProvider