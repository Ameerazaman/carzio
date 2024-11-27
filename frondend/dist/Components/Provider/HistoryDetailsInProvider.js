import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import HistoryDetailsProvider from '../../Pages/Provider/HistoryDetailsProvider';
import Sidebar from '../../Pages/Provider/Sidebar';
import Navbar from '../../Pages/Common/Navbar';
function HistoryDetailsInProvider() {
    return (_jsxs("div", { className: "flex flex-col h-screen", children: [_jsx(Navbar, {}), _jsxs("div", { className: "flex flex-grow", children: [_jsx(Sidebar, {}), _jsx("div", { className: "flex-grow pt-0 pb-0", children: _jsx(HistoryDetailsProvider, {}) })] })] }));
}
export default HistoryDetailsInProvider;
