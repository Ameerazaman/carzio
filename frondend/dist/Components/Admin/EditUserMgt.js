import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import Navbar from '../../Pages/Admin/Commons/Navbar';
import EditUser from '../../Pages/Admin/EditUser';
import Sidebar from '../../Pages/Provider/Sidebar';
function EditUserMgt() {
    var header = "user";
    return (_jsx("div", { children: _jsxs("div", { className: "flex", children: [_jsx(Sidebar, {}), _jsxs("div", { className: "flex-1 flex flex-col", children: [_jsx(Navbar, {}), _jsx("div", { className: "flex-1 p-6 bg-gray-100", children: _jsx(EditUser, { header: header }) })] })] }) }));
}
export default EditUserMgt;
