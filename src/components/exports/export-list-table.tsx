import React, { useEffect } from "react";
import { useTranslations } from "next-intl";
import { FaDownload } from "react-icons/fa6";
import CustomButton from "@/components/common/button/custom-button";
import axios from "@/common/util/api/axios-public-client";
import { toast } from "react-toastify";
import { Loader } from "../common/placeholder/loader";
import { GET_EXPORTS_DOWNLOAD_URL } from "@/common/constant/local.constant";
import NoResultFound from "../common/placeholder/no-result-found";
import Pagination from "../common/pagination/pagination";

interface ExportsListTableProps {
  onExportsListUpdate: () => Promise<void>;
  exportedData: any[];
  loading: boolean;
  totalCount: number;
}
const ExportsListTable: React.FC<ExportsListTableProps> = ({
  loading,
  exportedData,
  onExportsListUpdate,
  totalCount,
}) => {
  const t = useTranslations("exportsPage.exportTable");
  // tableColumns
  const tableColumns = [
    t("tableColumns.exportName"),
    t("tableColumns.exportType"),
    t("tableColumns.status"),
    t("tableColumns.created"),
    t("tableColumns.updated"),
    t("tableColumns.download"),
  ];

  // Update export list data
  useEffect(() => {
    const fetcher = async () => {
      try {
        await onExportsListUpdate();
      } catch (error: Error) {
        toast.error(error?.message || t("someThingWrong"));
      } finally {
      }
    };
    if (!loading) {
      fetcher();
    }
  }, []);

  // Handle Download Click
  const handleDownloadClick = async (id: string, index: number) => {
    try {
      const updatedExportData = [...exportedData];
      updatedExportData[index].loading = true;
      const apiResponse = await axios.get(GET_EXPORTS_DOWNLOAD_URL, {
        params: { exportId: id },
      });
      if (apiResponse?.data?.statusCode == 200) {
        const url = apiResponse?.data?.data;
        // Create a hidden anchor element
        const hiddenAnchor = document.createElement("a");
        hiddenAnchor.style.display = "none";
        // Set the anchor's href to the pre-signed URL
        hiddenAnchor.href = url;
        hiddenAnchor.target = "_blank";
        // Append the anchor to the document body
        document.body.appendChild(hiddenAnchor);
        // Simulate a click on the hidden anchor to trigger the download
        hiddenAnchor.click();
        // Remove the anchor from the document body
        document.body.removeChild(hiddenAnchor);
      } else {
        toast.error(apiResponse?.data?.errors[0]);
      }
    } catch (error: Error) {
      toast.error(error?.message || t("someThingWrong"));
    } finally {
      const updatedExportData = [...exportedData];
      updatedExportData[index].loading = false;
    }
  };
  return (
    <div className="bg-th-background p-2 md:p-4 rounded-xl">
      {loading ? (
        <Loader />
      ) : (
        <>
          {exportedData?.length > 0 ? (
            <>
              <div className="relative overflow-x-auto rounded-md">
                <table className="w-full text-sm text-left bg-th-primary-medium">
                  <thead className="text-sm text-th-primary-hard capitalize">
                    <tr>
                      {tableColumns?.map((column, index) => (
                        <th key={index} scope="col" className="px-3 py-4 whitespace-nowrap">
                          {column}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-th-background border">
                    {exportedData?.map((item, index) => (
                      <tr
                        key={index}
                        className="border-b font-medium text-th-secondary-medium hover:bg-th-primary-light"
                      >
                        <td className="px-3 py-4 whitespace-nowrap">{item?.name || "N/A"}</td>
                        <td className="px-3 py-4 whitespace-nowrap">{item?.type || "N/A"}</td>
                        <td className="px-3 py-4 whitespace-nowrap capitalize">{item?.status || "N/A"}</td>
                        <td className="px-3 py-4 whitespace-nowrap">
                          {new Date(item?.createdAt).toDateString() || "N/A"}
                        </td>
                        <td className="px-3 py-4 whitespace-nowrap">
                          {new Date(item?.updatedAt).toDateString() || "N/A"}
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap">
                          <CustomButton
                            className={`relative flex items-center justify-center whitespace-nowrap rounded-md bg-th-primary-hard py-1 px-2 text-xs lg:text-base font-bold text-th-primary-light outline-none transition duration-150 ease-in-out hover:shadow-lg ${
                              (item?.status === "inprogress" && "cursor-not-allowed bg-th-secondary-light") ||
                              (item?.status === "failed" && "cursor-not-allowed bg-th-secondary-light")
                            }`}
                            type="button"
                            label={t("download")}
                            disabled={
                              (item?.status === "inprogress" ? true : false) ||
                              (item?.status === "failed" ? true : false)
                            }
                            endIcon={<FaDownload className={`text-sm ${item?.loading ? "animate-bounce" : ""}`} />}
                            onClick={() => handleDownloadClick(item?._id, index)}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {totalCount > 10 ? <Pagination count={totalCount} onPaginationChange={onExportsListUpdate} /> : <></>}
            </>
          ) : (
            <NoResultFound />
          )}
        </>
      )}
    </div>
  );
};

export default ExportsListTable;
