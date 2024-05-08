import { GET_PRODUCT_NIPTYPE } from "@/common/constant/server.constant";
import axiosClient from "@/common/util/api/axios-client";

// Get Product Nip Type handler
const apiGetProductNipType = async () => {
  return await axiosClient.get(`${GET_PRODUCT_NIPTYPE}`);
};
export async function GET() {
  const data = await apiGetProductNipType();
  return Response.json(data?.data);
}
