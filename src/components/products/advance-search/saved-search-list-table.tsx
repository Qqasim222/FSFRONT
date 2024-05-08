import React, { useState } from "react";
import { useTranslations } from "next-intl";
import NoResultFound from "@/components/common/placeholder/no-result-found";
import { FaEye, FaTrashArrowUp, FaPencil } from "react-icons/fa6";
import CustomButton from "@/components/common/button/custom-button";
import CustomConfirmPopup from "@/components/common/popup/confirm-popup";
import { Loader } from "@/components/common/placeholder/loader";

interface SavedSearchListTableProps {
  onCancel: () => void;
  onConfirm: () => void;
  allSearchesHistory: any;
  setSelectedSearchHistoryProduct: any;
  setDeleteProductSearchId: any;
  loading: boolean;
  setIsUpdateSearch: any;
}

const SavedSearchListTable: React.FC<SavedSearchListTableProps> = ({
  allSearchesHistory,
  setSelectedSearchHistoryProduct,
  setIsUpdateSearch,
  onCancel,
  setDeleteProductSearchId,
  loading,
}) => {
  const t = useTranslations("productsPage.productAdvanceSearchFrom.saveSearchTable");
  const [visibleRecord, setvisibleRecord] = useState(10);
  const [showConfirmPopup, setShowConfirmPopup] = useState(false);
  const [searchRecordId, setSearchRecordId] = useState();

  // handle
  const handleLoadMore = () => {
    setvisibleRecord((prevVisibleRecord) => prevVisibleRecord + 10);
  };
  //handle delete click
  const handleDeleteClick = (item: any) => {
    setSearchRecordId(item);
    setShowConfirmPopup(!showConfirmPopup);
  };
  const saveProductIdInState = () => {
    setDeleteProductSearchId(searchRecordId);
    setShowConfirmPopup(!showConfirmPopup);
    onCancel();
  };
  // product section column
  const tableColumns = [t("tableColumns.name"), t("tableColumns.createdAt"), t("tableColumns.action")];

  return (
    <div className="bg-th-background rounded-xl w-full mt-2">
      <div className="relative overflow-x-auto rounded-md h-96">
        {loading ? (
          <Loader height="h-full" />
        ) : allSearchesHistory?.length > 0 ? (
          <>
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
              <tbody className="bg-th-background border ">
                {allSearchesHistory?.slice(0, visibleRecord).map((item, index) => (
                  <tr key={index} className="border-b font-medium text-th-secondary-medium hover:bg-th-primary-light">
                    <td className="px-3 py-4 whitespace-nowrap">{item?.name || "N/A"}</td>
                    <td className="px-3 py-4 whitespace-nowrap">{new Date(item?.createdAt).toDateString() || "N/A"}</td>
                    <td className="px-3 py-4 whitespace-nowrap">
                      <span className="flex gap-4">
                        <FaEye
                          className="cursor-pointer text-th-primary-hard hover:text-th-secondary-medium"
                          onClick={() => {
                            setSelectedSearchHistoryProduct(item);
                            setIsUpdateSearch(false);
                            onCancel();
                          }}
                        />
                        <FaPencil
                          className="cursor-pointer text-th-primary-hard hover:text-th-secondary-medium"
                          onClick={() => {
                            setSelectedSearchHistoryProduct(item);
                            setIsUpdateSearch(true);
                            onCancel();
                          }}
                        />
                        <FaTrashArrowUp
                          className="cursor-pointer text-th-primary-hard hover:text-th-danger-medium"
                          onClick={() => handleDeleteClick(item?._id)}
                        />
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="w-full items-center justify-center flex">
              {visibleRecord < allSearchesHistory?.length && (
                <CustomButton
                  className="rounded-md my-5 bg-th-primary-hard py-1.5 px-4 text-xs lg:text-base font-semibold text-th-primary-light focus:outline focus:outline-th-primary-medium transition duration-150 ease-in-out hover:shadow-lg"
                  type="button"
                  onClick={handleLoadMore}
                  label={t("loadMore")}
                />
              )}
            </div>
          </>
        ) : (
          <NoResultFound />
        )}
      </div>
      <CustomConfirmPopup
        isOpen={showConfirmPopup}
        onCancel={handleDeleteClick}
        onConfirm={saveProductIdInState}
        message="confirmDeleteMessage"
      />
    </div>
  );
};

export default SavedSearchListTable;
