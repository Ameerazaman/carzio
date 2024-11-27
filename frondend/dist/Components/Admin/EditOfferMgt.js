import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import Sidebar from '../../Pages/Admin/Commons/Sidebar';
import Navbar from '../../Pages/Admin/Commons/Navbar';
import EditOffer from '../../Pages/Admin/EditOffer';
function EditOfferMgt() {
    var header = "offers";
    return (_jsx("div", { children: _jsxs("div", { className: "flex", children: [_jsx(Sidebar, {}), _jsxs("div", { className: "flex-1 flex flex-col", children: [_jsx(Navbar, {}), _jsx("div", { className: "flex-1 p-6 bg-gray-100", children: _jsx(EditOffer, { header: header }) })] })] }) }));
}
export default EditOfferMgt;
