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
import { Doughnut, Line, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale, PointElement, LineElement, BarElement, } from 'chart.js';
import { getDashboardConstData } from '../../Api/Provider';
import { useSelector } from 'react-redux';
// Register ChartJS components
ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale, PointElement, LineElement, BarElement);
var ProviderDashboard = function () {
    var provider = useSelector(function (state) { return state.provider.currentProvider; });
    var providerId = provider === null || provider === void 0 ? void 0 : provider._id;
    var _a = useState(0), totalCars = _a[0], setTotalCars = _a[1];
    var _b = useState(0), totalRevenue = _b[0], setTotalRevenue = _b[1];
    var _c = useState([]), carRevenueData = _c[0], setCarRevenueData = _c[1];
    var _d = useState([]), carBookingData = _d[0], setCarBookingData = _d[1];
    var _e = useState(0), carBookingTotal = _e[0], setCarBookingTotal = _e[1];
    useEffect(function () {
        var fetchDashboardData = function () { return __awaiter(void 0, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!providerId) return [3 /*break*/, 2];
                        return [4 /*yield*/, getDashboardConstData(providerId)];
                    case 1:
                        result = _a.sent();
                        setTotalCars(result.data.totalCars);
                        setTotalRevenue(result.data.revenue);
                        setCarRevenueData(result.data.revenueByCar);
                        setCarBookingData(result.data.totalBookingCount);
                        setCarBookingTotal(result.data.totalBooking);
                        _a.label = 2;
                    case 2: return [2 /*return*/];
                }
            });
        }); };
        fetchDashboardData();
    }, [providerId]);
    var doughnutOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            tooltip: {
                callbacks: {
                    label: function (context) { return "".concat(context.label, ": ").concat(context.raw); },
                },
            },
        },
    };
    var carDoughnutData = {
        labels: ['Total Cars'],
        datasets: [
            {
                label: 'Cars',
                data: [totalCars],
                backgroundColor: ['#1E90FF'],
                borderWidth: 1,
            },
        ],
    };
    var revenueDoughnutData = {
        labels: ['Revenue'],
        datasets: [
            {
                label: 'Total Revenue',
                data: [totalRevenue],
                backgroundColor: ['#28a745'],
                borderWidth: 1,
            },
        ],
    };
    var carBookingDoughnutData = {
        labels: ['Total Car Bookings'],
        datasets: [
            {
                label: 'Bookings',
                data: [carBookingTotal],
                backgroundColor: ['#FFD700'],
                borderWidth: 1,
            },
        ],
    };
    var lineChartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            tooltip: {
                callbacks: {
                    label: function (context) { return "".concat(context.dataset.label, ": ").concat(context.raw); },
                },
            },
        },
    };
    var revenueLineChartData = {
        labels: carRevenueData.map(function (entry) { return entry.carName; }),
        datasets: [
            {
                label: 'Revenue ($)',
                data: carRevenueData.map(function (entry) { return entry.amount; }),
                borderColor: '#FF6347',
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                fill: true,
            },
        ],
    };
    var carBookingBarChartData = {
        labels: carBookingData.map(function (item) { return item.carName; }),
        datasets: [
            {
                label: 'Car Bookings',
                data: carBookingData.map(function (item) { return item.count; }),
                borderColor: '#FF6347',
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                fill: true,
            },
        ],
    };
    return (_jsxs("div", { className: "p-6 bg-white rounded-lg shadow-lg min-h-screen", children: [_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-6 mb-6", children: [_jsxs("div", { className: "text-center", children: [_jsx("h3", { className: "text-xl font-semibold", children: "Total Cars" }), _jsx("div", { className: "text-3xl text-red-500", children: totalCars }), _jsx(Doughnut, { data: carDoughnutData, options: doughnutOptions })] }), _jsxs("div", { className: "text-center", children: [_jsx("h3", { className: "text-xl font-semibold", children: "Total Bookings" }), _jsx("div", { className: "text-3xl text-yellow-500", children: carBookingTotal }), _jsx(Doughnut, { data: carBookingDoughnutData, options: doughnutOptions })] }), _jsxs("div", { className: "text-center", children: [_jsx("h3", { className: "text-xl font-semibold", children: "Total Revenue" }), _jsxs("div", { className: "text-3xl text-green-500", children: ["$", totalRevenue.toLocaleString()] }), _jsx(Doughnut, { data: revenueDoughnutData, options: doughnutOptions })] })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [_jsxs("div", { children: [_jsx("h3", { className: "text-xl font-semibold mb-3", children: "Revenue Trends" }), _jsx(Line, { data: revenueLineChartData, options: lineChartOptions })] }), _jsxs("div", { children: [_jsx("h3", { className: "text-xl font-semibold mb-3", children: "Car Bookings" }), _jsx(Bar, { data: carBookingBarChartData, options: lineChartOptions })] })] })] }));
};
export default ProviderDashboard;
