import React, { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import NoResultFound from "@/components/common/placeholder/no-result-found";
import { Loader } from "../common/placeholder/loader";
import { toast } from "react-toastify";
import Pagination from "../common/pagination/pagination";
import { projectionStructureData } from "@/common/config/projection-structure";
import { useRouter } from "next-intl/client";

interface ProductListTableProps {
  productData: any[];
  isLoading: boolean;
  onProductListUpdate: () => Promise<void>;
  totalCount: number;
  selectedCheckBoxesKeys: any;
  selectedCheckBoxes: any;
}

const ProductListTable: React.FC<ProductListTableProps> = ({
  productData,
  isLoading,
  onProductListUpdate,
  totalCount,
  selectedCheckBoxesKeys,
  selectedCheckBoxes,
}) => {
  const t = useTranslations("productsPage.productsTable");
  const router = useRouter();
  const [productFlattenData, setProductFlattenData] = useState<any>([]);
  // Get Table Columns
  const structureData = projectionStructureData?.fields;
  const fieldValuesArray = Object?.values(structureData)?.map((field) => {
    const { field: fieldName } = field;
    return {
      fieldName,
    };
  });
  const tableColumns = fieldValuesArray.map((field) => field?.fieldName);
  // fetcher
  useEffect(() => {
    const fetcher = async () => {
      try {
        await onProductListUpdate();
      } catch (error: Error) {
        toast.error(error?.message || t("someThingWrong"));
      } finally {
      }
    };
    if (!isLoading) {
      fetcher();
    }
  }, []);

  // Flatten an Object
  function flattenObject(obj: any) {
    const result = {};
    function recurse(current, path = "") {
      for (const key in current) {
        const value = current[key];
        const newPath = path + (path === "" ? key : "." + key);
        if (typeof value === "object" && value !== null) {
          recurse(value, newPath);
        } else {
          result[newPath] = value;
        }
      }
    }
    recurse(obj);
    return result;
  }
  useEffect(() => {
    // Now remap data here
    setProductFlattenData(
      productData.map((item) => {
        return flattenObject(item);
      }),
    );
  }, [productData]);

  // Check if the input is in date format
  const isDate = (dateString) => {
    const regex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;
    return regex.test(dateString);
  };
  // Convert date to human-readable format
  const convertDateToReadableFormate = (isoDate) => {
    const date = new Date(isoDate);
    return date.toDateString();
  };
  return (
    <div className="bg-th-background p-2 md:p-4 rounded-xl w-full">
      {isLoading ? (
        <Loader />
      ) : (
        <>
          {productData?.length > 0 ? (
            <>
              <div className="relative overflow-x-auto rounded-md">
                <table className="w-full text-sm text-left bg-th-primary-medium ">
                  <thead className="text-sm text-th-primary-hard capitalize ">
                    <tr>
                      {tableColumns?.map((column, index) => {
                        const currentValueIndex = selectedCheckBoxes?.findIndex((scbItem) => scbItem == column);
                        if (currentValueIndex == -1) return <></>;
                        return (
                          <th key={index} scope="col" className="px-3 py-4 whitespace-nowrap">
                            {column}
                          </th>
                        );
                      })}
                    </tr>
                  </thead>
                  <tbody className="bg-th-background border">
                    {productFlattenData?.map((item, index) => (
                      <>
                        <tr
                          key={index}
                          className="border-b font-medium text-th-secondary-medium hover:bg-th-primary-light hover:text-th-primary-hard cursor-pointer"
                          onClick={() => {
                            router.push(`/products/${item?._id}`);
                          }}
                        >
                          {tableColumns?.map((fieldItem, subIndex) => {
                            const currentValueIndex = selectedCheckBoxes?.findIndex((scbItem) => scbItem == fieldItem);
                            if (currentValueIndex == -1) return <></>;
                            return (
                              <td key={subIndex} className="px-3 py-4 whitespace-nowrap">
                                {item[selectedCheckBoxesKeys[currentValueIndex]] === 0
                                  ? 0
                                  : item[selectedCheckBoxesKeys[currentValueIndex]]?.length > 30
                                  ? item[selectedCheckBoxesKeys[currentValueIndex]]?.slice(0, 30) + "..."
                                  : isDate(item[selectedCheckBoxesKeys[currentValueIndex]])
                                  ? convertDateToReadableFormate(item[selectedCheckBoxesKeys[currentValueIndex]])
                                  : item[selectedCheckBoxesKeys[currentValueIndex]] || "N/A"}
                              </td>
                            );
                          })}
                        </tr>
                      </>
                    ))}
                  </tbody>
                </table>
              </div>
              {totalCount > 10 ? <Pagination count={totalCount} onPaginationChange={onProductListUpdate} /> : <></>}
            </>
          ) : (
            <NoResultFound />
          )}
        </>
      )}
    </div>
  );
};

export default ProductListTable;
