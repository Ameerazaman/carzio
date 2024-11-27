import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import Navbar from '../../Pages/Common/Navbar';
import EditCar from '../../Pages/Provider/EditCar';
function EditCarMgt() {
    return (_jsxs("div", { className: "flex flex-col h-screen", children: [_jsx(Navbar, {}), _jsx("div", { className: "flex flex-grow", children: _jsxs("div", { className: "flex-1 p-6 bg-gray-100", children: [_jsx("h1", { className: "text-2xl font-bold mb-4", children: "Car Management" }), _jsx("div", { className: "overflow-x-auto bg-white rounded-lg shadow-md", children: _jsx(EditCar, {}) })] }) })] }));
}
export default EditCarMgt;
