import { ProviderAdressInterface } from "../ProviderInterface";

export interface ProviderInterface {
    id?: string | undefined;
    name?: string;
    email: string;
    phone?: number;
    password?: string | Promise<string>;
    about?: string;
    isBlocked?: boolean;
}

export interface ProviderAuthResponse {
    status: number;
    data: {
        success: boolean;
        message: string;
        data?: ProviderInterface|ProviderAdressInterface|ProviderInterface[]|undefined,
        
        providerId?: string;
        token?: string;
        refreshToken?: string;
    };
}