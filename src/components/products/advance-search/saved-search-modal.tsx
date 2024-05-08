import { useTranslations } from "next-intl";
import React from "react";
import { FaX } from "react-icons/fa6";
import SavedSearchForm from "./saved-search-form";
import SavedSearchListTable from "./saved-search-list-table";

interface SavedSearchModelProps {
  isOpen: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  message: string;
  filters?: any;
  _key: string;
  selectedView: string;
  allSearchesHistory: any;
  selectedSearchHistoryProduct: any;
  setSelectedSearchHistoryProduct: any;
  isUpdateSearch: any;
  setIsUpdateSearch: any;
  setGetSaveSearchHistory: any;
  getSaveSearchHistory: boolean;
  setDeleteProductSearchId: any;
  loading: boolean;
}

const SavedSearchModel: React.FC<SavedSearchModelProps> = ({
  isOpen,
  onCancel,
  onConfirm,
  message,
  filters,
  _key,
  selectedView,
  allSearchesHistory,
  selectedSearchHistoryProduct,
  setSelectedSearchHistoryProduct,
  isUpdateSearch,
  setIsUpdateSearch,
  setGetSaveSearchHistory,
  getSaveSearchHistory,
  setDeleteProductSearchId,
  loading,
}) => {
  const t = useTranslations("productsPage.productAdvanceSearchFrom.savedSearchesModal");
  const messageKey = t(message);
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center z-50 bg-th-primary-medium">
      <div className="bg-th-background text-sm p-3 rounded-xl w-11/12 md:w-4/5 lg:w-1/2">
        <div className="flex justify-between items-center py-3 border-b border-th-primary-medium">
          <h4 className="text-th-primary-hard text-2xl font-semibold">{messageKey}</h4>
          <span
            className="text-th-secondary-medium cursor-pointer hover:text-th-danger-medium"
            onClick={() => onCancel()}
          >
            <FaX />
          </span>
        </div>
        {selectedView == "form" ? (
          <SavedSearchForm
            onCancel={onCancel}
            onConfirm={onConfirm}
            _key={_key}
            filters={filters}
            setGetSaveSearchHistory={setGetSaveSearchHistory}
            selectedSearchHistoryProduct={selectedSearchHistoryProduct}
            isUpdateSearch={isUpdateSearch}
            getSaveSearchHistory={getSaveSearchHistory}
          />
        ) : (
          <SavedSearchListTable
            onCancel={onCancel}
            onConfirm={onConfirm}
            allSearchesHistory={allSearchesHistory}
            setSelectedSearchHistoryProduct={setSelectedSearchHistoryProduct}
            setDeleteProductSearchId={setDeleteProductSearchId}
            loading={loading}
            setIsUpdateSearch={setIsUpdateSearch}
          />
        )}
      </div>
    </div>
  );
};

export default SavedSearchModel;
