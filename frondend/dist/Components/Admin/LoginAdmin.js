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
import { toast } from 'react-hot-toast'; // You can use any notification library if needed
import { adminLogin } from '../../Api/Admin';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { signInSuccessAdmin } from '../../App/Slice/AdminSlice';
function LoginAdmin() {
    var _this = this;
    var _a = useState(''), email = _a[0], setEmail = _a[1];
    var _b = useState(''), password = _b[0], setPassword = _b[1];
    var _c = useState({}), errors = _c[0], setErrors = _c[1];
    var dispatch = useDispatch();
    var navigate = useNavigate();
    var validation = function () {
        var new_errors = {};
        var trimmedEmail = email.trim(); // Trim spaces at start and end
        var trimmedPassword = password.trim(); // Trim spaces at start and end
        if (!trimmedEmail)
            new_errors.email = 'Email is required';
        // Checking the trimmed password length and whitespace
        if (!trimmedPassword) {
            new_errors.password = 'Password is required';
        }
        else if (/\s/.test(password)) {
            new_errors.password = 'Password should not contain spaces';
        }
        else if (trimmedPassword.length < 6) {
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
                    return [4 /*yield*/, adminLogin(formData)];
                case 2:
                    response = _a.sent();
                    console.log();
                    console.log(response, "response");
                    if (response) {
                        localStorage.setItem('token', response.data.token);
                        dispatch(signInSuccessAdmin(response.data.user.data)); // Store the token
                        navigate('/admin/dashboard'); // Redirect to home page
                    }
                    else {
                        navigate('/admin/login'); // Redirect back to login page if failed
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
    return (_jsx("div", { className: "flex h-screen items-center justify-center bg-gray-100", children: _jsxs("div", { className: "flex w-full max-w-2xl overflow-hidden rounded-lg shadow-lg bg-white", children: [_jsx("div", { className: "hidden sm:block sm:w-1/2 bg-cover bg-center", style: { backgroundImage: "url('/images/admin.webp')" } }), _jsxs("div", { className: "w-full sm:w-1/2 p-6", children: [_jsx("h1", { className: "text-3xl font-bold text-gray-700 mb-4", children: "Login" }), _jsxs("form", { onSubmit: submitData, children: [_jsxs("div", { className: "relative mb-4", children: [_jsx("input", { type: "email", id: "email", value: email, onChange: function (e) { return setEmail(e.target.value); }, className: "peer block w-full rounded-lg border ".concat(errors.email ? 'border-red-500' : 'border-gray-300', " bg-transparent px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-0"), placeholder: " " }), _jsx("label", { htmlFor: "email", className: "absolute left-3 top-2.5 z-10 origin-[0] -translate-y-4 scale-75 transform select-none bg-white px-2 text-sm text-gray-500 transition-all peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4 peer-focus:text-red-500", children: "Email" }), errors.email && _jsx("p", { className: "text-red-500 text-sm mt-1", children: errors.email })] }), _jsxs("div", { className: "relative mb-4", children: [_jsx("input", { type: "password", id: "password", value: password, onChange: function (e) { return setPassword(e.target.value); }, className: "peer block w-full rounded-lg border ".concat(errors.password ? 'border-red-500' : 'border-gray-300', " bg-transparent px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-0"), placeholder: " " }), _jsx("label", { htmlFor: "password", className: "absolute left-3 top-2.5 z-10 origin-[0] -translate-y-4 scale-75 transform select-none bg-white px-2 text-sm text-gray-500 transition-all peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4 peer-focus:text-red-500", children: "Password" }), errors.password && _jsx("p", { className: "text-red-500 text-sm mt-1", children: errors.password })] }), _jsx("button", { type: "submit", className: "w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 rounded-lg transition duration-300", children: "Login" })] }), _jsx("div", { className: "mt-4 text-center" })] })] }) }));
}
export default LoginAdmin;
