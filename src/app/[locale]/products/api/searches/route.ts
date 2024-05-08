import {
  GET_ALL_PRODUCTS_SEARCHES,
  UPDATE_PRODUCT_SEARCHES,
  DELETE_PRODUCT_SEARCH,
} from "@/common/constant/server.constant";
import axiosClient from "@/common/util/api/axios-client";

// Get Saved Searches list handler
const apiGetSavedSearches = async (params: any) => {
  const order = params.get("order") ? params.get("order") : "desc";

  const filters = {
    sort: {
      field: "createdAt",
      order: order,
    },
  };
  return await axiosClient.get(GET_ALL_PRODUCTS_SEARCHES, {
    params: {
      filters: decodeURI(JSON.stringify(filters)),
    },
  });
};

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const data = await apiGetSavedSearches(searchParams);
  return Response.json(data?.data);
}
//delete searche  by id
const apiDeleteSearch = async (params: any) => {
  const id = params.get("id");

  return await axiosClient.delete(`${DELETE_PRODUCT_SEARCH}/${id}`);
};
export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url);
  const data = await apiDeleteSearch(searchParams);
  return Response.json(data?.data);
}
// Edit Products Searches handler
const apiUpdateProductSearch = async (data: any) => {
  const simplefiedData = {
    name: data?.searchName,
    filter: data?.filters,
  };
  return await axiosClient.patch(`/${UPDATE_PRODUCT_SEARCHES}/${data?.searchId}`, simplefiedData);
};

export async function PATCH(req: Request) {
  const body = await req.json();
  const data = await apiUpdateProductSearch(body);
  return Response.json(data?.data);
}
