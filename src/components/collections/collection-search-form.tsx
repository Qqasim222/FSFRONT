import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { Controller, useForm } from "react-hook-form";
import CustomInput from "@/components/common/input/custom-input";
import CustomButton from "@/components/common/button/custom-button";
import { FaAngleDown, FaAngleUp, FaCalendarDays, FaFileCsv } from "react-icons/fa6";
import { toast } from "react-toastify";
import useLoading from "@/common/hook/loading";
import { useSearchParams } from "next/navigation";
import { usePathname, useRouter } from "next-intl/client";
import { yupResolver } from "@hookform/resolvers/yup";
import { collectionsSearchFormSchema } from "@/common/config/schema";
import CustomExportNamePopup from "../common/popup/export-name-popup";
import MultiSelectSearchField from "../products/product-detail/generic-fields/generic-multiselect-search";
import DatePicker from "react-datepicker";

// Define types for Users Search Inputs
interface CollectionSearchFormTypes {
  name: string;
  collaborator: string;
  startDate: string;
  endDate: string;
  status: string;
  country: string;
}
const CollectionSearchForm = ({ onSearchSubmit, collectionData, countriesList }: any) => {
  const t = useTranslations("collectionPage.searchFrom");
  const [isFormVisible, setFormVisibility] = useState<boolean>(false);
  const [isResetVisible, setResetVisibility] = useState<boolean>(false);
  const [showExportNamePopup, setShowExportNamePopup] = useState(false);
  const { loading, startLoading, stopLoading } = useLoading();
  const [exportFilters, setExportFilters] = useState<CollectionSearchFormTypes>();
  const searchParams = useSearchParams();
  const { replace } = useRouter();
  const pathname = usePathname();
  const params = new URLSearchParams(searchParams);
  // defultValues
  const defaultValues = {
    name: "",
    collaborator: "",
    startDate: "",
    endDate: "",
    status: "",
  };
  const {
    control,
    handleSubmit,
    reset,
    formState: { isDirty },
  } = useForm<CollectionSearchFormTypes>({
    resolver: yupResolver(collectionsSearchFormSchema),
    mode: "all",
    defaultValues: defaultValues,
  });

  // Handle Submit Collection Search Form
  const onSubmit = async (data: CollectionSearchFormTypes) => {
    try {
      setResetVisibility(true);
      startLoading();
      params.set("page", "1");
      if (data) {
        setExportFilters(data);
        const filters = encodeURI(JSON.stringify(data));
        params.set("filters", filters);
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
    }
  };
  // Handle Reset Search Form
  const resetCollectiosSearchForm = async () => {
    setResetVisibility(false);
    reset(defaultValues);
    setExportFilters(defaultValues);
    replace(`${pathname}`);
    await onSearchSubmit();
  };
  // Handle Export Collections Data
  const handleExportCollectionsData = async () => {
    setShowExportNamePopup(true);
  };
  const handleCancelExportName = () => {
    setShowExportNamePopup(false);
  };
  const handleConfirmExportName = async () => {
    setShowExportNamePopup(false);
  };
  return (
    <div className="bg-th-background p-2 md:p-4 rounded-xl">
      <div
        className="flex justify-between items-center cursor-pointer"
        onClick={() => setFormVisibility(!isFormVisible)}
      >
        <h4 className="text-lg text-th-primary-hard font-bold">{t("search")}</h4>
        <span className="flex items-center gap-x-2 md:gap-x-4">
          {isFormVisible && (
            <CustomButton
              className={`relative flex items-center justify-center whitespace-nowrap w-full rounded-md bg-th-primary-hard py-2 px-4 text-xs lg:text-base font-bold text-th-primary-light outline-none transition duration-150 ease-in-out hover:shadow-lg ${
                collectionData?.length === 0 && "cursor-not-allowed bg-th-secondary-light"
              }`}
              type="button"
              label={t("export")}
              endIcon={<FaFileCsv />}
              onClick={(e: any) => {
                e.stopPropagation();
                handleExportCollectionsData();
              }}
              disabled={collectionData?.length === 0}
            />
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
        </span>
      </div>
      <div className="w-full">
        {/* Form */}
        {isFormVisible && (
          <form className="h-full w-full mt-5" onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col md:flex-row gap-0 md:gap-4  md:mt-4">
              {/* First Name input */}
              <div className="w-full">
                <label htmlFor="name" className="text-th-secondary-medium font-semibold">
                  {t("name")}
                </label>
                <Controller
                  name="name"
                  control={control}
                  render={({ field }) => (
                    <CustomInput
                      className="w-full my-2 placeholder-th-secondary-light text-th-secondary-medium rounded-md border bg-th-grey-light py-2 md:py-3 lg:py-2.5 2xl:py-3.5 pl-2 leading-normal outline-none"
                      type="text"
                      placeholder={t("placeholder.name")}
                      id="name"
                      {...field}
                    />
                  )}
                />
              </div>
              {/* Date select inputs */}
              <div className="w-full flex flex-col md:flex-row mt-1 md:mt-0 gap-2 md:gap-4">
                <div className="flex flex-col md:w-1/2">
                  <label htmlFor="startDate" className="text-th-secondary-medium font-semibold">
                    {t("startDate")}
                  </label>
                  <Controller
                    name="startDate"
                    control={control}
                    render={({ field }) => (
                      <DatePicker
                        showIcon
                        toggleCalendarOnIconClick
                        icon={<FaCalendarDays className="text-th-primary-hard mt-[14px] md:mt-[17px] lg:mt-[19px]" />}
                        className="w-full my-2 h-[44px] md:h-[50px] lg:h-[54px] rounded-md border bg-th-grey-light px-2 leading-normal placeholder-th-secondary-light text-th-secondary-medium outline-none"
                        selected={field?.value || ""}
                        onChange={field?.onChange}
                        placeholderText={t("placeholder.startDate")}
                      />
                    )}
                  />
                </div>
                <div className="flex flex-col md:w-1/2">
                  <label htmlFor="endDate" className="text-th-secondary-medium font-semibold">
                    {t("endDate")}
                  </label>
                  <Controller
                    name="endDate"
                    control={control}
                    render={({ field }) => (
                      <DatePicker
                        showIcon
                        toggleCalendarOnIconClick
                        icon={<FaCalendarDays className="text-th-primary-hard mt-[14px] md:mt-[17px] lg:mt-[19px]" />}
                        className="w-full my-2 h-[44px] md:h-[50px] lg:h-[54px] rounded-md border bg-th-grey-light px-2 leading-normal placeholder-th-secondary-light text-th-secondary-medium outline-none"
                        selected={field?.value || ""}
                        onChange={field?.onChange}
                        placeholderText={t("placeholder.endDate")}
                      />
                    )}
                  />
                </div>
              </div>
            </div>
            <div className="flex flex-col md:flex-row gap-0 md:gap-4 md:mt-4">
              {/* Collaborator input */}
              <div className="w-full mt-1 md:mt-0">
                <label htmlFor="collaborator" className="text-th-secondary-medium font-semibold">
                  {t("collaborator")}
                </label>
                <Controller
                  name="collaborator"
                  control={control}
                  render={({ field }) => (
                    <CustomInput
                      className="w-full my-2 placeholder-th-secondary-light text-th-secondary-medium rounded-md border bg-th-grey-light py-2 md:py-3 lg:py-2.5 2xl:py-3.5 pl-2 leading-normal outline-none"
                      type="text"
                      placeholder={t("placeholder.collaborator")}
                      id="collaborator"
                      {...field}
                    />
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
                      <option value="active">{t("active")}</option>
                      <option value="inactive">{t("inactive")}</option>
                    </select>
                  )}
                />
              </div>
              {/* Country input */}
              <div className="w-full mt-1 md:mt-0">
                <label htmlFor="country" className="text-th-secondary-medium font-semibold">
                  {t("country")}
                </label>
                <Controller
                  name="country"
                  defaultValue=""
                  control={control}
                  render={({ field, fieldState }) => (
                    <div>
                      <MultiSelectSearchField
                        className={`w-full my-2 rounded-md border bg-th-grey-light py-2 md:py-3 lg:py-2.5 2xl:py-3.5 pl-2 leading-normal placeholder-th-secondary-light ${
                          false
                            ? "text-th-neutral-light cursor-not-allowed outline-none"
                            : "text-th-secondary-medium focus:outline focus:outline-th-primary-medium"
                        }`}
                        onSelect={(values) => {
                          field.onChange(values[0]?.name ? values[0]?.name : "");
                        }}
                        data={countriesList}
                        placeholder={t("placeholder.enterCountry")}
                        multiSelect={false}
                        selected={
                          field?.value && countriesList?.find((countryItem) => countryItem?.name == field.value)
                            ? [countriesList?.find((countryItem) => countryItem?.name == field.value)]
                            : []
                        }
                        selectedInInput
                      />
                      {fieldState.error && <span className="text-th-danger-medium">{t(fieldState.error.message)}</span>}
                    </div>
                  )}
                />
              </div>
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
                  className="mt-4 rounded-md  border border-th-primary-medium py-2 px-4 text-xs lg:text-base font-bold text-th-grey-hard outline-none transition duration-150 ease-in-out hover:shadow-lg"
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
        _key="collections"
      />
    </div>
  );
};
export default CollectionSearchForm;
