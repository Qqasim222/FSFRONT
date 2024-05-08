import axiosClient from "@/common/util/api/axios-client";
import { GET_COLLECTIONS_LIST } from "@/common/constant/server.constant";

// Get Latest Collection handler
const apiGetLatestCollection = async (params: any) => {
  const page = params?.get("page") ? params?.get("page") : 1;
  const pageSize = params?.get("pageSize") ? params?.get("pageSize") : 1;
  const order = params?.get("order") ? params?.get("order") : "desc";
  const filters = {
    sort: {
      field: "createdAt",
      order: order,
    },
  };
  return await axiosClient.get(GET_COLLECTIONS_LIST, {
    params: {
      page,
      pageSize,
      filters: decodeURI(JSON.stringify(filters)),
    },
  });
};

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const data = await apiGetLatestCollection(searchParams);
  return Response.json(data?.data);
}
