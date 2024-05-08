import axiosClient from "@/common/util/api/axios-client";
import { RESET_INVITE_URL } from "@/common/constant/server.constant";

// Send Invitation handler
const apiSendInvitation = async (data: string) => {
  return await axiosClient.post(RESET_INVITE_URL, data);
};

export async function POST(req: Request) {
  const body = await req.json();
  const data = await apiSendInvitation(body);
  return Response.json(data?.data);
}
