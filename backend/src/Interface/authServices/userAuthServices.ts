interface UserInterface {
    id?: string | undefined;
    name?: string;
    email?: string;
    phone?: number;
    password?: string | Promise<string>;

    isBlocked?: boolean;
}

export interface UserAuthResponse {
    status: number;
    data: {
        success: boolean;
        message?: string;
        data?: UserInterface|UserInterface[]|undefined,
        userId?: string;
        token?: string;
        refreshToken?: string;
    };
}