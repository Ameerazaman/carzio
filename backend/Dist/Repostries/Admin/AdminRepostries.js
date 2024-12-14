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
exports.AdminRepository = void 0;
const AdminModel_1 = __importDefault(require("../../Model/Admin/AdminModel"));
const BaseRepostry_1 = require("../BaseRepostry");
class AdminRepository extends BaseRepostry_1.BaseRepository {
    constructor() {
        super(AdminModel_1.default);
    }
    // ************************check email exist or not***********************
    emailExistCheck(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const existingAdmin = yield this.model.findOne({ email });
                return existingAdmin;
            }
            catch (error) {
                return null;
            }
        });
    }
    // *****************8get adminby Id*********************8
    getAdminById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const existingUser = yield this.model.findById(id);
                return existingUser;
            }
            catch (error) {
                return null;
            }
        });
    }
}
exports.AdminRepository = AdminRepository;
