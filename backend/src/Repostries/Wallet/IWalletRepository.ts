import { WalletInterface } from "../../Interface/WalletInterface"

export interface IWalletRepository {
    
    creditToWallet(userId: string, amount: number): Promise<WalletInterface | null>

    checkBalanceAndUpdateWallet(userId: string, amount: number): Promise<WalletInterface | null>

    getWalletPage(userId: string, page: number, limit: number): Promise<WalletInterface[] | null>

    countWalletDocuments(userId: string): Promise<number | null>

}