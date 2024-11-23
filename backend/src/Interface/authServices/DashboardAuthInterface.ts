import { DashboardInterface } from "../DashboardInterface";


export interface DashboardAuthInterface {
    status: number;
    data: {
        success: boolean;
        message?: string;
        data?: DashboardInterface;

    };
}