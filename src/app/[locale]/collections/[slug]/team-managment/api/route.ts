import { DELETE_TEAM_MEMBER, EDIT_TEAM_MEMBERS, GET_AVAILABLE_TEAM_MEMBERS } from "@/common/constant/server.constant";
import axiosClient from "@/common/util/api/axios-client";

// Get Team User List handler
const apiGetTeamUsersList = async (params: any) => {
  const collectionId = params.get("collectionId") ? params.get("collectionId") : "";
  const page = params?.get("page") ? params?.get("page") : 1;
  const pageSize = params?.get("pageSize") ? params?.get("pageSize") : 20;
  const isExists = params.get("isExists") ? params.get("isExists") : false;
  const name = params.get("name") ? params.get("name") : "";

  const filters: any = {
    equal: {
      isExists: Boolean(!isExists),
    },
    contain: {
      firstName: name,
    },
  };
  return await axiosClient.get(`${GET_AVAILABLE_TEAM_MEMBERS}/${collectionId}/available-users`, {
    params: {
      page,
      pageSize,
      filters: decodeURI(JSON.stringify(filters)),
    },
  });
};
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const data = await apiGetTeamUsersList(searchParams);
  return Response.json(data?.data);
}

// Edit Collection Team Members handler
const apiEditCollectionTeamMembers = async (data: any) => {
  const simplefiedData = {
    team: data?.team,
  };
  return await axiosClient.patch(EDIT_TEAM_MEMBERS + data?.collectionId, simplefiedData);
};

export async function PATCH(req: Request) {
  const body = await req.json();
  const data = await apiEditCollectionTeamMembers(body);
  return Response.json(data?.data);
}

// Delete Collection Team Member handler
const apiDeleteCollectionTeamMember = async (data: any) => {
  return await axiosClient.delete(DELETE_TEAM_MEMBER + data?.id + "/team/" + data?.teamUserId);
};

export async function DELETE(req: Request) {
  const body = await req.json();
  const data = await apiDeleteCollectionTeamMember(body);
  return Response.json(data?.data);
}
