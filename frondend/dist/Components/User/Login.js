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
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loginUser } from '../../Api/User';
import { toast } from 'react-hot-toast';
import { signInSuccess } from '../../App/Slice/UserSlice';
function Login() {
    var _this = this;
    var dispatch = useDispatch();
    var _a = useState(''), email = _a[0], setEmail = _a[1];
    var _b = useState(''), password = _b[0], setPassword = _b[1];
    var _c = useState({}), errors = _c[0], setErrors = _c[1];
    var navigate = useNavigate();
    var validation = function () {
        var new_errors = {};
        var trimmedEmail = email.trim(); // trim spaces at the start and end
        var trimmedPassword = password.trim(); // trim spaces at the start and end
        if (!trimmedEmail)
            new_errors.email = 'Email is required';
        if (!trimmedPassword)
            new_errors.password = 'Password is required';
        if (/\s/.test(trimmedPassword)) {
            new_errors.password = 'Password should not contain spaces';
        }
        if (password.length < 6) {
            new_errors.password = 'Password must be at least 6 characters long';
        }
        // Update state with trimmed values
        setEmail(trimmedEmail);
        setPassword(trimmedPassword);
        return new_errors;
    };
    var submitData = function (e) { return __awaiter(_this, void 0, void 0, function () {
        var formData, validationErrors, response, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    e.preventDefault();
                    formData = { email: email, password: password };
                    validationErrors = validation();
                    if (Object.keys(validationErrors).length > 0) {
                        setErrors(validationErrors);
                        return [2 /*return*/];
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, loginUser(formData)];
                case 2:
                    response = _a.sent();
                    if (response) {
                        dispatch(signInSuccess(response.data.user.data));
                        localStorage.setItem('token', response.data.user.refreshToken); // Store the token
                        navigate('/home', { replace: true }); // Redirect to home page
                    }
                    else {
                        navigate('/login'); // Redirect back to login page if failed
                    }
                    return [3 /*break*/, 4];
                case 3:
                    error_1 = _a.sent();
                    console.log(error_1);
                    toast.error('somthing went wrong while login');
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    return (_jsx("div", { children: _jsx("div", { className: "flex h-screen w-full items-center justify-center bg-gray-100", children: _jsxs("div", { className: "w-full max-w-3xl overflow-hidden rounded-lg bg-white shadow-lg sm:flex", children: [_jsx("div", { className: "m-2 w-full rounded-2xl bg-gray-400 bg-cover bg-center text-white sm:w-1/3", style: { backgroundImage: "url('/images/Rent-a-car.jpeg')" } }), _jsx("div", { className: "w-full sm:w-2/3", children: _jsxs("div", { className: "p-8", children: [_jsx("h1", { className: "text-3xl font-black text-slate-700", children: "Sign in" }), _jsx("p", { className: "mt-2 mb-5 text-base leading-tight text-gray-600", children: "Create an account to get access to 1000+ Freebies" }), _jsxs("form", { onSubmit: submitData, className: "mt-8", children: [_jsxs("div", { className: "relative mt-2 w-full", children: [_jsx("input", { onChange: function (e) { return setEmail(e.target.value); }, value: email, type: "text", id: "email", className: "border-1 peer block w-full appearance-none rounded-lg border border-gray-300 bg-transparent px-2.5 pb-2.5 pt-4 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0", placeholder: " " }), _jsx("label", { htmlFor: "email", className: "absolute top-2 left-1 z-10 origin-[0] -translate-y-4 scale-75 transform cursor-text select-none bg-white px-2 text-sm text-gray-500 duration-300 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 peer-focus:top-2 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:px-2 peer-focus:text-blue-600", children: "Enter Your Email" }), errors.email && _jsx("p", { className: "text-red-500", children: errors.email })] }), _jsxs("div", { className: "relative mt-2 w-full", children: [_jsx("input", { onChange: function (e) { return setPassword(e.target.value); }, value: password, type: "password", id: "password", className: "border-1 peer block w-full appearance-none rounded-lg border border-gray-300 bg-transparent px-2.5 pb-2.5 pt-4 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0", placeholder: " " }), _jsx("label", { htmlFor: "password", className: "absolute top-2 left-1 z-10 origin-[0] -translate-y-4 scale-75 transform cursor-text select-none bg-white px-2 text-sm text-gray-500 duration-300 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 peer-focus:top-2 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:px-2 peer-focus:text-blue-600", children: "Enter Your Password" }), errors.password && _jsx("p", { className: "text-red-500", children: errors.password })] }), _jsx("input", { className: "mt-4 w-full cursor-pointer rounded-lg bg-red-600 pt-3 pb-3 text-white shadow-lg hover:bg-red-500", type: "submit", value: "Create account" })] }), _jsx("div", { className: "mt-4 text-center", children: _jsxs("p", { className: "text-sm text-gray-600", children: ["Already have an account?", _jsx("a", { href: "/signup", className: "font-bold text-red-600 no-underline hover:text-red-500", children: "Sign up" })] }) })] }) })] }) }) }));
}
export default Login;
