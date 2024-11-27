var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
import { useState } from 'react';
import { createCoupon } from '../../Api/Admin';
import { useNavigate } from 'react-router-dom';
var AddCoupon = function () {
    var navigate = useNavigate();
    var _a = useState({
        discountPercentage: 0,
        maxDiscountAmount: 0,
        minRentalAmount: 0,
        startDate: '',
        endDate: '',
        isActive: true,
        userId: '',
        maxUsageLimit: 0,
    }), formData = _a[0], setFormData = _a[1];
    var _b = useState({}), errors = _b[0], setErrors = _b[1];
    var handleChange = function (e) {
        var _a = e.target, name = _a.name, value = _a.value, type = _a.type;
        var checked = e.target.checked;
        setFormData(function (prevState) {
            var _a;
            return (__assign(__assign({}, prevState), (_a = {}, _a[name] = type === 'checkbox' ? checked : value, _a)));
        });
    };
    var validate = function () {
        var newErrors = {};
        if (formData.discountPercentage <= 0)
            newErrors.discountPercentage = "Discount percentage must be greater than zero.";
        if (!formData.startDate)
            newErrors.startDate = "Start date is required.";
        if (!formData.minRentalAmount)
            newErrors.minRentalAmount = "Min rental amount is required.";
        if (!formData.endDate)
            newErrors.endDate = "End date is required.";
        if (formData.endDate < formData.startDate)
            newErrors.endDate = "End date must be after start date.";
        // Validation for Max Discount Amount
        if (formData.maxDiscountAmount < 0) {
            newErrors.maxDiscountAmount = "Max discount amount cannot be less than zero.";
        }
        // Validation for Min Rental Amount
        if (formData.minRentalAmount < 0) {
            newErrors.minRentalAmount = "Min rental amount cannot be less than zero.";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    var handleSubmit = function (e) { return __awaiter(void 0, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    e.preventDefault();
                    if (!validate()) return [3 /*break*/, 2];
                    return [4 /*yield*/, createCoupon(formData)];
                case 1:
                    result = _a.sent();
                    if (result) {
                        navigate('/admin/coupon');
                    }
                    _a.label = 2;
                case 2: return [2 /*return*/];
            }
        });
    }); };
    return (_jsxs("form", { onSubmit: handleSubmit, className: "p-4 max-w-sm mx-auto bg-white shadow-lg rounded", children: [_jsx("h2", { className: "text-lg font-bold mb-3 text-center", children: "Create Coupon" }), _jsxs("div", { className: "mb-3", children: [_jsx("label", { className: "block text-gray-700", children: "Discount Percentage" }), _jsx("input", { type: "number", name: "discountPercentage", placeholder: "Enter discount percentage", onChange: handleChange, className: "w-full px-2 py-1 border rounded ".concat(errors.discountPercentage ? 'border-red-500' : 'border-gray-300') }), errors.discountPercentage && _jsx("p", { className: "text-red-500 text-sm", children: errors.discountPercentage })] }), _jsx("div", { className: "flex space-x-2 mb-3", children: _jsxs("div", { className: "flex-1", children: [_jsx("label", { className: "block text-gray-700", children: "Min Rental Amount" }), _jsx("input", { type: "number", name: "minRentalAmount", placeholder: "Enter min rental amount", onChange: handleChange, className: "w-full px-2 py-1 border rounded ".concat(errors.minRentalAmount ? 'border-red-500' : 'border-gray-300') }), errors.minRentalAmount && _jsx("p", { className: "text-red-500 text-sm", children: errors.minRentalAmount })] }) }), _jsxs("div", { className: "mb-3", children: [_jsx("label", { className: "block text-gray-700", children: "Start Date" }), _jsx("input", { type: "date", name: "startDate", placeholder: "Select start date", onChange: handleChange, className: "w-full px-2 py-1 border rounded ".concat(errors.startDate ? 'border-red-500' : 'border-gray-300') }), errors.startDate && _jsx("p", { className: "text-red-500 text-sm", children: errors.startDate })] }), _jsxs("div", { className: "mb-3", children: [_jsx("label", { className: "block text-gray-700", children: "End Date" }), _jsx("input", { type: "date", name: "endDate", placeholder: "Select end date", onChange: handleChange, className: "w-full px-2 py-1 border rounded ".concat(errors.endDate ? 'border-red-500' : 'border-gray-300') }), errors.endDate && _jsx("p", { className: "text-red-500 text-sm", children: errors.endDate })] }), _jsx("button", { type: "submit", className: "w-full bg-blue-500 text-white py-2 rounded", children: "Submit" })] }));
};
export default AddCoupon;
