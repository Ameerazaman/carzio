import React from 'react'
import HistoryDetailsProvider from '../../Pages/Provider/HistoryDetailsProvider'
import Sidebar from '../../Pages/Provider/Sidebar'
import Navbar from '../../Pages/Common/Navbar'

function HistoryDetailsInProvider() {
  return (
    <div className="flex flex-col h-screen">
      <Navbar />
      <div className="flex flex-grow">
        <Sidebar />
        <div className="flex-grow pt-0 pb-0"> 
        <HistoryDetailsProvider/>
        </div>
      </div>
    </div>
  )
}

export default HistoryDetailsInProvider