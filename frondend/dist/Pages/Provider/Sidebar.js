import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { FaUser, FaCar, FaCog, FaCalendarAlt, FaComments, FaFileAlt, FaBars } from 'react-icons/fa';
import { NavLink } from 'react-router-dom';
function Sidebar() {
    var _a = useState(true), isOpen = _a[0], setIsOpen = _a[1];
    var toggleSidebar = function () {
        setIsOpen(!isOpen);
    };
    return (_jsxs("div", { className: "relative bg-gray-900 text-white h-screen p-4 shadow-lg transition-all duration-300 ease-in-out ".concat(isOpen ? 'w-64' : 'w-20'), children: [_jsx("button", { onClick: toggleSidebar, className: "absolute top-4 right-4 md:hidden text-white p-2 hover:bg-red-600 rounded-full", children: _jsx(FaBars, {}) }), _jsxs("ul", { className: "space-y-4 mt-8", children: [_jsx("li", { children: _jsxs(NavLink, { to: "/provider/home", className: function (_a) {
                                var isActive = _a.isActive;
                                return "flex items-center p-2 rounded transition duration-300  hover:scale-105 ".concat(isActive ? 'bg-red-600' : 'hover:bg-red-600');
                            }, children: [_jsx(FaUser, { className: "mr-2" }), isOpen && _jsx("span", { children: "Profile" })] }) }), _jsx("li", { children: _jsxs(NavLink, { to: "/provider/sales_report", className: function (_a) {
                                var isActive = _a.isActive;
                                return "flex items-center p-2 rounded transition duration-200 hover:bg-red-600 ".concat(isActive ? 'bg-red-600' : '');
                            }, children: [_jsx(FaFileAlt, { className: "mr-2" }), isOpen && _jsx("span", { children: "Report" })] }) }), _jsx("li", { children: _jsxs(NavLink, { to: "/provider/cars", className: function (_a) {
                                var isActive = _a.isActive;
                                return "flex items-center p-2 rounded transition duration-200 hover:bg-red-600 ".concat(isActive ? 'bg-red-600' : '');
                            }, children: [_jsx(FaCar, { className: "mr-2" }), isOpen && _jsx("span", { children: "My Cars" })] }) }), _jsx("li", { children: _jsxs(NavLink, { to: "/provider/dashboard", className: function (_a) {
                                var isActive = _a.isActive;
                                return "flex items-center p-2 rounded transition duration-200 hover:bg-red-600 ".concat(isActive ? 'bg-red-600' : '');
                            }, children: [_jsx(FaCog, { className: "mr-2" }), isOpen && _jsx("span", { children: "Dashboard" })] }) }), _jsx("li", { children: _jsxs(NavLink, { to: "/provider/booking", className: function (_a) {
                                var isActive = _a.isActive;
                                return "flex items-center p-2 rounded transition duration-200 hover:bg-red-600 ".concat(isActive ? 'bg-red-600' : '');
                            }, children: [_jsx(FaCalendarAlt, { className: "mr-2" }), isOpen && _jsx("span", { children: "Booking" })] }) }), _jsx("li", { children: _jsxs(NavLink, { to: "/provider/chat", className: function (_a) {
                                var isActive = _a.isActive;
                                return "flex items-center p-2 rounded transition duration-200 hover:bg-red-600 ".concat(isActive ? 'bg-red-600' : '');
                            }, children: [_jsx(FaComments, { className: "mr-2" }), isOpen && _jsx("span", { children: "Chat" })] }) })] })] }));
}
export default Sidebar;
