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
import { useState, useRef, useEffect } from 'react';
import { searchCarAvailabilty } from '../../Api/User';
// Sample slide data
var slides = [
    { image: '/images/carousel1.jpg', title: 'Affordable Cars for Rent', date: '2024-01-01' },
    { image: '/images/hyundai-creta.webp', title: 'Affordable Cars for Rent', date: '2024-01-01' },
    { image: '/images/family-car.jpg', title: 'Perfect Family Cars for Every Journey', date: '2024-02-01' },
];
var Carosel = function (_a) {
    var onEvent = _a.onEvent;
    var _b = useState(0), currentIndex = _b[0], setCurrentIndex = _b[1];
    var _c = useState(''), startDate = _c[0], setStartDate = _c[1];
    var _d = useState(''), endDate = _d[0], setEndDate = _d[1];
    var _e = useState(slides), filteredSlides = _e[0], setFilteredSlides = _e[1];
    var _f = useState(false), isFiltering = _f[0], setIsFiltering = _f[1];
    var carouselRef = useRef(null);
    var _g = useState([]), carData = _g[0], setCarData = _g[1];
    var handleNext = function () {
        setCurrentIndex(function (prevIndex) { return (prevIndex === filteredSlides.length - 1 ? 0 : prevIndex + 1); });
    };
    var handlePrev = function () {
        setCurrentIndex(function (prevIndex) { return (prevIndex === 0 ? filteredSlides.length - 1 : prevIndex - 1); });
    };
    var translateXValue = -currentIndex * 100;
    var handleSubmit = function (e) { return __awaiter(void 0, void 0, void 0, function () {
        var start, end, startString, endString, result, cars, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    e.preventDefault();
                    start = new Date(startDate);
                    end = new Date(endDate);
                    startString = start.toISOString();
                    endString = end.toISOString();
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, searchCarAvailabilty(startString, endString)];
                case 2:
                    result = _a.sent();
                    cars = result.data.data;
                    setCarData(cars); // Update local state
                    onEvent(cars); // Pass the full data to the Home component
                    return [3 /*break*/, 4];
                case 3:
                    error_1 = _a.sent();
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    useEffect(function () {
        if (isFiltering)
            return;
        var intervalId = setInterval(function () {
            handleNext();
        }, 3000);
        return function () { return clearInterval(intervalId); };
    }, [filteredSlides, isFiltering]);
    return (_jsxs("div", { className: "relative w-full overflow-hidden bg-black", children: [_jsx("div", { className: "flex transition-transform duration-500 ease-in-out", style: { transform: "translateX(".concat(translateXValue, "%)") }, ref: carouselRef, children: filteredSlides.length > 0 ? (filteredSlides.map(function (slide, index) { return (_jsx("div", { className: "min-w-full h-64 sm:h-80 lg:h-96 flex items-center justify-center bg-cover bg-center", style: { backgroundImage: "url(".concat(slide.image, ")") }, children: _jsx("h2", { className: "text-white text-xl sm:text-2xl lg:text-3xl bg-black bg-opacity-50 p-4 rounded", children: slide.title }) }, index)); })) : (_jsx("div", { className: "min-w-full h-64 sm:h-80 lg:h-96 flex items-center justify-center bg-gray-900", children: _jsx("h2", { className: "text-white text-xl sm:text-2xl lg:text-3xl", children: "No slides available" }) })) }), _jsx("button", { onClick: handlePrev, className: "absolute left-0 top-1/2 transform -translate-y-1/2 bg-gold text-black p-2 rounded-full shadow-lg hover:bg-yellow-600", children: "\u25C0" }), _jsx("button", { onClick: handleNext, className: "absolute right-0 top-1/2 transform -translate-y-1/2 bg-gold text-black p-2 rounded-full shadow-lg hover:bg-yellow-600", children: "\u25B6" }), _jsxs("form", { onSubmit: handleSubmit, children: [" ", _jsx("div", { className: "absolute bottom-8 left-1/2 transform -translate-x-1/2 w-11/12 sm:w-1/2 p-4 bg-white bg-opacity-90 rounded-t-lg shadow-lg", children: _jsxs("div", { className: "flex flex-col sm:flex-row justify-center items-center", children: [_jsx("img", { src: "/images/Gauto - Car Rental HTML Template Preview - ThemeForest_files/bmw-offer.png", alt: "Car Offer", className: "h-16 sm:h-24 object-contain mx-4" }), _jsxs("div", { className: "flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2", children: [_jsx("input", { type: "date", value: startDate, onChange: function (e) { return setStartDate(e.target.value); }, className: "border border-black p-2 rounded w-full sm:w-auto" }), _jsx("input", { type: "date", value: endDate, onChange: function (e) { return setEndDate(e.target.value); }, className: "border border-black p-2 rounded w-full sm:w-auto" }), _jsx("button", { type: "submit" // Submit the form
                                            , className: "bg-black text-white p-2 rounded w-full sm:w-auto hover:bg-gray-700", children: "Find a Car" })] })] }) })] })] }));
};
export default Carosel;
