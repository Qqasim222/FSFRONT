import React, { useState, ChangeEvent } from "react";
import { FaX, FaPlus } from "react-icons/fa6";
import CustomInput from "@/components/common/input/custom-input";
import { useTranslations } from "next-intl";

interface Option {
  id: string;
  name: string;
}

interface MultiSelectSearchFieldProps {
  className?: string;
  onSelect: (selectedOptions: Option[]) => void;
  placeholder: string;
  data?: any;
  selected?: Option[];
  multiSelect?: boolean;
  readOnly?: boolean;
  selectedInInput?: boolean;
}

const MultiSelectSearchField = ({
  onSelect,
  placeholder,
  className,
  selected = [],
  data,
  multiSelect,
  readOnly,
  selectedInInput,
}: MultiSelectSearchFieldProps) => {
  const t = useTranslations("searchSelectInput");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isDropdownVisible, setIsDropdownVisible] = useState<boolean>(false);
  const [options, setOptions] = useState<Option[]>(data);

  const handleSelect = (option: Option): void => {
    if (selected.findIndex((item) => item?.id == option?.id) == -1) {
      if (multiSelect) onSelect([...selected, option]);
      else onSelect([option]);
    } else {
      onSelect(selected?.filter((item) => item?.id !== option?.id));
    }
    setSearchTerm("");
    setIsDropdownVisible(false);
  };

  const handleRemove = (option: Option): void => {
    const updatedOptions = selected?.filter((selectedOption) => selectedOption?.id !== option?.id);
    onSelect(updatedOptions);
    setSearchTerm("");
    setIsDropdownVisible(false);
  };

  const handleSearch = (e: ChangeEvent<HTMLInputElement>): void => {
    setSearchTerm(e.target.value);
    const tempSelectedIds = selected?.map((item) => item?.id);
    if (e.target.value == "") {
      setIsDropdownVisible(false);
      setOptions(data);
    } else {
      setIsDropdownVisible(true);

      const newData1 = data?.filter((item: any) => {
        if (
          item?.name?.toLocaleLowerCase()?.startsWith(e?.target?.value?.toLocaleLowerCase()) &&
          !tempSelectedIds?.includes(item?.id)
        )
          return true;
        else return false;
      });
      const newData2 = data?.filter((item: any) => {
        if (
          item?.name?.toLocaleLowerCase()?.startsWith(e?.target?.value?.toLocaleLowerCase()) &&
          !tempSelectedIds?.includes(item?.id)
        )
          return false;
        else if (
          item?.name?.toLocaleLowerCase()?.includes(e?.target?.value?.toLocaleLowerCase()) &&
          !tempSelectedIds?.includes(item?.id)
        )
          return true;
        else return false;
      });
      setOptions([...newData1, ...newData2]);
    }
  };

  return (
    <div className="relative">
      <CustomInput
        type="text"
        placeholder={selectedInInput && selected?.length ? "" : placeholder}
        onChange={handleSearch}
        className={className}
        value={searchTerm}
        readOnly={readOnly || (selectedInInput && selected?.length) ? true : false}
      />
      {isDropdownVisible && (
        <div className="absolute top-full left-0 w-full bg-th-background border rounded mt-1 z-10 max-h-40 overflow-y-auto">
          {options?.length === 0 ? (
            <div className="p-2 text-th-grey-hard bg-th-zinc-light">{t("noOption")}</div>
          ) : (
            options?.map((option) => (
              <div key={option?._id || option?.id}>
                <span
                  className="flex items-center text-th-secondary-medium justify-between px-4 py-2 hover:bg-th-primary-medium cursor-pointer"
                  onClick={() => handleSelect(option)}
                >
                  <span>{option?.name}</span>
                  {multiSelect && (
                    <span>
                      <FaPlus />
                    </span>
                  )}
                </span>
              </div>
            ))
          )}
        </div>
      )}
      <div
        className={
          selectedInInput
            ? `absolute top-2.5 md:top-3.5 lg:top-2.5 2xl:top-4 left-1`
            : `my-0 flex flex-wrap ${selected?.length > 5 ? "h-48 overflow-auto" : ""}`
        }
      >
        {selected?.map((option) => (
          <div
            key={option?._id || option?.id}
            className="bg-th-zinc-light rounded-full px-4 py-1 m-1 flex items-center"
          >
            <span>{option?.name}</span>
            <span className="ml-2 cursor-pointer" onClick={() => handleRemove(option)}>
              <FaX className="text-th-grey-hard hover:text-th-danger-medium" />
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MultiSelectSearchField;
