import React from 'react'

import ChatHistory from '../../Pages/Provider/ChatHistory'
import Navbar from '../../Pages/Common/Navbar'
import Sidebar from '../../Pages/Provider/Sidebar'

function Chat() {
  return (
    <div className="flex flex-col h-screen">
            <Navbar />
            <div className="flex flex-grow">
                <Sidebar />

                <div className="flex-1 p-6 bg-gray-100 overflow-y-auto">
                
                    <div className="overflow-x-auto bg-white rounded-lg shadow-md">
                        <ChatHistory />
                    </div>
                </div>
            </div>
        </div>
  )
}

export default Chat