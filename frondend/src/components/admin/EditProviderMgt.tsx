import React from 'react'
import Navbar from '../../Pages/Admin/Commons/Navbar'
import EditUser from '../../Pages/Admin/EditUser'
import Sidebar from '../../Pages/Provider/Sidebar'

function EditProviderMgt() {
  let header:string="provider"
  return (
    <div>
      <div className="flex">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <div className="flex-1 p-6 bg-gray-100">
      
        <EditUser header={header}/>
          </div>
        </div>
      </div>
    </div>
    
  )
}

export default EditProviderMgt