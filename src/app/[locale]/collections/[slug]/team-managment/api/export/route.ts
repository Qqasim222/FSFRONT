import { GENERATE_TEAM_MEMBERS_CSV } from "@/common/constant/server.constant";
import axiosClient from "@/common/util/api/axios-client";

// Generate Team Members CSV Export handler
const apiGenerateTeamMembersExportCsv = async (params: any) => {
  const collectionId = params?.get("collectionId") ? params?.get("collectionId") : "";
  const exportName = params?.get("exportName") ? params?.get("exportName") : "";
  const firstName = params?.get("firstName") ? params?.get("firstName") : "";
  const lastName = params?.get("lastName") ? params?.get("lastName") : "";
  const email = params?.get("email") ? params?.get("email") : "";
  const status = params?.get("status") ? params?.get("status") : "";
  const role = params?.get("role") ? params?.get("role") : "";
  const order = params?.get("order") ? params?.get("order") : "desc";
  const filters: any = {
    contain: {
      "team.firstName": firstName,
      "team.lastName": lastName,
      "team.email": email,
    },
    equal: {
      "team.status": status,
      "team.role.code": role,
    },
    sort: {
      field: "createdAt",
      order: order,
    },
  };
  return await axiosClient.get(`/collection/${collectionId}/${GENERATE_TEAM_MEMBERS_CSV}`, {
    params: {
      filters: decodeURI(JSON.stringify(filters)),
      exportName: exportName,
    },
  });
};

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const data = await apiGenerateTeamMembersExportCsv(searchParams);
  return Response.json(data?.data);
}
