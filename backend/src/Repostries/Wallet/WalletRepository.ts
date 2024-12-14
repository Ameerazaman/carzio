import { WalletInterface } from "../../Interface/WalletInterface";
import WalletModel from "../../Model/User/WalletModel";
import { BaseRepository } from "../BaseRepostry";
import { IWalletRepository } from "./IWalletRepository";

export class WalletRepository extends BaseRepository<typeof WalletModel> implements IWalletRepository {
    constructor() {
        super(WalletModel);
    }

        // ***************************canceled booking amount credited to walet**********8
    async creditToWallet(userId: string, amount: number): Promise<WalletInterface | null> {
        try {
            const lastTransaction = await this.model.findOne({ UserId: userId }).sort({ createdAt: -1 });
            const lastTotalAmt = lastTransaction && typeof lastTransaction.TotalAmt === 'number' ? lastTransaction.TotalAmt : 0;

            if (isNaN(amount)) {
                throw new Error("Invalid amount provided");
            }

            const updatedTotal = lastTotalAmt + amount;

            // Create a new wallet transaction entry
            const result = await this.model.create({
                UserId: userId,
                TransactionType: 'Credit',
                Amount: amount,
                Description: "Canceled booked car",

                TotalAmt: updatedTotal,
            });


            return result as WalletInterface;

        } catch (error) {
            return null;
        }
    }

     // *************************check balnce and update*********************
     async checkBalanceAndUpdateWallet(userId: string, amount: number): Promise<WalletInterface | null> {
        try {
            const lastTransaction = await this.model.findOne({ UserId: userId }).sort({ createdAt: -1 });
            const lastTotalAmt = lastTransaction && typeof lastTransaction.TotalAmt === 'number' ? lastTransaction.TotalAmt : 0;

            if (isNaN(amount) || amount <= 0) {
                throw new Error("Invalid or negative amount provided");
            }
            if (lastTotalAmt >= amount) {
                const updatedTotal = lastTotalAmt - amount;

                const result = await this.model.create({
                    UserId: userId,
                    TransactionType: 'Debit',
                    Amount: amount,
                    Description: "Booked car using wallet amount",

                    TotalAmt: updatedTotal,
                });

                return result as WalletInterface;
            } else {

                return null;
            }

        } catch (error) {
            return null;
        }
    }



    // ***************get Wallet********************************
    async getWalletPage(userId: string, page: number, limit: number): Promise<WalletInterface[] | null> {
        try {

            const walletData = await this.model.aggregate([
                { $match: { UserId: userId } },
                { $skip: (page - 1) * limit },
                { $limit: limit },
            ]);

            return walletData
        } catch (error) {
            return null;
        }
    }

    // ******************************count bookingHistory************************

    async countWalletDocuments(userId: string): Promise<number | null> {
        try {

            const total = await this.model.aggregate([
                { $match: { UserId: userId } }])

            return total.length;
        } catch (error) {

            return null;
        }
    }
}
