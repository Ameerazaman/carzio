import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { FaTachometerAlt, FaCar, FaUser, FaCog, FaBell, FaTags, FaTicketAlt, FaCalendarAlt, FaFileAlt, FaBars } from 'react-icons/fa';
import { NavLink } from 'react-router-dom'; // Use NavLink from react-router-dom
function Sidebar() {
    var _a = useState(true), isOpen = _a[0], setIsOpen = _a[1]; // state to handle the toggling of sidebar
    var toggleSidebar = function () {
        setIsOpen(!isOpen); // toggle sidebar state
    };
    return (_jsxs("div", { className: "relative bg-gray-900 text-white h-screen p-4 shadow-lg transition-all duration-300 ease-in-out ".concat(isOpen ? 'w-64' : 'w-20'), children: [_jsx("button", { onClick: toggleSidebar, className: "absolute top-4 right-4 md:hidden text-white p-2 hover:bg-red-600 rounded-full", children: _jsx(FaBars, {}) }), _jsx("h2", { className: "text-lg font-bold mb-4 ".concat(!isOpen && 'hidden'), children: "Admin Dashboard" }), _jsxs("ul", { className: "space-y-2 mt-8", children: [_jsx("li", { children: _jsxs(NavLink, { to: "/admin/dashboard", className: function (_a) {
                                var isActive = _a.isActive;
                                return "font-bold flex items-center p-2 rounded transition duration-300 transform hover:scale-105 shadow-md ".concat(isActive ? 'bg-red-600' : 'hover:bg-red-600');
                            }, children: [_jsx(FaTachometerAlt, { className: "mr-2" }), isOpen && _jsx("span", { children: "Dashboard" })] }) }), _jsx("li", { children: _jsxs(NavLink, { to: "/admin/sales_report", className: function (_a) {
                                var isActive = _a.isActive;
                                return "font-bold flex items-center p-2 rounded transition duration-300 transform hover:scale-105 shadow-md ".concat(isActive ? 'bg-red-600' : 'hover:bg-red-600');
                            }, children: [_jsx(FaFileAlt, { className: "mr-2" }), isOpen && _jsx("span", { children: "Report" })] }) }), _jsx("li", { children: _jsxs(NavLink, { to: "/admin/cars", className: function (_a) {
                                var isActive = _a.isActive;
                                return "font-bold flex items-center p-2 rounded transition duration-300 transform hover:scale-105 shadow-md ".concat(isActive ? 'bg-red-600' : 'hover:bg-red-600');
                            }, children: [_jsx(FaCar, { className: "mr-2" }), isOpen && _jsx("span", { children: "Cars" })] }) }), _jsx("li", { children: _jsxs(NavLink, { to: "/admin/users", className: function (_a) {
                                var isActive = _a.isActive;
                                return "font-bold flex items-center p-2 rounded transition duration-300 transform hover:scale-105 shadow-md ".concat(isActive ? 'bg-red-600' : 'hover:bg-red-600');
                            }, children: [_jsx(FaUser, { className: "mr-2" }), isOpen && _jsx("span", { children: "Users" })] }) }), _jsx("li", { children: _jsxs(NavLink, { to: "/admin/providers", className: function (_a) {
                                var isActive = _a.isActive;
                                return "font-bold flex items-center p-2 rounded transition duration-300 transform hover:scale-105 shadow-md ".concat(isActive ? 'bg-red-600' : 'hover:bg-red-600');
                            }, children: [_jsx(FaCog, { className: "mr-2" }), isOpen && _jsx("span", { children: "Providers" })] }) }), _jsx("li", { children: _jsxs(NavLink, { to: "/admin/notifications", className: function (_a) {
                                var isActive = _a.isActive;
                                return "font-bold flex items-center p-2 rounded transition duration-300 transform hover:scale-105 shadow-md ".concat(isActive ? 'bg-red-600' : 'hover:bg-red-600');
                            }, children: [_jsx(FaBell, { className: "mr-2" }), isOpen && _jsx("span", { children: "Notifications" })] }) }), _jsx("li", { children: _jsxs(NavLink, { to: "/admin/offers", className: function (_a) {
                                var isActive = _a.isActive;
                                return "font-bold flex items-center p-2 rounded transition duration-300 transform hover:scale-105 shadow-md ".concat(isActive ? 'bg-red-600' : 'hover:bg-red-600');
                            }, children: [_jsx(FaTags, { className: "mr-2" }), isOpen && _jsx("span", { children: "Offer" })] }) }), _jsx("li", { children: _jsxs(NavLink, { to: "/admin/booking", className: function (_a) {
                                var isActive = _a.isActive;
                                return "font-bold flex items-center p-2 rounded transition duration-300 transform hover:scale-105 shadow-md ".concat(isActive ? 'bg-red-600' : 'hover:bg-red-600');
                            }, children: [_jsx(FaCalendarAlt, { className: "mr-2" }), isOpen && _jsx("span", { children: "Booking" })] }) }), _jsx("li", { children: _jsxs(NavLink, { to: "/admin/coupon", className: function (_a) {
                                var isActive = _a.isActive;
                                return "font-bold flex items-center p-2 rounded transition duration-300 transform hover:scale-105 shadow-md ".concat(isActive ? 'bg-red-600' : 'hover:bg-red-600');
                            }, children: [_jsx(FaTicketAlt, { className: "mr-2" }), isOpen && _jsx("span", { children: "Coupon" })] }) })] })] }));
}
export default Sidebar;
