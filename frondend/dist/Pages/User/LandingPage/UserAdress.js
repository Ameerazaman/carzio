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
import React, { useEffect, useState } from 'react';
import { editAddress, checkAddress, saveAddressData } from '../../../Api/User';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';
function UserAddress(_a) {
    var _this = this;
    var onAddressIdChange = _a.onAddressIdChange;
    var user = useSelector(function (state) { return state.user.currentUser; });
    var _b = useState(''), addressId = _b[0], setAddressId = _b[1];
    var _c = useState(false), isEditingAddress = _c[0], setIsEditingAddress = _c[1];
    var _d = useState({
        houseName: '',
        street: '',
        city: '',
        state: '',
        district: '',
        zip: '',
        userId: (user === null || user === void 0 ? void 0 : user._id) || ''
    }), currentAddress = _d[0], setCurrentAddress = _d[1];
    var _e = useState({}), addressErrors = _e[0], setAddressErrors = _e[1];
    useEffect(function () {
        var fetchProfile = function () { return __awaiter(_this, void 0, void 0, function () {
            var response, addressData, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, checkAddress((user === null || user === void 0 ? void 0 : user._id) || '')];
                    case 1:
                        response = _b.sent();
                        if ((response === null || response === void 0 ? void 0 : response.status) === 200) {
                            addressData = response.data.data;
                            setCurrentAddress(addressData);
                            setAddressId(addressData._id);
                            setIsEditingAddress(true);
                            onAddressIdChange(addressData._id);
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        _a = _b.sent();
                        toast.error('Error fetching address data.');
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); };
        if ((user === null || user === void 0 ? void 0 : user._id) && !addressId) {
            fetchProfile();
        }
    }, [user === null || user === void 0 ? void 0 : user._id, addressId, onAddressIdChange]);
    var handleAddressChange = function (e) {
        var _a = e.target, name = _a.name, value = _a.value;
        setCurrentAddress(function (prev) {
            var _a;
            return (__assign(__assign({}, prev), (_a = {}, _a[name] = value, _a)));
        });
        if (addressErrors[name]) {
            setAddressErrors(function (prev) {
                var _a;
                return (__assign(__assign({}, prev), (_a = {}, _a[name] = '', _a)));
            });
        }
    };
    var validateAddress = function () {
        var newErrors = {};
        if (!currentAddress.houseName)
            newErrors.houseName = 'House Name is required';
        if (!currentAddress.street)
            newErrors.street = 'Street is required';
        if (!currentAddress.city)
            newErrors.city = 'City is required';
        if (!currentAddress.state)
            newErrors.state = 'State is required';
        if (!currentAddress.district)
            newErrors.district = 'District is required';
        if (!currentAddress.zip || !/^\d{5,6}$/.test(currentAddress.zip)) {
            newErrors.zip = 'ZIP should be 5 or 6 digits';
        }
        setAddressErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    var saveAddress = function (e) { return __awaiter(_this, void 0, void 0, function () {
        var formData, result, _a, newAddressId, error_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    e.preventDefault();
                    if (!validateAddress()) {
                        toast.error('Please fill all fields correctly.');
                        return [2 /*return*/];
                    }
                    formData = __assign({}, currentAddress);
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 6, , 7]);
                    if (!isEditingAddress) return [3 /*break*/, 3];
                    return [4 /*yield*/, editAddress(formData, addressId)];
                case 2:
                    _a = _b.sent();
                    return [3 /*break*/, 5];
                case 3: return [4 /*yield*/, saveAddressData(formData)];
                case 4:
                    _a = _b.sent();
                    _b.label = 5;
                case 5:
                    result = _a;
                    if ((result === null || result === void 0 ? void 0 : result.status) === 200) {
                        if (!isEditingAddress) {
                            newAddressId = result.data._id;
                            setAddressId(newAddressId);
                            onAddressIdChange(newAddressId);
                            setIsEditingAddress(true);
                        }
                    }
                    else {
                        toast.error('Failed to save address.');
                    }
                    return [3 /*break*/, 7];
                case 6:
                    error_1 = _b.sent();
                    console.error('Error saving address:', error_1);
                    toast.error('Error saving address. Please try again.');
                    return [3 /*break*/, 7];
                case 7: return [2 /*return*/];
            }
        });
    }); };
    return (_jsxs("div", { className: "bg-white p-6 rounded-lg shadow-lg w-full max-w-3xl mb-8", children: [_jsx("h1", { className: "text-xl font-bold mb-3 text-red-600", children: "Manage Address" }), _jsxs("form", { onSubmit: saveAddress, children: [_jsx("div", { className: "grid grid-cols-3 gap-4 text-sm text-gray-700", children: ['houseName', 'street', 'city', 'state', 'district', 'zip'].map(function (field) { return (_jsxs("div", { className: "relative mb-4", children: [_jsx("input", { type: "text", name: field, value: currentAddress[field] || '', onChange: handleAddressChange, placeholder: " ", className: "peer block w-full rounded-lg border border-gray-300 bg-transparent px-3 py-2 text-sm text-gray-900 focus:border-red-500 focus:outline-none focus:ring-0 ".concat(isEditingAddress ? 'bg-white' : 'bg-gray-200', " ").concat(addressErrors[field] ? 'border-red-500' : '') }), _jsx("label", { htmlFor: field, className: "absolute left-3 top-2.5 z-10 origin-[0] -translate-y-4 scale-75 transform select-none bg-white px-2 text-sm text-gray-500 transition-all peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4 peer-focus:text-red-500", children: field.charAt(0).toUpperCase() + field.slice(1) }), addressErrors[field] && _jsx("p", { className: "text-xs text-red-500 mt-1", children: addressErrors[field] })] }, field)); }) }), _jsx("div", { className: "mt-4 flex justify-end", children: _jsx("button", { type: "submit", className: "bg-gray-900 text-white px-4 py-2 rounded text-sm hover:bg-gray-800 transition", children: isEditingAddress ? 'Edit' : 'Save' }) })] })] }));
}
export default React.memo(UserAddress);
