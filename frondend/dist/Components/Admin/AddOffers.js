import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import Navbar from '../../Pages/Admin/Commons/Navbar';
import Sidebar from '../../Pages/Admin/Commons/Sidebar';
import AddOffer from '../../Pages/Admin/AddOffer';
function AddOffers() {
    return (_jsxs("div", { children: ["    ", _jsxs("div", { className: "flex", children: [_jsx(Sidebar, {}), _jsxs("div", { className: "flex-1 flex flex-col", children: [_jsx(Navbar, {}), _jsx("div", { className: "flex-1 bg-gray-100 overflow-y-auto", children: _jsx("div", { className: "overflow-x-auto bg-white rounded-lg shadow-md", children: _jsx(AddOffer, {}) }) })] })] })] }));
}
export default AddOffers;
