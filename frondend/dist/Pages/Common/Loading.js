import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { FaCog } from 'react-icons/fa'; // Use FaCog as a steering wheel
function Loading() {
    return (_jsxs("div", { className: "flex flex-col items-center justify-center min-h-screen bg-white", children: [_jsx("div", { className: "relative flex items-center space-x-6", children: _jsx(FaCog, { className: "h-16 w-16 text-gray-900 animate-spin" }) }), _jsx("p", { className: "mt-12 text-lg font-semibold text-gray-900", children: "Loading your ride..." })] }));
}
export default Loading;
