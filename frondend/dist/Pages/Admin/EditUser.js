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
import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { editProvider, editUser, updateProvider, updateUser } from '../../Api/Admin';
import { useParams, useNavigate } from 'react-router-dom';
var EditUser = function (_a) {
    var header = _a.header;
    var id = useParams().id; // Extracting `id` from URL params
    var navigate = useNavigate();
    var _b = useState({
        username: '',
        email: '',
        password: ''
    }), formData = _b[0], setFormData = _b[1];
    var _c = useState({
        username: '',
        email: '',
        password: ''
    }), errors = _c[0], setErrors = _c[1];
    useEffect(function () {
        var fetchUserData = function () { return __awaiter(void 0, void 0, void 0, function () {
            var result, userData, error_1, result, providerData, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(header === 'user')) return [3 /*break*/, 6];
                        if (!id) return [3 /*break*/, 5];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, editUser(id)];
                    case 2:
                        result = _a.sent();
                        userData = result === null || result === void 0 ? void 0 : result.data;
                        setFormData({
                            username: (userData === null || userData === void 0 ? void 0 : userData.username) || '',
                            email: (userData === null || userData === void 0 ? void 0 : userData.email) || '',
                            password: '' // Keep password empty for security reasons
                        });
                        return [3 /*break*/, 4];
                    case 3:
                        error_1 = _a.sent();
                        return [3 /*break*/, 4];
                    case 4: return [3 /*break*/, 5];
                    case 5: return [3 /*break*/, 12];
                    case 6:
                        if (!id) return [3 /*break*/, 11];
                        _a.label = 7;
                    case 7:
                        _a.trys.push([7, 9, , 10]);
                        return [4 /*yield*/, editProvider(id)];
                    case 8:
                        result = _a.sent();
                        console.log(result, "result"); // Ensure 'id' is defined
                        providerData = result === null || result === void 0 ? void 0 : result.data;
                        // Setting the formData with the fetched user data
                        setFormData({
                            username: (providerData === null || providerData === void 0 ? void 0 : providerData.username) || '',
                            email: (providerData === null || providerData === void 0 ? void 0 : providerData.email) || '',
                            password: '' // Keep password empty for security reasons
                        });
                        return [3 /*break*/, 10];
                    case 9:
                        error_2 = _a.sent();
                        console.error('Error fetching user data:', error_2);
                        return [3 /*break*/, 10];
                    case 10: return [3 /*break*/, 12];
                    case 11:
                        console.error('No user ID provided.');
                        _a.label = 12;
                    case 12: return [2 /*return*/];
                }
            });
        }); };
        fetchUserData();
    }, [id]); // Re-run the effect if 'id' changes
    var validateForm = function () {
        var newErrors = { username: '', email: '', password: '' };
        var isValid = true;
        if (!formData.username) {
            newErrors.username = 'Username is required.';
            isValid = false;
        }
        if (!formData.email) {
            newErrors.email = 'Email is required.';
            isValid = false;
        }
        else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email address is invalid.';
            isValid = false;
        }
        setErrors(newErrors);
        return isValid;
    };
    var handleChange = function (e) {
        var _a = e.target, name = _a.name, value = _a.value;
        setFormData(function (prevState) {
            var _a;
            return (__assign(__assign({}, prevState), (_a = {}, _a[name] = value, _a)));
        });
        setErrors(function (prevErrors) {
            var _a;
            return (__assign(__assign({}, prevErrors), (_a = {}, _a[name] = '', _a)));
        });
    };
    var handleSubmit = function (e) { return __awaiter(void 0, void 0, void 0, function () {
        var result, error_3, result, error_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    e.preventDefault();
                    if (!(validateForm() && id)) return [3 /*break*/, 9];
                    if (!(header === 'user')) return [3 /*break*/, 5];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, updateUser(formData, id)];
                case 2:
                    result = _a.sent();
                    // Check if the update was successful, then navigate
                    if (result) {
                        navigate("/admin/users"); // Correcting the route
                    }
                    console.log('Submitted data:', formData);
                    return [3 /*break*/, 4];
                case 3:
                    error_3 = _a.sent();
                    console.error("Error updating user:", error_3);
                    return [3 /*break*/, 4];
                case 4: return [3 /*break*/, 8];
                case 5:
                    _a.trys.push([5, 7, , 8]);
                    return [4 /*yield*/, updateProvider(formData, id)];
                case 6:
                    result = _a.sent();
                    // Check if the update was successful, then navigate
                    if (result) {
                        navigate("/admin/providers"); // Correcting the route
                    }
                    console.log('Submitted data:', formData);
                    return [3 /*break*/, 8];
                case 7:
                    error_4 = _a.sent();
                    console.error("Error updating user:", error_4);
                    return [3 /*break*/, 8];
                case 8: return [3 /*break*/, 10];
                case 9:
                    console.error('User ID is not provided.');
                    _a.label = 10;
                case 10: return [2 /*return*/];
            }
        });
    }); };
    return (_jsxs("div", { className: "edit-user-form max-w-md mx-auto p-4 bg-white shadow-lg rounded-lg", children: [_jsxs("h2", { className: "text-xl font-bold mb-4", children: ["Edit ", header] }), _jsxs("form", { onSubmit: handleSubmit, children: [_jsxs("div", { className: "mb-4", children: [_jsx("label", { className: "block text-sm font-medium text-gray-700", children: "Username:" }), _jsx("input", { type: "text", name: "username", value: formData.username, onChange: handleChange, placeholder: "Enter username", className: "mt-1 block w-full border rounded-md p-2 ".concat(errors.username ? 'border-red-500' : 'border-gray-300') }), errors.username && _jsx("p", { className: "text-red-500 text-xs mt-1", children: errors.username })] }), _jsxs("div", { className: "mb-4", children: [_jsx("label", { className: "block text-sm font-medium text-gray-700", children: "Email:" }), _jsx("input", { type: "email", name: "email", value: formData.email, onChange: handleChange, placeholder: "Enter email", className: "mt-1 block w-full border rounded-md p-2 ".concat(errors.email ? 'border-red-500' : 'border-gray-300') }), errors.email && _jsx("p", { className: "text-red-500 text-xs mt-1", children: errors.email })] }), _jsx("button", { type: "submit", className: "w-full bg-red-500 text-white p-2 rounded-md hover:bg-blue-600 transition duration-200", children: "Save Changes" })] })] }));
};
export default EditUser;
