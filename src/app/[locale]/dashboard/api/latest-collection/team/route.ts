import axiosClient from "@/common/util/api/axios-client";
import { GET_ONE_COLLECTION } from "@/common/constant/server.constant";

// Get Latest Collection Team handler
const apiGetLatestCollectionTeamMembers = async (params: any) => {
  const slug = params.get("slug") ? params.get("slug") : "";
  const page = params?.get("page") ? params?.get("page") : 1;
  const pageSize = params?.get("pageSize") ? params?.get("pageSize") : 10;
  return await axiosClient.get(`${GET_ONE_COLLECTION}/${slug}`, {
    params: {
      page,
      pageSize,
    },
  });
};

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const data = await apiGetLatestCollectionTeamMembers(searchParams);
  return Response.json(data?.data);
}
