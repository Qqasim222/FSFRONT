import { GET_PRODUCT_ALLERGEN } from "@/common/constant/server.constant";
import axiosClient from "@/common/util/api/axios-client";

// Get Product Allergen handler
const apiGetProductAllergen = async () => {
  return await axiosClient.get(`${GET_PRODUCT_ALLERGEN}`);
};
export async function GET() {
  const data = await apiGetProductAllergen();
  return Response.json(data?.data);
}
