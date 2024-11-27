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
import { useLocation, useNavigate } from 'react-router-dom';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import toast from 'react-hot-toast';
import { userApi } from '../../../Services/Axios';
import { BookingConfirm, userIdStoredInCoupon } from '../../../Api/User';
var CheckoutForm = function () {
    var navigate = useNavigate();
    var location = useLocation();
    var bookingData = location.state.bookingData; // Get form data passed via navigation
    var _a = useState(false), loading = _a[0], setLoading = _a[1];
    var _b = useState(null), paymentIntent = _b[0], setPaymentIntent = _b[1];
    var stripe = useStripe();
    var elements = useElements();
    var _c = useState(null), cardError = _c[0], setCardError = _c[1]; // To store card validation errors
    // Create Payment Intent (called once the component mounts)
    useEffect(function () {
        var createPaymentIntent = function () { return __awaiter(void 0, void 0, void 0, function () {
            var response, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, userApi.post('/create-payment-intent', {
                                amount: bookingData.total_Amt, // Convert to cents
                            })];
                    case 1:
                        response = _a.sent();
                        setPaymentIntent(response.data);
                        return [3 /*break*/, 3];
                    case 2:
                        error_1 = _a.sent();
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); };
        createPaymentIntent();
    }, [bookingData]);
    var handleSubmit = function (event) { return __awaiter(void 0, void 0, void 0, function () {
        var clientSecret, result, result_1, result_2, error_2;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    event.preventDefault();
                    if (!stripe || !elements || !(paymentIntent === null || paymentIntent === void 0 ? void 0 : paymentIntent.clientSecret)) {
                        console.error("Stripe.js has not loaded or payment intent client secret is missing.");
                        return [2 /*return*/];
                    }
                    setLoading(true);
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 8, 9, 10]);
                    clientSecret = paymentIntent.clientSecret;
                    return [4 /*yield*/, stripe.confirmCardPayment(clientSecret, {
                            payment_method: {
                                card: elements.getElement(CardElement),
                            },
                        })];
                case 2:
                    result = _b.sent();
                    if (!result.error) return [3 /*break*/, 3];
                    toast.error("An error occurred during payment.");
                    return [3 /*break*/, 7];
                case 3:
                    if (!(((_a = result.paymentIntent) === null || _a === void 0 ? void 0 : _a.status) === 'succeeded')) return [3 /*break*/, 7];
                    toast.success('Payment successful!');
                    return [4 /*yield*/, BookingConfirm(bookingData)];
                case 4:
                    result_1 = _b.sent();
                    if (!result_1) return [3 /*break*/, 7];
                    if (!bookingData.Coupon) return [3 /*break*/, 6];
                    return [4 /*yield*/, userIdStoredInCoupon(bookingData.Coupon, bookingData.UserId)];
                case 5:
                    result_2 = _b.sent();
                    _b.label = 6;
                case 6:
                    navigate('/success'); // Redirect to success page
                    _b.label = 7;
                case 7: return [3 /*break*/, 10];
                case 8:
                    error_2 = _b.sent();
                    toast.error("An error occurred during payment.");
                    return [3 /*break*/, 10];
                case 9:
                    setLoading(false);
                    return [7 /*endfinally*/];
                case 10: return [2 /*return*/];
            }
        });
    }); };
    return (_jsxs("form", { onSubmit: handleSubmit, className: "w-full max-w-md mx-auto", children: [_jsx("h2", { className: "text-center text-xl font-semibold", children: "Checkout" }), _jsxs("div", { className: "my-4", children: [_jsx(CardElement, {}), cardError && _jsx("p", { className: "text-red-500 text-center", children: cardError }), " "] }), _jsx("div", { className: "text-center", children: _jsx("button", { type: "submit", disabled: !stripe || loading, className: "bg-blue-500 text-white px-4 py-2 rounded", children: loading ? "Processing..." : "Pay Now" }) })] }));
};
export default CheckoutForm;
