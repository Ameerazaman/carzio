import axios, { AxiosInstance } from "axios";
import { toast } from 'react-hot-toast';
import { refreshUserAccessToken, userLogout } from "../Api/User";
import { providerLogout, refreshProviderAccessToken } from "../Api/Provider";
import { adminLogout, refreshAdminAccessToken } from '../Api/Admin'


import { store } from "../App/Store";
import { signOut } from "../App/Slice/UserSlice";
import { signOutProvider } from "../App/Slice/ProviderSlice";
import { signOutAdmin } from "../App/Slice/AdminSlice";
// **********************************Axios instance for User********************
export { }
const userApi: AxiosInstance = axios.create({
  // baseURL: "http://localhost:5000/api/users",
  baseURL: "https://carzio.store/api/users",
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
    if (error?.response?.status === 401 && error.response.data.message === 'User Credentials Invalid please SignIn') {
      await userLogout();
      store.dispatch(signOut())

    }
    if (error.response?.status === 401 && error.response.data?.message === 'Refresh Token Expired') {
      await userLogout();
      store.dispatch(signOut())

    }
    if (error.response?.status === 401 && error.response.data?.message === "User is blocked by Admin") {
      await userLogout();
      store.dispatch(signOut())


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
  // baseURL: "http://localhost:5000/api",
  baseURL: "https://carzio.store/api",
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
      store.dispatch(signOutProvider())
    }
    if (error.response?.status === 401 && error.response.data?.message === 'Refresh Token Expired') {
      await providerLogout();
      store.dispatch(signOutProvider())
    }
    if (error.response?.status === 401 && error.response.data?.message === "Provider is blocked by Admin") {
      await providerLogout();
      store.dispatch(signOutProvider())
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
  // baseURL: "http://localhost:5000/api",
  baseURL: "https://carzio.store/api",

  withCredentials: true
});

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
      window.location.href = '/admin/login';
      store.dispatch(signOutAdmin())
    }
    if (error.response?.status === 401 && error.response.data?.message === 'Refresh Token Expired') {
      await adminLogout();
      window.location.href = '/admin/login';
      store.dispatch(signOutAdmin())
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


