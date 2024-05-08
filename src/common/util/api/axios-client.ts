import axios, { AxiosInstance } from "axios";
import { cookies } from "next/headers";

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;
const axiosClient: AxiosInstance = axios.create({
  responseType: "json",
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
  validateStatus: () => {
    return true;
  },
});

axiosClient.interceptors.request.use(function (config: any) {
  const language = cookies()?.get("NEXT_LOCALE");
  if (language) {
    const lang = language?.value;
    config.headers["Accept-Language"] = lang || "en";
  }

  const sessionInfo = cookies()?.get("session-info");
  if (sessionInfo?.value) {
    const sessionData = JSON.parse(sessionInfo?.value);
    const accessToken = sessionData?.data?.accessToken;
    config.headers["Authorization"] = `Bearer ${accessToken}`;
  }
  return config;
});

axiosClient.interceptors.response.use((response: any) => {
  if (response?.data?.statusCode == 401) {
    cookies().delete("session-info");
  }

  return response;
});
export default axiosClient;
