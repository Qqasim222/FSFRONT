import { GET_PRODUCTS_LIST, SAVE_PRODUCT_SEARCH } from "@/common/constant/server.constant";
import axiosClient from "@/common/util/api/axios-client";

// Get Product List handler
const apiGetProductList = async (params: any) => {
  const page = params?.get("page") ? params?.get("page") : 1;
  const advanceFilter = params?.get("advanceFilter");
  const pageSize = params?.get("pageSize") ? params?.get("pageSize") : 10;
  const order = params?.get("order") ? params?.get("order") : "desc";
  const gtin = params?.get("gtin") ? params?.get("gtin") : "";
  const productName = params?.get("productName") ? params?.get("productName") : "";
  const status = params?.get("status") ? params?.get("status") : "";
  ////////////////////////// Simple Filters Handle Here //////////////////////////
  const simpleFilters: any = {
    contain: {
      "name.default": productName,
    },
    equal: {
      gtin: gtin,
      "info.status.label": status,
    },
    sort: {
      field: "createdAt",
      order: order,
    },
  };
  // /////////////// Projection Handle Here /////////////////////
  // Default projection fields
  const defaultFields = {
    gtin: 1,
    "info.brand.name": 1,
    "info.brand.manufacturer.name": 1,
    "info.importerDistributor": 1,
    "name.default": 1,
    "info.status.label": 1,
  };
  // Get selected fields
  const fieldsArray: any[] = [];
  params?.getAll("fields[]")?.forEach((field: any) => {
    fieldsArray.push(field);
  });
  const fieldsObject: any = {};
  fieldsArray.forEach((key) => {
    if (key) {
      fieldsObject[key] = 1;
    }
  });
  // Send Conditionally projection
  const projection =
    Object.keys(fieldsObject)?.length !== 0
      ? decodeURI(JSON.stringify(fieldsObject))
      : decodeURI(JSON.stringify(defaultFields));

  const filtersToUse = advanceFilter ? advanceFilter : decodeURI(JSON.stringify(simpleFilters));

  return await axiosClient.get(GET_PRODUCTS_LIST, {
    params: {
      page,
      pageSize,
      filters: filtersToUse,
      projection: projection,
    },
  });
};

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const data = await apiGetProductList(searchParams);
  return Response.json(data?.data);
}

//  Save Product Search handler
const apiSaveProductSearchHandler = async (data) => {
  const dataObject = {
    name: data.searchName,
    filter: data.filters,
  };
  return await axiosClient.post(SAVE_PRODUCT_SEARCH, dataObject);
};

export async function POST(req: Request) {
  const body = await req.json();
  const data = await apiSaveProductSearchHandler(body);

  return Response.json(data?.data);
}
