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
import { useState } from "react";
import { FaStar } from "react-icons/fa";
import { createReviewAndRatings } from "../../../Api/User";
var ReviewModal = function (_a) {
    var isOpen = _a.isOpen, onClose = _a.onClose, bookingId = _a.bookingId, carId = _a.carId;
    var _b = useState(0), rating = _b[0], setRating = _b[1];
    var _c = useState(""), review = _c[0], setReview = _c[1];
    var _d = useState(null), hover = _d[0], setHover = _d[1];
    var handleSubmit = function () { return __awaiter(void 0, void 0, void 0, function () {
        var reviewData, result, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    if (!rating || !review.trim()) {
                        alert("Please add both a rating and a review.");
                        return [2 /*return*/];
                    }
                    reviewData = {
                        bookingId: bookingId,
                        rating: rating,
                        review: review,
                        carId: carId
                    };
                    return [4 /*yield*/, createReviewAndRatings(reviewData)];
                case 1:
                    result = _a.sent();
                    if (result) {
                        alert("Thank you for your review!");
                        onClose();
                    }
                    return [3 /*break*/, 3];
                case 2:
                    error_1 = _a.sent();
                    alert("Failed to submit your review. Please try again.");
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); };
    if (!isOpen)
        return null;
    return (_jsx("div", { className: "fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50", children: _jsxs("div", { className: "bg-white rounded-lg shadow-lg w-full max-w-md p-6", children: [_jsx("h2", { className: "text-xl font-semibold text-gray-900 mb-4", children: "Add Your Review" }), _jsxs("div", { className: "mb-4", children: [_jsx("label", { className: "block text-gray-700 font-medium mb-2", children: "Rating:" }), _jsx("div", { className: "flex", children: [1, 2, 3, 4, 5].map(function (star) { return (_jsx(FaStar, { size: 24, className: "cursor-pointer ".concat((hover || rating) >= star ? "text-yellow-500" : "text-gray-300"), onClick: function () { return setRating(star); }, onMouseEnter: function () { return setHover(star); }, onMouseLeave: function () { return setHover(null); } }, star)); }) })] }), _jsxs("div", { className: "mb-4", children: [_jsx("label", { className: "block text-gray-700 font-medium mb-2", children: "Review:" }), _jsx("textarea", { value: review, onChange: function (e) { return setReview(e.target.value); }, placeholder: "Write your review here...", className: "w-full border rounded-lg p-2 h-24 focus:ring focus:ring-red-500" })] }), _jsxs("div", { className: "flex justify-end space-x-4", children: [_jsx("button", { className: "px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 focus:outline-none", onClick: onClose, children: "Cancel" }), _jsx("button", { className: "px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 focus:outline-none", onClick: handleSubmit, children: "Submit" })] })] }) }));
};
export default ReviewModal;
