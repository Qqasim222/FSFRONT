import axiosClient from "@/common/util/api/axios-client";
import {
  GET_COLLECTIONS_LIST,
  ADD_NEW_COLLECTION,
  EDIT_COLLECTION,
  DELETE_COLLECTION,
} from "@/common/constant/server.constant";

// Get Collection List handler
const apiGetCollectionList = async (params: any) => {
  const page = params?.get("page") ? params?.get("page") : 1;
  const pageSize = params?.get("pageSize") ? params?.get("pageSize") : 10;
  const name = params?.get("name") ? params?.get("name") : "";
  const startDate = params?.get("startDate") ? new Date(params.get("startDate")).toISOString() : "";
  const endDate = params?.get("endDate") ? new Date(params.get("endDate")).toISOString() : "";
  const collaborator = params?.get("collaborator") ? params?.get("collaborator") : "";
  const status = params?.get("status") ? params?.get("status") : "";
  const order = params?.get("order") ? params?.get("order") : "desc";
  const isCollaboratorExist = params?.get("exist[collaborator]") ? params?.get("exist[collaborator]") : "";
  const operationalCountry = params?.get("country") ? params?.get("country") : "";
  let filters = {
    contain: {
      name: name,
      "collaborator.name": collaborator,
    },
    equal: {
      status: status,
      "operationalCountry.name": operationalCountry,
    },
    sort: {
      field: "createdAt",
      order: order,
    },
    date: { startDate: startDate, endDate: endDate },
    exist: {},
  };
  if (params?.has("exist[collaborator]")) {
    filters = { ...filters, exist: { collaborator: Boolean(!isCollaboratorExist) } };
  }
  return await axiosClient.get(GET_COLLECTIONS_LIST, {
    params: {
      page,
      pageSize,
      filters: decodeURI(JSON.stringify(filters)),
    },
  });
};

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const data = await apiGetCollectionList(searchParams);
  return Response.json(data?.data);
}

// Add New Collection handler
const apiAddNewCollection = async (data: string) => {
  return await axiosClient.post(ADD_NEW_COLLECTION, data);
};

export async function POST(req: Request) {
  const body = await req.json();
  const data = await apiAddNewCollection(body);
  return Response.json(data?.data);
}

// Edit Collection handler
const apiEditCollection = async (data: any) => {
  const simplefiedData = {
    name: data?.name,
    collaborator: data?.collaborator,
    status: data?.status,
    startDate: data?.startDate,
    endDate: data?.endDate,
    operationalCountry: data?.operationalCountry,
  };
  return await axiosClient.patch(EDIT_COLLECTION + data?.id, simplefiedData);
};

export async function PATCH(req: Request) {
  const body = await req.json();
  const data = await apiEditCollection(body);
  return Response.json(data?.data);
}

// Delete Collection handler
const apiDeleteCollection = async (data: any) => {
  return await axiosClient.delete(DELETE_COLLECTION + data?.id);
};

export async function DELETE(req: Request) {
  const body = await req.json();
  const data = await apiDeleteCollection(body);
  return Response.json(data?.data);
}
