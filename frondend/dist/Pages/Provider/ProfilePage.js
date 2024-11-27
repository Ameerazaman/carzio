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
import { useEffect, useState } from 'react';
import { editProfileData, getProfile, submitProfileData, updateProfileImage } from '../../Api/Provider';
import { toast } from 'react-hot-toast';
import { useSelector } from 'react-redux';
import { FaUpload } from 'react-icons/fa'; // Importing upload icon
var ProfilePage = function () {
    var provider = useSelector(function (state) { return state.provider.currentProvider; });
    var _a = useState(''), profileId = _a[0], setProfileId = _a[1];
    var _b = useState({
        name: '',
        email: '',
        phone: '',
        city: '',
        state: '',
        pinNumber: '',
        providerId: '',
        image: '', // Default image placeholder
    }), profile = _b[0], setProfile = _b[1];
    var _c = useState(false), isEditing = _c[0], setIsEditing = _c[1];
    var _d = useState({}), errors = _d[0], setErrors = _d[1];
    var _e = useState(null), selectedImage = _e[0], setSelectedImage = _e[1]; // Image file state
    // Fetch profile data when the component mounts or when provider changes
    useEffect(function () {
        var fetchProfile = function () { return __awaiter(void 0, void 0, void 0, function () {
            var result, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(provider && provider._id)) return [3 /*break*/, 4];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, getProfile(provider._id)];
                    case 2:
                        result = _a.sent();
                        if (result) {
                            setProfile(result.data);
                            setProfileId(result.data._id);
                            setIsEditing(true); // Assuming result.data contains the profile data
                        }
                        else {
                            toast.error('Failed to fetch profile data.');
                        }
                        return [3 /*break*/, 4];
                    case 3:
                        error_1 = _a.sent();
                        toast.error('Error fetching profile data.');
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        }); };
        fetchProfile();
    }, [provider, isEditing]);
    // Handle image change
    var handleImageChange = function (e) {
        if (e.target.files && e.target.files[0]) {
            var file = e.target.files[0];
            setSelectedImage(file); // Set the selected image as File
            // Create a preview of the image using FileReader
            var reader_1 = new FileReader();
            reader_1.onload = function () {
                setProfile(function (prevProfile) { return (__assign(__assign({}, prevProfile), { imageUrl: reader_1.result })); });
            };
            reader_1.readAsDataURL(file); // Convert file to base64
        }
    };
    // Handle form changes
    var handleChange = function (e) {
        var _a = e.target, name = _a.name, value = _a.value;
        setProfile(function (prevProfile) {
            var _a;
            return (__assign(__assign({}, prevProfile), (_a = {}, _a[name] = value, _a)));
        });
    };
    // Validation function
    var validateForm = function () {
        var newErrors = {};
        if (!profile.name)
            newErrors.name = 'Name is required';
        if (!profile.email)
            newErrors.email = 'Email is required';
        if (!profile.phone)
            newErrors.phone = 'Phone is required';
        if (!profile.city)
            newErrors.city = 'City is required';
        if (!profile.state)
            newErrors.state = 'State is required';
        if (!profile.pinNumber)
            newErrors.pinNumber = 'Pin Number is required';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    //******** */ update image*****************
    var updateImage = function () { return __awaiter(void 0, void 0, void 0, function () {
        var formData, result, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!selectedImage) {
                        toast.error('Please select an image to upload.');
                        return [2 /*return*/];
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    formData = new FormData();
                    formData.append('image', selectedImage); // 'image' should match the backend field name
                    return [4 /*yield*/, updateProfileImage(formData, profileId)];
                case 2:
                    result = _a.sent();
                    if (result) {
                        toast.success('Image updated successfully.');
                    }
                    else {
                        toast.error('Failed to update the image.');
                    }
                    return [3 /*break*/, 4];
                case 3:
                    error_2 = _a.sent();
                    toast.error('Error updating image. Please try again.');
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    // Handle form submit
    var saveProfile = function (e) { return __awaiter(void 0, void 0, void 0, function () {
        var formData, result, result, error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    e.preventDefault();
                    // Validate form before proceeding
                    if (!validateForm()) {
                        toast.error('Please fill all fields correctly.');
                        return [2 /*return*/];
                    }
                    if (!provider) {
                        toast.error('No provider data available.');
                        return [2 /*return*/];
                    }
                    formData = {
                        name: profile.name,
                        phone: profile.phone,
                        city: profile.city,
                        state: profile.state,
                        pinNumber: profile.pinNumber,
                        email: profile.email,
                        providerId: provider._id,
                        image: profile.image, // Include image URL in form data
                    };
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 6, , 7]);
                    if (!isEditing) return [3 /*break*/, 3];
                    return [4 /*yield*/, editProfileData(formData, profileId)];
                case 2:
                    result = _a.sent();
                    if (result) {
                        toast.success('Profile updated successfully.');
                    }
                    else {
                        toast.error('Failed to update profile.');
                    }
                    return [3 /*break*/, 5];
                case 3: return [4 /*yield*/, submitProfileData(formData)];
                case 4:
                    result = _a.sent();
                    if (result) {
                        toast.success('Profile saved successfully.');
                    }
                    else {
                        toast.error('Failed to save profile.');
                    }
                    _a.label = 5;
                case 5: return [3 /*break*/, 7];
                case 6:
                    error_3 = _a.sent();
                    toast.error('Error saving profile. Please try again.');
                    return [3 /*break*/, 7];
                case 7: return [2 /*return*/];
            }
        });
    }); };
    return (_jsxs("div", { className: "min-h-screen flex flex-col justify-center items-center bg-gray-100 pt-0", children: [_jsxs("div", { className: "bg-white p-6 rounded-lg shadow-lg flex w-full max-w-3xl mb-8", children: [_jsxs("div", { className: "flex-shrink-0 w-1/3 flex flex-col items-center", children: [_jsx("div", { className: "w-32 h-32 rounded-full bg-gray-500 overflow-hidden mb-4", children: _jsx("img", { src: profile.image, alt: "Profile", className: "w-full h-full object-cover" }) }), _jsxs("div", { className: "mt-2 w-full text-center flex items-center justify-center gap-2", children: [_jsx("input", { type: "file", accept: "image/*", onChange: handleImageChange, className: "w-3/4 text-xs text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none p-1" }), _jsxs("button", { type: "button", onClick: updateImage, className: "text-red-500 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-75", children: [_jsx(FaUpload, { size: 20 }), " "] }), selectedImage && (_jsxs("p", { className: "text-xs text-gray-500 mt-1 w-full text-left", children: ["Image selected: ", selectedImage.name] }))] })] }), _jsxs("div", { className: "flex-grow w-2/3", children: [_jsx("h1", { className: "text-xl font-bold mb-3 text-red-600", children: "Provider Profile" }), _jsxs("form", { onSubmit: saveProfile, children: [_jsx("div", { className: "grid grid-cols-3 gap-4 text-sm text-gray-700", children: ['name', 'email', 'phone', 'city', 'state', 'pinNumber'].map(function (field) { return (_jsxs("div", { className: "relative mb-4", children: [_jsx("input", { type: field === 'email' ? 'email' : 'text', name: field, value: profile[field], onChange: handleChange, placeholder: " ", className: "peer block w-full rounded-lg border border-gray-300 bg-transparent px-3 py-2 text-sm text-gray-900 focus:border-red-500 focus:outline-none focus:ring-0 ".concat(isEditing ? 'bg-white' : 'bg-gray-200', " ").concat(errors[field] ? 'border-red-500' : '') }), _jsx("label", { htmlFor: field, className: "absolute left-3 top-2.5 z-10 origin-[0] -translate-y-4 scale-75 transform select-none bg-white px-2 text-sm text-gray-500 transition-all peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4 peer-focus:text-red-500", children: field.charAt(0).toUpperCase() + field.slice(1) }), errors[field] && _jsx("p", { className: "text-xs text-red-500 mt-1", children: errors[field] })] }, field)); }) }), _jsx("div", { className: "mt-4 flex justify-end", children: _jsx("button", { type: "submit", className: "bg-gray-900 text-white px-4 py-2 rounded text-sm hover:bg-gray-800 transition", children: isEditing ? 'Edit' : 'Save' }) })] })] })] }), _jsxs("div", { className: "bg-white p-6 rounded-lg shadow-lg w-full max-w-3xl flex items-center", children: [_jsxs("div", { className: "w-2/3 pr-6", children: [_jsx("h2", { className: "text-lg font-bold text-gray-900 mb-4", children: "Do you want to earn from this app?" }), _jsx("p", { className: "text-gray-700 mb-6", children: "Please add your car details here to start renting it out." }), _jsx("div", { className: "flex justify-center", children: _jsx("a", { href: "/provider/add_car", children: _jsx("button", { className: "bg-red-600 text-white px-6 py-3 rounded-lg text-sm hover:bg-red-700 transition", children: "Add Car Details" }) }) })] }), _jsx("div", { className: "w-1/3", children: _jsx("img", { src: "/images/Rent-a-car.jpeg", alt: "Car Image", className: "w-full h-full object-cover rounded-lg" }) })] })] }));
};
export default ProfilePage;
