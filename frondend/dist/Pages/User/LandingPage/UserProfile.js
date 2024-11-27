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
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { editProfile, checkProfile, saveProfileData } from '../../../Api/User';
import UserAddress from './UserAdress';
var UserProfile = function () {
    var user = useSelector(function (state) { return state.user.currentUser; });
    var _a = useState(false), isEditing = _a[0], setIsEditing = _a[1];
    var _b = useState({}), errors = _b[0], setErrors = _b[1];
    var _c = useState(''), profileId = _c[0], setProfileId = _c[1];
    var _d = useState(''), addressId = _d[0], setAddressId = _d[1];
    var _e = useState({
        name: '',
        email: '',
        phone: '',
        adharNo: '',
        gender: "",
        userId: user === null || user === void 0 ? void 0 : user._id
    }), profile = _e[0], setProfile = _e[1];
    useEffect(function () {
        var fetchProfile = function () { return __awaiter(void 0, void 0, void 0, function () {
            var result, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!user) return [3 /*break*/, 4];
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, checkProfile(user._id)];
                    case 2:
                        result = _b.sent();
                        if ((result === null || result === void 0 ? void 0 : result.status) === 200) {
                            setProfile(result.data);
                            setProfileId(result.data._id);
                            setIsEditing(true);
                        }
                        else {
                            setProfile({ name: '', email: '', phone: '', adharNo: '', gender: '', userId: undefined });
                            toast.error('No profile found. Please create a new profile.');
                        }
                        return [3 /*break*/, 4];
                    case 3:
                        _a = _b.sent();
                        toast.error('Error fetching profile data.');
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        }); };
        fetchProfile();
    }, [user]);
    var handleChange = function (e) {
        var _a = e.target, name = _a.name, value = _a.value;
        setProfile(function (prevProfile) {
            var _a;
            return (__assign(__assign({}, prevProfile), (_a = {}, _a[name] = value, _a)));
        });
    };
    var validateForm = function () {
        var newErrors = {};
        if (!profile.name) {
            newErrors.name = 'Name is required';
        }
        else if (!/^[a-zA-Z\s]+$/.test(profile.name)) {
            newErrors.name = 'Name should contain only letters and spaces';
        }
        if (!profile.email) {
            newErrors.email = 'Email is required';
        }
        else if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(profile.email)) {
            newErrors.email = 'Invalid email format';
        }
        if (!profile.phone) {
            newErrors.phone = 'Phone is required';
        }
        else if (!/^\d{10}$/.test(profile.phone)) {
            newErrors.phone = 'Phone number must be 10 digits';
        }
        if (!profile.gender)
            newErrors.gender = 'Gender selection is required';
        if (!profile.adharNo) {
            newErrors.adharNo = 'Aadhar number is required';
        }
        else if (!/^\d{12}$/.test(profile.adharNo)) {
            newErrors.adharNo = 'Aadhar number must be 12 digits';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    var handleAddressId = function (id) {
        setAddressId(id);
    };
    var saveProfile = function (e) { return __awaiter(void 0, void 0, void 0, function () {
        var formData, result, result, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    e.preventDefault();
                    if (!validateForm()) {
                        // toast.error('Please fill all fields correctly.');
                        return [2 /*return*/];
                    }
                    if (!user) {
                        toast.error('No provider data available.');
                        return [2 /*return*/];
                    }
                    formData = {
                        name: profile.name,
                        phone: profile.phone,
                        email: profile.email,
                        adharNo: profile.adharNo,
                        gender: profile.gender,
                        userId: user === null || user === void 0 ? void 0 : user._id
                    };
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 6, , 7]);
                    if (!isEditing) return [3 /*break*/, 3];
                    return [4 /*yield*/, editProfile(formData, profileId)];
                case 2:
                    result = _a.sent();
                    if (result) {
                        setIsEditing(true);
                        toast.success('Profile updated successfully.');
                    }
                    else {
                        toast.error('Failed to update profile.');
                    }
                    return [3 /*break*/, 5];
                case 3: return [4 /*yield*/, saveProfileData(formData)];
                case 4:
                    result = _a.sent();
                    setIsEditing(true);
                    if (result) {
                        toast.success('Profile saved successfully.');
                    }
                    else {
                        toast.error('Failed to save profile.');
                    }
                    _a.label = 5;
                case 5: return [3 /*break*/, 7];
                case 6:
                    error_1 = _a.sent();
                    toast.error('Error saving profile. Please try again.');
                    return [3 /*break*/, 7];
                case 7: return [2 /*return*/];
            }
        });
    }); };
    return (_jsxs("div", { className: "min-h-screen flex flex-col justify-center items-center bg-gray-100 pt-0", children: [_jsxs("div", { className: "bg-white p-6 rounded-lg shadow-lg flex w-full max-w-3xl mb-8", children: [_jsxs("div", { className: "flex-shrink-0 w-1/3 flex flex-col items-center", children: [_jsx("img", { src: "/images/fun-unique-cartoon-profile-picture-that-represents-your-style-personality_1283595-14223.avif", alt: "User Profile Cartoon", className: "w-24 h-24 rounded-full object-cover mb-4" }), _jsx("p", { className: "text-gray-700 text-sm", children: "Welcome back!" }), _jsx("p", { className: "text-gray-500 text-xs italic text-center mt-2", children: "\"A well-maintained profile opens doors to new opportunities.\"" })] }), _jsxs("div", { className: "flex-grow w-2/3", children: [_jsx("h1", { className: "text-xl font-bold mb-3 text-red-600", children: "User Profile" }), _jsxs("form", { onSubmit: saveProfile, children: [_jsxs("div", { className: "grid grid-cols-3 gap-4 text-sm text-gray-700", children: [_jsx("input", { type: "text", value: user === null || user === void 0 ? void 0 : user._id, style: { display: "none" } }), ['name', 'email', 'phone', 'adharNo'].map(function (field) { return (_jsxs("div", { className: "relative mb-4", children: [_jsx("input", { type: field === 'email' ? 'email' :
                                                            field === 'phone' ? 'tel' :
                                                                'text' // Default type
                                                        , name: field, value: profile[field], onChange: handleChange, placeholder: " ", className: "peer block w-full rounded-lg border border-gray-300 bg-transparent px-3 py-2 text-sm text-gray-900 focus:border-red-500 focus:outline-none focus:ring-0 ".concat(isEditing ? 'bg-white' : 'bg-gray-200', " ").concat(errors[field] ? 'border-red-500' : '') }), _jsx("label", { htmlFor: field, className: "absolute left-3 top-2.5 z-10 origin-[0] -translate-y-4 scale-75 transform select-none bg-white px-2 text-sm text-gray-500 transition-all peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4 peer-focus:text-red-500", children: field.charAt(0).toUpperCase() + field.slice(1) }), errors[field] && _jsx("p", { className: "text-xs text-red-500 mt-1", children: errors[field] })] }, field)); }), _jsxs("div", { className: "relative mb-4", children: [_jsxs("select", { name: "gender", value: profile.gender, onChange: function (e) { return handleChange(e); }, className: "peer block w-full rounded-lg border border-gray-300 bg-transparent px-3 py-2 text-sm text-gray-900 focus:border-red-500 focus:outline-none focus:ring-0 ".concat(isEditing ? 'bg-white' : 'bg-gray-200', " ").concat(errors.gender ? 'border-red-500' : ''), children: [_jsx("option", { value: "", disabled: true, hidden: true, children: "Choose Gender" }), _jsx("option", { value: "male", children: "Male" }), _jsx("option", { value: "female", children: "Female" }), _jsx("option", { value: "other", children: "Other" })] }), _jsx("label", { htmlFor: "gender", className: "absolute left-3 top-2.5 z-10 origin-[0] -translate-y-4 scale-75 transform select-none bg-white px-2 text-sm text-gray-500 transition-all peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4 peer-focus:text-red-500", children: "Gender" }), _jsx("br", {}), errors.gender && _jsx("p", { className: "text-xs text-red-500 mt-1", children: errors.gender })] })] }), _jsx("div", { className: "mt-4 flex justify-end", children: _jsx("button", { type: "submit", className: "bg-gray-900 text-white px-4 py-2 rounded text-sm hover:bg-gray-800 transition", children: isEditing ? 'Edit' : 'Save' }) })] })] })] }), _jsx("div", { children: _jsx(UserAddress, { onAddressIdChange: handleAddressId }) })] }));
};
export default UserProfile;
