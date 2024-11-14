import React from 'react'
import Navbar from '../../Pages/Admin/Commons/Navbar'
import Sidebar from '../../Pages/Admin/Commons/Sidebar'
import HistoryDetailsAdmin from '../../Pages/Admin/HistoryDetailsAdmin'


function HistoryDetailsInAdmin() {
  return (
    <div className="flex flex-col h-screen">
      <Navbar />
      <div className="flex flex-grow">
        <Sidebar />
        <div className="flex-grow pt-0 pb-0"> 
        <HistoryDetailsAdmin/>
        </div>
      </div>
    </div>
  )
}

export default HistoryDetailsInAdmin