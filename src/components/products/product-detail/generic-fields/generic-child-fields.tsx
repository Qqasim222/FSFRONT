import React, { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import DatePicker from "react-datepicker";
import { FaCalendarDays } from "react-icons/fa6";

export const GenericChildFields = ({
  structureDummyData,
  subItem,
  innerIndex,
  editMode,
  genericHandler,
  optionsData,
  mainObj,
}: any) => {
  const { control } = useForm({
    mode: "all",
  });

  const getKey = (str) => {
    if (subItem?.includes("$")) {
      const arr = subItem?.split(".");
      const key = arr[arr?.length - 1];
      return key;
    } else {
      return str;
    }
  };

  useEffect(() => {
    genericHandler(mainObj, getKey(subItem));
  }, [subItem]);

  return (
    <Controller
      name={"adsas"}
      control={control}
      render={({ field }) => {
        return (
          <React.Fragment>
            {structureDummyData[subItem]?.isParent === false && (
              <tr key={innerIndex} className="font-medium text-th-secondary-medium hover:bg-th-primary-light">
                <td className="px-1 py-0 whitespace-nowrap text-xs">
                  {structureDummyData[subItem]?.type == "Text" && (
                    <input
                      {...field}
                      className={`w-[140px] my-2 rounded-md border bg-th-grey-light py-2 pl-2 leading-normal placeholder-th-secondary-light ${
                        !editMode
                          ? "text-th-neutral-light cursor-not-allowed outline-none"
                          : "text-th-secondary-medium focus:outline focus:outline-th-primary-medium"
                      }`}
                      type="text"
                      placeholder={structureDummyData[subItem]?.field}
                      onChange={(e) => {
                        genericHandler(mainObj, getKey(subItem), e.target.value);
                      }}
                    />
                  )}
                  {structureDummyData[subItem]?.type == "Numeric" && (
                    <input
                      {...field}
                      className={`w-[140px] my-2 rounded-md border bg-th-grey-light py-2 pl-2 leading-normal placeholder-th-secondary-light ${
                        !editMode
                          ? "text-th-neutral-light cursor-not-allowed outline-none"
                          : "text-th-secondary-medium focus:outline focus:outline-th-primary-medium"
                      }`}
                      type="number"
                      placeholder={structureDummyData[subItem]?.field}
                      onChange={(e) => {
                        genericHandler(mainObj, getKey(subItem), e.target.value);
                      }}
                    />
                  )}
                  {structureDummyData[subItem]?.type === "Dropdown" && (
                    <select
                      {...field}
                      className={`w-[140px] my-2 rounded-md border bg-th-grey-light py-2.5 pl-1 leading-normal placeholder-th-secondary-light text-th-secondary-medium ${
                        !editMode ? "cursor-not-allowed outline-none" : "focus:outline focus:outline-th-primary-medium"
                      }`}
                      disabled={!editMode}
                      onChange={(e) => {
                        const obj = JSON.parse(e.target.value);
                        genericHandler(mainObj, getKey(subItem), obj?.name);
                        if (structureDummyData[subItem]?.isApiCall) {
                          genericHandler(mainObj, "slug", obj?.slug);
                        }
                      }}
                    >
                      <option disabled selected>
                        {structureDummyData[subItem]?.field}
                      </option>
                      {optionsData?.map((dropdownOptions) => (
                        <option key={dropdownOptions} value={JSON.stringify(dropdownOptions)}>
                          {dropdownOptions?.name}
                        </option>
                      ))}
                    </select>
                  )}
                  {structureDummyData[subItem]?.type == "Date" && (
                    <DatePicker
                      showIcon
                      toggleCalendarOnIconClick
                      icon={<FaCalendarDays className="text-th-primary-hard mt-[12px]" />}
                      className="w-[140px] my-2 h-[36px] rounded-md border bg-th-grey-light px-2 leading-normal placeholder-th-secondary-light text-th-secondary-medium outline-none"
                      key={structureDummyData[subItem]?.key}
                      selected={field?.value ? new Date(field.value) : null}
                      onChange={(date) => {
                        const isoDate = date ? date.toISOString().substring(0, 10) : null;
                        genericHandler(mainObj, getKey(subItem), isoDate);
                        field.onChange(isoDate);
                      }}
                      readOnly={!editMode}
                      placeholderText={structureDummyData[subItem]?.field}
                    />
                  )}
                </td>
              </tr>
            )}
          </React.Fragment>
        );
      }}
    />
  );
};

export default GenericChildFields;
