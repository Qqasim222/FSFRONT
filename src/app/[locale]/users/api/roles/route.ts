import axiosClient from "@/common/util/api/axios-client";
import { GET_ROLES_LIST } from "@/common/constant/server.constant";

// Get Roles List handler
const apiGetRolesList = async () => {
  return await axiosClient.get(GET_ROLES_LIST);
};

export async function GET() {
  const data = await apiGetRolesList();
  return Response.json(data?.data);
}
