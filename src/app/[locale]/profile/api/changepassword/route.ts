import axiosClient from "@/common/util/api/axios-client";
import { CHANGE_PASSWORD_URL } from "@/common/constant/server.constant";

// Change Password handler
const apiChangePassword = async (data: string) => {
  return await axiosClient.patch(CHANGE_PASSWORD_URL, data);
};

export async function PATCH(req: Request) {
  const body = await req.json();
  const data = await apiChangePassword(body);
  return Response.json(data?.data);
}
