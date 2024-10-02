interface UserInterface {
    id?: string | undefined;
    name?: string;
    email: string;
    phone?: number;
    password?: string | Promise<string>;
    about?: string;
    isBlocked?: boolean;
}

export interface UserAuthResponse {
    status: number;
    data: {
        success: boolean;
        message: string;
        data?: UserInterface,
        userId?: string;
        token?: string;
        refreshToken?: string;
    };
}