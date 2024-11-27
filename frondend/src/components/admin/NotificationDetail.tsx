import React from 'react'

import Navbar from '../../Pages/Admin/Commons/Navbar'
import NotificationDetails from '../../Pages/Admin/NotificationDetails'
import Sidebar from '../../Pages/Admin/Commons/Sidebar'

function NotificationDetail() {
  
    return (
        <div>
            <div className="flex">
                <Sidebar />
                <div className="flex-1 flex flex-col">
                    <Navbar />
                    <div className="flex-1 p-6 bg-gray-100 ">

                        <NotificationDetails />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default NotificationDetail