import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import ChatHistory from '../../Pages/Provider/ChatHistory';
import Navbar from '../../Pages/Common/Navbar';
import Sidebar from '../../Pages/Provider/Sidebar';
function Chat() {
    return (_jsxs("div", { className: "flex flex-col h-screen", children: [_jsx(Navbar, {}), _jsxs("div", { className: "flex flex-grow", children: [_jsx(Sidebar, {}), _jsx("div", { className: "flex-1 p-6 bg-gray-100 overflow-y-auto", children: _jsx("div", { className: "overflow-x-auto bg-white rounded-lg shadow-md", children: _jsx(ChatHistory, {}) }) })] })] }));
}
export default Chat;
