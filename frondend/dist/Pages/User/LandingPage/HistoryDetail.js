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
import Swal from 'sweetalert2';
import { FaCar, FaMapMarkerAlt } from 'react-icons/fa';
import { cancelBookingByUser, checkBookidInReview, specificBookingDetails, storeCancelAmtToWallet } from '../../../Api/User';
import ReviewModal from './ReviewModal';
function HistoryDetail() {
    var _this = this;
    var _a = useState(null), bookingHistory = _a[0], setBookingHistory = _a[1];
    var _b = useState(true), loading = _b[0], setLoading = _b[1];
    var _c = useState(null), error = _c[0], setError = _c[1];
    var _d = useState(false), cancel = _d[0], setCancel = _d[1];
    var _e = useState(false), isReviewModalOpen = _e[0], setIsReviewModalOpen = _e[1];
    var bookingId = useParams().bookingId;
    useEffect(function () {
        var fetchBookingHistory = function () { return __awaiter(_this, void 0, void 0, function () {
            var result, result_1, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!bookingId) return [3 /*break*/, 7];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 5, , 6]);
                        setLoading(true);
                        return [4 /*yield*/, specificBookingDetails(bookingId)];
                    case 2:
                        result = _a.sent();
                        setBookingHistory(result.data.data);
                        if (!(result.data.data.status === "Completed")) return [3 /*break*/, 4];
                        return [4 /*yield*/, checkBookidInReview(bookingId)];
                    case 3:
                        result_1 = _a.sent();
                        if (!result_1.data.success) {
                            setIsReviewModalOpen(true);
                        }
                        _a.label = 4;
                    case 4:
                        setLoading(false);
                        return [3 /*break*/, 6];
                    case 5:
                        error_1 = _a.sent();
                        setError("Error fetching booking history.");
                        setLoading(false);
                        return [3 /*break*/, 6];
                    case 6: return [3 /*break*/, 8];
                    case 7:
                        setLoading(false);
                        setError("Booking ID is missing.");
                        _a.label = 8;
                    case 8: return [2 /*return*/];
                }
            });
        }); };
        fetchBookingHistory();
    }, [bookingId, cancel]);
    var handleCancelBooking = function () { return __awaiter(_this, void 0, void 0, function () {
        var _this = this;
        return __generator(this, function (_a) {
            Swal.fire({
                title: 'Are you sure?',
                text: 'Do you really want to cancel this booking?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#d33',
                cancelButtonColor: '#3085d6',
                confirmButtonText: 'Yes, cancel it!',
            }).then(function (result) { return __awaiter(_this, void 0, void 0, function () {
                var result_2;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!result.isConfirmed) return [3 /*break*/, 4];
                            if (!(bookingId && bookingHistory)) return [3 /*break*/, 4];
                            console.log(bookingId, "bookingId");
                            return [4 /*yield*/, cancelBookingByUser(bookingId, bookingHistory === null || bookingHistory === void 0 ? void 0 : bookingHistory.UserId, bookingHistory === null || bookingHistory === void 0 ? void 0 : bookingHistory.total_Amt)];
                        case 1:
                            _a.sent();
                            if (!(bookingHistory.Payment === "Wallet" || bookingHistory.Payment === "Online payment")) return [3 /*break*/, 3];
                            return [4 /*yield*/, storeCancelAmtToWallet(bookingHistory === null || bookingHistory === void 0 ? void 0 : bookingHistory.UserId, bookingHistory === null || bookingHistory === void 0 ? void 0 : bookingHistory.total_Amt)];
                        case 2:
                            result_2 = _a.sent();
                            _a.label = 3;
                        case 3:
                            setCancel(true);
                            Swal.fire('Cancelled!', 'Your booking has been cancelled.', 'success');
                            _a.label = 4;
                        case 4: return [2 /*return*/];
                    }
                });
            }); });
            return [2 /*return*/];
        });
    }); };
    if (loading)
        return _jsx("div", { children: "Loading..." });
    if (error)
        return _jsx("div", { children: error });
    if (!bookingHistory)
        return _jsx("div", { children: "No booking history available." });
    return (_jsxs("div", { className: "container mx-auto p-6", children: [_jsx("div", { className: "max-w-4xl mx-auto bg-white shadow-2xl rounded-lg overflow-hidden", children: _jsxs("div", { className: "p-6 space-y-6", children: [_jsxs("div", { className: "flex justify-between items-center", children: [_jsxs("div", { children: [_jsxs("h2", { className: "text-xl font-semibold text-gray-800", children: ["Booking ID: #", bookingHistory._id] }), _jsxs("p", { className: "text-gray-600 flex items-center", children: [_jsx(FaCar, { className: "mr-2 text-red-500" }), "Car: ", _jsx("span", { className: "font-semibold", children: bookingHistory.bookingDetails.car_name })] })] }), _jsx("div", { className: "text-right", children: _jsx("p", { className: "text-gray-600 flex items-center", children: _jsx("span", { className: "font-semibold ".concat(bookingHistory.status === "Completed" ? "text-green-500" : "text-yellow-500"), children: bookingHistory.status }) }) })] }), _jsxs("div", { className: "mb-6 flex justify-between items-start space-x-8", children: ["                         ", _jsxs("div", { className: "w-1/3 pr-4", children: [_jsx("h3", { className: "text-gray-700 font-semibold mb-2", children: "User Address" }), _jsxs("div", { className: "ml-4 space-y-2", children: [_jsxs("p", { className: "text-gray-600 flex items-center", children: [_jsx(FaMapMarkerAlt, { className: "mr-2" }), "House: ", bookingHistory.userAddress.houseName, "                                 "] }), _jsxs("p", { className: "text-gray-600 flex items-center", children: [_jsx(FaMapMarkerAlt, { className: "mr-2" }), "Street: ", bookingHistory.userAddress.street] }), _jsxs("p", { className: "text-gray-600 flex items-center", children: [_jsx(FaMapMarkerAlt, { className: "mr-2" }), "City: ", bookingHistory.userAddress.city] }), _jsxs("p", { className: "text-gray-600 flex items-center", children: [_jsx(FaMapMarkerAlt, { className: "mr-2" }), "District: ", bookingHistory.userAddress.district] }), _jsxs("p", { className: "text-gray-600 flex items-center", children: [_jsx(FaMapMarkerAlt, { className: "mr-2" }), "State: ", bookingHistory.userAddress.state] }), _jsxs("p", { className: "text-gray-600 flex items-center", children: [_jsx(FaMapMarkerAlt, { className: "mr-2" }), "                                     Zip: ", bookingHistory.userAddress.zip] })] })] }), _jsx("div", { className: "w-1/2", children: _jsx("img", { src: bookingHistory.bookingDetails.images[0] || "https://via.placeholder.com/600x400", alt: "Car", className: "w-full h-64 object-cover rounded-lg shadow-xl" }) })] }), _jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-6", children: [_jsxs("div", { className: "flex justify-between items-center", children: [_jsx("p", { className: "text-gray-700 font-semibold", children: "Issue Date:" }), _jsx("p", { className: "text-gray-600", children: bookingHistory.IssueDate })] }), _jsxs("div", { className: "flex justify-between items-center", children: [_jsx("p", { className: "text-gray-700 font-semibold", children: "Return Date:" }), _jsx("p", { className: "text-gray-600", children: bookingHistory.ReturnDate })] }), _jsxs("div", { className: "flex justify-between items-center", children: [_jsx("p", { className: "text-gray-700 font-semibold", children: "Amount:" }), _jsx("p", { className: "text-gray-600", children: bookingHistory.total_Amt })] }), _jsxs("div", { className: "flex justify-between items-center", children: [_jsx("p", { className: "text-gray-700 font-semibold", children: "Payment Method:" }), _jsx("p", { className: "text-gray-600", children: bookingHistory.Payment })] }), _jsxs("div", { className: "flex justify-between items-center", children: [_jsx("p", { className: "text-gray-700 font-semibold", children: "Rental Period:" }), _jsx("p", { className: "text-gray-600", children: bookingHistory.rentDays })] }), _jsxs("div", { className: "flex justify-between items-center", children: [_jsx("p", { className: "text-gray-700 font-semibold", children: "Pick-Up Time:" }), _jsx("p", { className: "text-gray-600", children: bookingHistory.PickUpTime })] })] }), _jsx("div", { className: "flex justify-end space-x-4", children: bookingHistory.status !== "Cancelled" && bookingHistory.status !== "Completed" ? (_jsx("button", { className: "bg-red-500 text-white py-2 px-6 rounded-lg shadow-md hover:bg-red-600 focus:outline-none transform transition duration-300 hover:scale-105", onClick: handleCancelBooking, children: "Cancel Booking" })) : null })] }) }), isReviewModalOpen && (_jsx(ReviewModal, { isOpen: isReviewModalOpen, onClose: function () { return setIsReviewModalOpen(false); }, bookingId: bookingId, carId: bookingHistory.bookingDetails._id }))] }));
}
export default HistoryDetail;
