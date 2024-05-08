"use client";
import { GET_ALL_EXPORTED_DATA } from "@/common/constant/local.constant";
import useLoading from "@/common/hook/loading";
import ExportsListTable from "@/components/exports/export-list-table";
import ExportsSearchForm from "@/components/exports/export-search-form";
import axios from "axios";
import { useTranslations } from "next-intl";
import React, { useState } from "react";
import { toast } from "react-toastify";

const ExportsPage = () => {
  const t = useTranslations("exportsPage");
  const { loading, startLoading, stopLoading } = useLoading();
  const [exportedData, setExportedData] = useState([]);
  const [totalCount, setTotalCount] = useState(0);

  // handle Fetch All Exports
  const handleGetAllExports = async (newPage: number = 1, filters: any) => {
    try {
      startLoading();
      const apiResponse = await axios.get(GET_ALL_EXPORTED_DATA, {
        params: { page: newPage, pageSize: 10, order: "desc", ...filters },
      });
      if (apiResponse?.data?.statusCode == 200) {
        setExportedData(apiResponse?.data?.data?.exports);
        setTotalCount(apiResponse?.data?.data?.totalCount);
      } else {
        setExportedData([]);
      }
    } catch (error: Error) {
      toast.error(error?.message || t("someThingWrong"));
    } finally {
      stopLoading();
    }
  };
  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <h3 className="text-xl text-th-primary-hard font-bold mb-4">{t("exportData")}</h3>
      </div>
      <>
        <ExportsSearchForm onSearchSubmit={handleGetAllExports} />
        <ExportsListTable
          onExportsListUpdate={handleGetAllExports}
          exportedData={exportedData}
          loading={loading}
          totalCount={totalCount}
        />
      </>
    </div>
  );
};

export default ExportsPage;
