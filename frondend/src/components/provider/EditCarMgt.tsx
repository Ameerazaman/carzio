
import Navbar from '../../Pages/Common/Navbar'
import EditCar from '../../Pages/Provider/EditCar'

function EditCarMgt() {

    return (
        <div className="flex flex-col h-screen">
            <Navbar />
            <div className="flex flex-grow">
                {/* <Sidebar /> */}

                <div className="flex-1 p-6 bg-gray-100">
                    <h1 className="text-2xl font-bold mb-4">Car Management</h1>
                    <div className="overflow-x-auto bg-white rounded-lg shadow-md">
                        <EditCar />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default EditCarMgt