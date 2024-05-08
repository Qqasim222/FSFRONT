import { useTranslations } from "next-intl";
import React from "react";
import { FaX } from "react-icons/fa6";
import ProducthistoryListTable from "./history-list-table";

interface ProductHistoryModalProps {
  isOpen: boolean;
  onCancel: () => void;
  isUpdateMode?: boolean;
  selectedUserData?: string;
  onUserListUpdate?: any;
}

const ProductHistoryModal: React.FC<ProductHistoryModalProps> = ({ isOpen, onCancel }) => {
  const t = useTranslations("productDetailPage.productHistoyModal");
  if (!isOpen) {
    return null;
  }
  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center z-50 bg-th-primary-medium">
      <div className="bg-th-background p-3 rounded-xl text-sm w-11/12 md:w-4/5 lg:w-1/2">
        <div className="flex justify-between items-center py-3 border-b border-th-primary-medium">
          <h4 className="text-th-primary-hard text-2xl font-semibold">{t("productHistory")}</h4>
          <span
            className="text-th-secondary-medium cursor-pointer hover:text-th-danger-medium"
            onClick={() => onCancel()}
          >
            <FaX />
          </span>
        </div>
        <div className="overflow-y-scroll max-h-96 p-2 w-full py-5">
          <ProducthistoryListTable />
        </div>
      </div>
    </div>
  );
};

export default ProductHistoryModal;
