import axiosClient from "@/common/util/api/axios-client";
import { RESET_PASSWORD_URL } from "@/common/constant/server.constant";

// Send Invitation handler
const apiResetPassword = async (data: string) => {
  return await axiosClient.post(RESET_PASSWORD_URL, data);
};

export async function POST(req: Request) {
  const body = await req.json();
  const data = await apiResetPassword(body);
  return Response.json(data?.data);
}
