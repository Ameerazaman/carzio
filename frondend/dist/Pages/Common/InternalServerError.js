import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { AiOutlineWarning } from 'react-icons/ai'; // React Icon for error
var InternalServerError = function () {
    return (_jsxs("div", { className: "min-h-screen flex flex-col justify-center items-center bg-gray-900 text-white", children: [_jsx(AiOutlineWarning, { className: "text-7xl text-red-500 animate-bounce mb-4" }), _jsx("h1", { className: "text-4xl font-bold mb-2", children: "500 - Internal Server Error" }), _jsx("p", { className: "text-lg text-gray-400 mb-6", children: "Oops! Something went wrong on our end. Please try again later." }), _jsx("button", { onClick: function () { return window.location.reload(); }, className: "px-6 py-3 bg-red-600 text-white rounded-md shadow-md hover:bg-red-700 transition-all duration-300 ease-in-out transform hover:scale-105", children: "Refresh Page" })] }));
};
export default InternalServerError;
