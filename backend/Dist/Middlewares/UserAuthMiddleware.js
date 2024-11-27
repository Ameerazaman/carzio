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
const UserRepostries_1 = require("../Repostries/User/UserRepostries");
const { UNAUTHORIZED } = HttpStatusCode_1.STATUS_CODES;
const jwt = new GenerateToken_1.CreateJWT();
const userRepository = new UserRepostries_1.UserRepository();
dotenv_1.default.config();
const userAuth = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let token = req.cookies.access_token;
        let refresh_token = req.cookies.refresh_token;
        if (!refresh_token) {
            return res.status(401).json({ success: false, message: 'Refresh Token Expired' });
        }
        const refreshTokenValid = (0, VerifyTokens_1.verifyRefreshToken)(refresh_token);
        const user = yield userRepository.getUserById(refreshTokenValid.data);
        if ((user === null || user === void 0 ? void 0 : user.isBlocked) === true) {
            return res.status(401).json({ success: false, message: "User is blocked by Admin" });
        }
        if (!token) {
            return res.status(401).json({ success: false, message: "Access Token Expired" });
        }
        const decoded = (0, VerifyTokens_1.verifyAccessToken)(token);
        if (!(decoded === null || decoded === void 0 ? void 0 : decoded.data)) {
            return res.status(401).json({ success: false, message: "Access Token Expired" });
        }
        const existingUser = yield userRepository.getUserById(decoded.data);
        if (!existingUser) {
            return res.status(404).json({ message: "User not found" });
        }
        if (existingUser === null || existingUser === void 0 ? void 0 : existingUser.isBlocked) {
            return res.json({ success: false, message: "User is blocked by admin!" });
        }
        else {
            req.user = existingUser;
            next();
        }
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Internal Server Error" });
    }
});
exports.default = userAuth;
