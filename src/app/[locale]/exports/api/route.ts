import axiosClient from "@/common/util/api/axios-client";
import { GET_ALL_EXPORTS } from "@/common/constant/server.constant";

// Get All Export List handler
const apiGetAllExportsList = async (params: any) => {
  const page = params?.get("page") ? params?.get("page") : 1;
  const pageSize = params?.get("pageSize") ? params?.get("pageSize") : 10;
  const exportType = params?.get("exportType") ? params?.get("exportType") : "";
  const exportName = params?.get("exportName") ? params?.get("exportName") : "";
  const status = params?.get("status") ? params?.get("status") : "";
  const order = params?.get("order") ? params?.get("order") : "desc";
  const filters: any = {
    contain: {
      name: exportName,
      module: exportType,
    },
    equal: {
      status: status,
    },
    sort: {
      field: "createdAt",
      order: order,
    },
  };
  return await axiosClient.get(GET_ALL_EXPORTS, {
    params: {
      page,
      pageSize,
      filters: decodeURI(JSON.stringify(filters)),
    },
  });
};

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const data = await apiGetAllExportsList(searchParams);
  return Response.json(data?.data);
}
