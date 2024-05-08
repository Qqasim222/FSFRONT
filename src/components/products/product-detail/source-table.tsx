import React from "react";
import { useTranslations } from "next-intl";
import NoResultFound from "@/components/common/placeholder/no-result-found";

interface ProductSourceTableSecProps {
  productData: any;
}

const ProductSourceTableSec: React.FC<ProductSourceTableSecProps> = ({ productData }) => {
  const t = useTranslations("productDetailPage.ProductSourceTableSec");

  // product section column
  const tableColumns = [t("tableColumns.gtin"), t("tableColumns.id"), t("tableColumns.status")];
  return (
    <div className="bg-th-background p-2 rounded-xl">
      <div className="relative overflow-x-auto rounded-lg">
        {productData ? (
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
              <tr className="border-b font-medium text-th-secondary-medium hover:bg-th-primary-light">
                <td className="px-3 py-4 whitespace-nowrap">{productData?.gtin || "N/A"}</td>
                <td className="px-3 py-4 whitespace-nowrap">{productData?._id || "N/A"}</td>
                <td className="px-3 py-4 whitespace-nowrap">{productData?.info?.status?.label || "N/A"}</td>
              </tr>
            </tbody>
          </table>
        ) : (
          <NoResultFound />
        )}
      </div>
    </div>
  );
};

export default ProductSourceTableSec;
