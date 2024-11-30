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
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from 'react';
import { FaUser, FaUserPlus, FaPhone, FaBars, FaTimes } from 'react-icons/fa';
import { useSelector, useDispatch } from 'react-redux';
import { userLogout } from '../../Api/User';
import Swal from 'sweetalert2';
import { toast } from 'react-hot-toast';
import { signOut } from '../../App/Slice/UserSlice';
import { useNavigate, Link } from 'react-router-dom';
import { providerLogout } from '../../Api/Provider';
import { signOutProvider } from '../../App/Slice/ProviderSlice';
function Navbar() {
    var _this = this;
    var _a = useState(false), menuOpen = _a[0], setMenuOpen = _a[1];
    var dispatch = useDispatch();
    var navigate = useNavigate();
    var user = useSelector(function (state) { var _a; return (_a = state.user) === null || _a === void 0 ? void 0 : _a.currentUser; });
    var provider = useSelector(function (state) { var _a; return (_a = state.provider) === null || _a === void 0 ? void 0 : _a.currentProvider; });
    var logoutUser = function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            try {
                Swal.fire({
                    title: "Are you sure?",
                    icon: "question",
                    showCancelButton: true,
                    confirmButtonColor: "#3085d6",
                    cancelButtonColor: "#d33",
                    confirmButtonText: "Yes",
                }).then(function (result) {
                    if (result.isConfirmed) {
                        if (user) {
                            userLogout();
                            dispatch(signOut());
                            navigate('/');
                        }
                        else if (provider) {
                            providerLogout();
                            dispatch(signOutProvider());
                            navigate('/');
                        }
                    }
                });
            }
            catch (error) {
                toast.error("Logout failed");
            }
            return [2 /*return*/];
        });
    }); };
    return (_jsxs("header", { children: [_jsxs("nav", { className: "relative bg-red-800 p-4 shadow-md flex justify-between items-center", children: [_jsxs("div", { className: "flex items-center space-x-4 text-white", children: [_jsx(FaPhone, {}), _jsx("span", { className: "hover:text-red-900 transition duration-300", children: " +123 456 7890" })] }), _jsx("button", { className: "text-white lg:hidden focus:outline-none", onClick: function () { return setMenuOpen(!menuOpen); }, children: menuOpen ? _jsx(FaTimes, { size: 24 }) : _jsx(FaBars, { size: 24 }) }), _jsx("div", { className: "".concat(menuOpen ? 'block' : 'hidden', " lg:flex lg:items-center space-x-6"), children: !user && !provider ? (_jsxs(_Fragment, { children: [_jsxs(Link, { to: "/login", className: "text-white hover:text-gray-300 flex items-center", children: [_jsx(FaUser, { className: "mr-2" }), " Login"] }), _jsxs(Link, { to: "/signup", className: "text-white hover:text-gray-300 flex items-center", children: [_jsx(FaUserPlus, { className: "mr-2" }), " Signup"] })] })) : (_jsxs("div", { className: "flex items-center space-x-6", children: [_jsxs(Link, { to: "/profile", className: "text-white flex items-center", children: [_jsx(FaUser, { className: "mr-2" }), " ", user ? user.username : provider === null || provider === void 0 ? void 0 : provider.username] }), _jsxs("a", { onClick: logoutUser, className: "text-white hover:text-gray-300 cursor-pointer flex items-center", children: [_jsx(FaUserPlus, { className: "mr-2" }), " Logout"] })] })) })] }), _jsx("nav", { className: "bg-white p-3 shadow-md", children: _jsxs("div", { className: "container mx-auto flex justify-between items-center", children: [_jsx("div", { className: "flex items-center", children: _jsx("img", { src: "/images/carzio.png", alt: "Logo", className: "h-10" }) }), _jsxs("div", { className: "flex items-center space-x-2", children: [_jsx("img", { src: "\\images\\Gauto - Car Rental HTML Template Preview - ThemeForest_files\\clock.png", alt: "Clock", className: "h-6 w-auto" }), _jsx("span", { className: "text-black-600", children: "9:00 AM to 10:00 PM" })] }), _jsxs("div", { className: "flex items-center space-x-2", children: [_jsx("img", { src: "\\images\\Gauto - Car Rental HTML Template Preview - ThemeForest_files\\globe.png", alt: "Globe", className: "h-6 w-auto" }), _jsx("span", { className: "text-black-600", children: "Malappuram, Palakkad, Calicut" })] }), !user && !provider ?
                            _jsx("button", { className: "bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded transition duration-300", children: _jsx("a", { href: "/provider/login", children: "Provider Signup" }) }) : "", provider && !user ?
                            _jsx("button", { className: "bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded transition duration-300", children: _jsx("a", { href: "/provider/Home", children: "Provider Home" }) }) : ""] }) }), user ? (_jsx("div", { className: "bg-black p-2", children: _jsx("div", { className: "container mx-auto flex justify-between items-center", children: _jsxs("div", { className: "flex space-x-8", children: [_jsx("a", { href: "/home", className: "text-white hover:text-red-400 transition duration-300 font-semibold", children: "Home" }), _jsx("a", { href: "/booking_history", className: "text-white hover:text-red-400 transition duration-300 font-semibold", children: "History" }), _jsx("a", { href: "/carList", className: "text-white hover:text-red-400 transition duration-300 font-semibold", children: "Cars" }), _jsx("a", { href: "/offers", className: "text-white hover:text-red-400 transition duration-300 font-semibold flex items-center", children: "Offer " }), _jsx("a", { href: "/wallet", className: "text-white hover:text-red-400 transition duration-300 font-semibold flex items-center", children: " Wallet " })] }) }) })) : (_jsx("hr", { style: { backgroundColor: 'black', height: '2px' } }))] }));
}
export default Navbar;
