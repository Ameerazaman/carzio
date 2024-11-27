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
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { carDetail, checkOffer, fetchCoupon, BookingConfirm, checkingBookedOrNot, userIdStoredInCoupon, checkBalanceUpdateWallet } from '../../../Api/User';
import toast from 'react-hot-toast';
import { MdError } from 'react-icons/md';
import UserAddress from './UserAdress';
function BookingPage() {
    var _this = this;
    var navigate = useNavigate();
    var user = useSelector(function (state) { return state.user.currentUser; });
    var carId = useParams().carId;
    var _a = useState({}), formErrors = _a[0], setFormErrors = _a[1];
    var _b = useState(false), loading = _b[0], setLoading = _b[1];
    var _c = useState(null), data = _c[0], setData = _c[1];
    var _d = useState(null), carData = _d[0], setCarData = _d[1];
    var _e = useState(false), isEditing = _e[0], setIsEditing = _e[1];
    var _f = useState(null), offerData = _f[0], setOfferData = _f[1];
    var _g = useState(null), couponData = _g[0], setCouponData = _g[1];
    var _h = useState({
        IssueDate: '',
        ReturnDate: '',
        Amount: 0,
        Payment: '',
        AdhaarNo: '',
        UserId: user === null || user === void 0 ? void 0 : user._id,
        CarsId: carId,
        UserAddressId: '',
        CouponAmt: 0,
        Coupon: '',
        ProviderId: '',
        PickUpTime: '',
        offerAmt: 0,
        rentDays: 1,
        total_Amt: 0,
        AmtOnDays: 0,
    }), formData = _h[0], setFormData = _h[1];
    useEffect(function () {
        var fetchCarData = function () { return __awaiter(_this, void 0, void 0, function () {
            var result, carDetails_1, err_1;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 3, 4, 5]);
                        setLoading(true);
                        if (!carId) return [3 /*break*/, 2];
                        return [4 /*yield*/, carDetail(carId)];
                    case 1:
                        result = _b.sent();
                        carDetails_1 = (_a = result === null || result === void 0 ? void 0 : result.data) === null || _a === void 0 ? void 0 : _a.data;
                        setCarData(carDetails_1);
                        if (carDetails_1) {
                            setFormData(function (prevData) {
                                var _a;
                                var rentalPrice = (_a = carDetails_1.rentalPrice) !== null && _a !== void 0 ? _a : 0;
                                var rentDays = prevData.rentDays || 1;
                                return __assign(__assign({}, prevData), { Amount: rentalPrice, AmtOnDays: rentDays * rentalPrice, total_Amt: rentalPrice, ProviderId: carDetails_1.providerId });
                            });
                        }
                        _b.label = 2;
                    case 2: return [3 /*break*/, 5];
                    case 3:
                        err_1 = _b.sent();
                        return [3 /*break*/, 5];
                    case 4:
                        setLoading(false);
                        return [7 /*endfinally*/];
                    case 5: return [2 /*return*/];
                }
            });
        }); };
        fetchCarData();
    }, [carId]);
    useEffect(function () {
        var fetchCouponAndOfferData = function () { return __awaiter(_this, void 0, void 0, function () {
            var couponData_1, couponsArray, validCoupons, offerData_1, offer, discountPercentage_1, err_2;
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _c.trys.push([0, 4, 5, 6]);
                        setLoading(true);
                        if (!((user === null || user === void 0 ? void 0 : user._id) && (carData === null || carData === void 0 ? void 0 : carData.car_name))) return [3 /*break*/, 3];
                        return [4 /*yield*/, fetchCoupon(user === null || user === void 0 ? void 0 : user._id)];
                    case 1:
                        couponData_1 = _c.sent();
                        couponsArray = ((_a = couponData_1 === null || couponData_1 === void 0 ? void 0 : couponData_1.data) === null || _a === void 0 ? void 0 : _a.data) || [];
                        validCoupons = couponsArray.filter(function (coupon) { return formData.AmtOnDays >= coupon.minRentalAmount; });
                        if (validCoupons.length > 0) {
                            setCouponData(validCoupons);
                        }
                        return [4 /*yield*/, checkOffer(carData.car_name)];
                    case 2:
                        offerData_1 = _c.sent();
                        if ((_b = offerData_1 === null || offerData_1 === void 0 ? void 0 : offerData_1.data) === null || _b === void 0 ? void 0 : _b.data) {
                            offer = offerData_1.data.data;
                            discountPercentage_1 = offer.discountPercentage || 0;
                            setFormData(function (prevData) { return (__assign(__assign({}, prevData), { offerAmt: (discountPercentage_1 * prevData.AmtOnDays) / 100 })); });
                        }
                        _c.label = 3;
                    case 3: return [3 /*break*/, 6];
                    case 4:
                        err_2 = _c.sent();
                        return [3 /*break*/, 6];
                    case 5:
                        setLoading(false);
                        return [7 /*endfinally*/];
                    case 6: return [2 /*return*/];
                }
            });
        }); };
        fetchCouponAndOfferData();
    }, [user, carData === null || carData === void 0 ? void 0 : carData.car_name, formData.AmtOnDays]);
    var handleChange = function (e) {
        var _a = e.target, name = _a.name, value = _a.value;
        setFormData(function (prevData) {
            var _a;
            var updatedData = __assign(__assign({}, prevData), (_a = {}, _a[name] = value, _a));
            if (name === 'IssueDate' || name === 'ReturnDate') {
                var IssueDate = updatedData.IssueDate, ReturnDate = updatedData.ReturnDate;
                if (IssueDate && ReturnDate) {
                    var issueDate = new Date(IssueDate);
                    var returnDate = new Date(ReturnDate);
                    var timeDifference = returnDate.getTime() - issueDate.getTime();
                    var daysDifference = Math.max(Math.ceil(timeDifference / (1000 * 3600 * 24)), 1);
                    updatedData.rentDays = daysDifference;
                    updatedData.AmtOnDays = updatedData.rentDays * updatedData.Amount;
                }
            }
            return updatedData;
        });
    };
    var validateFormData = function () {
        var errors = {};
        var today = new Date().toISOString().split("T")[0];
        if (!formData.IssueDate) {
            errors.IssueDate = "Issue Date is required.";
        }
        else if (formData.IssueDate <= today) {
            errors.IssueDate = "Issue Date must be a future date.";
        }
        if (!formData.ReturnDate) {
            errors.ReturnDate = "Return Date is required.";
        }
        else if (formData.ReturnDate <= today) {
            errors.ReturnDate = "Return Date must be a future date.";
        }
        else if (formData.ReturnDate <= formData.IssueDate) {
            errors.ReturnDate = "Return Date must be after Issue Date.";
        }
        if (formData.Amount <= 0)
            errors.Amount = "Amount must be greater than zero.";
        if (!formData.Payment)
            errors.Payment = "Payment method is required.";
        if (!formData.AdhaarNo || formData.AdhaarNo.length !== 12)
            errors.AdhaarNo = "Aadhaar number must be 12 digits.";
        if (!formData.UserId)
            errors.UserId = "User ID is required.";
        if (!formData.CarsId)
            errors.CarsId = "Car ID is required.";
        if (!formData.UserAddressId)
            errors.UserAddressId = "User Address ID is required.";
        if (formData.CouponAmt < 0)
            errors.CouponAmt = "Coupon Amount must be zero or positive.";
        if (formData.offerAmt < 0)
            errors.offerAmt = "Offer Amount must be zero or positive.";
        if (formData.rentDays <= 0)
            errors.rentDays = "Rent days must be at least 1.";
        if (formData.total_Amt <= 0)
            errors.total_Amt = "Total Amount must be greater than zero.";
        if (!formData.PickUpTime)
            errors.PickUpTime = "Pick up time is required.";
        return errors;
    };
    var handleSubmit = function (e) { return __awaiter(_this, void 0, void 0, function () {
        var errors, adjustedFormData, result, walletResult, bookingResult, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    e.preventDefault();
                    errors = validateFormData();
                    setFormErrors(errors);
                    if (Object.keys(errors).length > 0) {
                        toast.error("Please fix the errors before submitting.");
                        return [2 /*return*/];
                    }
                    // Validate required fields before proceeding
                    if (!formData.UserId) {
                        toast.error("User ID is required.");
                        return [2 /*return*/];
                    }
                    if (!formData.CarsId) {
                        toast.error("Car ID is required.");
                        return [2 /*return*/];
                    }
                    adjustedFormData = __assign(__assign({}, formData), { UserId: formData.UserId, CarsId: formData.CarsId, providerId: (carData === null || carData === void 0 ? void 0 : carData.providerId) || '', total_Amt: formData.AmtOnDays - formData.offerAmt - formData.CouponAmt, status: "pending" });
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 11, , 12]);
                    return [4 /*yield*/, checkingBookedOrNot(formData.IssueDate, formData.ReturnDate, formData.CarsId)];
                case 2:
                    result = _a.sent();
                    console.log(result, "result in checkingBookedOrNot");
                    if (!result.data.data.success) return [3 /*break*/, 9];
                    if (formData.Payment === "Online payment") {
                        adjustedFormData.status = "success";
                        navigate('/checkOut', { state: { bookingData: adjustedFormData } });
                        return [2 /*return*/];
                    }
                    if (!(formData.Payment === "Wallet" && formData.UserId)) return [3 /*break*/, 4];
                    return [4 /*yield*/, checkBalanceUpdateWallet(adjustedFormData.total_Amt, formData.UserId)];
                case 3:
                    walletResult = _a.sent();
                    if (!walletResult.data.data.success) {
                        toast.error(walletResult.data.data.message);
                        return [2 /*return*/];
                    }
                    _a.label = 4;
                case 4: return [4 /*yield*/, BookingConfirm(adjustedFormData)];
                case 5:
                    bookingResult = _a.sent();
                    if (!bookingResult) return [3 /*break*/, 8];
                    if (!adjustedFormData.Coupon) return [3 /*break*/, 7];
                    return [4 /*yield*/, userIdStoredInCoupon(adjustedFormData.Coupon, adjustedFormData.UserId)];
                case 6:
                    _a.sent();
                    _a.label = 7;
                case 7:
                    navigate('/success');
                    _a.label = 8;
                case 8:
                    console.log("Form submitted successfully:", bookingResult);
                    return [3 /*break*/, 10];
                case 9:
                    toast.error(result.data.data.message);
                    _a.label = 10;
                case 10: return [3 /*break*/, 12];
                case 11:
                    error_1 = _a.sent();
                    console.error("Error submitting form:", error_1);
                    toast.error("Error submitting form. Please try again.");
                    return [3 /*break*/, 12];
                case 12: return [2 /*return*/];
            }
        });
    }); };
    var handleAddressId = function (id) {
        setFormData(function (prevData) { return (__assign(__assign({}, prevData), { UserAddressId: id })); });
    };
    var handleCouponApply = function () {
        if (couponData && Array.isArray(couponData)) { // Check if couponData is not null
            var selectedCoupon = couponData.find(function (coupon) { return coupon.code === formData.Coupon; });
            if (selectedCoupon) {
                var discountAmount_1 = (selectedCoupon.discountPercentage / 100) * formData.AmtOnDays;
                console.log(discountAmount_1, "discount");
                setFormData(function (prevData) {
                    var newTotalAmt = prevData.Amount * prevData.rentDays - discountAmount_1; // Calculate the new total amount
                    return __assign(__assign({}, prevData), { CouponAmt: discountAmount_1, total_Amt: Math.max(newTotalAmt, 0) // Ensure total_Amt doesn't go below 0
                     });
                });
            }
            else {
                toast.error("Please select a valid coupon.");
            }
        }
        else {
            toast.error("Coupon data is not available.");
        }
    };
    if (!carData) {
        return (_jsxs("div", { className: "flex flex-col items-center justify-center h-full text-center", children: [_jsx(MdError, { className: "text-red-500 text-6xl mb-4" }), _jsx("p", { className: "text-red-500 text-2xl font-semibold", children: "Car Not Found or Blocked" }), _jsx("p", { className: "text-gray-500 mt-2", children: "We're sorry, but the car you're looking for is either unavailable or has been blocked." })] }));
    }
    return (_jsx("div", { className: "flex justify-center items-center min-h-screen via-blue-200 to-blue-100 p-4", children: _jsxs("form", { onSubmit: handleSubmit, className: "flex flex-wrap w-full max-w-5xl bg-white shadow-lg rounded-2xl p-8", children: [_jsxs("div", { className: "w-full md:w-1/2 pr-6 flex flex-col space-y-6", children: [_jsxs("div", { className: "flex space-x-6 items-center shadow-lg p-4 rounded-lg bg-white", children: [_jsx("img", { src: carData === null || carData === void 0 ? void 0 : carData.images[0], className: "h-40 w-40 object-contain rounded-lg" }), _jsxs("div", { children: [_jsx("h2", { className: "text-2xl font-bold text-gray-800 mb-4", children: carData === null || carData === void 0 ? void 0 : carData.car_name }), _jsxs("div", { className: "space-y-3", children: [_jsxs("div", { className: "relative", children: [_jsx("input", { type: "date", name: "IssueDate", value: formData.IssueDate || '', onChange: handleChange, className: "peer block w-full p-2 text-sm border border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200" }), _jsx("label", { className: "absolute left-3 top-2.5 z-10 origin-[0] -translate-y-4 scale-75 transform select-none bg-white px-2 text-sm text-gray-500 transition-all peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4 peer-focus:text-blue-500", children: "Issue Date" }), formErrors.IssueDate && _jsx("p", { className: "text-red-500", children: formErrors.IssueDate })] }, "IssueDate"), _jsxs("div", { className: "relative", children: [_jsx("input", { type: "date", name: "ReturnDate", value: formData.ReturnDate || '', onChange: handleChange, className: "peer block w-full p-2 text-sm border border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200" }), _jsx("label", { className: "absolute left-3 top-2.5 z-10 origin-[0] -translate-y-4 scale-75 transform select-none bg-white px-2 text-sm text-gray-500 transition-all peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4 peer-focus:text-blue-500", children: "Return Date" }), formErrors.ReturnDate && _jsx("p", { className: "text-red-500", children: formErrors.ReturnDate })] }, "ReturnDate"), _jsxs("div", { className: "flex space-x-4", children: [_jsxs("div", { className: "relative w-1/2", children: [_jsx("input", { type: "text", name: "AdhaarNo", value: formData.AdhaarNo || '', onChange: handleChange, maxLength: 12, className: "peer block w-full p-2 text-sm border border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200" }), _jsx("label", { className: "absolute left-3 top-2.5 z-10 origin-[0] -translate-y-4 scale-75 transform select-none bg-white px-2 text-sm text-gray-500 transition-all peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4 peer-focus:text-blue-500", children: "Aadhaar No." }), formErrors.AdhaarNo && _jsx("p", { className: "text-red-500", children: formErrors.AdhaarNo })] }, "AdhaarNo"), _jsxs("div", { className: "relative w-1/2", children: [_jsx("input", { type: "time", name: "PickUpTime", value: formData.PickUpTime || '', onChange: handleChange, className: "peer block w-full p-2 text-sm border border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200" }), _jsx("label", { className: "absolute left-3 top-2.5 z-10 origin-[0] -translate-y-4 scale-75 transform select-none bg-white px-2 text-sm text-gray-500 transition-all peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4 peer-focus:text-blue-500", children: "Pick up time" }), formErrors.PickUpTime && _jsx("p", { className: "text-red-500", children: formErrors.PickUpTime })] }, "PickUpTime")] })] })] })] }), _jsx("div", { children: _jsx(UserAddress, { onAddressIdChange: handleAddressId }) }), couponData &&
                            _jsxs("div", { className: "bg-white rounded-lg shadow-lg p-6 space-y-4", children: [_jsx("label", { className: "block text-lg font-semibold text-gray-800", children: "Coupon Code:" }), _jsxs("div", { className: "flex items-center space-x-4", children: [_jsxs("select", { name: "Coupon", value: formData === null || formData === void 0 ? void 0 : formData.Coupon, onChange: handleChange, className: "p-2 text-sm border border-gray-300 rounded-lg shadow-sm w-full md:w-2/3", children: [_jsx("option", { value: "", children: "Select Coupon" }), Array.isArray(couponData) && couponData.map(function (coupon) { return (_jsxs("option", { value: coupon.code, children: [coupon.code, " - ", coupon.discountPercentage, "% Off"] }, coupon.code)); })] }), _jsx("button", { type: "button", onClick: handleCouponApply, className: "ml-4 p-2 bg-green-500 text-white text-sm font-medium rounded-lg hover:bg-green-600", children: "Apply" }), formErrors.Coupon && _jsx("p", { className: "text-red-500", children: formErrors.Coupon })] })] })] }), _jsxs("div", { className: "w-full md:w-1/2 pl-6 flex flex-col space-y-6 mt-8 md:mt-0", children: [_jsxs("div", { className: "bg-white rounded-lg shadow-lg p-6 space-y-4", children: [_jsx("label", { className: "block text-lg font-semibold text-gray-800", children: "Payment Method:" }), ['Cash on issue date', 'Online payment', 'Cash on return date', "Wallet"].map(function (method) { return (_jsxs("div", { className: "flex items-center", children: [_jsx("input", { type: "radio", name: "Payment", value: method, checked: formData.Payment === method, onChange: handleChange, id: method.toLowerCase().replace(" ", ""), 
                                            // required
                                            className: "form-radio h-4 w-4 text-blue-600 focus:ring-blue-500" }), _jsx("label", { htmlFor: method.toLowerCase().replace(" ", ""), className: "ml-2 text-sm text-gray-700", children: method })] }, method)); }), formErrors.Payment && _jsx("p", { className: "text-red-500", children: formErrors.Payment })] }), _jsxs("div", { className: "bg-white rounded-lg shadow-lg p-6 space-y-4", children: [_jsx("label", { className: "block text-lg font-semibold text-gray-800", children: "Pricing Summary" }), _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("span", { className: "text-sm text-gray-700", children: ["Car Rent Amt/day(\u20B9", (carData === null || carData === void 0 ? void 0 : carData.rentalPrice) || 0, ")"] }), _jsxs("span", { className: "text-sm text-gray-900", children: ["\u20B9", (carData === null || carData === void 0 ? void 0 : carData.rentalPrice) || 0, "(", formData.rentDays, "days)"] }), _jsx("input", { type: "number", name: 'car_rent_amt', value: carData === null || carData === void 0 ? void 0 : carData.rentalPrice, hidden: true }), formErrors.rentalPrice && _jsx("p", { className: "text-red-500", children: formErrors.rentalPrice })] }), _jsxs("div", { className: "flex items-center justify-between", children: [_jsx("span", { className: "text-sm text-gray-700", children: "Offers Deduction" }), _jsxs("span", { className: "text-sm text-green-600", children: ["- ", formData.offerAmt || 0, "%"] }), formErrors.offerAmt && _jsx("p", { className: "text-red-500", children: formErrors.offerAmt })] }), _jsxs("div", { className: "flex items-center justify-between", children: [_jsx("span", { className: "text-sm text-gray-700", children: "Coupon Code Deduction" }), _jsxs("span", { className: "text-sm text-green-600", children: ["- \u20B9", formData.CouponAmt] }), formErrors.discountPercentage && _jsx("p", { className: "text-red-500", children: formErrors.discountPercentage })] }), _jsxs("div", { className: "flex items-center justify-between mt-4 font-semibold", children: [_jsx("span", { className: "text-lg text-gray-800", children: "Total Amount" }), _jsxs("span", { className: "text-lg text-blue-600", children: ["\u20B9", (formData.AmtOnDays || 0) - (formData.CouponAmt || 0) - (formData.offerAmt || 0), formErrors.total_Amt && _jsx("p", { className: "text-red-500", children: formErrors.total_Amt })] })] })] }), _jsx("button", { type: "submit", className: "p-2 bg-blue-600 text-white text-lg font-medium rounded-lg shadow-lg hover:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-200 mt-8", children: "Confirm Booking" })] })] }) }));
}
export default BookingPage;
