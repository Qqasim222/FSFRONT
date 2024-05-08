import React, { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Controller, useForm } from "react-hook-form";
import CustomInput from "@/components/common/input/custom-input";
import CustomButton from "@/components/common/button/custom-button";
import {
  FaAngleDown,
  FaAngleUp,
  //  FaFileCsv
} from "react-icons/fa6";
import { toast } from "react-toastify";
import useLoading from "@/common/hook/loading";
import { useSearchParams } from "next/navigation";
import { usePathname, useRouter } from "next-intl/client";
import { yupResolver } from "@hookform/resolvers/yup";
import { productSearchFormSchema } from "@/common/config/schema";
import CustomExportNamePopup from "../common/popup/export-name-popup";
import { logger } from "@/common/util/logger";
import { projectionStructureData } from "@/common/config/projection-structure";

// Define types for Users Search Inputs
interface ProductSearchFormTypes {
  productName: string;
  gtin: string;
  isLocked: string;
  status: string;
  fields: string[];
}
const ProductSearchForm = ({ onSearchSubmit, productsData, setSelectedCheckBoxesKeys, setSelectedCheckBoxes }: any) => {
  console.log("productsData", productsData);
  const t = useTranslations("productsPage.productSearchFrom");
  const [isFormVisible, setFormVisibility] = useState<boolean>(false);
  const [isDropdownVisible, setIsDropdownVisible] = useState<boolean>(false);
  const [isResetVisible, setResetVisibility] = useState<boolean>(false);
  const [showExportNamePopup, setShowExportNamePopup] = useState(false);
  const { loading, startLoading, stopLoading } = useLoading();
  const [exportFilters, setExportFilters] = useState<ProductSearchFormTypes>();
  const searchParams = useSearchParams();
  const { replace } = useRouter();
  const pathname = usePathname();
  const params = new URLSearchParams(searchParams);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef(null);
  const structureDummyData = projectionStructureData?.fields;
  const [selectedCheckBoxsFieldsKeys, setselectedCheckBoxsFieldsKeys] = useState([
    "gtin",
    "info.brand.name",
    "info.brand.manufacturer.name",
    "info.importerDistributor",
    "name.default",
    "info.status.label",
  ]);
  const [selectedCheckBoxsFields, setselectedCheckBoxsFields] = useState([
    "GTIN",
    "Brand Name",
    "Manufacturer Name",
    "Importer/Distributor",
    "Product Name",
    "Status",
  ]);
  // defultValues
  const defaultValues: ProductSearchFormTypes = {
    productName: "",
    gtin: "",
    isLocked: "",
    status: "",
    fields: [
      "gtin",
      "info.brand.name",
      "info.brand.manufacturer.name",
      "info.importerDistributor",
      "name.default",
      "info.status.label",
    ],
  };
  const {
    control,
    handleSubmit,
    reset,
    formState: { isDirty },
  } = useForm<ProductSearchFormTypes>({
    resolver: yupResolver(productSearchFormSchema),
    mode: "all",
    defaultValues: defaultValues,
  });
  // Handle Export Products Data
  // const handleExportProductsData = async () => {
  //   setShowExportNamePopup(true);
  // };
  const handleCancelExportName = () => {
    setShowExportNamePopup(false);
  };
  const handleConfirmExportName = async () => {
    setShowExportNamePopup(false);
  };

  // Dropdown option
  const optionsData = Object?.keys(structureDummyData)?.map((item) => ({
    value: structureDummyData[item]?.key,
    label: structureDummyData[item]?.field || item,
  }));
  const filteredOptions = optionsData?.filter(
    (option) => option?.label?.toLowerCase()?.includes(searchTerm?.toLowerCase()),
  );

  // Handle dropdown close on outside click
  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (dropdownRef?.current && event.target && !dropdownRef.current.contains(event.target)) {
        setIsDropdownVisible(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [isDropdownVisible == true]);

  // Handle Submit Collection Search Form
  const onSubmit = async (data: ProductSearchFormTypes) => {
    try {
      setResetVisibility(true);
      startLoading();
      params.set("page", "1");
      if (data) {
        setExportFilters(data);
        const filters = encodeURI(JSON.stringify(data));
        params.set("filters", filters);
        logger("filters", filters);
        replace(`${pathname}?${params}`);
      } else {
        params.delete("filters");
      }
      if (data !== undefined) {
        await onSearchSubmit(1, { ...data });
      }
    } catch (error: Error) {
      toast.error(error?.message || t("someThingWrong"));
    } finally {
      stopLoading();
      setSelectedCheckBoxes(selectedCheckBoxsFields);
      setSelectedCheckBoxesKeys(selectedCheckBoxsFieldsKeys);
    }
  };
  // Handle Reset Search Form
  const resetCollectiosSearchForm = async () => {
    setSearchTerm("");
    setIsDropdownVisible(false);
    setResetVisibility(false);
    reset(defaultValues);
    setExportFilters(defaultValues);
    // reset to default values
    setselectedCheckBoxsFieldsKeys([
      "gtin",
      "info.brand.name",
      "info.brand.manufacturer.name",
      "info.importerDistributor",
      "name.default",
      "info.status.label",
    ]);
    setselectedCheckBoxsFields([
      "GTIN",
      "Brand Name",
      "Manufacturer Name",
      "Importer/Distributor",
      "Product Name",
      "Status",
    ]);
    // Main index files states
    setSelectedCheckBoxesKeys([
      "gtin",
      "info.brand.name",
      "info.brand.manufacturer.name",
      "info.importerDistributor",
      "name.default",
      "info.status.label",
    ]);
    setSelectedCheckBoxes([
      "GTIN",
      "Brand Name",
      "Manufacturer Name",
      "Importer/Distributor",
      "Product Name",
      "Status",
    ]);
    replace(`${pathname}`);
    await onSearchSubmit();
  };

  return (
    <div className="bg-th-background p-2 md:p-4 rounded-xl">
      <div
        className="flex justify-between items-center cursor-pointer"
        onClick={() => setFormVisibility(!isFormVisible)}
      >
        <h4 className="text-lg text-th-primary-hard font-bold">{t("search")}</h4>
        <span className="flex items-center gap-x-2 md:gap-x-4">
          {/* {isFormVisible && (
            <CustomButton
              className={`relative flex items-center justify-center whitespace-nowrap w-full rounded-md bg-th-primary-hard py-2 px-4 text-xs lg:text-base font-bold text-th-primary-light outline-none transition duration-150 ease-in-out hover:shadow-lg ${
                productsData?.length === 0 && "cursor-not-allowed bg-th-secondary-light"
              }`}
              type="button"
              label={t("export")}
              endIcon={<FaFileCsv />}
              onClick={(e: any) => {
                e.stopPropagation();
                handleExportProductsData();
              }}
              disabled={productsData?.length === 0}
            />
          )} */}
          {isFormVisible ? (
            <FaAngleUp
              className="text-th-secondary-medium cursor-pointer"
              onClick={() => setFormVisibility(!isFormVisible)}
            />
          ) : (
            <FaAngleDown
              className="text-th-secondary-medium cursor-pointer"
              onClick={() => setFormVisibility(!isFormVisible)}
            />
          )}
        </span>
      </div>
      <div className="w-full">
        {/* Form */}
        {isFormVisible && (
          <form className="h-full w-full mt-5" onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col md:flex-row gap-0 md:gap-4  md:mt-4">
              {/* Product Name input */}
              <div className="w-full">
                <label htmlFor="productName" className="text-th-secondary-medium font-semibold">
                  {t("productName")}
                </label>
                <Controller
                  name="productName"
                  control={control}
                  render={({ field }) => (
                    <CustomInput
                      className="w-full my-2 placeholder-th-secondary-light text-th-secondary-medium rounded-md border bg-th-grey-light py-2 md:py-3 lg:py-2.5 2xl:py-3.5 pl-2 leading-normal outline-none"
                      type="text"
                      placeholder={t("placeholder.productName")}
                      id="productName"
                      {...field}
                    />
                  )}
                />
              </div>
              {/* Product Name input */}
              <div className="w-full">
                <label htmlFor="gtin" className="text-th-secondary-medium font-semibold">
                  {t("gtin")}
                </label>
                <Controller
                  name="gtin"
                  control={control}
                  render={({ field }) => (
                    <CustomInput
                      className="w-full my-2 placeholder-th-secondary-light text-th-secondary-medium rounded-md border bg-th-grey-light py-2 md:py-3 lg:py-2.5 2xl:py-3.5 pl-2 leading-normal outline-none"
                      type="text"
                      placeholder={t("placeholder.gtin")}
                      id="gtin"
                      {...field}
                    />
                  )}
                />
              </div>
            </div>
            <div className="flex flex-col md:flex-row gap-0 md:gap-4 md:mt-4">
              {/* isLocked input */}
              <div className="w-full mt-1 md:mt-0">
                <label htmlFor="isLocked" className="text-th-secondary-medium font-semibold">
                  {t("isLocked")}
                </label>
                <Controller
                  name="isLocked"
                  defaultValue=""
                  control={control}
                  render={({ field }) => (
                    <select
                      {...field}
                      disabled //disabled for now
                      className="select-dropdown-icon-style w-full my-2 rounded-md border bg-th-grey-light py-2 md:py-3 lg:py-2.5 2xl:py-3.5 pl-2 leading-normal placeholder-th-secondary-light text-th-secondary-medium outline-none"
                    >
                      <option value="" disabled>
                        {t("choose")}
                      </option>
                      <option value="locked">{t("locked")}</option>
                      <option value="unLocked">{t("unLocked")}</option>
                    </select>
                  )}
                />
              </div>
              {/* Status input */}
              <div className="w-full mt-1 md:mt-0">
                <label htmlFor="status" className="text-th-secondary-medium font-semibold">
                  {t("status")}
                </label>
                <Controller
                  name="status"
                  defaultValue=""
                  control={control}
                  render={({ field }) => (
                    <select
                      {...field}
                      className="select-dropdown-icon-style w-full my-2 rounded-md border bg-th-grey-light py-2 md:py-3 lg:py-2.5 2xl:py-3.5 pl-2 leading-normal placeholder-th-secondary-light text-th-secondary-medium outline-none"
                    >
                      <option value="" disabled>
                        {t("choose")}
                      </option>
                      <option value="Under Review">{t("underReview")}</option>
                      <option value="Pending">{t("pending")}</option>
                      <option value="Approved">{t("approved")}</option>
                      <option value="On Hold">{t("onHold")}</option>
                      <option value="Problems">{t("problems")}</option>
                      <option value="Rejected">{t("rejected")}</option>
                      <option value="Not a food">{t("notAFood")}</option>
                      <option value="Deleted">{t("deleted")}</option>
                    </select>
                  )}
                />
              </div>
            </div>
            <div className="flex flex-col md:flex-row gap-0 md:gap-4 md:mt-4">
              {/* Fields input */}
              <div className="w-full mt-1 md:mt-0" ref={dropdownRef}>
                <label htmlFor="fields" className="text-th-secondary-medium font-semibold">
                  {t("chooseFields")}
                </label>
                <Controller
                  name="fields"
                  control={control}
                  render={({ field }) => (
                    <div className="relative" onClick={() => setIsDropdownVisible(true)}>
                      <CustomInput
                        className="w-full my-2 rounded-md border bg-th-grey-light py-2 md:py-3 lg:py-2.5 2xl:py-3.5 pl-2 leading-normal placeholder-th-secondary-light text-th-secondary-medium outline-none"
                        type="text"
                        placeholder={t("placeholder.search")}
                        id="fieldName"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                      {filteredOptions?.length > 0 ? (
                        <>
                          {isDropdownVisible && (
                            <div className="relative rounded-md border bg-th-grey-light py-2 md:py-3 lg:py-2.5 2xl:py-3.5 px-2 leading-normal placeholder-th-secondary-light text-th-secondary-medium outline-none h-32 overflow-auto">
                              {/* "Select All" option */}
                              <div className="flex items-center">
                                <input
                                  type="checkbox"
                                  id="selectAll"
                                  onChange={(e) => {
                                    const checked = e.target.checked;
                                    const allValues = filteredOptions.map((option) => option?.value);
                                    const selectedValues = checked ? allValues : [];
                                    setselectedCheckBoxsFieldsKeys(selectedValues);
                                    field.onChange(selectedValues);
                                    setselectedCheckBoxsFields(
                                      checked ? filteredOptions.map((option) => option?.label) : [],
                                    );
                                  }}
                                  checked={selectedCheckBoxsFieldsKeys.length === filteredOptions.length}
                                  className="mr-2 cursor-pointer"
                                />
                                <label htmlFor="selectAll" className="cursor-pointer w-full">
                                  Select All
                                </label>
                              </div>

                              {filteredOptions?.map((option) => (
                                <div key={option.value} className="flex items-center">
                                  <input
                                    type="checkbox"
                                    id={option.value}
                                    onChange={(e) => {
                                      const selectedValues = field?.value
                                        ? [...field?.value]
                                        : [...selectedCheckBoxsFieldsKeys];
                                      if (e.target.checked) {
                                        selectedValues.push(option?.value);
                                      } else {
                                        const index = selectedValues?.indexOf(option?.value);
                                        if (index !== -1) {
                                          selectedValues.splice(index, 1);
                                        }
                                      }
                                      setselectedCheckBoxsFieldsKeys(selectedValues);
                                      field.onChange(selectedValues);
                                      if (selectedCheckBoxsFields.includes(option?.label)) {
                                        setselectedCheckBoxsFields(
                                          selectedCheckBoxsFields?.filter((_item) => _item !== option?.label),
                                        );
                                      } else setselectedCheckBoxsFields([...selectedCheckBoxsFields, option?.label]);
                                    }}
                                    onFocus={() => setIsDropdownVisible(true)}
                                    checked={selectedCheckBoxsFieldsKeys?.includes(option?.value)}
                                    className="mr-2 cursor-pointer"
                                  />
                                  <label htmlFor={option?.value} className="cursor-pointer w-full">
                                    {option?.label}
                                  </label>
                                </div>
                              ))}
                            </div>
                          )}
                        </>
                      ) : (
                        <div className="p-2 text-th-grey-hard bg-th-zinc-light rounded-md">{t("noOption")}</div>
                      )}
                    </div>
                  )}
                />
              </div>
              <div className="w-full mt-1 md:mt-0"></div>
            </div>
            {/* Actions Buttons */}
            <div className="flex md:flex-row space-x-4 my-2">
              {/* Search button */}
              <CustomButton
                className={`mt-4 rounded-md bg-th-primary-hard py-2 px-4 text-xs lg:text-base font-bold text-th-primary-light outline-none transition duration-150 ease-in-out hover:shadow-lg ${
                  loading && "cursor-not-allowed"
                }`}
                type="submit"
                disabled={loading || !isDirty}
                label={loading ? t("search") + "..." : t("search")}
              />
              {/* Reset button */}
              {isResetVisible && (
                <CustomButton
                  className="mt-4 rounded-md border border-th-primary-medium py-2 px-4 text-xs lg:text-base font-bold text-th-grey-hard outline-none transition duration-150 ease-in-out hover:shadow-lg"
                  type="button"
                  label={t("reset")}
                  onClick={resetCollectiosSearchForm}
                />
              )}
            </div>
          </form>
        )}
      </div>
      <CustomExportNamePopup
        isOpen={showExportNamePopup}
        onCancel={handleCancelExportName}
        onConfirm={handleConfirmExportName}
        message="confirmExportName"
        exportedFilters={exportFilters}
        _key="products"
      />
    </div>
  );
};
export default ProductSearchForm;
