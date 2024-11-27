import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import Navbar from '../../Pages/Admin/Commons/Navbar';
import Sidebar from '../../Pages/Admin/Commons/Sidebar';
import AddCoupon from '../../Pages/Admin/AddCoupon';
function AddCoupons() {
    return (_jsxs("div", { children: ["    ", _jsxs("div", { className: "flex", children: [_jsx(Navbar, {}), _jsxs("div", { className: "flex-1 flex flex-col", children: [_jsx(Sidebar, {}), _jsx("div", { className: "flex-1 bg-gray-100 overflow-y-auto", children: _jsx("div", { className: "overflow-x-auto bg-white  rounded-lg shadow-md pt-4 mt-5", children: _jsx(AddCoupon, {}) }) })] })] })] }));
}
export default AddCoupons;
