import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { Controller, useForm } from "react-hook-form";
import CustomInput from "@/components/common/input/custom-input";
import CustomButton from "@/components/common/button/custom-button";
import { FaAngleDown, FaAngleUp } from "react-icons/fa6";
import { toast } from "react-toastify";
import useLoading from "@/common/hook/loading";
import { useSearchParams } from "next/navigation";
import { usePathname, useRouter } from "next-intl/client";
import { yupResolver } from "@hookform/resolvers/yup";
import { exportsSearchFormSchema } from "@/common/config/schema";
import { logger } from "@/common/util/logger";

// Define types for Exports Search Inputs
interface ExportsSearchFormTypes {
  exportType: string;
  exportName: string;
  status: string;
}

const ExportsSearchForm = ({ onSearchSubmit }: any) => {
  const t = useTranslations("exportsPage.exportSearchFrom");
  const { loading, startLoading, stopLoading } = useLoading();
  const [isFormVisible, setFormVisibility] = useState<boolean>(false);
  const [isResetVisible, setResetVisibility] = useState<boolean>(false);
  const searchParams = useSearchParams();
  const { replace } = useRouter();
  const pathname = usePathname();
  const params = new URLSearchParams(searchParams);
  // defultValues
  const defaultValues = {
    exportType: "",
    exportName: "",
    status: "",
  };
  const {
    control,
    handleSubmit,
    reset,
    formState: { isDirty, errors },
  } = useForm<ExportsSearchFormTypes>({
    resolver: yupResolver(exportsSearchFormSchema),
    mode: "all",
    defaultValues: defaultValues,
  });
  // Handle Search Submit
  const onSubmit = async (data: ExportsSearchFormTypes) => {
    try {
      setResetVisibility(true);
      startLoading();
      params.set("page", "1");
      if (data) {
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
    }
  };
  // Handle Reset Search Form
  const resetUsersSearchForm = async () => {
    setResetVisibility(false);
    reset(defaultValues);
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
      <div className="w-full">
        {/* Form */}
        {isFormVisible && (
          <form className="h-full w-full mt-5" onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col md:flex-row gap-0 md:gap-4  md:mt-4">
              {/* Export Name input */}
              <div className="w-full mt-1 md:mt-0">
                <label htmlFor="exportName" className="text-th-secondary-medium font-semibold">
                  {t("exportName")}
                </label>
                <Controller
                  name="exportName"
                  control={control}
                  render={({ field }) => (
                    <CustomInput
                      className="w-full my-2 rounded-md border bg-th-grey-light py-2 md:py-3 lg:py-2.5 2xl:py-3.5 pl-2 leading-normal placeholder-th-secondary-light text-th-secondary-medium outline-none"
                      type="text"
                      placeholder={t("placeholder.exportName")}
                      id="exportName"
                      {...field}
                    />
                  )}
                />
                {errors.exportName && <span className="text-th-danger-medium">{t(errors.exportName.message)}</span>}
              </div>
              {/* Export Type input */}
              <div className="w-full">
                <label htmlFor="exportType" className="text-th-secondary-medium font-semibold">
                  {t("exportType")}
                </label>
                <Controller
                  name="exportType"
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
                      <option value="user">{t("user")}</option>
                      <option value="collection">{t("collection")}</option>
                      <option value="team">{t("team")}</option>
                    </select>
                  )}
                />
                {errors.exportType && <span className="text-th-danger-medium">{t(errors.exportType.message)}</span>}
              </div>
            </div>
            <div className="flex flex-col md:flex-row gap-0 md:gap-4  md:mt-4">
              {/* Status select input */}
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
                      <option value="inprogress">{t("inprogress")}</option>
                      <option value="done">{t("done")}</option>
                      <option value="failed">{t("failed")}</option>
                    </select>
                  )}
                />
                {errors.status && <span className="text-th-danger-medium">{t(errors.status.message)}</span>}
              </div>
              {/* Export Module Type */}
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
                  className="mt-4 rounded-md  border border-th-primary-medium py-2 px-4 text-xs lg:text-base font-bold text-th-grey-hard outline-none transition duration-150 ease-in-out hover:shadow-lg"
                  type="button"
                  label={t("reset")}
                  onClick={resetUsersSearchForm}
                />
              )}
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
export default ExportsSearchForm;
