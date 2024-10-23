import axios, { AxiosInstance } from "axios";
import { toast } from 'react-hot-toast';
import { refreshUserAccessToken, userLogout } from "../Api/User";
import { providerLogout, refreshProviderAccessToken } from "../Api/Provider";
import { adminLogout, refreshAdminAccessToken } from "../Api/Admin";
import { Component } from 'react';
// **********************************Axios instance for User********************
export { }
const userApi: AxiosInstance = axios.create({
  baseURL: "http://localhost:5000/api/users",
  withCredentials: true
});

userApi.interceptors.response.use(
  (response) => {
    if (response.data.message) {
      toast.success(response.data.message);
    }
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    if (error?.response?.status === 401 && error.response.data.message === 'Admin Credentials Invalid please SignIn') {
      await userLogout();
    }
    if (error.response?.status === 401 && error.response.data?.message === 'Refresh Token Expired') {
      await userLogout();
    }
    if (error.response?.status === 404) {
      window.location.href = '/error/404';
    }
    if (error?.response?.data?.message === 'Internal Server Error') {
      window.location.href = '/error/internal';
    }
    if (error.response?.status === 401 && error.response.data.message === 'Access Token Expired' && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        await refreshUserAccessToken();
        return userApi(originalRequest);
      } catch (refreshError) {
        userLogout();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

// **********************************Axios instance for Provider********************

const providerAPI: AxiosInstance = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true
});

providerAPI.interceptors.response.use(
  (response) => {
    if (response.data.message) {
      toast.success(response.data.message);
    }
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    if (error?.response?.status === 401 && error.response.data.message === 'Admin Credentials Invalid please SignIn') {
      await providerLogout();
    }
    if (error.response?.status === 401 && error.response.data?.message === 'Refresh Token Expired') {
      await providerLogout();
    }
    if (error.response?.status === 401 && error.response.data?.message ==="Provider is blocked by Admin") {
      await providerLogout();
    }
    if (error.response?.status === 404) {
      window.location.href = '/error/404';
    }
    if (error?.response?.data?.message === 'Internal Server Error') {
      window.location.href = '/error/internal';
    }
    if (error.response?.status === 401 && error.response.data.message === 'Access Token Expired' && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        await refreshProviderAccessToken();
        return providerAPI(originalRequest);
      } catch (refreshError) {
        providerLogout();
        window.location.href = '/provider/login';
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);
// **********************************Axios instance for Admin********************

const adminAPI: AxiosInstance = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true
});

// adminAPI.interceptors.response.use(
//   (response) => {
//     console.log('Response Interceptor:', response);
//     return response;
//   },
//   async (error) => {
//     const originalRequest = error.config;
//     if (error.response) {
//       const status = error.response.status;
//       if (status === 401) {
//         if (error.response.data.message === 'Refresh Token Expired') {
//           toast.error('Refresh Token Expired');
//           await adminLogout();
//         } else if (error.response.data.message === 'Access Token Expired' && !originalRequest._retry) {
//           originalRequest._retry = true;
//           try {
//             await refreshAdminAccessToken();
//             return adminAPI(originalRequest);
//           } catch (refreshError) {
//             toast.error('Unable to refresh access token. Please log in again.');
//             return Promise.reject(refreshError);
//           }
//         }
//       } else if (status === 403) {
//         toast.error('Access denied. Please log in.');
//         await adminLogout();
//         window.location.href = '/admin/login';
//       } else if (status === 404) {
//         if (error.response.data.message === 'Admin not found') {
//           toast.error("Admin not found");
//           await adminLogout();
//         }
//       } else if (status === 500) {
//         toast.error('Internal server error. Please try again later.');
//       }
//     } else {
//       toast.error('Network error. Please check your connection.');
//     }
//     return Promise.reject(error);
//   }
// );
adminAPI.interceptors.response.use(
  (response) => {
    if (response.data.message) {
      toast.success(response.data.message);
    }
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    if (error?.response?.status === 401 && error.response.data.message === 'Admin Credentials Invalid please SignIn') {
      await adminLogout();
    }
    if (error.response?.status === 401 && error.response.data?.message === 'Refresh Token Expired') {
      await adminLogout();
    }
    if (error.response?.status === 404) {
      window.location.href = '/error/404';
    }
    if (error?.response?.data?.message === 'Internal Server Error') {
      window.location.href = '/error/internal';
    }
    if (error.response?.status === 401 && error.response.data.message === 'Access Token Expired' && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        await refreshAdminAccessToken();
        return adminAPI(originalRequest);
      } catch (refreshError) {
        adminLogout();
        window.location.href = '/admin/login';
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export { adminAPI, userApi, providerAPI };


