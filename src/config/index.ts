import { message } from "antd";
import type { AxiosError, AxiosResponse } from "axios";

interface ApiResponse<T = any> {
  status?: number;
  success?: boolean;
  message?: string;
  data?: T;
  error?: string;
}


export const handleResponse = <T = any>(
  response: AxiosResponse<ApiResponse<T>> | AxiosError<ApiResponse<T>> | any
): T | false => {

  if (response?.status === 202) {
    message.loading({
      content: response?.data?.error || "Processing...",
      duration: 2,
    });
    return false;
  }

 
  if (response?.response) {
    const status = response.response.status;
    const serverMessage = response.response.data?.message;

    switch (status) {
      case 400:
      case 429:
        message.error(serverMessage || "Bad request");
        return false;

      case 401:
        message.error("You are not authorized for the action.");
        return false;

      case 500:
        message.error(response.message || "Internal server error");
        return false;

      default:
        message.error("Something went wrong. Please contact server admin.");
        console.log("⚠️ Unhandled error response:", response);
        return false;
    }
  }


  if (response?.status === 200 || response?.success === true) {
    if (response?.message) {
      message.success(response.message);
    }
    return response?.data ?? false;
  }

  // Fallback
  console.log("⚠️ Unhandled response:", response);
  message.error("Something went wrong. Please contact server admin.");
  return false;
};
