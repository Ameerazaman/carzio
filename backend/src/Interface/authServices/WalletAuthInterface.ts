import { WalletInterface } from "../WalletInterface";

export interface WalletAuthInterface {
    status: number;
    data: {
        success: boolean;
        message?: string;
        data?: WalletInterface |WalletInterface[] | undefined,
        page?: number,
        totalPage?: number,
        totalAmount?:number
    };
}