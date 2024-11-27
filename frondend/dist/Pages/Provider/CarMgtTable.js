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
import { useState } from 'react';
import { FaEdit } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { updateStatusCar } from '../../Api/Provider';
var CarMgtTable = function (_a) {
    var initialTableData = _a.tableData;
    var navigate = useNavigate();
    var _b = useState(initialTableData), tableData = _b[0], setTableData = _b[1];
    var handleEdit = function (id) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            navigate("/provider/edit_car/".concat(id));
            return [2 /*return*/];
        });
    }); };
    var handleStatus = function (id) { return __awaiter(void 0, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, updateStatusCar(id)];
                case 1:
                    result = _a.sent();
                    if (result) {
                        setTableData(function (prevTableData) {
                            return prevTableData.map(function (data) {
                                return data.id === id ? __assign(__assign({}, data), { isBlocked: !data.isBlocked }) : data;
                            });
                        });
                    }
                    return [2 /*return*/];
            }
        });
    }); };
    return (_jsxs("div", { className: "overflow-x-auto sm:overflow-visible", children: [" ", _jsxs("table", { className: "min-w-full bg-white border-collapse", children: [_jsx("thead", { children: _jsxs("tr", { className: "bg-gray-800 text-white text-sm leading-normal", children: [_jsx("th", { className: "py-2 px-4 border-b text-left", children: "No" }), _jsx("th", { className: "py-2 px-4 border-b text-left", children: "Car Name" }), _jsx("th", { className: "py-2 px-4 border-b text-left", children: "Image" }), _jsx("th", { className: "py-2 px-4 border-b text-left", children: "Rent/Day" }), _jsx("th", { className: "py-2 px-4 border-b text-left", children: "RcNumber" }), _jsx("th", { className: "py-2 px-4 border-b text-left", children: "Edit" }), _jsx("th", { className: "py-2 px-4 border-b text-left", children: "Status" })] }) }), _jsx("tbody", { children: tableData && tableData.length > 0 ? (tableData.map(function (data, index) {
                            var _a;
                            return (_jsxs("tr", { children: [_jsx("td", { className: "py-2 px-4 border-b", children: index + 1 }), _jsx("td", { className: "py-2 px-4 border-b", children: (data === null || data === void 0 ? void 0 : data.car_name) || 'N/A' }), _jsx("td", { className: "py-2 px-4 border-b", children: ((_a = data === null || data === void 0 ? void 0 : data.images) === null || _a === void 0 ? void 0 : _a.length) > 0 ? (_jsx("img", { src: data.images[0], alt: data.car_name || 'Car', className: "w-16 h-auto" })) : ('No Image') }), _jsx("td", { className: "py-2 px-4 border-b", children: (data === null || data === void 0 ? void 0 : data.rentalPrice) || 'N/A' }), _jsx("td", { className: "py-2 px-4 border-b", children: (data === null || data === void 0 ? void 0 : data.rcNumber) || 'N/A' }), _jsx("td", { className: "py-2 px-4 border-b text-center", children: _jsx("button", { onClick: function () { return handleEdit(data === null || data === void 0 ? void 0 : data.id); }, className: "text-blue-600 hover:text-blue-800", children: _jsx(FaEdit, {}) }) }), _jsx("td", { className: "py-2 px-4 border-b text-center", children: _jsx("button", { onClick: function () { return handleStatus(data === null || data === void 0 ? void 0 : data.id); }, className: "py-1 px-3 rounded-full ".concat((data === null || data === void 0 ? void 0 : data.isBlocked) ? 'bg-red-600 text-white' : 'bg-green-600 text-white', " cursor-pointer"), children: (data === null || data === void 0 ? void 0 : data.isBlocked) ? 'Blocked' : 'Active' }) })] }, index));
                        })) : (_jsx("tr", { children: _jsx("td", { colSpan: 7, className: "text-center py-4", children: "No cars found" }) })) })] })] }));
};
export default CarMgtTable;
