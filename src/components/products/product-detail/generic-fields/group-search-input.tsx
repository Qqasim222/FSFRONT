import { useTranslations } from "next-intl";
import React, { useEffect, useState } from "react";

interface GroupSearchDoubleInputFieldProps {
  editMode: boolean;
  onSelect: (values: string) => void;
  clearValues?: string;
}

const GroupSearchDoubleInputField: React.FC<GroupSearchDoubleInputFieldProps> = ({
  editMode,
  onSelect,
  clearValues,
}) => {
  const t = useTranslations("productDetailPage.productDetailTabsSec.nutrationInfoPanel");
  const [inputValue1, setInputValue1] = useState<string>("");
  const [inputValue2, setInputValue2] = useState<string>("");

  useEffect(() => {
    if (clearValues == "" || clearValues == ",") {
      setInputValue1("");
      setInputValue2("");
    }
  }, [clearValues]);
  return (
    <div>
      <div className="flex w-full items-center gap-x-2">
        <input
          type="text"
          className={`w-[200px] lg:w-full my-2 rounded-md border bg-th-grey-light py-2.5 pl-2 leading-normal placeholder-th-secondary-light ${
            !editMode
              ? "text-th-neutral-light cursor-not-allowed outline-none"
              : "text-th-secondary-medium focus:outline focus:outline-th-primary-medium"
          }`}
          value={inputValue1}
          placeholder={t("Enter group name")}
          onChange={(e) => setInputValue1(e.currentTarget.value)}
          readOnly={!editMode}
        />
        <input
          type="number"
          className={`w-[200px] lg:w-full my-2 rounded-md border bg-th-grey-light py-2.5 pl-2 leading-normal placeholder-th-secondary-light ${
            !editMode
              ? "text-th-neutral-light cursor-not-allowed outline-none"
              : "text-th-secondary-medium focus:outline focus:outline-th-primary-medium"
          }`}
          value={inputValue2}
          placeholder={t("Enter Group Code")}
          onChange={(e) => setInputValue2(e.currentTarget.value)}
          readOnly={!editMode}
        />
        <button
          className={`bg-th-primary-hard px-2 h-6 rounded-md text-th-primary-light ${
            !editMode && "bg-th-secondary-light cursor-not-allowed"
          }`}
          disabled={!editMode}
          onClick={() => {
            if (inputValue1 || inputValue2) {
              onSelect(`${inputValue1},${inputValue2}`);
            }
          }}
        >
          {t("Search")}
        </button>
      </div>
    </div>
  );
};

export default GroupSearchDoubleInputField;
