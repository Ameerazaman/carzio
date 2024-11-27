import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import Sidebar from '../../Pages/Admin/Commons/Sidebar';
import Navbar from '../../Pages/Admin/Commons/Navbar';
import EditCoupon from '../../Pages/Admin/EditCoupon';
function EditCouponMgt() {
    var header = "coupons";
    return (_jsx("div", { children: _jsxs("div", { className: "flex", children: [_jsx(Sidebar, {}), _jsxs("div", { className: "flex-1 flex flex-col", children: [_jsx(Navbar, {}), _jsx("div", { className: "flex-1 p-6 bg-gray-100", children: _jsx(EditCoupon, { header: header }) })] })] }) }));
}
export default EditCouponMgt;
