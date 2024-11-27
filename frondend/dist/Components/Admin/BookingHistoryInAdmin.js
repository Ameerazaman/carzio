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
import { useEffect, useState } from 'react';
import Navbar from '../../Pages/Admin/Commons/Navbar';
import Sidebar from '../../Pages/Admin/Commons/Sidebar';
import { getBookingHistory } from '../../Api/Admin'; // Adjusted for Admin API
import BookingHistoryAdmin from '../../Pages/Admin/BookingHistoryAdmin';
import Pagination from '../../Pages/Common/Pagination';
function BookingHistoryInAdmin() {
    var _this = this;
    var _a = useState([]), bookingHistory = _a[0], setBookingHistory = _a[1]; // Default to empty array
    var _b = useState(true), loading = _b[0], setLoading = _b[1];
    var _c = useState(null), error = _c[0], setError = _c[1];
    var _d = useState(1), page = _d[0], setPage = _d[1];
    var _e = useState(1), totalPages = _e[0], setTotalPages = _e[1];
    var limit = 10; // Adjusted limit for better pagination
    useEffect(function () {
        var fetchBookingHistory = function () { return __awaiter(_this, void 0, void 0, function () {
            var result, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        setLoading(true);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, 4, 5]);
                        return [4 /*yield*/, getBookingHistory(page, limit)];
                    case 2:
                        result = _a.sent();
                        // Check if result and result.data are defined, then handle booking history accordingly
                        if (result === null || result === void 0 ? void 0 : result.data) {
                            setBookingHistory(result.data.data || []); // Ensure bookingHistory is always an array
                            setTotalPages(result.data.totalPage || 1); // Set total pages dynamically
                        }
                        else {
                            setBookingHistory([]); // Default to empty array if no data
                            setTotalPages(1); // Default to 1 if no pages
                        }
                        return [3 /*break*/, 5];
                    case 3:
                        error_1 = _a.sent();
                        setError('Error fetching booking history.');
                        setBookingHistory([]); // Fallback to empty array in case of error
                        console.error('Error fetching booking history:', error_1);
                        return [3 /*break*/, 5];
                    case 4:
                        setLoading(false);
                        return [7 /*endfinally*/];
                    case 5: return [2 /*return*/];
                }
            });
        }); };
        fetchBookingHistory();
    }, [page]); // Fetch booking history whenever the page changes
    var handlePageChange = function (newPage) {
        if (newPage >= 1 && newPage <= totalPages) {
            setPage(newPage);
        }
    };
    return (_jsxs("div", { className: "flex flex-col h-screen", children: [_jsx(Navbar, {}), _jsxs("div", { className: "flex flex-grow", children: [_jsx(Sidebar, {}), _jsx("div", { className: "flex-grow p-4 overflow-y-auto", children: loading ? (_jsx("p", { className: "text-center py-4", children: "Loading..." })) : error ? (_jsx("p", { className: "text-center py-4 text-red-600", children: error })) : bookingHistory.length === 0 ? (_jsxs("div", { className: "flex flex-col items-center justify-center min-h-full animate-fade-in", children: [_jsx("div", { className: "text-2xl font-semibold text-gray-600 mb-4 animate-pulse", children: "No bookings available yet" }), _jsx("div", { className: "w-40 h-40 bg-gray-200 rounded-full flex items-center justify-center animate-bounce", children: _jsx("svg", { xmlns: "http://www.w3.org/2000/svg", className: "w-20 h-20 text-gray-400", viewBox: "0 0 20 20", fill: "currentColor", children: _jsx("path", { fillRule: "evenodd", d: "M4 3C4 2.44772 4.44772 2 5 2H15C15.5523 2 16 2.44772 16 3V17C16 17.5523 15.5523 18 15 18H5C4.44772 18 4 17.5523 4 17V3ZM5 4V16H15V4H5Z", clipRule: "evenodd" }) }) }), _jsx("p", { className: "text-lg text-gray-500 mt-4 animate-fade-in", children: "You haven't made any bookings yet. Once you do, they will show up here!" })] })) : (_jsxs(_Fragment, { children: [_jsx(BookingHistoryAdmin, { bookingHistory: bookingHistory }), _jsx(Pagination, { currentPage: page, totalPages: totalPages, onPageChange: handlePageChange })] })) })] })] }));
}
export default BookingHistoryInAdmin;
