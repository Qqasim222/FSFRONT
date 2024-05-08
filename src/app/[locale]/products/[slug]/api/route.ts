import { EDIT_PRODUCT_DETAIL, GET_PRODUCT_DETAIL } from "@/common/constant/server.constant";
import axiosClient from "@/common/util/api/axios-client";

// Get One Product handler
const apiGetOneProduct = async (params: any) => {
  const slug = params.get("slug") ? params.get("slug") : "";
  return await axiosClient.get(`${GET_PRODUCT_DETAIL}/${slug}`);
};
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const data = await apiGetOneProduct(searchParams);
  return Response.json(data?.data);
}

// Update One Product handler
const apiUpdateOneProduct = async (data: any) => {
  const {
    "info.brand.name": name,
    "info.importerDistributor": importerDistributor,
    "info.brand.manufacturer.name": manufacturer,
  } = data?.data;

  // updated data
  const updatedData = {
    name,
    importerDistributor,
    manufacturer,
  };
  return;
  return await axiosClient.patch(`${EDIT_PRODUCT_DETAIL}/${data?.productId}`, updatedData);
};
export async function PATCH(req: Request) {
  const body = await req.json();
  const data = await apiUpdateOneProduct(body);
  return Response.json(data?.data);
}
