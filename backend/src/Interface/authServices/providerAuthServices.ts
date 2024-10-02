interface ProviderInterface {
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
        data?: ProviderInterface,
        providerId?: string;
        token?: string;
        refreshToken?: string;
    };
}