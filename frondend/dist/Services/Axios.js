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
import axios from "axios";
import { toast } from 'react-hot-toast';
import { refreshUserAccessToken, userLogout } from "../Api/User";
import { providerLogout, refreshProviderAccessToken } from "../Api/Provider";
import { adminLogout, refreshAdminAccessToken } from '../Api/Admin';
import { store } from "../App/Store";
import { signOut } from "../App/Slice/UserSlice";
import { signOutProvider } from "../App/Slice/ProviderSlice";
import { signOutAdmin } from "../App/Slice/AdminSlice";
var userApi = axios.create({
    // baseURL: "http://localhost:5000/api/users",
    baseURL: "https://carzio.store/api/users",
    withCredentials: true
});
userApi.interceptors.response.use(function (response) {
    if (response.data.message) {
        toast.success(response.data.message);
    }
    return response;
}, function (error) { return __awaiter(void 0, void 0, void 0, function () {
    var originalRequest, refreshError_1;
    var _a, _b, _c, _d, _e, _f, _g, _h, _j;
    return __generator(this, function (_k) {
        switch (_k.label) {
            case 0:
                originalRequest = error.config;
                if (!(((_a = error === null || error === void 0 ? void 0 : error.response) === null || _a === void 0 ? void 0 : _a.status) === 401 && error.response.data.message === 'User Credentials Invalid please SignIn')) return [3 /*break*/, 2];
                return [4 /*yield*/, userLogout()];
            case 1:
                _k.sent();
                store.dispatch(signOut());
                _k.label = 2;
            case 2:
                if (!(((_b = error.response) === null || _b === void 0 ? void 0 : _b.status) === 401 && ((_c = error.response.data) === null || _c === void 0 ? void 0 : _c.message) === 'Refresh Token Expired')) return [3 /*break*/, 4];
                return [4 /*yield*/, userLogout()];
            case 3:
                _k.sent();
                store.dispatch(signOut());
                _k.label = 4;
            case 4:
                if (!(((_d = error.response) === null || _d === void 0 ? void 0 : _d.status) === 401 && ((_e = error.response.data) === null || _e === void 0 ? void 0 : _e.message) === "User is blocked by Admin")) return [3 /*break*/, 6];
                return [4 /*yield*/, userLogout()];
            case 5:
                _k.sent();
                store.dispatch(signOut());
                _k.label = 6;
            case 6:
                if (((_f = error.response) === null || _f === void 0 ? void 0 : _f.status) === 404) {
                    window.location.href = '/error/404';
                }
                if (((_h = (_g = error === null || error === void 0 ? void 0 : error.response) === null || _g === void 0 ? void 0 : _g.data) === null || _h === void 0 ? void 0 : _h.message) === 'Internal Server Error') {
                    window.location.href = '/error/internal';
                }
                if (!(((_j = error.response) === null || _j === void 0 ? void 0 : _j.status) === 401 && error.response.data.message === 'Access Token Expired' && !originalRequest._retry)) return [3 /*break*/, 10];
                originalRequest._retry = true;
                _k.label = 7;
            case 7:
                _k.trys.push([7, 9, , 10]);
                return [4 /*yield*/, refreshUserAccessToken()];
            case 8:
                _k.sent();
                return [2 /*return*/, userApi(originalRequest)];
            case 9:
                refreshError_1 = _k.sent();
                userLogout();
                window.location.href = '/login';
                return [2 /*return*/, Promise.reject(refreshError_1)];
            case 10: return [2 /*return*/, Promise.reject(error)];
        }
    });
}); });
// **********************************Axios instance for Provider********************
var providerAPI = axios.create({
    // baseURL: "http://localhost:5000/api",
    baseURL: "https://carzio.store/api",
    withCredentials: true
});
providerAPI.interceptors.response.use(function (response) {
    if (response.data.message) {
        toast.success(response.data.message);
    }
    return response;
}, function (error) { return __awaiter(void 0, void 0, void 0, function () {
    var originalRequest, refreshError_2;
    var _a, _b, _c, _d, _e, _f, _g, _h, _j;
    return __generator(this, function (_k) {
        switch (_k.label) {
            case 0:
                originalRequest = error.config;
                if (!(((_a = error === null || error === void 0 ? void 0 : error.response) === null || _a === void 0 ? void 0 : _a.status) === 401 && error.response.data.message === 'Admin Credentials Invalid please SignIn')) return [3 /*break*/, 2];
                return [4 /*yield*/, providerLogout()];
            case 1:
                _k.sent();
                store.dispatch(signOutProvider());
                _k.label = 2;
            case 2:
                if (!(((_b = error.response) === null || _b === void 0 ? void 0 : _b.status) === 401 && ((_c = error.response.data) === null || _c === void 0 ? void 0 : _c.message) === 'Refresh Token Expired')) return [3 /*break*/, 4];
                return [4 /*yield*/, providerLogout()];
            case 3:
                _k.sent();
                store.dispatch(signOutProvider());
                _k.label = 4;
            case 4:
                if (!(((_d = error.response) === null || _d === void 0 ? void 0 : _d.status) === 401 && ((_e = error.response.data) === null || _e === void 0 ? void 0 : _e.message) === "Provider is blocked by Admin")) return [3 /*break*/, 6];
                return [4 /*yield*/, providerLogout()];
            case 5:
                _k.sent();
                store.dispatch(signOutProvider());
                _k.label = 6;
            case 6:
                if (((_f = error.response) === null || _f === void 0 ? void 0 : _f.status) === 404) {
                    window.location.href = '/error/404';
                }
                if (((_h = (_g = error === null || error === void 0 ? void 0 : error.response) === null || _g === void 0 ? void 0 : _g.data) === null || _h === void 0 ? void 0 : _h.message) === 'Internal Server Error') {
                    window.location.href = '/error/internal';
                }
                if (!(((_j = error.response) === null || _j === void 0 ? void 0 : _j.status) === 401 && error.response.data.message === 'Access Token Expired' && !originalRequest._retry)) return [3 /*break*/, 10];
                originalRequest._retry = true;
                _k.label = 7;
            case 7:
                _k.trys.push([7, 9, , 10]);
                return [4 /*yield*/, refreshProviderAccessToken()];
            case 8:
                _k.sent();
                return [2 /*return*/, providerAPI(originalRequest)];
            case 9:
                refreshError_2 = _k.sent();
                providerLogout();
                window.location.href = '/provider/login';
                return [2 /*return*/, Promise.reject(refreshError_2)];
            case 10: return [2 /*return*/, Promise.reject(error)];
        }
    });
}); });
// **********************************Axios instance for Admin********************
var adminAPI = axios.create({
    // baseURL: "http://localhost:5000/api",
    baseURL: "https://carzio.store/api",
    withCredentials: true
});
adminAPI.interceptors.response.use(function (response) {
    if (response.data.message) {
        toast.success(response.data.message);
    }
    return response;
}, function (error) { return __awaiter(void 0, void 0, void 0, function () {
    var originalRequest, refreshError_3;
    var _a, _b, _c, _d, _e, _f, _g;
    return __generator(this, function (_h) {
        switch (_h.label) {
            case 0:
                originalRequest = error.config;
                if (!(((_a = error === null || error === void 0 ? void 0 : error.response) === null || _a === void 0 ? void 0 : _a.status) === 401 && error.response.data.message === 'Admin Credentials Invalid please SignIn')) return [3 /*break*/, 2];
                return [4 /*yield*/, adminLogout()];
            case 1:
                _h.sent();
                window.location.href = '/admin/login';
                store.dispatch(signOutAdmin());
                _h.label = 2;
            case 2:
                if (!(((_b = error.response) === null || _b === void 0 ? void 0 : _b.status) === 401 && ((_c = error.response.data) === null || _c === void 0 ? void 0 : _c.message) === 'Refresh Token Expired')) return [3 /*break*/, 4];
                return [4 /*yield*/, adminLogout()];
            case 3:
                _h.sent();
                window.location.href = '/admin/login';
                store.dispatch(signOutAdmin());
                _h.label = 4;
            case 4:
                if (((_d = error.response) === null || _d === void 0 ? void 0 : _d.status) === 404) {
                    window.location.href = '/error/404';
                }
                if (((_f = (_e = error === null || error === void 0 ? void 0 : error.response) === null || _e === void 0 ? void 0 : _e.data) === null || _f === void 0 ? void 0 : _f.message) === 'Internal Server Error') {
                    window.location.href = '/error/internal';
                }
                if (!(((_g = error.response) === null || _g === void 0 ? void 0 : _g.status) === 401 && error.response.data.message === 'Access Token Expired' && !originalRequest._retry)) return [3 /*break*/, 8];
                originalRequest._retry = true;
                _h.label = 5;
            case 5:
                _h.trys.push([5, 7, , 8]);
                return [4 /*yield*/, refreshAdminAccessToken()];
            case 6:
                _h.sent();
                return [2 /*return*/, adminAPI(originalRequest)];
            case 7:
                refreshError_3 = _h.sent();
                adminLogout();
                window.location.href = '/admin/login';
                return [2 /*return*/, Promise.reject(refreshError_3)];
            case 8: return [2 /*return*/, Promise.reject(error)];
        }
    });
}); });
export { adminAPI, userApi, providerAPI };
