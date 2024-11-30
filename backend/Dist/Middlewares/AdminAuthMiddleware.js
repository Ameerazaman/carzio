"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const GenerateToken_1 = require("../Utlis/GenerateToken");
const VerifyTokens_1 = require("../Utlis/VerifyTokens");
const HttpStatusCode_1 = require("../Constants/HttpStatusCode");
const AdminRepostries_1 = require("../Repostries/Admin/AdminRepostries");
const { UNAUTHORIZED } = HttpStatusCode_1.STATUS_CODES;
const jwt = new GenerateToken_1.CreateJWT();
const adminRepository = new AdminRepostries_1.AdminRepository();
dotenv_1.default.config();
const adminAuth = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let token = req.cookies.access_token;
        let refresh_token = req.cookies.refresh_token;
        if (!refresh_token) {
            return res.status(401).json({ success: false, message: 'Refresh Token Expired' });
        }
        const refreshTokenValid = (0, VerifyTokens_1.verifyRefreshToken)(refresh_token);
        const admin = yield adminRepository.getAdminById(refreshTokenValid.data);
        if (!token) {
            return res.status(401).json({ success: false, message: "Access Token Expired" });
        }
        const decoded = (0, VerifyTokens_1.verifyAccessToken)(token);
        if (!(decoded === null || decoded === void 0 ? void 0 : decoded.data)) {
            return res.status(401).json({ success: false, message: "Access Token Expired" });
        }
        const existingAdmin = yield adminRepository.getAdminById(decoded.data);
        if (!existingAdmin) {
            return res.status(404).json({ message: "Admin not found" });
        }
        if (existingAdmin) {
            req.admin = existingAdmin;
            next();
        }
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Internal Server Error" });
    }
});
exports.default = adminAuth;
