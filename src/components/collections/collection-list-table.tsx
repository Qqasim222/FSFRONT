import React, { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import CollectionModal from "./collection-modal";
import { Loader } from "../common/placeholder/loader";
import { toast } from "react-toastify";
import { FaEye, FaPencil, FaTrashArrowUp } from "react-icons/fa6";
import axios from "@/common/util/api/axios-public-client";
import useLoading from "@/common/hook/loading";
import Pagination from "../common/pagination/pagination";
import NoResultFound from "../common/placeholder/no-result-found";
import { COLLECTIONS } from "@/common/constant/local.constant";
import Link from "next-intl/link";
import CustomConfirmPopup from "../common/popup/confirm-popup";
import { useRouter } from "next-intl/client";

interface CollectionListTableProps {
  canUpdateCollection: boolean;
  canDeleteCollection: boolean;
  onCollectionListUpdate: () => Promise<void>;
  collectionData: any[];
  isLoading: boolean;
  totalCount: number;
  countriesList: any;
}

const CollectionListTable: React.FC<CollectionListTableProps> = ({
  canUpdateCollection,
  canDeleteCollection,
  onCollectionListUpdate,
  collectionData,
  isLoading,
  totalCount,
  countriesList,
}) => {
  const t = useTranslations("collectionPage.table");
  const router = useRouter();
  const [selectedCollectionData, setSelectedCollectionData] = useState("");
  const { loading, startLoading, stopLoading } = useLoading();
  const [showConfirmPopup, setShowConfirmPopup] = useState(false);
  const [isEditCollectionModalOpen, setEditCollectionModalOpen] = useState<boolean>(false);
  const [isUpdateMode, setUpdateMode] = useState<boolean>(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const handleEditClick = (data: any) => {
    setSelectedCollectionData(data);
    setEditCollectionModalOpen(true);
    setUpdateMode(true);
  };
  const handleCloseModal = () => {
    setEditCollectionModalOpen(false);
  };

  const handleCancelDelete = () => {
    setShowConfirmPopup(false);
    setItemToDelete(null);
  };

  const tableColumns = [
    t("tableColumns.name"),
    t("tableColumns.collaborator"),
    t("tableColumns.country"),
    t("tableColumns.startDate"),
    t("tableColumns.endDate"),
    t("tableColumns.status"),
    t("tableColumns.action"),
  ];
  // fetcher
  useEffect(() => {
    const fetcher = async () => {
      try {
        await onCollectionListUpdate();
      } catch (error: Error) {
        toast.error(error?.message || t("someThingWrong"));
      } finally {
      }
    };
    if (!isLoading) {
      fetcher();
    }
  }, []);

  // Delete Collection Handler
  // Delete Collection Handler
  const handleDeleteClick = async (_id: any) => {
    setItemToDelete(_id);
    setShowConfirmPopup(true);
  };
  const handleConfirmDelete = async () => {
    try {
      startLoading();
      const simplefiedData = {
        id: itemToDelete,
      };
      const apiResponse = await axios.delete(COLLECTIONS, { data: JSON.stringify(simplefiedData) });
      if (apiResponse?.data?.statusCode == 200) {
        toast.success(apiResponse?.data?.message);
        if (onCollectionListUpdate) onCollectionListUpdate();
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
          {collectionData?.length > 0 ? (
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
                    {collectionData?.map((item, index) => (
                      <tr
                        key={index}
                        className="border-b font-medium text-th-secondary-medium hover:bg-th-primary-light hover:text-th-primary-hard cursor-pointer"
                        onClick={() => {
                          router.push(`/collections/${item?._id}`);
                        }}
                      >
                        <td className="px-3 py-4 whitespace-nowrap">{item?.name || "N/A"}</td>
                        <td className="px-3 py-4 whitespace-nowrap">{item?.collaborator?.name || "N/A"}</td>
                        <td className="px-3 py-4 whitespace-nowrap">{item?.operationalCountry?.name || "N/A"}</td>

                        <td className="px-3 py-4 whitespace-nowrap">
                          {item?.startDate ? new Date(item?.startDate).toDateString() : "N/A"}
                        </td>
                        <td className="px-3 py-4 whitespace-nowrap">
                          {item?.endDate ? new Date(item?.endDate).toDateString() : "N/A"}
                        </td>
                        <td className="px-3 py-4 whitespace-nowrap capitalize">{item?.status || "N/A"}</td>
                        <td
                          className="px-3 py-4 whitespace-nowrap cursor-default"
                          onClick={(e) => {
                            e.stopPropagation();
                          }}
                        >
                          <span className="flex gap-4">
                            <Link href={`/collections/${item?._id}`}>
                              <FaEye className="cursor-pointer text-th-primary-hard hover:text-th-secondary-medium" />
                            </Link>
                            {/* can update a collection */}
                            {canUpdateCollection ? (
                              <FaPencil
                                className="cursor-pointer text-th-primary-hard hover:text-th-secondary-medium"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleEditClick(item);
                                }}
                              />
                            ) : (
                              <FaPencil className="cursor-not-allowed text-th-primary-hard hover:text-th-secondary-medium" />
                            )}
                            {/* can delete a collection */}
                            {canDeleteCollection ? (
                              <>
                                {loading ? (
                                  <FaTrashArrowUp className="cursor-not-allowed text-th-primary-hard hover:text-th-danger-medium" />
                                ) : (
                                  <FaTrashArrowUp
                                    className="cursor-pointer text-th-primary-hard hover:text-th-danger-medium"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleDeleteClick(item?._id);
                                    }}
                                  />
                                )}
                              </>
                            ) : (
                              <FaTrashArrowUp className="cursor-not-allowed text-th-primary-hard hover:text-th-danger-medium" />
                            )}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {totalCount > 10 ? <Pagination count={totalCount} onPaginationChange={onCollectionListUpdate} /> : <></>}
            </>
          ) : (
            <NoResultFound />
          )}
        </>
      )}
      {/* Collection Modal component */}
      <CollectionModal
        isOpen={isEditCollectionModalOpen}
        onCancel={handleCloseModal}
        isUpdateMode={isUpdateMode}
        selectedCollectionData={selectedCollectionData}
        onCollectionListUpdate={onCollectionListUpdate}
        countriesList={countriesList}
      />

      <CustomConfirmPopup
        isOpen={showConfirmPopup}
        onCancel={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        message="confirmDeleteMessage"
      />
    </div>
  );
};

export default CollectionListTable;
