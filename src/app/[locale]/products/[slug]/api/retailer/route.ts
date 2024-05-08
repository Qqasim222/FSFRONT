import { GET_PRODUCT_RETAILER } from "@/common/constant/server.constant";
import axiosClient from "@/common/util/api/axios-client";

// Get Product Retailer handler
const apiGetProductRetailer = async () => {
  return await axiosClient.get(`${GET_PRODUCT_RETAILER}`);
};
export async function GET() {
  const data = await apiGetProductRetailer();
  return Response.json(data?.data);
}
