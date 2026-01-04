import axios from "axios";
import type {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
} from "axios";

import store from "@/redux/store/index";
import type { RootState } from "@/redux/store/index";

/**
 * Axios instance
 */
const instance: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL as string,
  timeout: 600000,
  maxContentLength: Infinity,
  maxBodyLength: Infinity,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

/**
 * Request interceptor (Redux token)
 */
instance.interceptors.request.use(
  (config) => {
    const state: RootState = store.getState();
    const token = state.session?.userSession?.token;

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);



const responseBody = <T>(response: AxiosResponse<T>): T => response.data;


const requests = {
  get: <T = any>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<T> =>
    instance.get<T>(url, config).then(responseBody),

  post: <T = any, B = any>(
    url: string,
    body?: B,
    config?: AxiosRequestConfig
  ): Promise<T> =>
    instance.post<T>(url, body, config).then(responseBody),

  put: <T = any, B = any>(
    url: string,
    body?: B,
    config?: AxiosRequestConfig
  ): Promise<T> =>
    instance.put<T>(url, body, config).then(responseBody),

  patch: <T = any, B = any>(
    url: string,
    body?: B,
    config?: AxiosRequestConfig
  ): Promise<T> =>
    instance.patch<T>(url, body, config).then(responseBody),

  delete: <T = any, B = any>(
    url: string,
    body?: B,
    config?: AxiosRequestConfig
  ): Promise<T> =>
    instance
      .delete<T>(url, {
        ...config,
        data: body,
      })
      .then(responseBody),
};

export default requests;
