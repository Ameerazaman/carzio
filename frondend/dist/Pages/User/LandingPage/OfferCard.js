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
import { FaCar, FaCalendarAlt, FaPercent } from 'react-icons/fa';
import { getOffer } from '../../../Api/User';
var OfferCard = function () {
    var _a = useState([]), offerCards = _a[0], setOfferCards = _a[1];
    var _b = useState(true), loading = _b[0], setLoading = _b[1];
    var _c = useState(null), error = _c[0], setError = _c[1];
    useEffect(function () {
        var fetchOffers = function () { return __awaiter(void 0, void 0, void 0, function () {
            var result, err_1;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, 3, 4]);
                        return [4 /*yield*/, getOffer()];
                    case 1:
                        result = _b.sent();
                        if (result && Array.isArray((_a = result === null || result === void 0 ? void 0 : result.data) === null || _a === void 0 ? void 0 : _a.data)) {
                            setOfferCards(result.data.data);
                        }
                        else {
                            setOfferCards([]);
                        }
                        return [3 /*break*/, 4];
                    case 2:
                        err_1 = _b.sent();
                        setError('Failed to fetch offers. Please try again later.');
                        return [3 /*break*/, 4];
                    case 3:
                        setLoading(false);
                        return [7 /*endfinally*/];
                    case 4: return [2 /*return*/];
                }
            });
        }); };
        fetchOffers();
    }, []);
    if (loading) {
        return _jsx("div", { className: "text-center p-4", children: "Loading offers..." });
    }
    if (error) {
        return _jsx("div", { className: "text-center p-4 text-red-600", children: error });
    }
    return (_jsxs("div", { className: "min-h-screen bg-gray-200", children: [_jsx("br", {}), _jsxs("header", { className: "relative bg-white p-4 text-center shadow-lg rounded-b-lg", children: [_jsx("h1", { className: "relative z-10 text-4xl font-bold mb-1 text-gray-900", children: "Current Offers" }), _jsx("p", { className: "relative z-10 text-md text-gray-700 mt-1", children: "Grab the best deals on our rentals!" })] }), _jsx("div", { className: "container mx-auto p-4", children: _jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4", children: offerCards.map(function (offer) { return (_jsxs("div", { className: "relative overflow-hidden border-4 border-red-500 rounded-lg shadow-lg p-4 hover:shadow-xl transition bg-gradient-to-r from-red-500 via-orange-400 to-yellow-300", children: [_jsx("div", { className: "absolute inset-0 transform -skew-y-3 bg-white" }), _jsxs("div", { className: "relative z-10", children: [_jsx("h2", { className: "text-xl font-semibold mb-2 text-gray-800", children: offer.offerTitle }), _jsxs("p", { className: "flex items-center text-gray-700 mb-1", children: [_jsx(FaCar, { className: "mr-2 text-red-600" }), " Available for: ", offer.carName] }), _jsxs("p", { className: "flex items-center text-gray-700 mb-1", children: [_jsx(FaCalendarAlt, { className: "mr-2 text-red-600" }), " Valid from: ", new Date(offer.startDate).toLocaleDateString(), " to ", new Date(offer.endDate).toLocaleDateString()] }), _jsxs("p", { className: "flex items-center text-gray-700 mb-1", children: [_jsx(FaPercent, { className: "mr-2 text-red-600" }), " Discount: ", offer.discountPercentage, "% off"] })] })] }, offer.id)); }) }) })] }));
};
export default OfferCard;
