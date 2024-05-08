import axiosClient from "@/common/util/api/axios-client";
import { DOWNLOAD_EXPORT_URL } from "@/common/constant/server.constant";

// Get exports download url handler
const apiGetExportsDownloadURL = async (params: any) => {
  const exportId = params.get("exportId") ? params.get("exportId") : "";
  return await axiosClient.get(`${DOWNLOAD_EXPORT_URL}/${exportId}/url`);
};

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const data = await apiGetExportsDownloadURL(searchParams);
  return Response.json(data?.data);
}
