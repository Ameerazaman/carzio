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
import { useEffect, useState } from "react";
import CarFilter from "../../Pages/User/LandingPage/CarFilter";
import Navbar from "../../Pages/Common/Navbar";
import Card from "../../Pages/Common/Card";
import { fetchCars } from "../../Api/User";
import { BiError } from "react-icons/bi";
import Pagination from "../../Pages/Common/Pagination";
import Footer from "../../Pages/Common/Footer";
function CarList() {
    var _this = this;
    var _a = useState([]), carData = _a[0], setCarData = _a[1];
    var _b = useState(true), loading = _b[0], setLoading = _b[1];
    var _c = useState(null), error = _c[0], setError = _c[1];
    var _d = useState(1), page = _d[0], setPage = _d[1];
    var _e = useState(1), totalPages = _e[0], setTotalPages = _e[1];
    var limit = 10;
    var filterData = function (data) {
        if (Array.isArray(data)) {
            if (data.length === 0) {
                setCarData([]);
                setError("No cars match your Searching."); // Set a message for empty data
            }
            else {
                setCarData(data); // Update car data if `data` is a non-empty array
                setError(null); // Clear any previous error messages
            }
        }
        else if (data.message) {
            console.log(data.message, "filtered data as message");
            setCarData([]); // Clear car data
            setError(data.message); // Set error from the response message
        }
    };
    useEffect(function () {
        var fetchData = function () { return __awaiter(_this, void 0, void 0, function () {
            var result, error_1;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, 3, 4]);
                        setLoading(true);
                        return [4 /*yield*/, fetchCars(page, limit)];
                    case 1:
                        result = _b.sent();
                        if ((_a = result === null || result === void 0 ? void 0 : result.data) === null || _a === void 0 ? void 0 : _a.data) {
                            setCarData(result.data.data);
                            setTotalPages(result.data.totalPage || 1);
                        }
                        else {
                            setError('No car data returned.');
                        }
                        return [3 /*break*/, 4];
                    case 2:
                        error_1 = _b.sent();
                        setError("Error fetching car data.");
                        return [3 /*break*/, 4];
                    case 3:
                        setLoading(false);
                        return [7 /*endfinally*/];
                    case 4: return [2 /*return*/];
                }
            });
        }); };
        fetchData();
    }, [page]);
    var handlePageChange = function (newPage) {
        if (newPage >= 1 && newPage <= totalPages) {
            setPage(newPage);
        }
    };
    return (_jsxs("div", { children: [_jsx(Navbar, {}), _jsxs("div", { className: "container mx-auto flex flex-col md:flex-row mt-4", children: [_jsx("div", { className: "w-full md:w-1/4 p-4", children: _jsx(CarFilter, { filteredData: filterData }) }), _jsx("div", { className: "w-full md:w-3/4 p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4", children: loading ? (_jsxs("div", { className: "flex items-center justify-center w-full text-gray-600 text-lg font-medium bg-gray-100 p-4 rounded-md col-span-full", children: [_jsx("span", { className: "animate-spin mr-2", children: "\uD83D\uDD04" }), " ", "Loading cars..."] })) : error ? (_jsxs("div", { className: "flex items-center justify-center w-full text-red-700 bg-red-100 p-4 rounded-md col-span-full", children: [_jsx(BiError, { className: "text-2xl mr-2" }), " ", _jsx("span", { className: "text-lg font-semibold", children: error })] })) : (carData.map(function (car, index) { return (_jsx(Card, { carData: car }, index)); })) })] }), _jsx(Pagination, { currentPage: page, totalPages: totalPages, onPageChange: handlePageChange }), _jsx("div", { className: "mt-12", children: _jsx(Footer, {}) })] }));
}
export default CarList;
