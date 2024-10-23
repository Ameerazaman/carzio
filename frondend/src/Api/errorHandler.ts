

import { Request, Response } from 'express';
import { AxiosError } from 'axios';
import { toast } from 'react-hot-toast';

type ErrorResponse = {
    message: string;
    success: boolean;
};


const errorHandler = (error: Error | AxiosError) => {
    console.log('Error handler called');
    const axiosError = error as AxiosError;

    if (axiosError.response?.data) {
        console.log('Error response data:', axiosError.response.data);
        const errorResponse = axiosError.response.data as ErrorResponse;
        toast.error(errorResponse.message); // This should trigger a toast notification
    } else {
        console.error('An unexpected error occurred:', error);
        toast.error('Something went wrong. Please try again!');
    }
};

export default errorHandler;
