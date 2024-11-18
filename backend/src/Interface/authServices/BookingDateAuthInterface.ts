export interface BookingDateInterface {
    issueDate: string;
    returnDate: string;
}

export interface BookingDateAuthInterface {
    status: number;
    data: {
        success: boolean;
        message?: string;
        data?: BookingDateInterface[]|BookingDateInterface|undefined,  
        page?:number,
        totalPage?:number
    };
}