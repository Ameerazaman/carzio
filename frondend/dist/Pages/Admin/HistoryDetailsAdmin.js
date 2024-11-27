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
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { FaCar, FaMapMarkerAlt } from 'react-icons/fa'; // Add react-icons
import Swal from 'sweetalert2';
import { specificBookingDetails, updateStatusOfBooking } from '../../Api/Admin';
function HistoryDetailsAdmin() {
    var _this = this;
    var _a = useState(null), bookingHistory = _a[0], setBookingHistory = _a[1];
    var _b = useState(true), loading = _b[0], setLoading = _b[1];
    var _c = useState(null), error = _c[0], setError = _c[1];
    var _d = useState(false), status = _d[0], setStatus = _d[1];
    var bookingId = useParams().bookingId;
    useEffect(function () {
        var fetchBookingHistory = function () { return __awaiter(_this, void 0, void 0, function () {
            var result, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!bookingId) return [3 /*break*/, 5];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        setLoading(true);
                        return [4 /*yield*/, specificBookingDetails(bookingId)];
                    case 2:
                        result = _a.sent();
                        setBookingHistory(result.data.data);
                        setLoading(false);
                        return [3 /*break*/, 4];
                    case 3:
                        error_1 = _a.sent();
                        setError("Error fetching booking history.");
                        setLoading(false);
                        return [3 /*break*/, 4];
                    case 4: return [3 /*break*/, 6];
                    case 5:
                        setLoading(false);
                        setError("Booking ID is missing.");
                        _a.label = 6;
                    case 6: return [2 /*return*/];
                }
            });
        }); };
        fetchBookingHistory();
    }, [status]);
    var handleStatusChange = function (newStatus) { return __awaiter(_this, void 0, void 0, function () {
        var error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setStatus(false);
                    if (!bookingId)
                        return [2 /*return*/];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, updateStatusOfBooking(bookingId, newStatus)];
                case 2:
                    _a.sent(); // Call your API with the new status
                    setStatus(true);
                    return [3 /*break*/, 4];
                case 3:
                    error_2 = _a.sent();
                    Swal.fire('Error', 'Failed to update booking status', 'error');
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    if (loading)
        return _jsx("div", { children: "Loading..." });
    if (error)
        return _jsx("div", { children: error });
    if (!bookingHistory)
        return _jsx("div", { children: "No booking history available." });
    return (_jsx("div", { className: "container mx-auto p-6", children: _jsx("div", { className: "max-w-4xl mx-auto bg-white shadow-2xl rounded-lg overflow-hidden", children: _jsxs("div", { className: "p-6 space-y-6", children: [_jsxs("div", { className: "flex justify-between items-center", children: [_jsxs("div", { children: [_jsxs("h2", { className: "text-xl font-semibold text-gray-800", children: ["Booking ID: #", bookingHistory._id] }), _jsxs("p", { className: "text-gray-600 flex items-center", children: [_jsx(FaCar, { className: "mr-2 text-red-500" }), "Car: ", _jsx("span", { className: "font-semibold", children: bookingHistory.bookingDetails.car_name })] })] }), _jsx("div", { className: "text-right", children: _jsxs("select", { className: "font-semibold p-2 rounded-lg shadow-md focus:outline-none\n                                 ".concat((bookingHistory === null || bookingHistory === void 0 ? void 0 : bookingHistory.status) === "Completed"
                                        ? "text-green-600 bg-green-100"
                                        : (bookingHistory === null || bookingHistory === void 0 ? void 0 : bookingHistory.status) === "Cancelled"
                                            ? "text-red-600 bg-red-100"
                                            : (bookingHistory === null || bookingHistory === void 0 ? void 0 : bookingHistory.status) === "Pending"
                                                ? "text-yellow-600 bg-yellow-100"
                                                : "text-gray-500 bg-gray-100"), value: bookingHistory === null || bookingHistory === void 0 ? void 0 : bookingHistory.status, onChange: function (e) { return handleStatusChange(e.target.value); }, children: [_jsx("option", { value: "Completed", disabled: (bookingHistory === null || bookingHistory === void 0 ? void 0 : bookingHistory.status) === "Completed", children: "Completed" }), _jsx("option", { value: "Cancelled", disabled: (bookingHistory === null || bookingHistory === void 0 ? void 0 : bookingHistory.status) === "Cancelled", children: "Cancelled" }), _jsx("option", { value: "Success", children: "Success" }), _jsx("option", { value: "Pending", children: "Pending" })] }) })] }), _jsxs("div", { className: "mb-6 flex justify-between items-start space-x-8", children: [_jsxs("div", { className: "w-1/3 pr-4", children: [_jsx("h3", { className: "text-gray-700 font-semibold mb-2", children: "User Address" }), _jsxs("div", { className: "ml-4 space-y-2", children: [_jsxs("p", { className: "text-gray-600 flex items-center", children: [_jsx(FaMapMarkerAlt, { className: "mr-2" }), "House: ", bookingHistory.userAddress.houseName] }), _jsxs("p", { className: "text-gray-600 flex items-center", children: [_jsx(FaMapMarkerAlt, { className: "mr-2" }), "Street: ", bookingHistory.userAddress.street] }), _jsxs("p", { className: "text-gray-600 flex items-center", children: [_jsx(FaMapMarkerAlt, { className: "mr-2" }), "City: ", bookingHistory.userAddress.city] }), _jsxs("p", { className: "text-gray-600 flex items-center", children: [_jsx(FaMapMarkerAlt, { className: "mr-2" }), "District: ", bookingHistory.userAddress.district] }), _jsxs("p", { className: "text-gray-600 flex items-center", children: [_jsx(FaMapMarkerAlt, { className: "mr-2" }), "State: ", bookingHistory.userAddress.state] }), _jsxs("p", { className: "text-gray-600 flex items-center", children: [_jsx(FaMapMarkerAlt, { className: "mr-2" }), "Zip: ", bookingHistory.userAddress.zip] })] })] }), _jsx("div", { className: "w-1/2", children: _jsx("img", { src: bookingHistory.bookingDetails.images[0] || "https://via.placeholder.com/600x400", alt: "Car", className: "w-full h-64 object-cover rounded-lg shadow-xl" }) })] }), _jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-6", children: [_jsxs("div", { className: "flex justify-between items-center", children: [_jsx("p", { className: "text-gray-700 font-semibold", children: "Issue Date:" }), _jsx("p", { className: "text-gray-600", children: bookingHistory.IssueDate })] }), _jsxs("div", { className: "flex justify-between items-center", children: [_jsx("p", { className: "text-gray-700 font-semibold", children: "Return Date:" }), _jsx("p", { className: "text-gray-600", children: bookingHistory.ReturnDate })] }), _jsxs("div", { className: "flex justify-between items-center", children: [_jsx("p", { className: "text-gray-700 font-semibold", children: "Amount:" }), _jsx("p", { className: "text-gray-600", children: bookingHistory.total_Amt })] }), _jsxs("div", { className: "flex justify-between items-center", children: [_jsx("p", { className: "text-gray-700 font-semibold", children: "Payment Method:" }), _jsx("p", { className: "text-gray-600", children: bookingHistory.Payment })] }), _jsxs("div", { className: "flex justify-between items-center", children: [_jsx("p", { className: "text-gray-700 font-semibold", children: "Rental Period:" }), _jsx("p", { className: "text-gray-600", children: bookingHistory.rentDays })] }), _jsxs("div", { className: "flex justify-between items-center", children: [_jsx("p", { className: "text-gray-700 font-semibold", children: "Pick-Up Time:" }), _jsx("p", { className: "text-gray-600", children: bookingHistory.PickUpTime })] })] })] }) }) }));
}
export default HistoryDetailsAdmin;
