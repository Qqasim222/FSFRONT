import React, { useEffect } from "react";
import { useTranslations } from "next-intl";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import CustomInput from "@/components/common/input/custom-input";
import CustomButton from "@/components/common/button/custom-button";
import { addNewCollectionFormSchema, updateCollectionFormSchema } from "@/common/config/schema";
import axios from "@/common/util/api/axios-public-client";
import { toast } from "react-toastify";
import useLoading from "@/common/hook/loading";
import SingleSelectSearchInput from "../common/input/single-select-search-input";
import { useSearchParams } from "next/navigation";
import { usePathname, useRouter } from "next-intl/client";
import { COLLECTIONS } from "@/common/constant/local.constant";
import MultiSelectSearchField from "../products/product-detail/generic-fields/generic-multiselect-search";
import DatePicker from "react-datepicker";
import { FaCalendarDays } from "react-icons/fa6";

// Define types for Edit Collection Inputs
interface CollectionFormTypes {
  name: string;
  collaborator: any[];
  startDate: Date;
  endDate: Date;
  status: string;
  country: any[];
}
interface CollectionFormProps {
  onCancel: () => void;
  isUpdateMode: boolean;
  selectedCollectionData: string;
  onCollectionListUpdate: any;
  countriesList: any;
}

const CollectionForm: React.FC<CollectionFormProps> = ({
  onCancel,
  isUpdateMode,
  selectedCollectionData,
  onCollectionListUpdate,
  countriesList,
}) => {
  const t = useTranslations("collectionPage.collectionModal.form");
  const { loading, startLoading, stopLoading } = useLoading();
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);
  const pathname = usePathname();
  const { replace } = useRouter();
  const {
    control,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isDirty },
  } = useForm<CollectionFormTypes>({
    resolver: yupResolver(isUpdateMode ? updateCollectionFormSchema : addNewCollectionFormSchema),
    mode: "all",
  });
  function formatDate(inputDate) {
    const parts = inputDate.split("/");
    const day = parts[1];
    const month = parts[0];
    const year = parts[2];
    const dateObject = new Date(year, month - 1, day);
    const formattedDate =
      dateObject.getFullYear() +
      "-" +
      ("0" + (dateObject.getMonth() + 1)).slice(-2) +
      "-" +
      ("0" + dateObject.getDate()).slice(-2);
    return formattedDate;
  }

  useEffect(() => {
    if (isUpdateMode && selectedCollectionData) {
      setValue("name", selectedCollectionData?.name || "");
      setValue(
        "collaborator",
        selectedCollectionData?.collaborator
          ? [
              {
                id: selectedCollectionData.collaborator?._id,
                name: selectedCollectionData.collaborator?.name,
              },
            ]
          : [],
      );
      const startDate = new Date(selectedCollectionData?.startDate).toLocaleDateString().split("T")[0];
      selectedCollectionData.startDate !== null && setValue("startDate", formatDate(startDate));
      const endDate = new Date(selectedCollectionData?.endDate).toLocaleDateString().split("T")[0];
      selectedCollectionData.endDate !== null && setValue("endDate", formatDate(endDate));
      setValue("status", selectedCollectionData?.status || "");
      setValue("country", selectedCollectionData?.operationalCountry?.name || "");
    } else {
      reset();
    }
  }, [isUpdateMode, selectedCollectionData, reset, setValue]);

  // Function to add one day to a date days
  function addOneDay(date: any) {
    const modifiedDate = new Date(date);
    modifiedDate.setDate(modifiedDate?.getDate() + 1);
    return modifiedDate;
  }

  // Handle Submit
  const onSubmit = async (data: CollectionFormTypes) => {
    const filters = params?.get("filters") || "";
    const searchData = filters ? JSON.parse(decodeURI(filters)) : {};
    const filterSelectedCountry = countriesList?.filter((item: any) => item?.name === data?.country);

    if (isUpdateMode) {
      try {
        startLoading();
        const simplefiedData = {
          name: data?.name ? data?.name : null,
          collaborator: data?.collaborator[0]?.id ? data?.collaborator[0]?.id : null,
          startDate: data.startDate && data.startDate.toISOString(),
          endDate: data.endDate && data.endDate.toISOString(),
          status: data?.status ? data?.status : null,
          id: selectedCollectionData ? selectedCollectionData?._id : "",
          operationalCountry: data?.country
            ? { name: filterSelectedCountry[0]?.name, code: filterSelectedCountry[0]?.shortName }
            : null,
        };
        const apiResponse = await axios.patch(COLLECTIONS, JSON.stringify(simplefiedData));
        if (apiResponse?.data?.statusCode == 200) {
          toast.success(apiResponse?.data?.message);
          reset();
          onCancel();
          if (onCollectionListUpdate) onCollectionListUpdate(params.get("page") || 1, searchData);
        } else {
          toast.error(apiResponse?.data?.message);
        }
      } catch (error: Error) {
        toast.error(error?.message || t("someThingWrong"));
      } finally {
        stopLoading();
      }
    } else {
      startLoading();
      try {
        const simplefiedData = {
          name: data?.name && data?.name,
          collaborator: data?.collaborator && data?.collaborator[0]?.id,
          startDate: data?.startDate && addOneDay(new Date(data.startDate)).toISOString(),
          endDate: data?.endDate && addOneDay(new Date(data.endDate)).toISOString(),
          status: data?.status,
          operationalCountry: data?.country
            ? { name: filterSelectedCountry[0]?.name, code: filterSelectedCountry[0]?.shortName }
            : null,
        };

        const apiResponse = await axios.post(COLLECTIONS, JSON.stringify(simplefiedData));
        if (apiResponse?.data?.statusCode == 201) {
          toast.success(apiResponse?.data?.message);
          reset();
          onCancel();
          replace(`${pathname}`);
          if (onCollectionListUpdate) {
            onCollectionListUpdate(params.get("page") || 1);
            replace(`${pathname}`);
          }
        } else {
          toast.error(apiResponse?.data?.message);
        }
      } catch (error: Error) {
        toast.error(error?.message || t("someThingWrong"));
      } finally {
        stopLoading();
      }
    }
  };
  // Associate User Set As Initial
  useEffect(() => {
    if (searchParams?.has("user")) {
      const associatedUser = JSON.parse(searchParams?.get("user"));
      setValue(
        "collaborator",
        associatedUser?.name
          ? [
              {
                id: associatedUser?.id,
                name: associatedUser?.name,
              },
            ]
          : [],
      );
    }
  }, []);

  return (
    <div className="w-full">
      {/* Form */}
      <form className="h-full w-full" onSubmit={handleSubmit(onSubmit)}>
        {/* First Name input */}
        <div className="flex flex-col">
          <label htmlFor="name" className="text-th-secondary-medium font-semibold">
            {t("name")}
            <span className="text-th-danger-medium ps-1">*</span>
          </label>
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <CustomInput
                className="w-full my-2 rounded-md border bg-th-grey-light py-2 md:py-3 lg:py-2.5 2xl:py-3.5 pl-2 leading-normal placeholder-th-secondary-light text-th-secondary-medium outline-none"
                type="text"
                placeholder={t("placeholder.name")}
                id="name"
                {...field}
              />
            )}
          />
          {errors.name && <span className="text-th-danger-medium">{t(errors.name.message)}</span>}
        </div>
        {/* Collaborator Name input */}
        <div className="flex flex-col mt-3 mb-3 sm:mt-0">
          <label htmlFor="collaborator" className="text-th-secondary-medium font-semibold">
            {t("collaborator")}
          </label>
          <Controller
            name="collaborator"
            control={control}
            render={({ field, fieldState }) => (
              <div>
                <SingleSelectSearchInput
                  className="w-full mt-2 placeholder-th-secondary-light text-th-secondary-medium rounded-md border bg-th-grey-light py-2 md:py-3 lg:py-2.5 2xl:py-3.5 pl-2 leading-normal outline-none"
                  onSelect={field.onChange} // Pass the onChange handler directly
                  selected={field.value}
                  placeholder={t("placeholder.collaborator")}
                />
                {fieldState.error && <span className="text-th-danger-medium">{t(fieldState.error.message)}</span>}
              </div>
            )}
          />
        </div>
        {/* country selector */}
        <div className="flex flex-col mt-3 mb-3 sm:mt-0">
          <label htmlFor="country" className="text-th-secondary-medium font-semibold">
            {t("country")}
            <span className="text-th-danger-medium ps-1">*</span>
          </label>
          <Controller
            name="country"
            control={control}
            render={({ field }) => (
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
                {errors.country && <span className="text-th-danger-medium">{t(errors.country.message)}</span>}
              </div>
            )}
          />
        </div>

        {/* Start date input */}
        <div className="flex flex-col mt-3 sm:mt-0">
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
                icon={<FaCalendarDays className="text-th-primary-hard mt-[12px] md:mt-[17px] lg:mt-[19px]" />}
                className="w-full my-2 h-[39px] md:h-[47px] lg:h-[51px] rounded-md border bg-th-grey-light px-2 leading-normal placeholder-th-secondary-light text-th-secondary-medium outline-none"
                selected={field?.value || ""}
                onChange={field?.onChange}
                placeholderText={t("placeholder.startDate")}
              />
            )}
          />
          {errors.startDate && <span className="text-th-danger-medium">{t(errors.startDate.message)}</span>}
        </div>
        {/* End data input */}
        <div className="flex flex-col mt-3 sm:mt-0">
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
                icon={<FaCalendarDays className="text-th-primary-hard mt-[12px] md:mt-[17px] lg:mt-[19px]" />}
                className="w-full my-2 h-[39px] md:h-[47px] lg:h-[51px] rounded-md border bg-th-grey-light px-2 leading-normal placeholder-th-secondary-light text-th-secondary-medium outline-none"
                selected={field?.value || ""}
                onChange={field?.onChange}
                placeholderText={t("placeholder.endDate")}
              />
            )}
          />
          {errors.endDate && <span className="text-th-danger-medium">{t(errors.endDate.message)}</span>}
        </div>
        {/* Status select input */}
        <div className="flex flex-col mt-3 sm:m-0">
          <label htmlFor="status" className="text-th-secondary-medium font-semibold">
            {t("status")}
            <span className="text-th-danger-medium ps-1">*</span>
          </label>
          <Controller
            name="status"
            defaultValue="active"
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
          {errors.status && <span className="text-th-danger-medium">{t(errors.status.message)}</span>}
        </div>
        {/* Actions Buttons */}
        <div className="flex flex-col md:flex-row md:space-x-4 mt-2 md:mt-4">
          {/* Save button */}
          <CustomButton
            className={`mt-4 rounded-md bg-th-primary-hard py-3 lg:py-2.5 px-6 text-xs lg:text-base font-semibold text-th-primary-light outline-none transition duration-150 ease-in-out hover:shadow-lg ${
              loading && "cursor-not-allowed"
            }`}
            type="submit"
            label={loading ? t("save") + "..." : t("save")}
            disabled={!isDirty || loading}
          />
          {/* Cancel button */}
          <CustomButton
            className="mt-4 rounded-md border border-th-primary-medium py-3 lg:py-2.5 px-6 text-xs lg:text-base font-semibold text-th-grey-hard outline-none transition duration-150 ease-in-out hover:shadow-lg"
            type="button"
            label={t("cancel")}
            onClick={() => {
              onCancel();
              reset();
            }}
          />
        </div>
      </form>
    </div>
  );
};

export default CollectionForm;
