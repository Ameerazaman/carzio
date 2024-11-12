import React from 'react'
import Sidebar from '../../Pages/Admin/Commons/Sidebar'
import Navbar from '../../Pages/Admin/Commons/Navbar'

import EditCoupon from '../../Pages/Admin/EditCoupon'

function EditCouponMgt() {
     let header:string="coupons"
  return (
    <div>
    <div className="flex">
    <Sidebar />
    <div className="flex-1 flex flex-col">
      <Navbar />
      <div className="flex-1 p-6 bg-gray-100">
    
      <EditCoupon header={header}/>
        </div>
      </div>
    </div>
  </div>
  )
}

export default EditCouponMgt