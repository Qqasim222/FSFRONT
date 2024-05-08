import { EDIT_PROFILE_URL, GET_USER_PROFILE } from "@/common/constant/server.constant";
import axiosClient from "@/common/util/api/axios-client";

// Update Profile handler
const apiEditProfile = async (data: string) => {
  return await axiosClient.patch(EDIT_PROFILE_URL, data);
};

export async function PATCH(req: Request) {
  const body = await req.json();
  const data = await apiEditProfile(body);
  return Response.json(data?.data);
}

// Get User Profile handler
const apiGetUserProfile = async () => {
  return await axiosClient.get(GET_USER_PROFILE);
};

export async function GET() {
  const data = await apiGetUserProfile();
  return Response.json(data?.data);
}
