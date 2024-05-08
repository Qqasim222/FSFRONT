import React from "react";
import { useTranslations } from "next-intl";
import Link from "next-intl/link";
import NoResultFound from "@/components/common/placeholder/no-result-found";
import { FaEye } from "react-icons/fa6";
import { useRouter } from "next-intl/client";

interface ProductTableSectionProps {
  productsData: any;
}

const ProductTableSection: React.FC<ProductTableSectionProps> = ({ productsData }) => {
  const t = useTranslations("collectionDetailPage.collectionProductSec.ProductTable");
  const router = useRouter();

  // product section column
  const tableColumns = [
    t("tableColumns.productName"),
    t("tableColumns.gtin"),
    t("tableColumns.brand"),
    // t("tableColumns.status"),
    t("tableColumns.action"),
  ];
  return (
    <div className="bg-th-background rounded-xl w-full">
      <div className="relative overflow-x-auto rounded-md mt-2">
        {productsData?.length > 0 ? (
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
              {productsData?.map((item, index) => (
                <tr
                  key={index}
                  className="border-b font-medium text-th-secondary-medium hover:bg-th-primary-light hover:text-th-primary-hard cursor-pointer"
                  onClick={() => {
                    router.push(`/products/${item?._id}`);
                  }}
                >
                  <td className="px-3 py-4 whitespace-nowrap">
                    {item?.name?.default?.length > 30
                      ? item?.name?.default?.slice(0, 30) + "..."
                      : item?.name?.default || "N/A"}
                  </td>
                  <td className="px-3 py-4 whitespace-nowrap">{item?.gtin || "N/A"}</td>
                  <td className="px-3 py-4 whitespace-nowrap">{item?.info?.brand?.name || "N/A"}</td>
                  {/* <td className="px-3 py-4 whitespace-nowrap capitalize">{item?.info?.status || "N/A"}</td> */}
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
        ) : (
          <NoResultFound />
        )}
      </div>
    </div>
  );
};

export default ProductTableSection;
