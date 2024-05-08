import { ADD_NEW_USER, EDIT_USER, GET_USERS_LIST } from "@/common/constant/server.constant";
import axiosClient from "@/common/util/api/axios-client";

// Get User List handler
const apiGetUsersList = async (params: any) => {
  const page = params?.get("page") ? params?.get("page") : 1;
  const pageSize = params?.get("pageSize") ? params?.get("pageSize") : 10;
  const firstName = params?.get("firstName") ? params?.get("firstName") : "";
  const lastName = params?.get("lastName") ? params?.get("lastName") : "";
  const email = params?.get("email") ? params?.get("email") : "";
  const status = params?.get("status") ? params?.get("status") : "";
  const role = params?.get("role") ? params?.get("role") : "";
  const order = params?.get("order") ? params?.get("order") : "desc";
  const name = params.get("name") ? params.get("name") : "";
  const country = params?.get("country") ? params?.get("country") : "";
  const filters: any = {
    contain: {
      firstName: firstName || name,
      lastName: lastName,
    },
    equal: {
      email: email,
      status: status,
      "role.code": role,
      country,
    },
    sort: {
      field: "createdAt",
      order: order,
    },
  };
  if (params?.get("role.name")) {
    filters.equal = { ...filters.equal, "role.name": params?.get("role.name") };
  }
  return await axiosClient.get(GET_USERS_LIST, {
    params: {
      page,
      pageSize,
      filters: decodeURI(JSON.stringify(filters)),
    },
  });
};

export async function GET(req: any) {
  const { searchParams } = new URL(req.url);
  const data = await apiGetUsersList(searchParams);
  return Response.json(data?.data);
}

// Add New User handler
const apiAddNewUser = async (data: string) => {
  return await axiosClient.post(ADD_NEW_USER, data);
};

export async function POST(req: any) {
  const body = await req.json();
  const data = await apiAddNewUser(body);
  return Response.json(data?.data);
}

// Edit User handler
const apiEditUser = async (data: any) => {
  const simplefiedData = {
    firstName: data?.firstName,
    lastName: data?.lastName,
    status: data?.status,
    roleId: data?.roleId,
    country: data?.country,
    mobile: data?.mobile,
  };
  return await axiosClient.put(EDIT_USER + data?.id, simplefiedData);
};

export async function PUT(req: any) {
  const body = await req.json();
  const data = await apiEditUser(body);
  return Response.json(data?.data);
}
