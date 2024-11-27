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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { FaSearch } from "react-icons/fa"; // Import the search icon
import { applyFilters, searchCar } from "../../../Api/User";
function CarFilter(_a) {
    var _this = this;
    var filteredData = _a.filteredData;
    var _b = useState({
        engineType: [],
        fuelType: [],
        sortPrice: "",
        searchQuery: "",
    }), filters = _b[0], setFilters = _b[1];
    var handleSearchCar = (function () { return __awaiter(_this, void 0, void 0, function () {
        var response, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, searchCar(filters.searchQuery)];
                case 1:
                    response = _a.sent();
                    filteredData(response === null || response === void 0 ? void 0 : response.data); // Pass data to the parent
                    return [3 /*break*/, 3];
                case 2:
                    error_1 = _a.sent();
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); });
    var handleCheckboxChange = function (e, category) {
        var _a = e.target, value = _a.value, checked = _a.checked;
        setFilters(function (prevFilters) {
            var _a;
            var selectedTypes = prevFilters[category];
            return __assign(__assign({}, prevFilters), (_a = {}, _a[category] = checked
                ? __spreadArray(__spreadArray([], selectedTypes, true), [value], false) : selectedTypes.filter(function (type) { return type !== value; }), _a));
        });
    };
    var handleSortPriceChange = function (e) {
        var value = e.target.value;
        setFilters(function (prevFilters) { return (__assign(__assign({}, prevFilters), { sortPrice: value })); });
    };
    var handleSearchChange = function (e) {
        var value = e.target.value;
        setFilters(function (prevFilters) { return (__assign(__assign({}, prevFilters), { searchQuery: value })); });
    };
    var fetchFilteredCars = function (filters) { return __awaiter(_this, void 0, void 0, function () {
        var response, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, applyFilters(filters)];
                case 1:
                    response = _a.sent();
                    filteredData(response === null || response === void 0 ? void 0 : response.data); // Pass data to the parent
                    return [3 /*break*/, 3];
                case 2:
                    error_2 = _a.sent();
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); };
    return (_jsxs("div", { className: "p-8 bg-gray-800 rounded-lg shadow-lg text-gray-100", children: [_jsx("h2", { className: "text-2xl font-bold mb-6 text-center text-red-500", children: "Filter Cars" }), _jsxs("div", { className: "mb-6 flex justify-center", children: [" ", _jsxs("div", { className: "flex flex-col sm:flex-row items-center", children: [_jsx("input", { type: "text", placeholder: "Search for cars...", value: filters.searchQuery, onChange: handleSearchChange, className: "flex-grow p-3 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-red-500 bg-gray-700 text-gray-100 mb-2 sm:mb-0 sm:mr-0" }), _jsx("button", { onClick: handleSearchCar, className: "bg-red-500 text-gray-100 rounded-lg p-3 hover:bg-red-400 transition-all duration-200 flex items-center justify-center", children: _jsx(FaSearch, { className: "w-5 h-5" }) })] })] }), _jsxs("div", { className: "space-y-6", children: [_jsxs("div", { children: [_jsx("label", { className: "block font-semibold mb-2 text-red-500", children: "Sort by Price" }), _jsxs("div", { className: "flex flex-col sm:flex-row sm:space-x-4", children: [_jsxs("label", { className: "flex items-center space-x-2", children: [_jsx("input", { type: "radio", value: "lowToHigh", checked: filters.sortPrice === "lowToHigh", onChange: handleSortPriceChange, className: "text-red-500 focus:ring-red-500" }), _jsx("span", { children: "Low to High" })] }), _jsxs("label", { className: "flex items-center space-x-2", children: [_jsx("input", { type: "radio", value: "highToLow", checked: filters.sortPrice === "highToLow", onChange: handleSortPriceChange, className: "text-red-500 focus:ring-red-500" }), _jsx("span", { children: "High to Low" })] })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block font-semibold mb-2 text-red-500", children: "Engine Type" }), _jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-3", children: ["Electric", "Manual", "Automatic"].map(function (type) { return (_jsxs("label", { className: "flex items-center space-x-2 bg-gray-700 rounded-lg p-2 cursor-pointer hover:bg-gray-600 transition-colors duration-200", children: [_jsx("input", { type: "checkbox", value: type, checked: filters.engineType.includes(type), onChange: function (e) { return handleCheckboxChange(e, "engineType"); }, className: "text-red-500 focus:ring-red-500" }), _jsx("span", { children: type })] }, type)); }) })] }), _jsxs("div", { children: [_jsx("label", { className: "block font-semibold mb-2 text-red-500", children: "Fuel Type" }), _jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-3", children: ["Petrol", "Diesel", "Electric", "Hybrid"].map(function (type) { return (_jsxs("label", { className: "flex items-center space-x-2 bg-gray-700 rounded-lg p-2 cursor-pointer hover:bg-gray-600 transition-colors duration-200", children: [_jsx("input", { type: "checkbox", value: type, checked: filters.fuelType.includes(type), onChange: function (e) { return handleCheckboxChange(e, "fuelType"); }, className: "text-red-500 focus:ring-red-500" }), _jsx("span", { children: type })] }, type)); }) })] })] }), _jsx("button", { onClick: function () { return fetchFilteredCars(filters); }, className: "mt-8 w-full py-3 bg-red-500 text-gray-100 font-semibold rounded-lg hover:bg-red-400 transition-all duration-200", children: "Apply Filters" })] }));
}
export default CarFilter;
