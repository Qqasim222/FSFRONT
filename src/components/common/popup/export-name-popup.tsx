import { useTranslations } from "next-intl";
import React from "react";
import CustomButton from "@/components/common/button/custom-button";
import CustomInput from "@/components/common/input/custom-input";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import { exportNameFormSchema } from "@/common/config/schema";
import { FaX } from "react-icons/fa6";
import { toast } from "react-toastify";
import axios from "@/common/util/api/axios-public-client";
import { EXPORT_COLLECTIONS_CSV, EXPORT_TEAM_MEMBERS_CSV, EXPORT_USERS_CSV } from "@/common/constant/local.constant";
import useLoading from "@/common/hook/loading";

interface CustomExportNamePopupProps {
  isOpen: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  message: string;
  exportedFilters?: any;
  collectionId?: string;
  _key: string;
}

const CustomExportNamePopup: React.FC<CustomExportNamePopupProps> = ({
  isOpen,
  onCancel,
  onConfirm,
  message,
  exportedFilters,
  collectionId,
  _key,
}) => {
  const t = useTranslations("popups.exportName");
  const messageKey = t(message);
  const { loading, startLoading, stopLoading } = useLoading();
  const {
    control,
    handleSubmit,
    reset,
    formState: { isDirty, errors },
  } = useForm({
    resolver: yupResolver(exportNameFormSchema),
    mode: "all",
    defaultValues: { name: "" },
  });

  if (!isOpen) {
    return null;
  }
  // Handle form submission
  const onSubmit = handleSubmit(async (data: any) => {
    try {
      startLoading();
      if (_key === "users") {
        const apiResponse = await axios.get(EXPORT_USERS_CSV, {
          params: {
            exportName: data?.name,
            firstName: exportedFilters?.firstName,
            lastName: exportedFilters?.lastName,
            email: exportedFilters?.email,
            role: exportedFilters?.role,
            status: exportedFilters?.status,
            order: "desc",
          },
        });
        if (apiResponse?.data?.statusCode === 200) {
          toast.success(apiResponse?.data?.message);
          onConfirm();
          reset();
        } else {
          toast.error(apiResponse?.data?.errors[0]);
        }
      } else if (_key === "collections") {
        const apiResponse = await axios.get(EXPORT_COLLECTIONS_CSV, {
          params: {
            exportName: data?.name,
            name: exportedFilters?.name,
            collaborator: exportedFilters?.collaborator,
            startDate: exportedFilters?.startDate,
            endDate: exportedFilters?.endDate,
            status: exportedFilters?.status,
            order: "desc",
          },
        });
        if (apiResponse?.data?.statusCode === 200) {
          toast.success(apiResponse?.data?.message);
          onConfirm();
          reset();
        } else {
          toast.error(apiResponse?.data?.errors[0]);
        }
      } else if (_key === "team-members") {
        const apiResponse = await axios.get(EXPORT_TEAM_MEMBERS_CSV, {
          params: {
            exportName: data?.name,
            firstName: exportedFilters?.firstName,
            lastName: exportedFilters?.lastName,
            email: exportedFilters?.email,
            role: exportedFilters?.role,
            status: exportedFilters?.status,
            collectionId: collectionId,
            order: "desc",
          },
        });
        if (apiResponse?.data?.statusCode === 200) {
          toast.success(apiResponse?.data?.message);
          onConfirm();
          reset();
        } else {
          toast.error(apiResponse?.data?.errors[0]);
        }
      }
    } catch (error: Error) {
      toast.error(error?.message || t("someThingWrong"));
    } finally {
      stopLoading();
    }
  });

  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center z-50 bg-th-primary-medium">
      <div className="bg-th-background text-sm p-3 rounded-xl w-11/12 md:w-4/5 lg:w-1/2">
        <div className="flex justify-between items-center py-3 border-b border-th-primary-medium">
          <h4 className="text-th-primary-hard text-2xl font-semibold">{messageKey}</h4>
          <span
            className="text-th-secondary-medium cursor-pointer hover:text-th-danger-medium"
            onClick={() => onCancel()}
          >
            <FaX />
          </span>
        </div>
        <form className="h-full w-full py-5" onSubmit={onSubmit}>
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
                  placeholder={t("namePlaceholder")}
                  id="name"
                  {...field}
                />
              )}
            />
            {errors.name && <span className="text-th-danger-medium">{t(errors.name.message)}</span>}
          </div>
          {/* Confirm and Cancel buttons */}
          <div className="flex mt-4 text-lg gap-4">
            <CustomButton
              className={`rounded-md bg-th-primary-hard py-2 px-4 text-xs lg:text-base font-semibold text-th-primary-light outline-none transition duration-150 ease-in-out hover:shadow-lg ${
                loading && "cursor-not-allowed"
              }`}
              type="submit"
              label={loading ? t("submit") + "..." : t("submit")}
              disabled={loading || !isDirty}
            />
            <CustomButton
              className="rounded-md border border-th-primary-medium py-2 px-4 text-xs lg:text-base font-semibold text-th-grey-hard outline-none transition duration-150 ease-in-out hover:shadow-lg"
              type="button"
              label={t("cancel")}
              onClick={() => {
                onCancel();
                reset({ name: "" });
              }}
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default CustomExportNamePopup;
