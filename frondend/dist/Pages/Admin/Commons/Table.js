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
import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { FaEdit } from 'react-icons/fa';
import { editCoupon, editOffer, editProvider, editUser, updateStatus, updateStatusCar, updateStatusCoupon, updateStatusOffer, updateStatusProvider } from '../../../Api/Admin';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
var Table = function (_a) {
    var initialTableData = _a.tableData, header = _a.header;
    var _b = useState(initialTableData), tableData = _b[0], setTableData = _b[1];
    var navigate = useNavigate();
    useEffect(function () {
        console.log(tableData, 'data');
    }, [tableData]);
    var handleEdit = function (id) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!(header === "user")) return [3 /*break*/, 2];
                    return [4 /*yield*/, editUser(id)];
                case 1:
                    _a.sent();
                    navigate("/admin/edit_".concat(header, "/").concat(id));
                    return [3 /*break*/, 8];
                case 2:
                    if (!(header === 'coupons')) return [3 /*break*/, 4];
                    return [4 /*yield*/, editCoupon(id)];
                case 3:
                    _a.sent();
                    navigate("/admin/edit_".concat(header, "/").concat(id));
                    return [3 /*break*/, 8];
                case 4:
                    if (!(header === "offers")) return [3 /*break*/, 6];
                    return [4 /*yield*/, editOffer(id)];
                case 5:
                    _a.sent();
                    navigate("/admin/edit_".concat(header, "/").concat(id));
                    return [3 /*break*/, 8];
                case 6: return [4 /*yield*/, editProvider(id)];
                case 7:
                    _a.sent();
                    navigate("/admin/edit_".concat(header, "/").concat(id));
                    _a.label = 8;
                case 8: return [2 /*return*/];
            }
        });
    }); };
    var handleStatus = function (id) { return __awaiter(void 0, void 0, void 0, function () {
        var result, statusUpdateResult, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 13, , 14]);
                    return [4 /*yield*/, Swal.fire({
                            title: 'Are you sure?',
                            text: 'Do you want to change the status or delete it?',
                            icon: 'warning',
                            showCancelButton: true,
                            confirmButtonText: 'Yes, change status',
                            cancelButtonText: 'No, cancel',
                        })];
                case 1:
                    result = _a.sent();
                    if (!result.isConfirmed) return [3 /*break*/, 12];
                    console.log("id check", id);
                    statusUpdateResult = void 0;
                    if (!(header === "user")) return [3 /*break*/, 3];
                    return [4 /*yield*/, updateStatus(id)];
                case 2:
                    statusUpdateResult = _a.sent();
                    return [3 /*break*/, 11];
                case 3:
                    if (!(header === "cars")) return [3 /*break*/, 5];
                    console.log("Handling car status update");
                    return [4 /*yield*/, updateStatusCar(id)];
                case 4:
                    statusUpdateResult = _a.sent();
                    return [3 /*break*/, 11];
                case 5:
                    if (!(header === 'coupons')) return [3 /*break*/, 7];
                    console.log("Handling car status update");
                    return [4 /*yield*/, updateStatusCoupon(id)];
                case 6:
                    statusUpdateResult = _a.sent();
                    return [3 /*break*/, 11];
                case 7:
                    if (!(header === "offers")) return [3 /*break*/, 9];
                    console.log("Handling offer status update");
                    return [4 /*yield*/, updateStatusOffer(id)];
                case 8:
                    statusUpdateResult = _a.sent();
                    return [3 /*break*/, 11];
                case 9: return [4 /*yield*/, updateStatusProvider(id)];
                case 10:
                    statusUpdateResult = _a.sent();
                    _a.label = 11;
                case 11:
                    if (statusUpdateResult) {
                        // Show success alert
                        Swal.fire({
                            title: 'Success!',
                            text: 'Status updated successfully!',
                            icon: 'success',
                            confirmButtonText: 'OK',
                        });
                        if (statusUpdateResult) {
                            setTableData(function (prevTableData) {
                                return prevTableData.map(function (data) {
                                    return data.id === id
                                        ? __assign(__assign({}, data), { isBlocked: data.hasOwnProperty('isBlocked') ? !data.isBlocked : data.isBlocked, isActive: data.hasOwnProperty('isActive') ? !data.isActive : data.isActive }) : data;
                                });
                            });
                        }
                    }
                    return [3 /*break*/, 12];
                case 12: return [3 /*break*/, 14];
                case 13:
                    error_1 = _a.sent();
                    // Show error alert
                    Swal.fire({
                        title: 'Error!',
                        text: 'Something went wrong while updating the status.',
                        icon: 'error',
                        confirmButtonText: 'Try Again',
                    });
                    return [3 /*break*/, 14];
                case 14: return [2 /*return*/];
            }
        });
    }); };
    return (_jsxs("table", { className: "min-w-full bg-white border-collapse", children: [_jsx("thead", { children: _jsx("tr", { children: header === "notification" ? (_jsxs(_Fragment, { children: [_jsx("th", { className: "py-2 px-4 border-b text-left", children: "No" }), _jsx("th", { className: "py-2 px-4 border-b text-left", children: "Car Name" }), _jsx("th", { className: "py-2 px-4 border-b text-left", children: "Image" }), _jsx("th", { className: "py-2 px-4 border-b text-left", children: "Rent/Day" }), _jsx("th", { className: "py-2 px-4 border-b text-left", children: "Date" }), _jsx("th", { className: "py-2 px-4 border-b text-left", children: "Details" })] })) : header === "cars" ? (_jsxs(_Fragment, { children: [_jsx("th", { className: "py-2 px-4 border-b text-left", children: "No" }), _jsx("th", { className: "py-2 px-4 border-b text-left", children: "Car Name" }), _jsx("th", { className: "py-2 px-4 border-b text-left", children: "Image" }), _jsx("th", { className: "py-2 px-4 border-b text-left", children: "Rent/Day" }), _jsx("th", { className: "py-2 px-4 border-b text-left", children: "RcNumber" }), _jsx("th", { className: "py-2 px-4 border-b text-left", children: "Status" })] })) : header === "offers" ? (_jsxs(_Fragment, { children: [_jsx("th", { className: "py-2 px-4 border-b text-left", children: "No" }), _jsx("th", { className: "py-2 px-4 border-b text-left", children: "Offer Name" }), _jsx("th", { className: "py-2 px-4 border-b text-left", children: "Discount (%)" }), _jsx("th", { className: "py-2 px-4 border-b text-left", children: "carName" }), _jsx("th", { className: "py-2 px-4 border-b text-left", children: "End Date" }), _jsx("th", { className: "py-2 px-4 border-b text-left", children: "Edit" }), _jsx("th", { className: "py-2 px-4 border-b text-left", children: "Status" })] })) : header === "coupons" ? (_jsxs(_Fragment, { children: [_jsx("th", { className: "py-2 px-4 border-b text-left", children: "No" }), _jsx("th", { className: "py-2 px-4 border-b text-left", children: "Code" }), _jsx("th", { className: "py-2 px-4 border-b text-left", children: "Discount (%)" }), _jsx("th", { className: "py-2 px-4 border-b text-left", children: "Min Rent Amt" }), _jsx("th", { className: "py-2 px-4 border-b text-left", children: "Start Date" }), _jsx("th", { className: "py-2 px-4 border-b text-left", children: "End Date" }), _jsx("th", { className: "py-2 px-4 border-b text-left", children: "Edit" }), _jsx("th", { className: "py-2 px-4 border-b text-left", children: "Status" })] })) : (_jsxs(_Fragment, { children: [_jsx("th", { className: "py-2 px-4 border-b text-left", children: "No" }), _jsx("th", { className: "py-2 px-4 border-b text-left", children: "Email" }), _jsx("th", { className: "py-2 px-4 border-b text-left", children: header === "user" ? "Username" : "Provider Name" }), _jsx("th", { className: "py-2 px-4 border-b text-left", children: "Edit" }), _jsx("th", { className: "py-2 px-4 border-b text-left", children: "Status" })] })) }) }), _jsx("tbody", { children: (tableData === null || tableData === void 0 ? void 0 : tableData.length) > 0 ? (tableData.map(function (data, index) {
                    var _a, _b;
                    return (_jsx("tr", { children: header === 'notification' ? (_jsxs(_Fragment, { children: [_jsx("td", { className: "py-2 px-4 border-b", children: index + 1 }), _jsx("td", { className: "py-2 px-4 border-b", children: (data === null || data === void 0 ? void 0 : data.car_name) || "N/A" }), _jsx("td", { className: "py-2 px-4 border-b", children: ((_a = data === null || data === void 0 ? void 0 : data.images) === null || _a === void 0 ? void 0 : _a.length) > 0 ? (_jsx("img", { src: data.images[0], alt: data.car_name, className: "w-16 h-auto" })) : ("No Image") }), _jsx("td", { className: "py-2 px-4 border-b", children: data.rentalPrice }), _jsx("td", { className: "py-2 px-4 border-b", children: data.createdAt }), _jsx("td", { className: "py-2 px-4 border-b text-center", children: _jsx(Link, { to: "/admin/notifications_details/".concat(data.id), children: _jsx("button", { className: "mt-2 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded", children: "View Details" }) }) })] })) : header === 'cars' ? (_jsxs(_Fragment, { children: [_jsx("td", { className: "py-2 px-4 border-b", children: index + 1 }), _jsx("td", { className: "py-2 px-4 border-b", children: (data === null || data === void 0 ? void 0 : data.car_name) || "N/A" }), _jsx("td", { className: "py-2 px-4 border-b", children: ((_b = data === null || data === void 0 ? void 0 : data.images) === null || _b === void 0 ? void 0 : _b.length) > 0 ? (_jsx("img", { src: data.images[0], alt: data.car_name, className: "w-16 h-auto" })) : ("No Image") }), _jsx("td", { className: "py-2 px-4 border-b", children: data.rentalPrice }), _jsx("td", { className: "py-2 px-4 border-b", children: data.rcNumber }), _jsx("td", { className: "py-2 px-4 border-b text-center", children: _jsx("button", { onClick: function () { return handleStatus(data === null || data === void 0 ? void 0 : data.id); }, className: "py-1 px-3 rounded-full ".concat((data === null || data === void 0 ? void 0 : data.isBlocked) ? 'bg-red-600 text-white' : 'bg-green-600 text-white', " cursor-pointer"), children: (data === null || data === void 0 ? void 0 : data.isBlocked) ? 'Blocked' : 'Active' }) })] })) : header === 'coupons' ? (_jsxs(_Fragment, { children: [_jsx("td", { className: "py-2 px-4 border-b", children: index + 1 }), _jsx("td", { className: "py-2 px-4 border-b", children: data.code || "N/A" }), _jsx("td", { className: "py-2 px-4 border-b", children: data.discountPercentage || "N/A" }), _jsx("td", { className: "py-2 px-4 border-b", children: data.minRentalAmount || "N/A" }), _jsx("td", { className: "py-2 px-4 border-b", children: new Date(data.startDate).toLocaleDateString() || "N/A" }), _jsx("td", { className: "py-2 px-4 border-b", children: new Date(data.endDate).toLocaleDateString() || "N/A" }), _jsx("td", { className: "py-2 px-4 border-b text-center", children: _jsx("button", { onClick: function () { return handleEdit(data.id); }, className: "text-blue-600 hover:text-blue-800", children: _jsx(FaEdit, {}) }) }), _jsx("td", { className: "py-2 px-4 border-b text-center", children: _jsx("button", { onClick: function () { return handleStatus(data === null || data === void 0 ? void 0 : data.id); }, className: "py-1 px-3 rounded-full ".concat((data === null || data === void 0 ? void 0 : data.isActive) ? 'bg-green-600 text-white' : 'bg-red-600 text-white', " cursor-pointer"), children: (data === null || data === void 0 ? void 0 : data.isActive) ? 'Active' : 'Block' }) })] })) : header === 'offers' ? (_jsxs(_Fragment, { children: [_jsx("td", { className: "py-2 px-4 border-b", children: index + 1 }), _jsx("td", { className: "py-2 px-4 border-b", children: (data === null || data === void 0 ? void 0 : data.offerTitle) || "N/A" }), _jsxs("td", { className: "py-2 px-4 border-b", children: [data === null || data === void 0 ? void 0 : data.discountPercentage, "%"] }), _jsx("td", { className: "py-2 px-4 border-b", children: data === null || data === void 0 ? void 0 : data.carName }), _jsx("td", { className: "py-2 px-4 border-b", children: data === null || data === void 0 ? void 0 : data.endDate }), _jsx("td", { className: "py-2 px-4 border-b text-center", children: _jsx("button", { onClick: function () { return handleEdit(data === null || data === void 0 ? void 0 : data.id); }, className: "text-blue-600 hover:text-blue-800", children: _jsx(FaEdit, {}) }) }), _jsx("td", { className: "py-2 px-4 border-b text-center", children: _jsx("button", { onClick: function () { return handleStatus(data === null || data === void 0 ? void 0 : data.id); }, className: "py-1 px-3 rounded-full ".concat((data === null || data === void 0 ? void 0 : data.isActive) ? 'bg-red-600 text-white' : 'bg-green-600 text-white', " cursor-pointer"), children: (data === null || data === void 0 ? void 0 : data.isActive) ? 'Active' : 'Block' }) })] })) : (_jsxs(_Fragment, { children: [_jsx("td", { className: "py-2 px-4 border-b", children: index + 1 }), _jsx("td", { className: "py-2 px-4 border-b", children: (data === null || data === void 0 ? void 0 : data.email) || "N/A" }), _jsx("td", { className: "py-2 px-4 border-b", children: header === 'user' ? (data === null || data === void 0 ? void 0 : data.username) || "N/A" : (data === null || data === void 0 ? void 0 : data.usernamev) || "N/A" }), " ", _jsx("td", { className: "py-2 px-4 border-b text-center", children: _jsx("button", { onClick: function () { return handleEdit(data === null || data === void 0 ? void 0 : data.id); }, className: "text-blue-600 hover:text-blue-800", children: _jsx(FaEdit, {}) }) }), _jsx("td", { className: "py-2 px-4 border-b text-center", children: _jsx("button", { onClick: function () { return handleStatus(data === null || data === void 0 ? void 0 : data.id); }, className: "py-1 px-3 rounded-full ".concat((data === null || data === void 0 ? void 0 : data.isBlocked) ? 'bg-red-600 text-white' : 'bg-green-600 text-white', " cursor-pointer"), children: (data === null || data === void 0 ? void 0 : data.isBlocked) ? 'Blocked' : 'Active' }) })] })) }, index));
                })) : (_jsx("tr", { children: _jsxs("td", { colSpan: header === "notification" ? 5 : 6, className: "text-center py-4", children: ["No ", header, "s found"] }) })) })] }));
};
export default Table;
