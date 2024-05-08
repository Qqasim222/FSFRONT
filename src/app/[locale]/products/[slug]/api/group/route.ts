import { GET_PRODUCT_GROUP } from "@/common/constant/server.constant";
import axiosClient from "@/common/util/api/axios-client";

// Get Product Group handler
const apiGetProductGroup = async (params: any) => {
  const gctName = params?.get("gctName") ? params?.get("gctName") : "";
  const masterGroupCode = params?.get("masterGroupCode") ? params?.get("masterGroupCode") : "";
  const filters: any = {
    contain: {
      gctName: gctName,
      masterGroupCode: masterGroupCode,
    },
  };
  return await axiosClient.get(`${GET_PRODUCT_GROUP}`, {
    params: {
      filters: decodeURI(JSON.stringify(filters)),
    },
  });
};
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const data = await apiGetProductGroup(searchParams);
  return Response.json(data?.data);
}
