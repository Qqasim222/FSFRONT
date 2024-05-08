import axios, { AxiosInstance } from "axios";
import { signOut } from "next-auth/react";

const axiosClient: AxiosInstance = axios.create({
  responseType: "json",
  headers: {
    "Content-Type": "application/json",
  },
  validateStatus: () => {
    return true;
  },
});

axiosClient.interceptors.response.use((response: any) => {
  if (response?.data?.statusCode == 401) {
    signOut({ redirect: false });
    window.location.reload();
  }
  return response;
});
export default axiosClient;
