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
import { useState, useEffect } from 'react';
import { resend, verifyOtp } from '../../Api/User';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
var Otp = function () {
    var _a = useState(50), timer = _a[0], setTimer = _a[1]; // Set initial timer value
    var _b = useState(true), isTimerActive = _b[0], setIsTimerActive = _b[1]; // State to control button text
    var _c = useState(Array(6).fill('')), otp = _c[0], setOtp = _c[1]; // State to store the OTP digits
    var navigate = useNavigate();
    // Effect to handle countdown
    useEffect(function () {
        if (timer > 0 && isTimerActive) {
            var interval_1 = setInterval(function () {
                setTimer(function (prev) { return prev - 1; });
            }, 1000);
            return function () { return clearInterval(interval_1); }; // Cleanup interval on component unmount or timer change
        }
        else if (timer === 0) {
            setIsTimerActive(false); // Stop the timer when it reaches 0
        }
    }, [timer, isTimerActive]);
    var handleResendOtp = function () { return __awaiter(void 0, void 0, void 0, function () {
        var result, error_1;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _c.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, resend()];
                case 1:
                    result = _c.sent();
                    if ((_a = result === null || result === void 0 ? void 0 : result.data) === null || _a === void 0 ? void 0 : _a.success) {
                        // Reset OTP inputs and restart the timer in sequence
                        setOtp(Array(6).fill('')); // Reset OTP input fields
                        setIsTimerActive(false); // Stop the timer before restarting
                        // Use setTimeout to ensure states update properly
                        setTimeout(function () {
                            setTimer(50); // Reset the timer to 50 seconds
                            setIsTimerActive(true); // Reactivate the timer after resetting
                        }, 0);
                        toast.success('OTP resent successfully.');
                    }
                    else {
                        toast.error(((_b = result === null || result === void 0 ? void 0 : result.data) === null || _b === void 0 ? void 0 : _b.message) || 'Failed to resend OTP. Try again.');
                    }
                    return [3 /*break*/, 3];
                case 2:
                    error_1 = _c.sent();
                    toast.error('Error resending OTP. Please try again.');
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); };
    var handleInputChange = function (index, value) {
        // Update the OTP state based on input change
        var newOtp = __spreadArray([], otp, true);
        newOtp[index] = value.replace(/[^0-9]/g, ''); // Allow only numeric input
        setOtp(newOtp);
        // Move focus to the next input if the current input is filled
        if (value && index < otp.length - 1) {
            var nextInput = document.getElementById("otp-input-".concat(index + 1));
            if (nextInput) {
                nextInput.focus();
            }
        }
    };
    var handleSubmit = function (e) { return __awaiter(void 0, void 0, void 0, function () {
        var userOtp, result, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    e.preventDefault();
                    userOtp = otp.join('');
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, verifyOtp(userOtp)];
                case 2:
                    result = _a.sent();
                    console.log(result, "otp result");
                    if (result.success) {
                        toast.success('OTP verified and user saved successfully');
                        navigate('/login'); // Redirect to login page on success
                    }
                    else {
                        console.log('OTP verification failed.');
                        toast.error(result.message || 'OTP verification failed.');
                    }
                    return [3 /*break*/, 4];
                case 3:
                    error_2 = _a.sent();
                    console.error('Error during OTP verification:', error_2);
                    toast.error('Error during OTP verification. Please try again.');
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    return (_jsx("div", { className: "min-h-screen flex justify-center items-center bg-white", children: _jsxs("div", { className: "flex w-full max-w-3xl shadow-lg rounded-lg overflow-hidden relative", children: [_jsxs("div", { className: "flex-1 flex flex-col justify-center items-center bg-gray-100 p-4 md:p-6 relative z-10", children: [_jsx("h2", { className: "text-xl md:text-2xl font-bold mb-4 md:mb-6 text-black", children: "Enter OTP" }), _jsx("p", { className: "text-gray-600 mb-4 text-center text-sm md:text-base", children: "We have sent you an OTP on your registered mobile number." }), _jsxs("form", { className: "w-full max-w-xs", onSubmit: handleSubmit, children: [_jsx("div", { className: "grid grid-cols-6 gap-1 mb-4 md:mb-5", children: otp.map(function (digit, index) { return (_jsx("input", { id: "otp-input-".concat(index), type: "text", maxLength: 1, value: digit, onChange: function (e) { return handleInputChange(index, e.target.value); }, className: "w-full text-center border border-gray-300 rounded p-2 bg-white focus:outline-none focus:ring-2 focus:ring-red-500 text-sm" }, index)); }) }), isTimerActive ?
                                    _jsx("button", { type: "submit", className: "w-full bg-red-600 hover:bg-red-700 text-white py-2 md:py-2 rounded font-semibold transition duration-300 text-sm", children: "Verify OTP" }) : ""] }), isTimerActive &&
                            _jsxs("p", { className: "mt-4 text-gray-600 text-center text-sm", children: ["Didn't receive OTP?", ' ', _jsx("p", { onClick: handleResendOtp, className: "text-red-500 hover:underline", children: "Resend" })] }), _jsx("p", { className: "mt-4 text-gray-600 text-center text-sm", children: isTimerActive ? "Resend OTP in ".concat(timer, "s") : (_jsx("button", { type: "submit", onClick: handleResendOtp, className: "p-2 w-full bg-red-600 hover:bg-red-700 text-white py-2 md:py-2 rounded font-semibold transition duration-300 text-sm", children: "Resend" })) })] }), _jsxs("div", { className: "hidden lg:flex flex-1 justify-center items-center relative", children: [_jsx("img", { src: "/images/otp verify.avif", alt: "OTP Side", className: "object-cover w-full h-full rounded-md" }), _jsx("div", { className: "absolute inset-0 rounded-md bg-black opacity-5" })] })] }) }));
};
export default Otp;
