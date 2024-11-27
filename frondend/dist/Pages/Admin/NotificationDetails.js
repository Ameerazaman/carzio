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
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { useNavigate, useParams } from 'react-router-dom';
import { notificaionDetails, verifyNotification } from '../../Api/Admin';
var NotificationDetails = function () {
    var _a;
    var id = useParams().id;
    var _b = useState({}), carDetails = _b[0], setCarDetails = _b[1];
    var _c = useState(true), loading = _c[0], setLoading = _c[1];
    var _d = useState(''), message = _d[0], setMessage = _d[1];
    var _e = useState(''), error = _e[0], setError = _e[1];
    var navigate = useNavigate();
    useEffect(function () {
        var fetchCarDetails = function () { return __awaiter(void 0, void 0, void 0, function () {
            var result, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!id) return [3 /*break*/, 4];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, notificaionDetails(id)];
                    case 2:
                        result = _a.sent();
                        setCarDetails(result === null || result === void 0 ? void 0 : result.data);
                        setLoading(false);
                        return [3 /*break*/, 4];
                    case 3:
                        err_1 = _a.sent();
                        setError('Error fetching car details');
                        setLoading(false);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        }); };
        fetchCarDetails();
    }, [id]);
    var handleNotificationVerification = function (action) { return __awaiter(void 0, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!id) return [3 /*break*/, 2];
                    return [4 /*yield*/, verifyNotification(id, action)];
                case 1:
                    result = _a.sent();
                    if (result) {
                        navigate('/admin/notifications');
                        // Optionally, display a success message or refresh data
                    }
                    else {
                    }
                    _a.label = 2;
                case 2: return [2 /*return*/];
            }
        });
    }); };
    if (loading)
        return _jsx("div", { className: "flex justify-center items-center h-screen", children: _jsx("p", { children: "Loading..." }) });
    if (error)
        return _jsx("div", { className: "text-center text-red-500", children: error });
    return (_jsx("div", { className: "max-w-6xl mx-auto p-6 mt-10", children: _jsx("div", { className: "bg-white rounded-lg shadow-lg overflow-hidden", children: _jsx("div", { className: "p-8 bg-gradient-to-br from-gray-50 to-gray-100", children: _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-8", children: [_jsx("div", { className: "space-y-4", children: [
                                { label: 'Car Name', value: carDetails.car_name },
                                { label: 'Model', value: carDetails.model },
                                { label: 'Rental Price', value: "\u20B9".concat(carDetails.rentalPrice, " / day") },
                                { label: 'Engine Type', value: carDetails.engineType },
                                { label: 'Fuel Type', value: carDetails.fuelType },
                                { label: 'Color', value: carDetails.color },
                                { label: 'RC Number', value: carDetails.rcNumber },
                                { label: 'RC Expiry', value: new Date(carDetails.rcExpiry).toLocaleDateString() },
                                { label: 'Insurance Expiry', value: new Date(carDetails.insuranceExpiry).toLocaleDateString() },
                                { label: 'Pollution Certificate Expiry', value: new Date(carDetails.pollutionExpiry).toLocaleDateString() },
                            ].map(function (detail, idx) { return (_jsxs("div", { className: "flex justify-between items-center", children: [_jsxs("p", { className: "text-gray-700 font-bold", children: [detail.label, ":"] }), _jsx("p", { className: "text-gray-900 font-medium", children: detail.value || 'N/A' })] }, idx)); }) }), _jsxs("div", { className: "space-y-6", children: [_jsxs("div", { children: [_jsx("p", { className: "text-gray-700 font-bold", children: "Car Images" }), _jsx("div", { className: "flex space-x-4 overflow-x-auto mt-2", children: (_a = carDetails.images) === null || _a === void 0 ? void 0 : _a.map(function (image, index) { return (_jsx("img", { src: image, alt: "Car Image ".concat(index + 1), className: "w-48 h-48 object-cover rounded-lg border border-gray-200 shadow-sm" }, index)); }) })] }), _jsxs("div", { className: "flex space-x-4", children: [_jsxs("button", { onClick: function () { return handleNotificationVerification("Accept"); }, className: "w-full py-3 px-5 flex items-center justify-center text-white bg-green-500 hover:bg-green-600 transition-all rounded-lg shadow-md transform hover:scale-105", children: [_jsx(FaCheckCircle, { className: "mr-2 text-xl" }), " Accept"] }), _jsxs("button", { onClick: function () { return handleNotificationVerification("Reject"); }, className: "w-full py-3 px-5 flex items-center justify-center text-white bg-red-500 hover:bg-red-600 transition-all rounded-lg shadow-md transform hover:scale-105", children: [_jsx(FaTimesCircle, { className: "mr-2 text-xl" }), " Reject"] })] }), message && _jsx("p", { className: "mt-4 text-center text-green-600 font-semibold", children: message }), error && _jsx("p", { className: "mt-4 text-center text-red-600 font-semibold", children: error })] })] }) }) }) }));
};
export default NotificationDetails;
