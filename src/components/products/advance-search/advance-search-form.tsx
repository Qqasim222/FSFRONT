import React, { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Controller, useForm } from "react-hook-form";
import CustomButton from "@/components/common/button/custom-button";
import {
  FaAngleDown,
  FaAngleUp,
  FaCircleMinus,
  FaCirclePlus,
  // FaFileCsv,
  FaSquareMinus,
  FaSquarePlus,
  FaX,
} from "react-icons/fa6";

import { toast } from "react-toastify";
import useLoading from "@/common/hook/loading";
import { useSearchParams } from "next/navigation";
import { usePathname, useRouter } from "next-intl/client";
import CustomExportNamePopup from "@/components/common/popup/export-name-popup";
import SavedSearchModel from "./saved-search-modal";
import CustomInput from "@/components/common/input/custom-input";
import { advanceFilterStructure } from "@/common/config/advance-filter-structure";
import { GET_ALL_PRODUCTS_SEARCHES, DELETE_PRODUCT_SEARCH } from "@/common/constant/local.constant";
import axios from "axios";
import DatePicker from "react-datepicker";
import { FaCalendarDays } from "react-icons/fa6";

// Define types for product advance search Inputs
interface ProductSearchFormTypes {}
const ProductAdvanceSearchForm = ({ onSearchSubmit, productData }: any) => {
  const t = useTranslations("productsPage.productAdvanceSearchFrom");
  const { loading, startLoading, stopLoading } = useLoading();
  const [isFormVisible, setFormVisibility] = useState<boolean>(false);
  const [isResetVisible, setResetVisibility] = useState<boolean>(false);
  const [showExportNamePopup, setShowExportNamePopup] = useState(false);
  const [showSavedSearchNamePopup, setShowSavedSearchNamePopup] = useState(false);
  const [selectedView, setSelectedView] = useState<"form" | "table">("form");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const structureDummyData = advanceFilterStructure?.fields;
  const [selectedFields, setSelectedFields] = useState([{ value: "name.default", label: "Product Name" }]);
  const allOption = { value: "all", label: "Select All" };
  const dropdownRef = useRef(null);
  const searchParams = useSearchParams();
  const { replace } = useRouter();
  const pathname = usePathname();
  const params = new URLSearchParams(searchParams);
  const [selectedValues, setSelectedValues] = useState("");
  const [allSearchesHistory, setAllSearchesHistory] = useState([]);
  const [selectedSearchHistoryProduct, setSelectedSearchHistoryProduct] = useState({});
  const [getSaveSearchHistory, setGetSaveSearchHistory] = useState(false);
  const [deleteProductSearchId, setDeleteProductSearchId] = useState("");
  const [savedSearchesTableLoader, setSavedSearchesTableLoader] = useState(false);
  const [isUpdateSearch, setIsUpdateSearch] = useState(false);

  // Dropdown option
  const optionsData = Object?.keys(structureDummyData)?.map((item) => ({
    value: structureDummyData[item]?.key,
    label: structureDummyData[item]?.field || item,
  }));
  const filteredOptions = optionsData?.filter(
    (option) => option?.label?.toLowerCase()?.includes(searchTerm?.toLowerCase()),
  );
  const {
    control,
    handleSubmit,
    setValue,
    reset,
    getValues,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<ProductSearchFormTypes>({
    mode: "all",
  });

  //get all searches
  const getAllSearchesHistory = async () => {
    try {
      setSavedSearchesTableLoader(true);
      const apiResponse = await axios.get(GET_ALL_PRODUCTS_SEARCHES, {
        params: {
          order: "desc",
        },
      });
      if (apiResponse?.data?.statusCode === 200) {
        setAllSearchesHistory(apiResponse?.data?.data?.searches);
      } else {
        toast.error(apiResponse?.data?.message);
      }
    } catch (error) {
      toast.error(error?.message || t("someThingWrong"));
    } finally {
      setSavedSearchesTableLoader(false);
    }
  };
  const deleteProductSearch = async () => {
    try {
      const apiResponse = await axios.delete(DELETE_PRODUCT_SEARCH, {
        params: {
          id: deleteProductSearchId,
        },
      });
      if (apiResponse?.data?.statusCode === 200) {
        toast.success(apiResponse?.data?.message);
        getAllSearchesHistory();
        setDeleteProductSearchId("");
      }
    } catch (error) {
      toast.error(error);
    }
  };
  useEffect(() => {
    if (deleteProductSearchId?.length > 0) {
      deleteProductSearch();
    }
  }, [deleteProductSearchId]);
  useEffect(() => {
    getAllSearchesHistory();
  }, [getSaveSearchHistory]);
  // Apply saved filter again
  useEffect(() => {
    if (Object.keys(selectedSearchHistoryProduct).length > 0 && selectedSearchHistoryProduct?.filter) {
      const filterValues = selectedSearchHistoryProduct?.filter;
      const newDataObj = {};
      const newdata = Object.keys(filterValues).map((item) => {
        Object.assign(newDataObj, { [item]: filterValues[item] });
        return { label: [item].toString(), value: selectedSearchHistoryProduct?.filter[item]?.key };
      });
      setSelectedFields(newdata);
      reset(newDataObj);
      onSubmit(newDataObj);
    }
  }, [selectedSearchHistoryProduct]);

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

  // Handle Saved Search Popup
  const handleSavedSearchPopup = async (id: any) => {
    if (id == "form") {
      setSelectedView("form");
    } else if ((id = "table")) {
      setSelectedView("table");
    }
    setShowSavedSearchNamePopup(true);
  };
  const handleCancelSavedSearchName = () => {
    setShowSavedSearchNamePopup(false);
  };
  const handleConfirmSavedSearchName = async () => {
    setShowSavedSearchNamePopup(false);
  };

  // Handle Toggle Dropdown
  const handleToggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };
  // Handle dropdown close on outside click
  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (dropdownRef?.current && event.target && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [isDropdownOpen == true]);

  // Handle Submit Product Advance Search Form
  const onSubmit = async (data: ProductSearchFormTypes) => {
    try {
      const errorMessage = Object.entries(data);
      let isError = false;
      errorMessage.map((value) => {
        if (value[0] != "fields" && !value[1]) {
          isError = true;
          setError(value[0], { message: value[0] + " is required" });
        }
      });
      if (isError) {
        return;
      }
      const filtersData = {
        equal: {},
        notEqual: {},
        assigned: {},
        notAssigned: {},
        in: {},
        nin: {},
        date: { greaterThan: {}, lessThan: {} },
      };
      const searchedData = Object.entries(data);
      searchedData.map((value) => {
        if (value[1]?.fliter) {
          const key = value[1];
          if (key.fliter == "lessThan" || key.fliter == "greaterThan") {
            filtersData.date[key.fliter][key.key] = key.value;
          } else {
            filtersData[key.fliter][key.key] = key.value;
          }
        }
      });
      setResetVisibility(true);
      startLoading();
      params.set("page", "1");

      if (data) {
        const filters = encodeURI(JSON.stringify(data));
        params.set("filters", filters);
        replace(`${pathname}?${params}`);
      } else {
        params.delete("filters");
      }
      if (data !== undefined) {
        await onSearchSubmit(1, { advanceFilter: JSON.stringify(filtersData) });
      }
    } catch (error: any) {
      toast.error(error?.message || t("someThingWrong"));
    } finally {
      stopLoading();
    }
  };

  // Handle Reset Search Form
  const resetAdvanceSearchForm = async () => {
    replace(`${pathname}`);
    setResetVisibility(false);
    reset({ "": "" });
    clearErrors();
    setSelectedFields([{ value: "name.default", label: "Product Name" }]);
    setFormVisibility(false);
    setIsUpdateSearch(false);
    await onSearchSubmit();
  };

  // Handle Remove Field from Fields
  const handleRemoveField = (removedField: any[]) => {
    const updatedSelectedFields = selectedFields.filter((field) => field.value !== removedField.value);
    setSelectedFields(updatedSelectedFields);
    const data = { ...getValues() };
    delete data[removedField.label];
    clearErrors(removedField.label);
    reset(data);
  };

  // Handle Remove Option from Option list
  const handleRemoveOption = (value, prevValues, name) => {
    const updatedOptions = prevValues.filter((option, index) => index !== value);
    setValue(name, {
      ...getValues(name),
      value: updatedOptions,
    });
  };

  // Even if user edit input field data but not search
  const onEditFieldSavedSearch = () => {
    handleSavedSearchPopup("form");
  };

  // Render SearchAble Fields
  const renderSearchAbleFields = (structureDummyData: any) => {
    return (
      <div className="w-full max-h-72 overflow-auto">
        {selectedFields.map((structureItem, index) => {
          return (
            <>
              <div key={index} className="flex items-start justify-start gap-2 md:gap-4 md:w-2/3">
                {/* {index < selectedFields?.length - 1 && (
                  <div
                    className={"absolute w-[2px] h-10 bg-th-primary-medium top-10 left-2 transform -translate-x-2/4"}
                  />
                )} */}
                <FaCircleMinus
                  className="text-6xl text-th-primary-hard cursor-pointer hover:text-th-danger-medium"
                  onClick={() => handleRemoveField(structureItem)}
                />
                <h5 className="w-full my-2 text-th-primary-hard rounded-md bg-th-primary-medium py-2 pl-2 leading-normal outline-none whitespace-nowrap overflow-x-auto">
                  {structureItem?.label}
                </h5>
                <select
                  className="w-full my-2 placeholder-th-secondary-light text-th-secondary-medium rounded-md border bg-th-grey-light py-2.5 pl-2 leading-normal outline-none"
                  value={getValues(structureItem.label)?.fliter}
                  onChange={(e) => {
                    setValue(structureItem.label, {
                      ...getValues(structureItem.label),
                      fliter: e.target.value,
                      key: structureItem?.value,
                    });
                  }}
                >
                  <option selected value="" className="text-th-zinc-medium">
                    Choose Filter
                  </option>
                  {structureDummyData[structureItem.value]?.filters?.map((filterOption, optionIndex) => (
                    <option key={optionIndex} value={filterOption?.filter}>
                      {filterOption?.label}
                    </option>
                  ))}
                </select>
                <Controller
                  name={structureItem.label}
                  control={control}
                  render={({}) => {
                    const selectedValue = getValues(structureItem.label)?.fliter;

                    if (
                      (selectedValue === "equal" ||
                        selectedValue === "notEqual" ||
                        selectedValue === "assigned" ||
                        selectedValue === "notAssigned" ||
                        selectedValue === "greaterThan" ||
                        selectedValue === "lessThan" ||
                        selectedValue === "in" ||
                        selectedValue === "nin") &&
                      structureDummyData[structureItem.value]?.filtersdata
                    ) {
                      return (
                        <select
                          className="w-full my-2 placeholder-th-secondary-light text-th-secondary-medium rounded-md border bg-th-grey-light py-2.5 pl-2 leading-normal outline-none"
                          value={getValues(structureItem.label)?.value}
                          onChange={(e) => {
                            setValue(structureItem.label, {
                              ...getValues(structureItem.label),
                              value: e.target.value,
                            });
                            clearErrors(structureItem.label?.field);
                          }}
                        >
                          <option selected value="" className="text-th-zinc-medium">
                            Choose
                          </option>
                          {structureDummyData[structureItem.value]?.filtersdata?.map(
                            (option: string, optionIndex: number) => (
                              <option key={optionIndex} value={option}>
                                {option}
                              </option>
                            ),
                          )}
                        </select>
                      );
                    } else if (selectedValue === "equal" || selectedValue === "notEqual") {
                      return (
                        <input
                          className="w-full my-2 placeholder-th-secondary-light text-th-secondary-medium rounded-md border bg-th-grey-light py-2 pl-2 leading-normal outline-none"
                          type="text"
                          placeholder={`Enter ${structureItem.label}`}
                          value={getValues(structureItem.label)?.value || ""}
                          onChange={(e) => {
                            setValue(structureItem.label, {
                              ...getValues(structureItem.label),
                              value: e.target.value,
                            });
                            clearErrors(structureItem.label);
                          }}
                        />
                      );
                    } else if (selectedValue === "greaterThan" || selectedValue === "lessThan") {
                      return (
                        <DatePicker
                          showIcon
                          toggleCalendarOnIconClick
                          icon={<FaCalendarDays className="text-th-primary-hard mt-[12px] md:mt-[14px] lg:mt-[14px]" />}
                          className="w-full md:w-[152px] lg:w-[120px] 2xl:w-[238px] my-2 h-[42px] md:h-[42px] lg:h-[42px] rounded-md border bg-th-grey-light px-2 leading-normal placeholder-th-secondary-light text-th-secondary-medium outline-none"
                          placeholderText={`Enter ${structureItem.label}`}
                          selected={
                            getValues(structureItem.label)?.value
                              ? new Date(getValues(structureItem.label)?.value)
                              : null
                          }
                          onChange={(date) => {
                            setValue(structureItem.label, {
                              ...getValues(structureItem.label),
                              value: date,
                            });
                            clearErrors(structureItem.label);
                          }}
                        />
                      );
                    } else if (selectedValue === "assigned" || selectedValue === "notAssigned") {
                      const dummydata = ["false", "true"];
                      return (
                        <select
                          className="w-full my-2 placeholder-th-secondary-light text-th-secondary-medium rounded-md border bg-th-grey-light py-2.5 pl-2 leading-normal outline-none"
                          value={getValues(structureItem.label).value}
                          onChange={(e) => {
                            setValue(structureItem.label, {
                              ...getValues(structureItem.label),
                              value: e.target.value,
                            });
                            clearErrors(structureItem.label);
                          }}
                        >
                          <option selected value="" className="text-th-zinc-medium">
                            Choose
                          </option>
                          {dummydata?.map((option: string, optionIndex: number) => (
                            <option key={optionIndex} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                      );
                    } else if (selectedValue === "in" || selectedValue === "nin") {
                      return (
                        <div>
                          <div className="flex justify-start items-start gap-x-4">
                            <input
                              className={`w-full md:w-[140px] lg:w-[185px] 2xl:w-[320px] my-2 rounded-md border bg-th-grey-light py-2 pl-2 leading-normal placeholder-th-secondary-light ${
                                false
                                  ? "text-th-neutral-light cursor-not-allowed outline-none"
                                  : "text-th-secondary-medium focus:outline focus:outline-th-primary-medium"
                              }`}
                              type="text"
                              value={selectedValues}
                              placeholder={`Enter ${structureItem.label}`}
                              onChange={(e) => {
                                setSelectedValues(e.target.value);
                              }}
                            />
                            <button
                              type="button"
                              className="mt-5 -ml-10"
                              disabled={selectedValues?.length == 0}
                              onClick={() => {
                                const values = Array.isArray(getValues(structureItem.label).value)
                                  ? [...getValues(structureItem.label).value, selectedValues]
                                  : [selectedValues];
                                setValue(structureItem.label, {
                                  ...getValues(structureItem.label),
                                  value: values,
                                });
                                setSelectedValues("");
                                clearErrors(structureItem.label);
                              }}
                            >
                              <FaCirclePlus
                                className={`text-lg ${
                                  selectedValues?.length == 0
                                    ? "text-th-info-medium cursor-not-allowed"
                                    : "text-th-primary-hard cursor-pointer"
                                }`}
                              />
                            </button>
                          </div>
                          <div className="flex w-full flex-wrap">
                            {Array.isArray(getValues(structureItem.label).value) &&
                              getValues(structureItem.label).value?.map((option, index) => (
                                <div
                                  key={option + index}
                                  className="bg-th-zinc-light rounded-full px-4 py-1 m-1 flex items-center justify-between"
                                >
                                  <span>{option}</span>
                                  <span
                                    className="ml-2 cursor-pointer"
                                    onClick={() =>
                                      handleRemoveOption(
                                        index,
                                        getValues(structureItem.label).value,
                                        structureItem.label,
                                      )
                                    }
                                  >
                                    <FaX className="text-th-grey-hard hover:text-th-danger-medium" />
                                  </span>
                                </div>
                              ))}
                          </div>
                        </div>
                      );
                    } else {
                      return (
                        <input
                          className="w-full my-2 placeholder-th-secondary-light text-th-secondary-medium rounded-md border bg-th-zinc-light py-2 pl-2 leading-normal outline-none"
                          type="text"
                          disabled
                          placeholder={`Enter ${structureItem.label}`}
                          value={""}
                        />
                      );
                    }
                  }}
                />
              </div>
              <span className="text-th-danger-medium text-sm pl-10">
                {!getValues(structureItem.label)?.value || errors[structureItem.label]?.message
                  ? structureItem.label + " is Required"
                  : ""}
              </span>
            </>
          );
        })}
      </div>
    );
  };
  return (
    <div className="bg-th-background p-2 md:p-4 rounded-xl relative">
      <div
        className="flex justify-between items-center cursor-pointer"
        onClick={() => {
          if (isDropdownOpen === true) {
            setFormVisibility(isFormVisible === true);
          } else {
            setFormVisibility(!isFormVisible);
          }
        }}
      >
        <h4 className="text-lg text-th-primary-hard font-bold">
          <div className="flex flex-col items-start md:flex-row md:items-center gap-x-2 whitespace-nowrap">
            <span className="cursor-pointer">{t("advanceSearch")}</span>
            {isFormVisible && (
              <span
                className="text-xl cursor-context-menu"
                onClick={(e) => {
                  e.stopPropagation();
                  handleToggleDropdown();
                }}
              >
                {isDropdownOpen ? <FaSquareMinus /> : <FaSquarePlus />}
              </span>
            )}
          </div>
        </h4>
        <div ref={dropdownRef}>
          {isDropdownOpen && (
            <div className="absolute top-12 left-3 md:top-10 md:left-40 mt-2 h-64 overflow-auto w-64 rounded-md shadow-lg bg-th-background ring-1 ring-th-grey-medium z-10">
              <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                <div className="relative m-1">
                  <CustomInput
                    className="w-full rounded-md border bg-th-grey-light py-1.5 pl-2 leading-normal placeholder-th-secondary-light text-th-secondary-medium"
                    type="text"
                    placeholder={t("searchHere")}
                    id="fieldName"
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                    }}
                  />
                  {filteredOptions?.length > 0 ? (
                    <div className="relative bg-th-grey-light py-2 md:py-3 lg:py-2.5 2xl:py-3.5 px-2 leading-normal placeholder-th-secondary-light text-th-secondary-medium outline-none overflow-auto">
                      {/* Add the "Select All" option at the beginning */}
                      <div key={allOption.value} className="flex items-center accent-th-primary-hard text-sm">
                        <input
                          type="checkbox"
                          id={allOption.value}
                          onChange={(e) => {
                            const checked = e.target.checked;
                            setSelectedFields(checked ? filteredOptions : []);
                            if (!checked) {
                              reset();
                              clearErrors();
                            }
                          }}
                          checked={selectedFields.length === filteredOptions.length}
                          className="mr-2 cursor-pointer"
                        />
                        <label htmlFor={allOption.value} className="cursor-pointer w-full whitespace-nowrap">
                          {allOption.label}
                        </label>
                      </div>

                      {filteredOptions?.map((option) => (
                        <div key={option.value} className="flex items-center accent-th-primary-hard text-sm">
                          <input
                            type="checkbox"
                            id={option.value}
                            onChange={(e) => {
                              const selectedValues = [...selectedFields];
                              const index = selectedValues?.findIndex((data) => data.value == option.value);

                              if (e.target.checked && index == "-1") {
                                selectedValues?.push(option);
                              } else {
                                const data = { ...getValues() };
                                delete data[option?.label];
                                reset(data);

                                clearErrors(option.label);
                                const index = selectedValues?.findIndex((data) => data.value == option.value);
                                if (index !== -1) {
                                  selectedValues?.splice(index, 1);
                                }
                              }
                              setSelectedFields(selectedValues);
                            }}
                            checked={selectedFields?.findIndex((data) => data.value == option.value) != "-1"}
                            className="mr-2 cursor-pointer"
                          />
                          <label htmlFor={option.value} className="cursor-pointer w-full whitespace-nowrap">
                            {option.label}
                          </label>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-2 my-2 text-sm text-th-grey-hard bg-th-zinc-light rounded-md">No Option</div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="flex items-center gap-x-2 md:gap-x-4">
          {isFormVisible && (
            <>
              {/* Export Products */}
              {/* <CustomButton
                className={`relative flex items-center justify-center whitespace-nowrap w-full rounded-md bg-th-primary-hard py-2 px-4 text-xs lg:text-base font-bold text-th-primary-light outline-none transition duration-150 ease-in-out hover:shadow-lg ${
                  productData?.length === 0 && "cursor-not-allowed bg-th-secondary-light"
                }`}
                type="button"
                label={t("export")}
                endIcon={<FaFileCsv />}
                onClick={(e: any) => {
                e.stopPropagation();
                handleExportProductsData();
              }}
                disabled={productsData?.length === 0}
              /> */}
            </>
          )}
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
        </div>
      </div>
      <div className="w-full">
        {/* Form */}
        {isFormVisible && (
          <form className="h-full w-full mt-5" onSubmit={handleSubmit(onSubmit)}>
            <div className="w-full overflow-x-auto">{renderSearchAbleFields(structureDummyData)}</div>
            {/* Actions Buttons */}
            <div className="flex sm:flex-row flex-col sm:space-x-4 my-2">
              {/* Search button */}
              <CustomButton
                className={`mt-2 md:mt-4 rounded-md bg-th-primary-hard py-2 px-4 text-xs lg:text-base font-bold text-th-primary-light outline-none transition duration-150 ease-in-out hover:shadow-lg ${
                  loading && "cursor-not-allowed"
                }`}
                type="submit"
                onClick={handleSubmit(onSubmit)}
                disabled={loading || selectedFields?.length == 0}
                label={loading ? t("search") + "..." : t("search")}
              />
              {/* Reset button */}
              {isResetVisible && (
                <CustomButton
                  className="mt-2 md:mt-4 rounded-md  border border-th-primary-medium py-2 px-4 text-xs lg:text-base font-bold text-th-grey-hard outline-none transition duration-150 ease-in-out hover:shadow-lg"
                  type="button"
                  label={t("reset")}
                  onClick={resetAdvanceSearchForm}
                />
              )}
              {/* Save As button */}
              {isResetVisible && (
                <>
                  {isUpdateSearch === true ? (
                    <CustomButton
                      className={`mt-2 md:mt-4 rounded-md bg-th-primary-hard py-2 px-4 text-xs lg:text-base font-bold text-th-primary-light outline-none transition duration-150 ease-in-out hover:shadow-lg ${
                        productData?.length === 0 && "cursor-not-allowed bg-th-secondary-light"
                      }`}
                      type="button"
                      label={t("update")}
                      disabled={productData?.length === 0}
                      onClick={onEditFieldSavedSearch}
                    />
                  ) : (
                    <CustomButton
                      className={`mt-2 md:mt-4 rounded-md bg-th-primary-hard py-2 px-4 text-xs lg:text-base font-bold text-th-primary-light outline-none transition duration-150 ease-in-out hover:shadow-lg ${
                        productData?.length === 0 && "cursor-not-allowed bg-th-secondary-light"
                      }`}
                      type="button"
                      label={t("save")}
                      disabled={productData?.length === 0}
                      onClick={onEditFieldSavedSearch}
                    />
                  )}
                </>
              )}

              {/* Saved Searches */}
              <CustomButton
                className="mt-2 md:mt-4 rounded-md bg-th-primary-hard py-2 px-4 text-xs lg:text-base font-bold text-th-primary-light outline-none transition duration-150 ease-in-out hover:shadow-lg"
                type="button"
                label={t("savedSearches")}
                onClick={() => {
                  handleSavedSearchPopup("table");
                }}
              />
            </div>
          </form>
        )}
      </div>
      <CustomExportNamePopup
        isOpen={showExportNamePopup}
        onCancel={handleCancelExportName}
        onConfirm={handleConfirmExportName}
        message="confirmExportName"
        exportedFilters={getValues()}
        _key="products"
      />
      <SavedSearchModel
        isOpen={showSavedSearchNamePopup}
        onCancel={handleCancelSavedSearchName}
        onConfirm={handleConfirmSavedSearchName}
        message={selectedView == "table" ? "searchHistory" : isUpdateSearch ? "updateSearch" : "saveSearch"}
        selectedSearchHistoryProduct={selectedSearchHistoryProduct}
        setSelectedSearchHistoryProduct={setSelectedSearchHistoryProduct}
        setIsUpdateSearch={setIsUpdateSearch}
        isUpdateSearch={isUpdateSearch}
        allSearchesHistory={allSearchesHistory}
        filters={getValues()}
        _key="products"
        selectedView={selectedView}
        setGetSaveSearchHistory={setGetSaveSearchHistory}
        getSaveSearchHistory={getSaveSearchHistory}
        setDeleteProductSearchId={setDeleteProductSearchId}
        loading={savedSearchesTableLoader}
      />
    </div>
  );
};
export default ProductAdvanceSearchForm;
