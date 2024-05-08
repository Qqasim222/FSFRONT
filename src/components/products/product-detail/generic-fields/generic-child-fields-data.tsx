import React, { useState, useEffect } from "react";
import { FaX } from "react-icons/fa6";
import { toast } from "react-toastify";

interface CustomGenericChildFieldsDataComponentProps {
  editMode: boolean;
  optionsData: any;
  productDefaultData: any;
  validationFields: any;
  setData: any;
}

const CustomGenericChildFieldsDataComponent: React.FC<CustomGenericChildFieldsDataComponentProps> = ({
  editMode,
  optionsData,
  productDefaultData,
  validationFields,
  setData,
}) => {
  const [selectedValues, setSelectedValues] = useState<string[]>([]);
  // Compare optionsData with productDefaultData and set default selected values
  useEffect(() => {
    const excludedKeys = [
      "slug",
      "idRetailer",
      "idClaim",
      "_id",
      "idClaims",
      "claimClassification",
      "haveClaimValue",
      "idPrep",
    ];
    const defaultSelectedValues = productDefaultData?.map((defaultItem: any) => {
      const mergedObject: { [key: string]: any } = {};
      // Add keys and values from defaultItem, excluding specified keys
      for (const key in defaultItem) {
        if (defaultItem?.hasOwnProperty(key) && !excludedKeys?.includes(key)) {
          mergedObject[key] = defaultItem[key];
        }
      }
      return mergedObject;
    });
    // new Date(defaultItem?.date * 1000)?.toISOString()?.split("T")[0]
    setSelectedValues(defaultSelectedValues?.filter((value) => value !== ""));
  }, [optionsData, productDefaultData]);
  // handle remove
  const handleRemove = (option: string): void => {
    const indexToRemove = selectedValues?.indexOf(option);
    if (indexToRemove !== -1) {
      const updatedOptions = [...selectedValues];
      updatedOptions?.splice(indexToRemove, 1);
      setSelectedValues(updatedOptions);
    }
  };
  return (
    <div>
      <div className="flex w-full items-center gap-x-2">
        <button
          className={`bg-th-primary-hard ml-2 mb-1 px-2 h-6 rounded-md text-th-primary-light ${
            !editMode && "bg-th-secondary-light cursor-not-allowed"
          }`}
          type="button"
          disabled={!editMode}
          onClick={() => {
            const validationTemp = Object?.keys(validationFields)?.map((item) => {
              if (validationFields[item]) {
                return true;
              }
              return false;
            });
            if (validationTemp?.includes(false)) {
              toast.error("All fields are required");
            } else {
              setData(validationFields);
            }
          }}
        >
          Add
        </button>
      </div>
      <div className={`${selectedValues?.length > 5 ? "h-48 overflow-auto" : ""}`}>
        {selectedValues?.length > 0 &&
          [...selectedValues]?.reverse()?.map((option, index) => (
            <div
              key={index}
              className="bg-th-zinc-light w-fit rounded-full p-4 py-1 m-1 flex items-center justify-between gap-x-2"
            >
              {Object?.entries(option)?.map(([key, value]) => (
                <span key={key} className="bg-th-background rounded-md px-2 py-1 w-fit overflow-auto">
                  {value}
                </span>
              ))}
              <span className="ml-2 cursor-pointer" onClick={() => handleRemove(option)}>
                <FaX className="text-th-grey-hard hover:text-th-danger-medium" />
              </span>
            </div>
          ))}
      </div>
    </div>
  );
};

export default CustomGenericChildFieldsDataComponent;
