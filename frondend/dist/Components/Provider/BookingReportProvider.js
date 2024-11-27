var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import Pagination from "../../Pages/Common/Pagination";
import Report from "../../Pages/Common/Report";
import Sidebar from "../../Pages/Provider/Sidebar";
import Navbar from "../../Pages/Common/Navbar";
import { fetchSalesReport } from "../../Api/Provider";
import { useSelector } from "react-redux";
function BookingReportProvider() {
    var _this = this;
    var provider = useSelector(function (state) { return state.provider.currentProvider; });
    var _a = useState([]), tableData = _a[0], setTableData = _a[1];
    var _b = useState(true), loading = _b[0], setLoading = _b[1];
    var _c = useState(null), error = _c[0], setError = _c[1];
    var _d = useState(1), page = _d[0], setPage = _d[1];
    var _e = useState(1), totalPages = _e[0], setTotalPages = _e[1];
    var limit = 10;
    useEffect(function () {
        var fetchData = function () { return __awaiter(_this, void 0, void 0, function () {
            var result, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, 4, 5]);
                        setLoading(true);
                        setError(null);
                        if (!provider) return [3 /*break*/, 2];
                        return [4 /*yield*/, fetchSalesReport(page, limit, provider === null || provider === void 0 ? void 0 : provider._id)];
                    case 1:
                        result = _a.sent();
                        if (result === null || result === void 0 ? void 0 : result.data) {
                            setTableData(result.data || []); // Adjust as needed to match the API response structure
                            setTotalPages(result.data.totalPage || 1);
                        }
                        else {
                            setError("Sales report is not retrieved.");
                        }
                        _a.label = 2;
                    case 2: return [3 /*break*/, 5];
                    case 3:
                        error_1 = _a.sent();
                        setError("Failed to fetch the sales report.");
                        return [3 /*break*/, 5];
                    case 4:
                        setLoading(false);
                        return [7 /*endfinally*/];
                    case 5: return [2 /*return*/];
                }
            });
        }); };
        fetchData();
    }, [page, provider]);
    var handlePageChange = function (newPage) {
        if (newPage >= 1 && newPage <= totalPages) {
            setPage(newPage);
        }
    };
    return (_jsxs("div", { className: "flex flex-col h-screen", children: [_jsx(Navbar, {}), " ", _jsxs("div", { className: "flex flex-grow", children: [" ", _jsx(Sidebar, {}), _jsx("div", { className: "flex-1 p-6 bg-gray-100 overflow-y-auto", children: _jsx("div", { className: "overflow-x-auto bg-white rounded-lg shadow-md ", children: loading ? (_jsx("p", { className: "text-center py-4", children: "Loading..." })) : error ? (_jsxs("div", { className: "flex flex-col items-center justify-center min-h-[300px]", children: [_jsx("div", { className: "w-32 h-32 bg-red-200 rounded-full flex items-center justify-center animate-pulse", children: _jsx("svg", { xmlns: "http://www.w3.org/2000/svg", className: "h-16 w-16 text-red-500", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: 2, children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M12 3v18m9-9H3" }) }) }), _jsx("p", { className: "text-red-600 mt-4 text-lg font-semibold", children: error }), _jsx("p", { className: "text-gray-500 text-sm", children: "Please try refreshing or check back later." })] })) : tableData.length === 0 ? (_jsxs("div", { className: "flex flex-col items-center justify-center min-h-[300px]", children: [_jsx("div", { className: "w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center animate-bounce", children: _jsx("svg", { xmlns: "http://www.w3.org/2000/svg", className: "h-16 w-16 text-gray-400", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: 2, children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M8 16l-4-4m0 0l4-4m-4 4h16m-5 4l4-4m0 0l-4-4m4 4H3" }) }) }), _jsx("p", { className: "text-gray-600 mt-4 text-lg font-semibold", children: "No data available" }), _jsx("p", { className: "text-gray-500 text-sm", children: "Once bookings are made, they will appear here." })] })) : (_jsxs(_Fragment, { children: [_jsx(Report, { tableData: tableData }), _jsx(Pagination, { currentPage: page, totalPages: totalPages, onPageChange: handlePageChange })] })) }) })] })] }));
}
export default BookingReportProvider;
