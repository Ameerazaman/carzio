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
exports.WalletRepository = void 0;
const WalletModel_1 = __importDefault(require("../../Model/User/WalletModel"));
const BaseRepostry_1 = require("../BaseRepostry");
class WalletRepository extends BaseRepostry_1.BaseRepository {
    constructor() {
        super(WalletModel_1.default);
    }
    // ***************************canceled booking amount credited to walet**********8
    creditToWallet(userId, amount) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const lastTransaction = yield this.model.findOne({ UserId: userId }).sort({ createdAt: -1 });
                const lastTotalAmt = lastTransaction && typeof lastTransaction.TotalAmt === 'number' ? lastTransaction.TotalAmt : 0;
                if (isNaN(amount)) {
                    throw new Error("Invalid amount provided");
                }
                const updatedTotal = lastTotalAmt + amount;
                // Create a new wallet transaction entry
                const result = yield this.model.create({
                    UserId: userId,
                    TransactionType: 'Credit',
                    Amount: amount,
                    Description: "Canceled booked car",
                    TotalAmt: updatedTotal,
                });
                return result;
            }
            catch (error) {
                return null;
            }
        });
    }
    // *************************check balnce and update*********************
    checkBalanceAndUpdateWallet(userId, amount) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const lastTransaction = yield this.model.findOne({ UserId: userId }).sort({ createdAt: -1 });
                const lastTotalAmt = lastTransaction && typeof lastTransaction.TotalAmt === 'number' ? lastTransaction.TotalAmt : 0;
                if (isNaN(amount) || amount <= 0) {
                    throw new Error("Invalid or negative amount provided");
                }
                if (lastTotalAmt >= amount) {
                    const updatedTotal = lastTotalAmt - amount;
                    const result = yield this.model.create({
                        UserId: userId,
                        TransactionType: 'Debit',
                        Amount: amount,
                        Description: "Booked car using wallet amount",
                        TotalAmt: updatedTotal,
                    });
                    return result;
                }
                else {
                    return null;
                }
            }
            catch (error) {
                return null;
            }
        });
    }
    // ***************get Wallet********************************
    getWalletPage(userId, page, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const walletData = yield this.model.aggregate([
                    { $match: { UserId: userId } },
                    { $skip: (page - 1) * limit },
                    { $limit: limit },
                ]);
                return walletData;
            }
            catch (error) {
                return null;
            }
        });
    }
    // ******************************count bookingHistory************************
    countWalletDocuments(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const total = yield this.model.aggregate([
                    { $match: { UserId: userId } }
                ]);
                return total.length;
            }
            catch (error) {
                return null;
            }
        });
    }
}
exports.WalletRepository = WalletRepository;
