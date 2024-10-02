// import { AxiosError } from "axios"
// import toast from "react-hot-toast";

// type ErrorResponse = {
//     message: string,
//     success: Boolean,
// }

// const errorHandler = async (error: Error | AxiosError) => {

//     const axiosError = error as AxiosError;

//     if (axiosError.response?.data) {
//         const errorResponse = axiosError.response.data as ErrorResponse
//         if (errorResponse.message === "User is blocked by admin!") {
//             toast.error(errorResponse.message);
//         } else if (errorResponse.message === "Professional is blocked by admin!") {
//             toast.error(errorResponse.message);
//         } else {
//             toast.error(errorResponse.message);
//         }

//     } else {
//         toast.error('Something went wrong. Please try again!');
//     }

// }

// export default errorHandler


import { Request, Response } from 'express';
import { AxiosError } from 'axios';
import { toast } from 'react-toastify'
// import userServices from './userServices'; // Adjust import as necessary
// import { OK, BAD_REQUEST, INTERNAL_SERVER_ERROR } from './httpStatusCodes'; // Adjust import as necessary

type ErrorResponse = {
    message: string;
    success: boolean;
};

// Improved error handler with logging
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
