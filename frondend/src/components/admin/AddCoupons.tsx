import React from 'react'

import Navbar from '../../Pages/Admin/Commons/Navbar'
import Sidebar from '../../Pages/Admin/Commons/Sidebar'
import AddCoupon from '../../Pages/Admin/AddCoupon'

function AddCoupons() {
  return (
    <div>    <div className="flex">
      <Navbar />

      <div className="flex-1 flex flex-col">
        <Sidebar />
        <div className="flex-1 bg-gray-100 overflow-y-auto">

          <div className="overflow-x-auto bg-white  rounded-lg shadow-md pt-4 mt-5">
            <AddCoupon />
          </div>
        </div>
      </div>
    </div></div>
  )
}

export default AddCoupons