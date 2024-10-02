import axios, { AxiosInstance } from "axios";

// Named export for both Api and API
export const Api: AxiosInstance = axios.create({
    baseURL: "http://localhost:5000/api/users",
    withCredentials: true
});

export const API: AxiosInstance = axios.create({
    baseURL: "http://localhost:5000/api",
    withCredentials: true
});
