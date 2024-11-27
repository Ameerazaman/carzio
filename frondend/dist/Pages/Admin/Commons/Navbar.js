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
import { useEffect } from 'react';
import { FaSignOutAlt } from 'react-icons/fa'; // You may want to include only the icons you use
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { adminLogout } from '../../../Api/Admin';
import { signOutAdmin } from '../../../App/Slice/AdminSlice';
import toast from 'react-hot-toast';
function Navbar() {
    var _this = this;
    var admin = useSelector(function (state) { return state.admin.currentAdmin; });
    var dispatch = useDispatch();
    var navigate = useNavigate();
    useEffect(function () {
        if (!admin) {
            navigate("/admin/login");
        }
    }, [admin, navigate]);
    var logoutUser = function () { return __awaiter(_this, void 0, void 0, function () {
        var _this = this;
        return __generator(this, function (_a) {
            try {
                Swal.fire({
                    title: "Are you sure?",
                    text: "",
                    icon: "question",
                    showCancelButton: true,
                    confirmButtonColor: "#3085d6",
                    cancelButtonColor: "#d33",
                    confirmButtonText: "Yes",
                }).then(function (result) { return __awaiter(_this, void 0, void 0, function () {
                    var response, error_1;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                if (!(result.isConfirmed && admin)) return [3 /*break*/, 5];
                                _a.label = 1;
                            case 1:
                                _a.trys.push([1, 3, , 4]);
                                return [4 /*yield*/, adminLogout()];
                            case 2:
                                response = _a.sent();
                                if (response) {
                                    dispatch(signOutAdmin()); // Clear admin from Redux store
                                    navigate('/admin/login'); // Navigate to login page
                                }
                                else {
                                    throw new Error("Logout failed");
                                }
                                return [3 /*break*/, 4];
                            case 3:
                                error_1 = _a.sent();
                                toast.error("Logout failed. Please try again.");
                                return [3 /*break*/, 4];
                            case 4: return [3 /*break*/, 6];
                            case 5:
                                navigate('/admin/dashboard'); // If canceled, remain on dashboard
                                _a.label = 6;
                            case 6: return [2 /*return*/];
                        }
                    });
                }); });
            }
            catch (error) {
                console.log(error);
            }
            return [2 /*return*/];
        });
    }); };
    return (_jsx("nav", { className: "bg-gray-900 p-4 shadow-md", children: _jsxs("div", { className: "container mx-auto flex justify-between items-center", children: [_jsx("div", { className: "text-white text-lg font-bold", children: _jsx("img", { src: "/images/car white.png" // Replace with your logo path
                        , alt: "Logo", className: "h-12 w-auto max-h-[48px]" // Adjusted height and width
                     }) }), _jsx("div", { className: "flex items-center", children: _jsxs("button", { onClick: logoutUser, className: "flex items-center text-white hover:text-red-500 transition duration-300", children: [_jsx(FaSignOutAlt, { className: "mr-2" }), "Logout"] }) })] }) }));
}
export default Navbar;
