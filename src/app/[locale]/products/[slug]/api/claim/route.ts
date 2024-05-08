import { GET_PRODUCT_CLAIMS } from "@/common/constant/server.constant";
import axiosClient from "@/common/util/api/axios-client";

// Get Product Claim handler
const apiGetProductClaim = async () => {
  return await axiosClient.get(`${GET_PRODUCT_CLAIMS}`);
};
export async function GET() {
  const data = await apiGetProductClaim();
  return Response.json(data?.data);
}
