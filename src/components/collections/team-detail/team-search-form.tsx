import React, { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Controller, useForm } from "react-hook-form";
import CustomInput from "@/components/common/input/custom-input";
import CustomButton from "@/components/common/button/custom-button";
import { FaAngleDown, FaAngleUp, FaFileCsv } from "react-icons/fa6";
import { toast } from "react-toastify";
import useLoading from "@/common/hook/loading";
import { useSearchParams } from "next/navigation";
import { usePathname, useRouter } from "next-intl/client";
import { yupResolver } from "@hookform/resolvers/yup";
import { myTeamMembersSearchFormSchema } from "@/common/config/schema";
import axios from "@/common/util/api/axios-public-client";
import { GET_ROLES } from "@/common/constant/local.constant";
import CustomExportNamePopup from "@/components/common/popup/export-name-popup";
import { logger } from "@/common/util/logger";

// Define types for team Members Search Inputs
interface MyTeamMembersSearchFormTypes {
  firstName: string;
  lastName: string;
  email: string;
  status: string;
  role: string;
}

const MyTeamMembersSearchForm = ({ onSearchSubmit, teamMembersData }: any) => {
  const t = useTranslations("myTeamManagmentDetailPage.myTeamMembersSearchForm");
  const { loading, startLoading, stopLoading } = useLoading();
  const [isFormVisible, setFormVisibility] = useState<boolean>(false);
  const [showExportNamePopup, setShowExportNamePopup] = useState(false);
  const [isResetVisible, setResetVisibility] = useState<boolean>(false);
  const [exportFilters, setExportFilters] = useState<MyTeamMembersSearchFormTypes>();
  const searchParams = useSearchParams();
  const { replace } = useRouter();
  const pathname = usePathname();
  const params = new URLSearchParams(searchParams);
  const [roles, setRoles] = useState([]);
  const pathParts = pathname.split("/");
  const collectionsIndex = pathParts.indexOf("collections");
  const collectionId = pathParts[collectionsIndex + 1];
  // defultValues
  const defaultValues = {
    firstName: "",
    lastName: "",
    email: "",
    status: "",
    role: "",
  };
  const {
    control,
    handleSubmit,
    reset,
    formState: { isDirty, errors },
  } = useForm<MyTeamMembersSearchFormTypes>({
    resolver: yupResolver(myTeamMembersSearchFormSchema),
    mode: "all",
    defaultValues: defaultValues,
  });
  // handle search submit
  const onSubmit = async (data: MyTeamMembersSearchFormTypes) => {
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
    }
  };
  // Handle Cancle Search Form
  const resetMyTeamMembersSearchForm = async () => {
    setResetVisibility(false);
    reset(defaultValues);
    setExportFilters(defaultValues);
    replace(`${pathname}`);
    await onSearchSubmit();
  };
  // Handle Export Team Users Data
  const handleExportTeamMembersData = async () => {
    setShowExportNamePopup(true);
  };
  const handleCancelExportName = () => {
    setShowExportNamePopup(false);
  };
  const handleConfirmExportName = async () => {
    setShowExportNamePopup(false);
  };
  // Get Roles
  useEffect(() => {
    const fetcher = async () => {
      try {
        const apiResponse = await axios.get(GET_ROLES);
        if (apiResponse?.data?.statusCode === 200) {
          setRoles(apiResponse?.data?.data);
        }
      } catch (error: Error) {
        toast.error(error?.message || t("someThingWrong"));
      }
    };
    fetcher();
  }, []);
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
                (teamMembersData?.length === 0 || teamMembersData?.team?.length === 0) &&
                "cursor-not-allowed bg-th-secondary-light"
              }`}
              type="button"
              label={t("export")}
              endIcon={<FaFileCsv />}
              disabled={teamMembersData?.length === 0 || teamMembersData?.team?.length === 0}
              onClick={(e: any) => {
                e.stopPropagation();
                handleExportTeamMembersData();
              }}
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
                <label htmlFor="firstName" className="text-th-secondary-medium font-semibold">
                  {t("firstName")}
                </label>
                <Controller
                  name="firstName"
                  control={control}
                  render={({ field }) => (
                    <CustomInput
                      className="w-full my-2 placeholder-th-secondary-light text-th-secondary-medium rounded-md border bg-th-grey-light py-2 md:py-3 lg:py-2.5 2xl:py-3.5 pl-2 leading-normal outline-none"
                      type="text"
                      placeholder={t("placeholder.firstName")}
                      id="firstName"
                      {...field}
                    />
                  )}
                />
                {errors.firstName && <span className="text-th-danger-medium">{t(errors.firstName.message)}</span>}
              </div>
              {/* Last Name input */}
              <div className="w-full mt-1 md:mt-0">
                <label htmlFor="lastName" className="text-th-secondary-medium font-semibold">
                  {t("lastName")}
                </label>
                <Controller
                  name="lastName"
                  control={control}
                  render={({ field }) => (
                    <CustomInput
                      className="w-full my-2 rounded-md border bg-th-grey-light py-2 md:py-3 lg:py-2.5 2xl:py-3.5 pl-2 leading-normal placeholder-th-secondary-light text-th-secondary-medium outline-none"
                      type="text"
                      placeholder={t("placeholder.lastName")}
                      id="lastName"
                      {...field}
                    />
                  )}
                />
                {errors.lastName && <span className="text-th-danger-medium">{t(errors.lastName.message)}</span>}
              </div>
            </div>
            <div className="flex flex-col md:flex-row gap-0 md:gap-4  md:mt-4">
              {/* Email input */}
              <div className="w-full mt-1 md:mt-0">
                <label htmlFor="email" className="text-th-secondary-medium font-semibold">
                  {t("email")}
                </label>
                <Controller
                  name="email"
                  control={control}
                  render={({ field }) => (
                    <CustomInput
                      className="w-full my-2 rounded-md border bg-th-grey-light py-2 md:py-3 lg:py-2.5 2xl:py-3.5 pl-2 leading-normal placeholder-th-secondary-light text-th-secondary-medium outline-none"
                      type="email"
                      placeholder={t("placeholder.email")}
                      id="email"
                      {...field}
                    />
                  )}
                />
                {errors.email && <span className="text-th-danger-medium">{t(errors.email.message)}</span>}
              </div>
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
                      <option value="active">{t("active")}</option>
                      <option value="inactive">{t("inactive")}</option>
                    </select>
                  )}
                />
                {errors.status && <span className="text-th-danger-medium">{t(errors.status.message)}</span>}
              </div>
            </div>
            <div className="flex flex-col md:flex-row gap-0 md:gap-4  md:mt-4">
              {/* Status select input */}
              <div className="w-full mt-1 md:mt-0">
                <label htmlFor="role" className="text-th-secondary-medium font-semibold">
                  {t("role")}
                </label>
                <Controller
                  name="role"
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
                      {roles?.map((role) => (
                        <option key={role?.code} value={role?.code}>
                          {role?.name}
                        </option>
                      ))}
                    </select>
                  )}
                />
                {errors.role && <span className="text-th-danger-medium">{t(errors.role.message)}</span>}
              </div>
              {/* Empty div */}
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
                  onClick={resetMyTeamMembersSearchForm}
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
        collectionId={collectionId}
        _key="team-members"
      />
    </div>
  );
};
export default MyTeamMembersSearchForm;
