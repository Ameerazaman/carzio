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
import { AiOutlineCar } from 'react-icons/ai';
import { BiDetail } from 'react-icons/bi';
import { GiPriceTag } from 'react-icons/gi';
import { BsFuelPump } from 'react-icons/bs';
import { FaRegCalendarAlt } from 'react-icons/fa';
import { editCar, editCarDetails, editCarImage } from '../../Api/Provider';
import { useNavigate, useParams } from 'react-router-dom';
var EditCar = function () {
    var id = useParams().id; // Extracting `id` from URL params
    useEffect(function () {
        var fetchCarData = function () { return __awaiter(void 0, void 0, void 0, function () {
            var result, carData, formatDate, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!id) return [3 /*break*/, 5];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, editCar(id)];
                    case 2:
                        result = _a.sent();
                        carData = result === null || result === void 0 ? void 0 : result.data;
                        formatDate = function (dateString) {
                            var date = new Date(dateString);
                            return date.toISOString().split('T')[0]; // Formats to YYYY-MM-DD
                        };
                        setFormData({
                            car_name: (carData === null || carData === void 0 ? void 0 : carData.car_name) || '',
                            model: (carData === null || carData === void 0 ? void 0 : carData.model) || '',
                            rentalPrice: (carData === null || carData === void 0 ? void 0 : carData.rentalPrice) || '',
                            engineType: (carData === null || carData === void 0 ? void 0 : carData.engineType) || '',
                            fuelType: (carData === null || carData === void 0 ? void 0 : carData.fuelType) || '',
                            color: (carData === null || carData === void 0 ? void 0 : carData.color) || '',
                            images: (carData === null || carData === void 0 ? void 0 : carData.images) || ['', '', '', ''],
                            rcNumber: (carData === null || carData === void 0 ? void 0 : carData.rcNumber) || '',
                            rcExpiry: (carData === null || carData === void 0 ? void 0 : carData.rcExpiry) ? formatDate(carData.rcExpiry) : '', // Ensure correct format
                            insurancePolicyNumber: (carData === null || carData === void 0 ? void 0 : carData.insurancePolicyNumber) || '',
                            insuranceExpiry: (carData === null || carData === void 0 ? void 0 : carData.insuranceExpiry) ? formatDate(carData.insuranceExpiry) : '', // Ensure correct format
                            pollutionCertificateNumber: (carData === null || carData === void 0 ? void 0 : carData.pollutionCertificateNumber) || '',
                            pollutionExpiry: (carData === null || carData === void 0 ? void 0 : carData.pollutionExpiry) ? formatDate(carData.pollutionExpiry) : '', // Ensure correct format
                            providerId: (carData === null || carData === void 0 ? void 0 : carData.providerId) || ''
                        });
                        return [3 /*break*/, 4];
                    case 3:
                        error_1 = _a.sent();
                        return [3 /*break*/, 4];
                    case 4: return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        }); };
        fetchCarData();
    }, [id]);
    var navigate = useNavigate();
    var _a = useState({
        car_name: '',
        model: '',
        rentalPrice: '',
        engineType: '',
        fuelType: '',
        color: '',
        images: ['', '', '', ''],
        rcNumber: '',
        rcExpiry: '',
        insurancePolicyNumber: '',
        insuranceExpiry: '',
        pollutionCertificateNumber: '',
        pollutionExpiry: '',
        providerId: '',
        id: '' // Ensure this value is set from the provider data
    }), formData = _a[0], setFormData = _a[1];
    var _b = useState(formData.images), uploadedImages = _b[0], setUploadedImages = _b[1];
    var _c = useState({}), errors = _c[0], setErrors = _c[1];
    // Handle input changes
    var handleInputChange = function (e) {
        var _a = e.target, name = _a.name, value = _a.value;
        setFormData(function (prevData) {
            var _a;
            return (__assign(__assign({}, prevData), (_a = {}, _a[name] = value, _a)));
        });
    };
    // Handle image uploads
    var handleImageUpload = function (event) {
        var files = event.target.files;
        if (files && files.length > 0) {
            var newFiles_1 = Array.from(files).slice(0, 4); // Limit to 4 images
            var newImageURLs_1 = newFiles_1.map(function (file) { return URL.createObjectURL(file); }); // Create URLs for preview
            // Update the form data with the image URLs and actual files
            setUploadedImages(newImageURLs_1);
            setFormData(function (prevData) { return (__assign(__assign({}, prevData), { images: newImageURLs_1, uploadedFiles: newFiles_1 })); });
            // Clear error if images are uploaded
            if (newFiles_1.length > 0) {
                setErrors(function (prevErrors) {
                    var updatedErrors = __assign({}, prevErrors);
                    delete updatedErrors['images'];
                    return updatedErrors;
                });
            }
        }
    };
    // Handle form submission
    var validate = function () {
        var newErrors = {};
        if (!formData.car_name.trim())
            newErrors.car_name = 'Car name is required.';
        if (!formData.model.trim())
            newErrors.model = 'Model is required.';
        if (!formData.rentalPrice) {
            newErrors.rentalPrice = 'Rental price is required.';
        }
        else if (isNaN(Number(formData.rentalPrice)) || Number(formData.rentalPrice) <= 0) {
            newErrors.rentalPrice = 'Rental price must be a positive number.';
        }
        if (!formData.engineType.trim())
            newErrors.engineType = 'Engine type is required.';
        if (!formData.fuelType.trim())
            newErrors.fuelType = 'Fuel type is required.';
        if (!formData.color.trim())
            newErrors.color = 'Color is required.';
        // Images validation
        if (uploadedImages.length === 0) {
            newErrors.images = 'At least one car image is required.';
        }
        // Document details validation
        if (!formData.pollutionCertificateNumber.trim())
            newErrors.pollutionCertificateNumber = 'Pollution certificate number is required.';
        if (!formData.pollutionExpiry.trim())
            newErrors.pollutionExpiry = 'Pollution expiry date is required.';
        // Insurance details validation
        if (!formData.insurancePolicyNumber.trim())
            newErrors.insurancePolicyNumber = 'Insurance policy number is required.';
        if (!formData.insuranceExpiry.trim())
            newErrors.insuranceExpiry = 'Insurance expiry date is required.';
        // RC details validation
        if (!formData.rcNumber.trim())
            newErrors.rcNumber = 'RC number is required.';
        if (!formData.rcExpiry.trim())
            newErrors.rcExpiry = 'RC expiry date is required.';
        // if (!carData.rcOwnerName.trim()) newErrors.rcOwnerName = 'RC owner name is required.';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    var handleSaveImage = function () { return __awaiter(void 0, void 0, void 0, function () {
        var carId, uploadedFiles, result, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    carId = id;
                    if (!carId) {
                        return [2 /*return*/];
                    }
                    uploadedFiles = formData.uploadedFiles || [];
                    if (uploadedFiles.length === 0) {
                        return [2 /*return*/];
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, editCarImage(uploadedFiles, carId)];
                case 2:
                    result = _a.sent();
                    if (result) {
                        navigate('/provider/cars'); // Navigate on successful upload
                    }
                    return [3 /*break*/, 4];
                case 3:
                    error_2 = _a.sent();
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    // save the details
    var handleSave = function (e) { return __awaiter(void 0, void 0, void 0, function () {
        var carId, result, firstErrorField, element;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    e.preventDefault();
                    if (!validate()) return [3 /*break*/, 2];
                    carId = id;
                    if (!carId) {
                        return [2 /*return*/]; // Or handle this case as you see fit
                    }
                    return [4 /*yield*/, editCarDetails(formData, carId)];
                case 1:
                    result = _a.sent();
                    if (result) {
                        navigate('/provider/cars');
                    }
                    return [3 /*break*/, 3];
                case 2:
                    firstErrorField = Object.keys(errors)[0];
                    element = document.getElementsByName(firstErrorField)[0];
                    if (element) {
                        element.scrollIntoView({ behavior: 'smooth' });
                        element.focus();
                    }
                    _a.label = 3;
                case 3: return [2 /*return*/];
            }
        });
    }); };
    return (_jsx("div", { className: "bg-gray-900 min-h-screen p-8", children: _jsx("div", { className: "max-w-7xl mx-auto", children: _jsxs("form", { onSubmit: handleSave, children: [_jsx("input", { type: "text", value: formData.id, name: 'providerId' }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-8", children: [_jsx("div", { className: "space-y-4", children: _jsxs("div", { className: "bg-gray-800 p-6 rounded-lg shadow-xl", children: [_jsx("h6", { className: "text-3xl font-bold text-white mb-6", children: "Documents Details" }), _jsxs("div", { className: "space-y-6", children: [_jsxs("div", { children: [_jsx("h3", { className: "text-red-500 font-bold mb-2", children: "Pollution Details" }), _jsxs("div", { className: "mb-4", children: [_jsx("label", { className: "block text-gray-400 font-medium mb-2", children: "Certificate Number" }), _jsxs("div", { className: "flex items-center bg-gray-700 rounded-lg p-2", children: [_jsx(BiDetail, { className: "text-white text-xl mr-2" }), _jsx("input", { type: "text", name: "pollutionCertificateNumber", value: formData.pollutionCertificateNumber, onChange: handleInputChange, placeholder: "Enter pollution certificate number", className: "bg-transparent text-white w-full outline-none ".concat(errors.pollutionCertificateNumber ? 'border border-red-500' : '') })] }), errors.pollutionCertificateNumber && _jsx("p", { className: "text-red-500 text-sm mt-1", children: errors.pollutionCertificateNumber })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-gray-400 font-medium mb-2", children: "Expiry Date" }), _jsxs("div", { className: "flex items-center bg-gray-700 rounded-lg p-2", children: [_jsx(FaRegCalendarAlt, { className: "text-white text-xl mr-2" }), _jsx("input", { type: "date", name: "pollutionExpiry", value: formData.pollutionExpiry, onChange: handleInputChange, className: "bg-transparent text-white w-full outline-none ".concat(errors.pollutionExpiry ? 'border border-red-500' : '') })] }), errors.pollutionExpiry && _jsx("p", { className: "text-red-500 text-sm mt-1", children: errors.pollutionExpiry })] })] }), _jsxs("div", { children: [_jsx("h6", { className: "text-red-500 font-bold mb-2", children: "Insurance Details" }), _jsxs("div", { className: "mb-4", children: [_jsx("label", { className: "block text-gray-400 font-medium mb-2", children: "Policy Number" }), _jsxs("div", { className: "flex items-center bg-gray-700 rounded-lg p-2", children: [_jsx(BiDetail, { className: "text-white text-xl mr-2" }), _jsx("input", { type: "text", name: "insurancePolicyNumber", value: formData.insurancePolicyNumber, onChange: handleInputChange, placeholder: "Enter insurance policy number", className: "bg-transparent text-white w-full outline-none ".concat(errors.insurancePolicyNumber ? 'border border-red-500' : '') })] }), errors.insurancePolicyNumber && _jsx("p", { className: "text-red-500 text-sm mt-1", children: errors.insurancePolicyNumber })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-gray-400 font-medium mb-2", children: "Expiry Date" }), _jsxs("div", { className: "flex items-center bg-gray-700 rounded-lg p-2", children: [_jsx(FaRegCalendarAlt, { className: "text-white text-xl mr-2" }), _jsx("input", { type: "date", name: "insuranceExpiry", value: formData.insuranceExpiry, onChange: handleInputChange, className: "bg-transparent text-white w-full outline-none ".concat(errors.insuranceExpiry ? 'border border-red-500' : '') })] }), errors.insuranceExpiry && _jsx("p", { className: "text-red-500 text-sm mt-1", children: errors.insuranceExpiry })] })] }), _jsxs("div", { children: [_jsx("h6", { className: "text-red-500 font-bold mb-2", children: "RC Details" }), _jsxs("div", { className: "mb-4", children: [_jsx("label", { className: "block text-gray-400 font-medium mb-2", children: "RC Number" }), _jsxs("div", { className: "flex items-center bg-gray-700 rounded-lg p-2", children: [_jsx(BiDetail, { className: "text-white text-xl mr-2" }), _jsx("input", { readOnly: true, type: "text", name: "rcNumber" // Updated name to reflect the field's purpose
                                                                            , value: formData.rcNumber, onChange: handleInputChange, placeholder: "Enter RC owner name", className: "bg-transparent text-white w-full outline-none ".concat(errors.rcNumber ? 'border border-red-500' : '') })] }), errors.rcNumber && _jsx("p", { className: "text-red-500 text-sm mt-1", children: errors.rcNumber })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-gray-400 font-medium mb-2", children: "Expiry Date" }), _jsxs("div", { className: "flex items-center bg-gray-700 rounded-lg p-2", children: [_jsx(FaRegCalendarAlt, { className: "text-white text-xl mr-2" }), _jsx("input", { type: "date", name: "rcExpiry" // Updated name to reflect the field's purpose
                                                                            , value: formData.rcExpiry, onChange: handleInputChange, className: "bg-transparent text-white w-full outline-none ".concat(errors.rcExpiry ? 'border border-red-500' : '') })] }), errors.rcExpiry && _jsx("p", { className: "text-red-500 text-sm mt-1", children: errors.rcExpiry })] })] })] })] }) }), _jsx("div", { children: _jsx("div", { children: _jsx("div", { className: "space-y-4", children: _jsxs("div", { className: "bg-gray-800 p-6 rounded-lg shadow-xl", children: [_jsx("h2", { className: "text-3xl font-bold text-white mb-6", children: "Car Details" }), _jsxs("div", { children: [_jsx("label", { className: "block text-gray-400 font-medium mb-2", children: "Car Name" }), _jsxs("div", { className: "flex items-center bg-gray-700 rounded-lg p-2", children: [_jsx(AiOutlineCar, { className: "text-white text-xl mr-2" }), _jsx("input", { type: "text", name: "car_name", value: formData.car_name, onChange: handleInputChange, placeholder: "Enter car name", className: "bg-transparent text-white w-full outline-none ".concat(errors.car_name ? 'border border-red-500' : '') })] }), errors.car_name && _jsx("p", { className: "text-red-500 text-sm mt-1", children: errors.car_name })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-gray-400 font-medium mb-2", children: "Model" }), _jsxs("div", { className: "flex items-center bg-gray-700 rounded-lg p-2", children: [_jsx(BiDetail, { className: "text-white text-xl mr-2" }), _jsx("input", { type: "text", name: "model", value: formData.model, onChange: handleInputChange, placeholder: "Enter car model", className: "bg-transparent text-white w-full outline-none ".concat(errors.model ? 'border border-red-500' : '') })] }), errors.model && _jsx("p", { className: "text-red-500 text-sm mt-1", children: errors.model })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-gray-400 font-medium mb-2", children: "Rental Price" }), _jsxs("div", { className: "flex items-center bg-gray-700 rounded-lg p-2", children: [_jsx(GiPriceTag, { className: "text-white text-xl mr-2" }), _jsx("input", { type: "number", name: "rentalPrice", value: formData.rentalPrice, onChange: handleInputChange, placeholder: "Enter rental price per day", className: "bg-transparent text-white w-full outline-none ".concat(errors.rentalPrice ? 'border border-red-500' : ''), min: "0" })] }), errors.rentalPrice && _jsx("p", { className: "text-red-500 text-sm mt-1", children: errors.rentalPrice })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-gray-400 font-medium mb-2", children: "Engine Type" }), _jsxs("div", { className: "flex items-center bg-gray-700 rounded-lg p-2", children: [_jsx(BsFuelPump, { className: "text-white text-xl mr-2" }), _jsxs("select", { name: "engineType", value: formData.engineType, onChange: handleInputChange, className: "bg-transparent text-white w-full outline-none ".concat(errors.engineType ? 'border border-red-500' : ''), children: [_jsx("option", { className: ' text-black', value: "", disabled: true, children: "Select engine type" }), _jsx("option", { className: ' text-black', value: "V6", children: "Manual" }), _jsx("option", { className: ' text-black', value: "V8", children: "Automaic" }), _jsx("option", { className: ' text-black', value: "Electric", children: "Electric" })] })] }), errors.engineType && _jsx("p", { className: "text-red-500 text-sm mt-1", children: errors.engineType })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-gray-400 font-medium mb-2", children: "Fuel Type" }), _jsxs("div", { className: "flex items-center bg-gray-700 rounded-lg p-2", children: [_jsx(BsFuelPump, { className: "text-white text-xl mr-2" }), _jsxs("select", { name: "fuelType", value: formData.fuelType, onChange: handleInputChange, className: "bg-transparent text-white w-full outline-none ".concat(errors.fuelType ? 'border border-red-500' : ''), children: [_jsx("option", { className: ' text-black', value: "", disabled: true, children: "Select fuel type" }), _jsx("option", { className: ' text-black', value: "Petrol", children: "Petrol" }), _jsx("option", { className: ' text-black', value: "Diesel", children: "Diesel" }), _jsx("option", { className: ' text-black', value: "Electric", children: "Electric" }), _jsx("option", { className: ' text-black', value: "Hybrid", children: "Hybrid" })] })] }), errors.fuelType && _jsx("p", { className: "text-red-500 text-sm mt-1", children: errors.fuelType })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-gray-400 font-medium mb-2", children: "Color" }), _jsxs("div", { className: "flex items-center bg-gray-700 rounded-lg p-2", children: [_jsx("div", { className: "text-white text-xl mr-2", children: "\uD83C\uDFA8" }), _jsx("input", { type: "text", name: "color", value: formData.color, onChange: handleInputChange, placeholder: "Enter car color", className: "bg-transparent text-white w-full outline-none ".concat(errors.color ? 'border border-red-500' : '') })] }), errors.color && _jsx("p", { className: "text-red-500 text-sm mt-1", children: errors.color })] }), _jsx("div", { className: "flex justify-end", children: _jsx("button", { type: "submit", className: "mt-4 bg-red-600 text-white py-2 px-6 rounded-lg hover:bg-red-700", children: "Save" }) }), _jsxs("div", { children: [_jsx("label", { className: "block text-gray-400 font-medium mb-2", children: "Car Images" }), _jsx("input", { type: "file", accept: "image/*", multiple: true, onChange: handleImageUpload, className: "mb-4 text-white ".concat(errors.images ? 'border border-red-500' : '') }), errors.images && _jsx("p", { className: "text-red-500 text-sm mt-1", children: errors.images }), _jsx("div", { className: "grid grid-cols-4 gap-2", children: formData.images.map(function (image, index) { return (_jsx("div", { className: "bg-gray-700 rounded-lg h-24 flex justify-center items-center", children: _jsx("img", { src: image, alt: "Car ".concat(index + 1), className: "h-full w-full object-cover rounded-lg" }) }, index)); }) }), _jsx("button", { type: "button", onClick: handleSaveImage, className: "mt-4 bg-red-600 text-white py-2 px-6 rounded-lg hover:bg-red-700", children: "Edit Image" })] })] }) }) }) })] })] }) }) }));
};
export default EditCar;
