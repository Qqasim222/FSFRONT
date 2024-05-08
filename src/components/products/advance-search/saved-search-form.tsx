import React from "react";
import { useTranslations } from "next-intl";
import CustomButton from "@/components/common/button/custom-button";
import CustomInput from "@/components/common/input/custom-input";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import { savedSearchNameFormSchema } from "@/common/config/schema";
import { toast } from "react-toastify";
import useLoading from "@/common/hook/loading";
import axios from "@/common/util/api/axios-public-client";
import { SAVE_PRODUCT_SEARCH, UPDATE_PRODUCT_SEARCH } from "@/common/constant/local.constant";
interface SavedSearchFormProps {
  onCancel: () => void;
  onConfirm: () => void;
  _key: string;
  filters: any;
  setGetSaveSearchHistory: any;
  getSaveSearchHistory: boolean;
  selectedSearchHistoryProduct: any;
  isUpdateSearch: any;
}

const SavedSearchForm: React.FC<SavedSearchFormProps> = ({
  onCancel,
  onConfirm,
  _key,
  filters,
  setGetSaveSearchHistory,
  getSaveSearchHistory,
  selectedSearchHistoryProduct,
  isUpdateSearch,
}) => {
  const t = useTranslations("productsPage.productAdvanceSearchFrom.saveSearchForm");

  const { loading, startLoading, stopLoading } = useLoading();
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(savedSearchNameFormSchema),
    mode: "all",
    defaultValues: {
      searchName: isUpdateSearch ? selectedSearchHistoryProduct?.name : "",
      // description: ""
    },
  });

  // Handle form submission
  const onSubmit = handleSubmit(async (data: any) => {
    try {
      startLoading();
      if (_key === "products") {
        if (isUpdateSearch === true) {
          const apiResponse = await axios.patch(UPDATE_PRODUCT_SEARCH, {
            searchName: data.searchName,
            filters: filters,
            searchId: selectedSearchHistoryProduct?._id,
          });
          if (apiResponse?.data?.statusCode === 200) {
            setGetSaveSearchHistory(!getSaveSearchHistory);
            toast.success(apiResponse?.data?.message);
            onConfirm();
            reset();
          } else {
            toast.error(apiResponse?.data?.errors);
          }
        } else if (isUpdateSearch === false) {
          const apiResponse = await axios.post(SAVE_PRODUCT_SEARCH, { searchName: data.searchName, filters: filters });
          if (apiResponse?.data?.statusCode === 201) {
            setGetSaveSearchHistory(!getSaveSearchHistory);
            toast.success(apiResponse?.data?.message);
            onConfirm();
            reset();
          } else {
            toast.error(apiResponse?.data?.errors);
          }
        }
      }
    } catch (error: Error) {
      toast.error(error?.message || t("someThingWrong"));
    } finally {
      stopLoading();
    }
  });
  return (
    <div>
      <form className="h-full w-full py-5" onSubmit={onSubmit}>
        {/* Search Name input */}
        <div className="w-full">
          <label htmlFor="searchName" className="text-th-secondary-medium font-semibold">
            {t("searchName")}
            <span className="text-th-danger-medium ps-1">*</span>
          </label>
          <Controller
            name="searchName"
            control={control}
            render={({ field }) => (
              <CustomInput
                className="w-full my-2 placeholder-th-secondary-light text-th-secondary-medium rounded-md border bg-th-grey-light py-2 md:py-3 lg:py-2.5 2xl:py-3.5 pl-2 leading-normal outline-none"
                type="text"
                placeholder={t("placeholder.enterName")}
                id="searchName"
                {...field}
              />
            )}
          />
          {errors.searchName && <span className="text-th-danger-medium">{t(errors.searchName.message)}</span>}
        </div>
        {/* description input */}
        {/* <div className="w-full">
          <label htmlFor="description" className="text-th-secondary-medium font-semibold">
            {t("description")}
          </label>
          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <textarea
                className="w-full my-2 placeholder-th-secondary-light text-th-secondary-medium rounded-md border bg-th-grey-light py-2 md:py-3 lg:py-2.5 2xl:py-3.5 pl-2 leading-normal outline-none"
                placeholder={t("placeholder.enterDesc")}
                id="name"
                rows={3}
                {...field}
              />
            )}
          />
          {errors.description && <span className="text-th-danger-medium">{t(errors.description.message)}</span>}
        </div> */}
        {/* Confirm and Cancel buttons */}
        <div className="flex mt-4 text-lg gap-4">
          <CustomButton
            className={`rounded-md bg-th-primary-hard py-2 px-4 text-xs lg:text-base font-semibold text-th-primary-light outline-none transition duration-150 ease-in-out hover:shadow-lg ${
              loading && "cursor-not-allowed"
            }`}
            type="submit"
            label={loading ? t("save") + "..." : t("save")}
            disabled={loading}
          />
          <CustomButton
            className="rounded-md border border-th-primary-medium py-2 px-4 text-xs lg:text-base font-semibold text-th-grey-hard outline-none transition duration-150 ease-in-out hover:shadow-lg"
            type="button"
            label={t("cancel")}
            onClick={() => {
              onCancel();
              reset({
                searchName: "",
                // description: ""
              });
            }}
          />
        </div>
      </form>
    </div>
  );
};

export default SavedSearchForm;
