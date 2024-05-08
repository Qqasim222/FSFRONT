import axiosClient from "@/common/util/api/axios-client";
import { GET_ONE_COLLECTION } from "@/common/constant/server.constant";

// Get One Collection handler
const apiGetOneCollection = async (params: any) => {
  const slug = params.get("slug") ? params.get("slug") : "";
  const page = params?.get("page") ? params?.get("page") : 1;
  const pageSize = params?.get("pageSize") ? params?.get("pageSize") : 10;
  const firstName = params?.get("firstName") ? params?.get("firstName") : "";
  const lastName = params?.get("lastName") ? params?.get("lastName") : "";
  const email = params?.get("email") ? params?.get("email") : "";
  const status = params?.get("status") ? params?.get("status") : "";
  const role = params?.get("role") ? params?.get("role") : "";
  const order = params?.get("order") ? params?.get("order") : "desc";
  const filters: any = {
    contain: {
      "team.firstName": firstName,
      "team.lastName": lastName,
      "team.email": email,
    },
    equal: {
      "team.status": status,
      "team.role.code": role,
    },
    sort: {
      field: "createdAt",
      order: order,
    },
  };
  if (params?.get("role.name")) {
    filters.equal = { ...filters.equal, "team.role.code": params?.get("role.name") };
  }
  return await axiosClient.get(`${GET_ONE_COLLECTION}/${slug}`, {
    params: {
      page,
      pageSize,
      filters: decodeURI(JSON.stringify(filters)),
    },
  });
};

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const data = await apiGetOneCollection(searchParams);
  return Response.json(data?.data);
}
