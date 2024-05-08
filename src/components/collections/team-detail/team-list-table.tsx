import { DELETE_TEAM_USER } from "@/common/constant/local.constant";
import useLoading from "@/common/hook/loading";
import Pagination from "@/components/common/pagination/pagination";
import CustomConfirmPopup from "@/components/common/popup/confirm-popup";
import { Loader } from "@/components/common/placeholder/loader";
import NoResultFound from "@/components/common/placeholder/no-result-found";
import axios from "@/common/util/api/axios-public-client";
import { useTranslations } from "next-intl";
import React, { useEffect, useState } from "react";
import { FaTrashArrowUp } from "react-icons/fa6";
import { toast } from "react-toastify";

interface MyTeamMembersListTableProps {
  teamMembersData: any;
  isLoading: boolean;
  onTeamMembersListUpdate: () => Promise<void>;
  totalCount: number;
}

const MyTeamMembersListTable: React.FC<MyTeamMembersListTableProps> = ({
  teamMembersData,
  onTeamMembersListUpdate,
  isLoading,
  totalCount,
}: any) => {
  const t = useTranslations("myTeamManagmentDetailPage.myTeamMembersListTable");
  const { loading, startLoading, stopLoading } = useLoading();
  const teamMembers = teamMembersData?.team;
  const [showConfirmPopup, setShowConfirmPopup] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  // tableColumns
  const tableColumns = [
    t("tableColumns.firstName"),
    t("tableColumns.lastName"),
    t("tableColumns.e-mail"),
    t("tableColumns.mobile"),
    t("tableColumns.country"),
    t("tableColumns.role"),
    t("tableColumns.update"),
    t("tableColumns.loginDate"),
    t("tableColumns.status"),
    t("tableColumns.action"),
  ];
  // fetcher
  useEffect(() => {
    const fetcher = async () => {
      try {
        await onTeamMembersListUpdate();
      } catch (error: Error) {
        toast.error(error?.message || t("someThingWrong"));
      } finally {
      }
    };
    if (!isLoading) {
      fetcher();
    }
  }, []);
  // Delete Collection Handlers
  const handleDeleteClick = async (_id: any) => {
    setItemToDelete(_id);
    setShowConfirmPopup(true);
  };
  const handleCancelDelete = () => {
    setShowConfirmPopup(false);
    setItemToDelete(null);
  };
  const handleConfirmDelete = async () => {
    try {
      startLoading();
      const simplefiedData = {
        id: teamMembersData?._id,
        teamUserId: itemToDelete,
      };
      const apiResponse = await axios.delete(DELETE_TEAM_USER, { data: JSON.stringify(simplefiedData) });
      if (apiResponse?.data?.statusCode == 200) {
        toast.success(apiResponse?.data?.message);
        if (onTeamMembersListUpdate) onTeamMembersListUpdate();
      } else {
        toast.error(apiResponse?.data?.message);
      }
    } catch (error: Error) {
      toast.error(error?.message || t("someThingWrong"));
    } finally {
      stopLoading();
      setShowConfirmPopup(false);
      setItemToDelete(null);
    }
  };

  return (
    <div className="bg-th-background p-2 md:p-4 rounded-xl">
      {isLoading ? (
        <Loader />
      ) : (
        <>
          {teamMembers?.length > 0 ? (
            <>
              <div className="relative overflow-x-auto rounded-md">
                <table className="w-full text-sm text-left bg-th-primary-medium ">
                  <thead className="text-sm text-th-primary-hard capitalize ">
                    <tr>
                      {tableColumns?.map((column, index) => (
                        <th key={index} scope="col" className="px-3 py-4 whitespace-nowrap">
                          {column}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-th-background border">
                    {teamMembers?.map((item: any) => (
                      <tr
                        key={item?._id}
                        className="border-b font-medium text-th-secondary-medium hover:bg-th-primary-light"
                      >
                        <td className="px-3 py-4 whitespace-nowrap">{item?.firstName || "N/A"}</td>
                        <td className="px-3 py-4 whitespace-nowrap">{item?.lastName || "N/A"}</td>
                        <td className="px-3 py-4 whitespace-nowrap">{item?.email || "N/A"}</td>
                        <td className="px-3 py-4 whitespace-nowrap">{item?.mobile || "N/A"}</td>
                        <td className="px-3 py-4 whitespace-nowrap">{item?.country || "N/A"}</td>
                        <td className="px-3 py-4 whitespace-nowrap">{item?.role?.name || "N/A"}</td>
                        <td className="px-3 py-4 whitespace-nowrap">
                          {new Date(item?.updatedAt).toDateString() || "N/A"}
                        </td>
                        <td className="px-3 py-4 whitespace-nowrap">
                          {new Date(item?.createdAt).toDateString() || "N/A"}
                        </td>
                        <td className="px-3 py-4 whitespace-nowrap capitalize">{item?.status || "N/A"}</td>
                        <td className="px-3 py-4 whitespace-nowrap">
                          <>
                            {loading ? (
                              <FaTrashArrowUp className="cursor-not-allowed text-th-primary-hard hover:text-th-danger-medium ms-3" />
                            ) : (
                              <FaTrashArrowUp
                                className="cursor-pointer text-th-primary-hard hover:text-th-danger-medium ms-3"
                                onClick={() => handleDeleteClick(item?._id)}
                              />
                            )}
                          </>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {totalCount > 10 ? <Pagination count={totalCount} onPaginationChange={onTeamMembersListUpdate} /> : <></>}
            </>
          ) : (
            <NoResultFound />
          )}
        </>
      )}
      <CustomConfirmPopup
        isOpen={showConfirmPopup}
        onCancel={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        message="confirmDeleteMessage"
      />
    </div>
  );
};

export default MyTeamMembersListTable;
