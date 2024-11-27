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
import { useState, useEffect } from 'react';
import { FaCar, FaTag, FaCalendarAlt, FaPercent } from 'react-icons/fa';
import { useNavigate, useParams } from 'react-router-dom';
import { editOffer, updateOffer } from '../../Api/Admin';
var EditOffer = function (_a) {
    var header = _a.header;
    var navigate = useNavigate();
    var id = useParams().id;
    var _b = useState({
        carName: '',
        offerTitle: '',
        startDate: '',
        endDate: '',
        discountPercentage: ''
    }), formData = _b[0], setFormData = _b[1];
    var _c = useState({}), errors = _c[0], setErrors = _c[1];
    useEffect(function () {
        var fetchOfferData = function () { return __awaiter(void 0, void 0, void 0, function () {
            var response, fetchedData, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        if (!id) return [3 /*break*/, 2];
                        return [4 /*yield*/, editOffer(id)];
                    case 1:
                        response = _a.sent();
                        if (response === null || response === void 0 ? void 0 : response.data) {
                            fetchedData = response.data;
                            setFormData(__assign(__assign({}, fetchedData), { startDate: fetchedData.startDate ? new Date(fetchedData.startDate).toISOString().split('T')[0] : '', endDate: fetchedData.endDate ? new Date(fetchedData.endDate).toISOString().split('T')[0] : '' }));
                        }
                        _a.label = 2;
                    case 2: return [3 /*break*/, 4];
                    case 3:
                        error_1 = _a.sent();
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        }); };
        fetchOfferData();
    }, [id]);
    var handleInputChange = function (e) {
        var _a = e.target, name = _a.name, value = _a.value;
        setFormData(function (prevData) {
            var _a;
            return (__assign(__assign({}, prevData), (_a = {}, _a[name] = value, _a)));
        });
    };
    var validateForm = function () {
        var newErrors = {};
        if (!formData.carName)
            newErrors.carName = 'Car name is required';
        if (!formData.offerTitle)
            newErrors.offerTitle = 'Offer title is required';
        if (!formData.startDate)
            newErrors.startDate = 'Start date is required';
        if (!formData.endDate)
            newErrors.endDate = 'End date is required';
        if (new Date(formData.startDate) > new Date(formData.endDate)) {
            newErrors.endDate = 'End date cannot be before start date';
        }
        if (!formData.discountPercentage) {
            newErrors.discountPercentage = 'Discount percentage is required';
        }
        else if (Number(formData.discountPercentage) < 0 || Number(formData.discountPercentage) > 100) {
            newErrors.discountPercentage = 'Discount percentage must be between 0 and 100';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    var handleSubmit = function (e) { return __awaiter(void 0, void 0, void 0, function () {
        var result, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    e.preventDefault();
                    if (!validateForm()) return [3 /*break*/, 6];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 5, , 6]);
                    if (!id) return [3 /*break*/, 3];
                    return [4 /*yield*/, updateOffer(id, formData)];
                case 2:
                    result = _a.sent();
                    if (result === null || result === void 0 ? void 0 : result.data) {
                        navigate('/admin/offers');
                    }
                    return [3 /*break*/, 4];
                case 3:
                    console.warn("No ID found for updating the offer.");
                    _a.label = 4;
                case 4: return [3 /*break*/, 6];
                case 5:
                    error_2 = _a.sent();
                    console.error('Error updating offer:', error_2);
                    return [3 /*break*/, 6];
                case 6: return [2 /*return*/];
            }
        });
    }); };
    return (_jsx("div", { className: "flex justify-center items-center min-h-screen bg-gray-100", children: _jsxs("div", { className: "bg-white rounded-lg shadow-lg p-8 w-full max-w-md", children: [_jsx("h2", { className: "text-2xl font-bold text-red-600 text-center mb-6", children: "Edit Offer" }), _jsxs("form", { onSubmit: handleSubmit, children: [_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4 mb-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-gray-700 font-semibold mb-2", htmlFor: "carName", children: "Car Name" }), _jsxs("div", { className: "relative", children: [_jsx(FaCar, { className: "absolute top-1/2 transform -translate-y-1/2 left-3 text-gray-500" }), _jsx("input", { type: "text", id: "carName", name: "carName", value: formData.carName, onChange: handleInputChange, className: "w-full pl-10 py-2 border rounded-lg focus:outline-none focus:border-red-500 ".concat(errors.carName ? 'border-red-500' : ''), placeholder: "Enter car name", required: true })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-gray-700 font-semibold mb-2", htmlFor: "offerTitle", children: "Offer Title" }), _jsxs("div", { className: "relative", children: [_jsx(FaTag, { className: "absolute top-1/2 transform -translate-y-1/2 left-3 text-gray-500" }), _jsx("input", { type: "text", id: "offerTitle", name: "offerTitle", value: formData.offerTitle, onChange: handleInputChange, className: "w-full pl-10 py-2 border rounded-lg focus:outline-none focus:border-red-500 ".concat(errors.offerTitle ? 'border-red-500' : ''), placeholder: "Enter offer title", required: true })] })] })] }), _jsxs("div", { className: "mb-4", children: [_jsx("label", { className: "block text-gray-700 font-semibold mb-2", htmlFor: "startDate", children: "Start Date" }), _jsxs("div", { className: "relative", children: [_jsx(FaCalendarAlt, { className: "absolute top-1/2 transform -translate-y-1/2 left-3 text-gray-500" }), _jsx("input", { type: "date", id: "startDate", name: "startDate", value: formData.startDate, onChange: handleInputChange, className: "w-full pl-10 py-2 border rounded-lg focus:outline-none focus:border-red-500 ".concat(errors.startDate ? 'border-red-500' : ''), required: true })] })] }), _jsxs("div", { className: "mb-4", children: [_jsx("label", { className: "block text-gray-700 font-semibold mb-2", htmlFor: "endDate", children: "End Date" }), _jsxs("div", { className: "relative", children: [_jsx(FaCalendarAlt, { className: "absolute top-1/2 transform -translate-y-1/2 left-3 text-gray-500" }), _jsx("input", { type: "date", id: "endDate", name: "endDate", value: formData.endDate, onChange: handleInputChange, className: "w-full pl-10 py-2 border rounded-lg focus:outline-none focus:border-red-500 ".concat(errors.endDate ? 'border-red-500' : ''), required: true })] })] }), _jsxs("div", { className: "mb-6", children: [_jsx("label", { className: "block text-gray-700 font-semibold mb-2", htmlFor: "discountPercentage", children: "Discount Percentage" }), _jsxs("div", { className: "relative", children: [_jsx(FaPercent, { className: "absolute top-1/2 transform -translate-y-1/2 left-3 text-gray-500" }), _jsx("input", { type: "number", id: "discountPercentage", name: "discountPercentage", value: formData.discountPercentage, onChange: handleInputChange, min: "0", max: "100", className: "w-full pl-10 py-2 border rounded-lg focus:outline-none focus:border-red-500 ".concat(errors.discountPercentage ? 'border-red-500' : ''), placeholder: "Enter discount percentage", required: true })] })] }), _jsx("div", { className: "flex justify-end", children: _jsx("button", { type: "submit", className: "bg-gray-700 hover:bg-red-600 text-white font-semibold px-6 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500", children: "Update Offer" }) })] })] }) }));
};
export default EditOffer;
