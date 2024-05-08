import React from "react";
import { useTranslations } from "next-intl";
import Link from "next-intl/link";
import NoResultFound from "@/components/common/placeholder/no-result-found";
import { FaEye } from "react-icons/fa6";

// product dummy data
const dummyData = [
  {
    _id: 1,
    date: "2022-01-01",
    source: "John Doe",
    status: "Active",
  },
  {
    _id: 2,
    date: "2022-02-01",
    source: "Jane Doe",
    status: "Inactive",
  },
];

interface ProducthistoryListTableProps {}

const ProducthistoryListTable: React.FC<ProducthistoryListTableProps> = ({}) => {
  const t = useTranslations("productDetailPage.productHistoyModal.productsHistoryTable");
  // product section column
  const tableColumns = [t("tableColumns.source"), t("tableColumns.date"), t("tableColumns.action")];
  return (
    <div className="bg-th-background rounded-xl w-full">
      <div className="relative overflow-x-auto rounded-md">
        {dummyData?.length > 0 ? (
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
              <tbody className="bg-th-background border">
                {dummyData?.map((item, index) => (
                  <tr key={index} className="border-b font-medium text-th-secondary-medium hover:bg-th-primary-light">
                    <td className="px-3 py-4 whitespace-nowrap">
                      <Link href={`/products/${item?._id}`} className="hover:text-th-primary-hard">
                        {item?.source || "N/A"}
                      </Link>
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap">{item?.date || "N/A"}</td>
                    <td className="px-3 py-4 whitespace-nowrap">
                      <span className="flex gap-4">
                        <Link href={`/products/${item?._id}`} className="hover:text-th-primary-hard">
                          <FaEye className="cursor-pointer text-th-primary-hard hover:text-th-secondary-medium ms-3" />
                        </Link>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        ) : (
          <NoResultFound />
        )}
      </div>
    </div>
  );
};

export default ProducthistoryListTable;
