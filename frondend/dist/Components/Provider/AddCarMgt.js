import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import Navbar from '../../Pages/Common/Navbar';
import AddCar from '../../Pages/Provider/AddCar';
function AddCarMgt() {
    return (_jsxs("div", { className: "flex flex-col min-h-screen", children: [_jsx(Navbar, {}), _jsx("div", { className: "flex-grow p-4 md:p-8 bg-gray-100", children: _jsx("div", { className: "max-w-screen-lg mx-auto p-4 bg-white rounded-lg shadow-lg", children: _jsx(AddCar, {}) }) })] }));
}
export default AddCarMgt;
