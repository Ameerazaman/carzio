import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect } from 'react';
import Navbar from '../../Pages/Admin/Commons/Navbar'; // Adjust path if necessary
import Sidebar from '../../Pages/Admin/Commons/Sidebar'; // Adjust path if necessary
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import AdminDashboard from '../../Pages/Admin/AdminDashboard';
function Dashboard() {
    var admin = useSelector(function (state) { return state.admin.currentAdmin; });
    var navigate = useNavigate();
    useEffect(function () {
        if (admin) {
            navigate('/admin/dashboard');
        }
        else {
            navigate('/admin/login');
        }
    }, [admin, navigate]);
    return (_jsxs("div", { className: "flex min-h-screen", children: [_jsx("div", { children: _jsx(Sidebar, {}) }), _jsxs("div", { className: "flex-1 flex flex-col", children: [_jsx("div", { className: "bg-gray-900", children: _jsx(Navbar, {}) }), _jsxs("div", { className: "flex-1 p-4 lg:p-6 bg-gray-100 overflow-y-auto", children: [_jsx("h1", { className: "text-2xl font-bold mb-4 text-center lg:text-left", children: "Admin Dashboard" }), _jsx("div", { className: "bg-white rounded-lg shadow-md p-4", children: _jsx(AdminDashboard, {}) })] })] })] }));
}
export default Dashboard;
