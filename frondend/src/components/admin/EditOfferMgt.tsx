import React from 'react'
import Sidebar from '../../Pages/Admin/Commons/Sidebar'
import Navbar from '../../Pages/Admin/Commons/Navbar'
import EditOffer from '../../Pages/Admin/EditOffer'

function EditOfferMgt() {
     let header:string="offers"
  return (
    <div>
    <div className="flex">
    <Sidebar />
    <div className="flex-1 flex flex-col">
      <Navbar />
      <div className="flex-1 p-6 bg-gray-100">
    
      <EditOffer header={header}/>
        </div>
      </div>
    </div>
  </div>
  )
}

export default EditOfferMgt