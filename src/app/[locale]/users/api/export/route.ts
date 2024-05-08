import { GENERATE_USERS_CSV } from "@/common/constant/server.constant";
import axiosClient from "@/common/util/api/axios-client";

// Generate Users CSV Export handler
const apiGenerateUsersExportCsv = async (params: any) => {
  const exportName = params?.get("exportName") ? params?.get("exportName") : "";
  const firstName = params?.get("firstName") ? params?.get("firstName") : "";
  const lastName = params?.get("lastName") ? params?.get("lastName") : "";
  const email = params?.get("email") ? params?.get("email") : "";
  const status = params?.get("status") ? params?.get("status") : "";
  const role = params?.get("role") ? params?.get("role") : "";
  const order = params?.get("order") ? params?.get("order") : "desc";
  const filters: any = {
    contain: {
      firstName: firstName,
      lastName: lastName,
      email: email,
    },
    equal: {
      status: status,
      "role.code": role,
    },
    sort: {
      field: "createdAt",
      order: order,
    },
  };
  return await axiosClient.get(GENERATE_USERS_CSV, {
    params: {
      filters: decodeURI(JSON.stringify(filters)),
      exportName: exportName,
    },
  });
};

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const data = await apiGenerateUsersExportCsv(searchParams);
  return Response.json(data?.data);
}
