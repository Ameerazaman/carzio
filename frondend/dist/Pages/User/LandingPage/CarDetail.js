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
import { Link, useNavigate, useParams } from 'react-router-dom';
import { FaCar, FaCalendarCheck, FaFileAlt, FaCertificate, FaIdCard, FaMoneyBillWave, FaBook, FaCommentDots } from 'react-icons/fa';
import { carDetail } from '../../../Api/User';
import ChatPage from './ChatPage';
import { useSelector } from 'react-redux';
function CarDetail() {
    var _this = this;
    var _a, _b, _c;
    var id = useParams().id;
    var user = useSelector(function (state) { return state.user.currentUser; });
    var username = (_a = user === null || user === void 0 ? void 0 : user.username) !== null && _a !== void 0 ? _a : '';
    var userId = (_b = user === null || user === void 0 ? void 0 : user._id) !== null && _b !== void 0 ? _b : '';
    var _d = useState({
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
    }), carDetails = _d[0], setCarDetails = _d[1];
    var providerId = (_c = carDetails === null || carDetails === void 0 ? void 0 : carDetails.providerId) !== null && _c !== void 0 ? _c : '';
    var _e = useState(true), loading = _e[0], setLoading = _e[1];
    var _f = useState(null), mainImage = _f[0], setMainImage = _f[1]; // Initialize mainImage as null
    var _g = useState(''), error = _g[0], setError = _g[1];
    var _h = useState(null), review = _h[0], setReview = _h[1];
    var _j = useState(0), ratings = _j[0], setRatings = _j[1];
    var _k = useState(false), isModalOpen = _k[0], setIsModalOpen = _k[1]; // Modal state for chat
    var toggleModal = function () {
        setIsModalOpen(function (prevState) { return !prevState; }); // Toggle the modal visibility
    };
    var navigate = useNavigate();
    useEffect(function () {
        var fetchCarDetails = function () { return __awaiter(_this, void 0, void 0, function () {
            var result, carData, formatDate, err_1;
            var _a, _b, _c, _d, _e;
            return __generator(this, function (_f) {
                switch (_f.label) {
                    case 0:
                        if (!id) return [3 /*break*/, 4];
                        _f.label = 1;
                    case 1:
                        _f.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, carDetail(id)];
                    case 2:
                        result = _f.sent();
                        carData = (_a = result === null || result === void 0 ? void 0 : result.data) === null || _a === void 0 ? void 0 : _a.data;
                        formatDate = function (dateString) {
                            var date = new Date(dateString);
                            return date.toISOString().split('T')[0]; // Formats to YYYY-MM-DD
                        };
                        setRatings((_b = result === null || result === void 0 ? void 0 : result.data) === null || _b === void 0 ? void 0 : _b.ratings);
                        setReview((_c = result === null || result === void 0 ? void 0 : result.data) === null || _c === void 0 ? void 0 : _c.review);
                        setCarDetails({
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
                        // Set main image only if images exist
                        if (((_e = (_d = result === null || result === void 0 ? void 0 : result.data) === null || _d === void 0 ? void 0 : _d.data) === null || _e === void 0 ? void 0 : _e.images) && result.data.data.images.length > 0) {
                            setMainImage(result.data.data.images[0]);
                        }
                        setLoading(false);
                        return [3 /*break*/, 4];
                    case 3:
                        err_1 = _f.sent();
                        setError('Error fetching car details');
                        setLoading(false);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        }); };
        fetchCarDetails();
    }, [id]);
    // Render loading or error states
    if (loading) {
        return _jsx("div", { children: "Loading..." });
    }
    if (error) {
        return _jsx("div", { children: error });
    }
    // Handle opening and closing the modal
    return (_jsxs("div", { className: "flex p-6 bg-gray-100", children: [_jsxs("div", { className: "w-1/2 pr-6", children: [_jsx("img", { src: mainImage !== null && mainImage !== void 0 ? mainImage : "", alt: carDetails.car_name || "Car Image", className: "w-full h-80 object-cover mb-4 rounded-lg shadow-lg transition-transform transform hover:scale-105" }), _jsx("div", { className: "flex space-x-2 mb-4", children: carDetails.images.map(function (image, index) { return (_jsx("img", { src: image, alt: "Thumbnail ".concat(index + 1), className: "w-24 h-24 object-cover rounded-lg shadow transition-transform transform hover:scale-110 cursor-pointer", onClick: function () { return setMainImage(image); } }, index)); }) }), _jsxs("div", { className: "mt-6", children: [_jsx("h3", { className: "text-2xl font-bold text-gray-800 mb-4", children: "Customer Reviews" }), _jsx("ul", { className: "space-y-4", children: review && review.length > 0 ? (review.map(function (r, index) { return (_jsxs("li", { className: "bg-gray-200 p-4 rounded-lg shadow-lg", children: [_jsxs("p", { className: "text-gray-800 font-medium", children: ["Review ", index + 1, ":"] }), _jsx("p", { className: "text-gray-700 mt-2", children: r })] }, index)); })) : (_jsx("p", { className: "text-gray-600 italic", children: "No reviews available for this car." })) })] })] }), _jsx("div", { className: "w-1/2", children: _jsxs("div", { className: "bg-white rounded-lg shadow-lg p-6", children: [_jsx("h2", { className: "text-3xl font-bold text-gray-800 mb-4", children: carDetails.car_name }), _jsx("div", { className: "flex mb-4", children: Array.from({ length: 5 }, function (_, index) { return (_jsx("span", { className: "text-2xl ".concat(index < Math.round(ratings) ? "text-yellow-500" : "text-gray-300"), children: "\u2605" }, index)); }) }), _jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("p", { className: "flex items-center", children: [_jsx(FaCar, { className: "mr-2 text-blue-600" }), _jsx("strong", { children: "Model:" })] }), _jsx("p", { children: carDetails.model }), _jsxs("p", { className: "flex items-center", children: [_jsx(FaCalendarCheck, { className: "mr-2 text-green-600" }), _jsx("strong", { children: "Color:" })] }), _jsx("p", { children: carDetails.color }), _jsxs("p", { className: "flex items-center", children: [_jsx(FaFileAlt, { className: "mr-2 text-orange-600" }), _jsx("strong", { children: "Engine Type:" })] }), _jsx("p", { children: carDetails.engineType }), _jsxs("p", { className: "flex items-center", children: [_jsx(FaCertificate, { className: "mr-2 text-purple-600" }), _jsx("strong", { children: "Fuel Type:" })] }), _jsx("p", { children: carDetails.fuelType }), _jsxs("p", { className: "flex items-center", children: [_jsx(FaMoneyBillWave, { className: "mr-2 text-red-600" }), _jsx("strong", { children: "Rental Price:" })] }), _jsxs("p", { children: ["\u20B9", carDetails.rentalPrice, "/day"] }), _jsxs("p", { className: "flex items-center", children: [_jsx(FaFileAlt, { className: "mr-2 text-orange-600" }), _jsx("strong", { children: "Insurance Policy Number:" })] }), _jsx("p", { children: carDetails.insurancePolicyNumber }), _jsxs("p", { className: "flex items-center", children: [_jsx(FaCalendarCheck, { className: "mr-2 text-green-600" }), _jsx("strong", { children: "Insurance Expiry:" })] }), _jsx("p", { children: new Date(carDetails.insuranceExpiry).toLocaleDateString() }), _jsxs("p", { className: "flex items-center", children: [_jsx(FaIdCard, { className: "mr-2 text-indigo-600" }), _jsx("strong", { children: "Pollution Certificate Number:" })] }), _jsx("p", { children: carDetails.pollutionCertificateNumber }), _jsxs("p", { className: "flex items-center", children: [_jsx(FaCalendarCheck, { className: "mr-2 text-green-600" }), _jsx("strong", { children: "Pollution Expiry:" })] }), _jsx("p", { children: new Date(carDetails.pollutionExpiry).toLocaleDateString() }), _jsxs("p", { className: "flex items-center", children: [_jsx(FaIdCard, { className: "mr-2 text-indigo-600" }), _jsx("strong", { children: "RC Number:" })] }), _jsx("p", { children: carDetails.rcNumber }), _jsxs("p", { className: "flex items-center", children: [_jsx(FaCalendarCheck, { className: "mr-2 text-green-600" }), _jsx("strong", { children: "RC Expiry:" })] }), _jsx("p", { children: new Date(carDetails.rcExpiry).toLocaleDateString() })] }), _jsx("div", { className: "mt-6" }), _jsxs("div", { className: "flex flex-row items-center justify-center space-x-6", children: [_jsx(Link, { to: "/booking_details/".concat(id), children: _jsxs("button", { className: "flex items-center bg-blue-600 text-white py-3 px-8 rounded-lg text-lg font-semibold hover:bg-red-700 transition duration-300 ease-in-out shadow-xl transform hover:scale-105 space-x-3", children: [_jsx(FaBook, { className: "text-white text-xl" }), " ", _jsx("span", { children: "Book Now" })] }) }), _jsxs("button", { onClick: toggleModal, className: "flex items-center bg-green-600 text-white py-3 px-8 rounded-lg text-lg font-semibold hover:bg-red-700 transition duration-300 ease-in-out shadow-xl transform hover:scale-105 space-x-3", children: [_jsx(FaCommentDots, { className: "text-white text-xl" }), " ", _jsx("span", { children: "Chat with Provider" })] })] })] }) }), isModalOpen && (_jsx("div", { className: "fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50", children: _jsxs("div", { className: "bg-white rounded-lg shadow-lg w-96 p-6 relative space-between", style: { backgroundImage: 'url("/images/chat.avif")' }, children: [_jsx("button", { onClick: toggleModal, className: "absolute top-2 right-2 text-red-800 hover:text-red-900 font-bold z-60", children: "X" }), _jsx(ChatPage, { senderId: userId, receiverId: providerId, username: username })] }) }))] }));
}
export default CarDetail;
