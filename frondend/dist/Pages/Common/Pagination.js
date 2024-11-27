import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
var Pagination = function (_a) {
    var currentPage = _a.currentPage, totalPages = _a.totalPages, onPageChange = _a.onPageChange;
    var handlePrev = function () {
        if (currentPage > 1) {
            onPageChange(currentPage - 1);
        }
    };
    var handleNext = function () {
        if (currentPage < totalPages) {
            onPageChange(currentPage + 1);
        }
    };
    return (_jsxs("div", { className: "flex items-center justify-center space-x-4 mt-6", children: [_jsx("button", { onClick: handlePrev, disabled: currentPage === 1, className: "px-4 py-2 rounded-lg transition ".concat(currentPage === 1
                    ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                    : 'bg-red-600 text-white hover:bg-red-700'), children: "\u00AB Previous" }), _jsxs("span", { className: "text-gray-700 font-semibold", children: ["Page ", _jsx("span", { className: "text-red-600", children: currentPage }), " of ", totalPages] }), _jsx("button", { onClick: handleNext, disabled: currentPage === totalPages, className: "px-4 py-2 rounded-lg transition ".concat(currentPage === totalPages
                    ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                    : 'bg-red-600 text-white hover:bg-red-700'), children: "Next \u00BB" })] }));
};
export default Pagination;
