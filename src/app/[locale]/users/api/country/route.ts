import axiosClient from "@/common/util/api/axios-client";
import { GET_COUNTRY_LIST } from "@/common/constant/server.constant";

// Get countries list handler
const apiGetCountriesList = async () => {
  return await axiosClient.get(GET_COUNTRY_LIST);
};

export async function GET() {
  const data = await apiGetCountriesList();
  return Response.json(data?.data);
}
