"use client";
import { GET_SINGLE_COLLECTION_TEAM } from "@/common/constant/local.constant";
import useLoading from "@/common/hook/loading";
import MyTeamMembersListTable from "@/components/collections/team-detail/team-list-table";
import MyTeamAddMemberModal from "@/components/collections/team-detail/team-modal";
import MyTeamMembersSearchForm from "@/components/collections/team-detail/team-search-form";
import CustomButton from "@/components/common/button/custom-button";
import axios from "@/common/util/api/axios-public-client";
import { useTranslations } from "next-intl";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

const MyTeamManagmentDetailPage = ({ props }: any) => {
  const t = useTranslations("myTeamManagmentDetailPage");
  const [isAddTeamMemberModalOpen, setAddTeamMemberModalOpen] = useState<boolean>(false);
  const [totalCount, setTotalCount] = useState(0);
  const [teamMembersData, setTeamMembersData] = useState([]);
  const { loading, startLoading, stopLoading } = useLoading();
  const singleCollectionName = useSelector((state: any) => state.collection);
  // Modal handle
  const handleAddTeamMembersModal = () => {
    setAddTeamMemberModalOpen(true);
  };
  const handleCloseTeamMembersModal = () => {
    setAddTeamMemberModalOpen(false);
  };

  // Get Single Collection Team
  const handleTeamMembersUpdate = async (newPage: number = 1, filters: any) => {
    try {
      startLoading();
      const apiResponse = await axios.get(GET_SINGLE_COLLECTION_TEAM, {
        params: { slug: props?.slug, page: newPage, pageSize: 10, order: "desc", ...filters },
      });
      if (apiResponse?.data?.statusCode === 200) {
        setTeamMembersData(apiResponse?.data?.data);
        setTotalCount(apiResponse?.data?.data?.totalCount);
      } else {
        setTeamMembersData([]);
        setTotalCount(0);
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
        <h3 className="text-xl text-th-primary-hard font-bold mb-4">{singleCollectionName?.name}</h3>
        <div className="text-xl text-th-primary-hard mb-4">
          <CustomButton
            className="w-full rounded-md bg-th-primary-hard py-2 px-4 text-xs lg:text-base font-bold text-th-primary-light outline-none transition duration-150 ease-in-out hover:shadow-lg"
            type="button"
            label={t("addUser")}
            onClick={handleAddTeamMembersModal}
          />
          <MyTeamAddMemberModal
            isOpen={isAddTeamMemberModalOpen}
            collection={props?.slug}
            onCancel={handleCloseTeamMembersModal}
            onTeamMembersListUpdate={handleTeamMembersUpdate}
          />
        </div>
      </div>
      <>
        <MyTeamMembersSearchForm onSearchSubmit={handleTeamMembersUpdate} teamMembersData={teamMembersData} />
        <MyTeamMembersListTable
          teamMembersData={teamMembersData}
          onTeamMembersListUpdate={handleTeamMembersUpdate}
          isLoading={loading}
          totalCount={totalCount}
        />
      </>
    </div>
  );
};

export default MyTeamManagmentDetailPage;
