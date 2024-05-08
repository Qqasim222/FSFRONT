import NoResultFound from "@/components/common/placeholder/no-result-found";
import { useTranslations } from "next-intl";
import React, { useState } from "react";
import { FaCircleArrowDown, FaCircleArrowRight } from "react-icons/fa6";

interface RecursiveListSecProps {
  data: {
    _id: string;
    gctName: string;
    masterGroupCode: string;
    isLeaf: boolean;
    children: RecursiveListSecProps["data"][];
  }[];
  masterCode: string;
  editMode: boolean;
}

const RecursiveListSec: React.FC<RecursiveListSecProps> = ({ data, masterCode, editMode }) => {
  const t = useTranslations("productDetailPage.productDetailTabsSec.productTabs.productTabFields");

  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const toggleItem = (itemId: string) => {
    setExpandedItems((prevExpandedItems) =>
      prevExpandedItems?.includes(itemId)
        ? prevExpandedItems?.filter((id) => id !== itemId)
        : [...prevExpandedItems, itemId],
    );
  };

  const renderList = (items: RecursiveListSecProps["data"], level = 0) => {
    return (
      <>
        {items.map((item) => (
          <React.Fragment key={item?._id}>
            <tr className="border-b font-medium text-th-secondary-medium hover:bg-th-primary-light">
              <td
                className="px-3 py-4 whitespace-nowrap 
                  text-th-primary-hard border-b "
              >
                <div
                  style={{
                    paddingLeft: `${level * 20}px`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <div className="flex items-center">
                    {item?.isLeaf && (
                      <input
                        type="radio"
                        name="groupRadio"
                        className="me-3 form-radio accent-th-primary-hard focus:ring-th-primary-hard transform scale-125"
                        defaultChecked={masterCode == item?.masterGroupCode}
                        disabled={!editMode}
                      />
                    )}
                    {item?.children?.length > 0 && (
                      <button
                        className="text-th-primary-hard me-3 text-xl"
                        type="button"
                        onClick={() => toggleItem(item?._id)}
                      >
                        {expandedItems?.includes(item?._id) ? <FaCircleArrowDown /> : <FaCircleArrowRight />}
                      </button>
                    )}
                    {item?.gctName}
                  </div>
                </div>
              </td>
              <td className="px-3 py-0 whitespace-nowrap text-xs">
                <span>{item?.masterGroupCode}</span>
              </td>
            </tr>
            {expandedItems.includes(item?._id) && item?.children?.length > 0 && renderList(item?.children, level + 1)}
          </React.Fragment>
        ))}
      </>
    );
  };

  return (
    <>
      {data?.length > 0 ? (
        <table className="w-full text-sm text-center bg-th-background rounded-lg">
          <thead className="rounded-lg whitespace-nowrap">
            <tr className="flex justify-between bg-th-primary-medium py-4 rounded-s-lg p-5 text-th-primary-hard text-normal font-semibold">
              <th>{t("Group Name")}</th>
            </tr>
            <th className="bg-th-primary-medium text-th-primary-hard text-normal font-semibold rounded-e-lg pe-5">
              {t("Group Code")}
            </th>
          </thead>
          <tbody>{renderList(data)}</tbody>
        </table>
      ) : (
        <NoResultFound />
      )}
    </>
  );
};

export default RecursiveListSec;
