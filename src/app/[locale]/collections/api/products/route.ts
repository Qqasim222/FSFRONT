import axiosClient from "@/common/util/api/axios-client";
import { GET_PRODUCTS_LIST } from "@/common/constant/server.constant";

// Get Single Collection Products handler
const apiGetSingleCollectionProducts = async (params: any) => {
  const page = params?.get("page") ? params?.get("page") : 1;
  const pageSize = params?.get("pageSize") ? params?.get("pageSize") : 5;
  const order = params?.get("order") ? params?.get("order") : "desc";
  const slug = params?.get("slug") ? params?.get("slug") : "";
  const filters = {
    sort: {
      field: "createdAt",
      order: order,
    },
  };
  return await axiosClient.get(GET_PRODUCTS_LIST, {
    params: {
      page,
      pageSize,
      collectionIds: slug,
      filters: decodeURI(JSON.stringify(filters)),
    },
  });
};

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const data = await apiGetSingleCollectionProducts(searchParams);
  return Response.json(data?.data);
}
