import { GENERATE_COLLECTIONS_CSV } from "@/common/constant/server.constant";
import axiosClient from "@/common/util/api/axios-client";

// Generate Collections CSV Export handler
const apiGenerateCollectionExportCsv = async (params: any) => {
  const exportName = params?.get("exportName") ? params?.get("exportName") : "";
  const name = params?.get("name") ? params?.get("name") : "";
  const startDate = params?.get("startDate") ? new Date(params.get("startDate")).toISOString() : "";
  const endDate = params?.get("endDate") ? new Date(params.get("endDate")).toISOString() : "";
  const collaborator = params?.get("collaborator") ? params?.get("collaborator") : "";
  const status = params?.get("status") ? params?.get("status") : "";
  const order = params?.get("order") ? params?.get("order") : "desc";
  const filters: any = {
    contain: {
      name: name,
      "collaborator.name": collaborator,
    },
    equal: {
      status: status,
    },
    sort: {
      field: "createdAt",
      order: order,
    },
    date: { startDate: startDate, endDate: endDate },
  };
  return await axiosClient.get(GENERATE_COLLECTIONS_CSV, {
    params: {
      exportName: exportName,
      filters: decodeURI(JSON.stringify(filters)),
    },
  });
};

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const data = await apiGenerateCollectionExportCsv(searchParams);
  return Response.json(data?.data);
}
