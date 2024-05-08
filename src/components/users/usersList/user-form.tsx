import React, { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import CustomInput from "@/components/common/input/custom-input";
import CustomButton from "@/components/common/button/custom-button";
import { addNewUserFormSchema, updateUserFormSchema } from "@/common/config/schema";
import axios from "@/common/util/api/axios-public-client";
import { toast } from "react-toastify";
import useLoading from "@/common/hook/loading";
import CustomPhoneInput from "@/components/common/input/custom-phone-input";
import { useSearchParams } from "next/navigation";
import { usePathname, useRouter } from "next-intl/client";
import { USERS, USERS_ROLES } from "@/common/constant/local.constant";
import MultiSelectSearchField from "@/components/products/product-detail/generic-fields/generic-multiselect-search";

// Define types for Edit Profile Inputs
interface UserFormTypes {
  firstName: string;
  lastName: string;
  email: string;
  mobile?: string;
  country?: string;
  role?: string;
  status?: string;
}
interface UserFormProps {
  onCancel: () => void;
  isUpdateMode: boolean;
  selectedUserData: string;
  onUserListUpdate: any;
  handleAssociateCollectionModal: (id: string, role: string, name: string) => void;
  countriesList: any;
}
// phoneInputStyles
const phoneInputStyles: React.CSSProperties = {
  "--react-international-phone-border-radius": "0px",
  "--react-international-phone-border-color": "none",
  "--react-international-phone-dropdown-item-background-color": "white",
  "--react-international-phone-background-color": "transparent",
  "--react-international-phone-text-color": "var(--secondary-medium)",
  "--react-international-phone-font-size": "text-md",
  "--react-international-phone-selected-dropdown-item-background-color": "transparent",
  "--react-international-phone-selected-dropdown-zindex": "1",
  "--react-international-phone-height": "22px",
};

const UserForm: React.FC<UserFormProps> = ({
  onCancel,
  isUpdateMode,
  selectedUserData,
  onUserListUpdate,
  handleAssociateCollectionModal,
  countriesList,
}) => {
  const t = useTranslations("addNewUserModle");
  const { loading, startLoading, stopLoading } = useLoading();
  const [roles, setRoles] = useState([]);
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);
  const pathname = usePathname();
  const { replace } = useRouter();
  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isDirty },
  } = useForm<UserFormTypes>({
    resolver: yupResolver(isUpdateMode ? updateUserFormSchema : addNewUserFormSchema),
    mode: "all",
  });

  // Populate the form with selectedUserData
  useEffect(() => {
    if (isUpdateMode && selectedUserData) {
      setValue("firstName", selectedUserData?.firstName || "");
      setValue("lastName", selectedUserData?.lastName || "");
      setValue("email", selectedUserData?.email || "");
      setValue("country", selectedUserData?.country || "");
      setValue("mobile", selectedUserData?.mobile || "");
      setValue("role", selectedUserData?.roleId + "," + selectedUserData?.role?.code || "");
      setValue("status", selectedUserData?.status || "");
    } else {
      reset();
    }
  }, [isUpdateMode, selectedUserData, reset, setValue]);
  // Fetch user roles
  useEffect(() => {
    const fetcher = async () => {
      try {
        const apiResponse = await axios.get(USERS_ROLES);
        if (apiResponse?.data?.statusCode === 200) {
          setRoles(apiResponse?.data?.data);
        }
      } catch (error: Error) {
        toast.error(error?.message || t("someThingWrong"));
      }
    };
    fetcher();
  }, []);

  // Handle Submit User
  const onSubmit = async (data: UserFormTypes) => {
    const filters = params?.get("filters") || "";
    const searchData = filters ? JSON.parse(decodeURI(filters)) : {};

    if (isUpdateMode) {
      try {
        startLoading();
        const simplefiedData = {
          firstName: data?.firstName,
          lastName: data?.lastName,
          status: data?.status,
          roleId: data?.role ? data?.role.split(",")[0] : null,
          country: data?.country,
          mobile: data?.mobile?.length > 5 ? data?.mobile : null,
          id: selectedUserData?._id,
        };
        const apiResponse = await axios.put(USERS, JSON.stringify(simplefiedData));
        if (apiResponse?.data?.statusCode == 200) {
          onCancel();
          reset();
          toast.success(apiResponse?.data?.message);
          handleAssociateCollectionModal(
            apiResponse?.data?.data?._id,
            data?.role.split(",")[1] === "collaborator" ? data?.role.split(",")[1] : "",
            data?.firstName && data?.lastName ? data?.firstName + " " + data?.lastName : "",
          );
          if (onUserListUpdate) onUserListUpdate(params.get("page") || 1, searchData);
        } else {
          toast.error(apiResponse?.data?.message);
        }
      } catch (error: Error) {
        toast.error(error?.message || t("someThingWrong"));
      } finally {
        stopLoading();
      }
    } else {
      try {
        startLoading();
        const simplefiedData = {
          email: data?.email,
          firstName: data?.firstName,
          lastName: data?.lastName,
          country: data?.country,
          mobile: data?.mobile?.length > 5 ? data?.mobile : null,
          roleId: data?.role ? data?.role.split(",")[0] : null,
        };
        const apiResponse = await axios.post(USERS, JSON.stringify(simplefiedData));
        if (apiResponse?.data?.statusCode == 201) {
          onCancel();
          reset();
          toast.success(apiResponse?.data?.message);
          handleAssociateCollectionModal(
            apiResponse?.data?.data?._id,
            data?.role.split(",")[1] === "collaborator" ? data?.role.split(",")[1] : "",
            data?.firstName && data?.lastName ? data?.firstName + " " + data?.lastName : "",
          );
          if (onUserListUpdate) {
            onUserListUpdate(params.get("page") || 1);
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

  return (
    <div className="w-full">
      {/* Form */}
      <form className="h-full w-full" onSubmit={handleSubmit(onSubmit)}>
        {/* First Name input */}
        <div className="flex flex-col">
          <label htmlFor="firstName" className="text-th-secondary-medium font-semibold">
            {t("firstName")}
            <span className="text-th-danger-medium ps-1">*</span>
          </label>
          <Controller
            name="firstName"
            control={control}
            render={({ field }) => (
              <CustomInput
                className="w-full my-2 rounded-md border bg-th-grey-light py-2 md:py-3 lg:py-2.5 2xl:py-3.5 pl-2 leading-normal placeholder-th-secondary-light text-th-secondary-medium outline-none"
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
        <div className="flex flex-col mt-3 sm:mt-0">
          <label htmlFor="lastName" className="text-th-secondary-medium font-semibold">
            {t("lastName")}
            <span className="text-th-danger-medium ps-1">*</span>
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
        {/* Email input */}
        <div className="flex flex-col mt-3 sm:m-0">
          <label htmlFor="email" className="text-th-secondary-medium font-semibold">
            {t("e-mail")}
            <span className="text-th-danger-medium ps-1">*</span>
          </label>
          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <CustomInput
                className={`w-full my-2 rounded-md border bg-th-grey-light py-2 md:py-3 lg:py-2.5 2xl:py-3.5 pl-2 leading-normal placeholder-th-secondary-light text-th-secondary-medium outline-none ${
                  isUpdateMode && "bg-th-zinc-light cursor-not-allowed"
                }`}
                type="email"
                placeholder={t("placeholder.email")}
                id="email"
                readOnly={isUpdateMode}
                {...field}
              />
            )}
          />
          {errors.email && <span className="text-th-danger-medium">{t(errors.email.message)}</span>}
        </div>
        {/* Country input */}
        <div className="flex flex-col mt-3 sm:m-0">
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
        {/* Mobile input */}
        <div className="flex flex-col mt-3 sm:mt-0">
          <label htmlFor="mobile" className="text-th-secondary-medium font-semibold">
            {t("mobile")}
          </label>
          <Controller
            name="mobile"
            control={control}
            render={({ field }) => (
              <CustomPhoneInput
                style={phoneInputStyles}
                className="w-full my-2 rounded-md border bg-th-grey-light py-2 md:py-3 lg:py-2.5 2xl:py-3.5 pl-2 leading-normal placeholder-th-secondary-light text-th-secondary-medium outline-none"
                type="text"
                forceDialCode={false}
                placeholder={t("placeholder.mobile")}
                id="mobile"
                value={field.value}
                onChange={field.onChange}
              />
            )}
          />
          {errors.mobile && <span className="text-th-danger-medium">{t(errors.mobile.message)}</span>}
        </div>
        {/* Role select input */}
        <div className="flex flex-col mt-3 sm:m-0">
          <label htmlFor="role" className="text-th-secondary-medium font-semibold">
            {t("role")}
            <span className="text-th-danger-medium ps-1">*</span>
          </label>
          <Controller
            name="role"
            control={control}
            render={({ field }) => (
              <select
                {...field}
                className="select-dropdown-icon-style w-full my-2 rounded-md border bg-th-grey-light py-2.5 md:py-3.5 lg:py-3 2xl:py-4 pl-2 leading-normal placeholder-th-secondary-light text-th-secondary-medium outline-none"
              >
                <option value="">{t("choose")}</option>
                {roles?.map((role) => (
                  <option key={role?._id} value={`${role?._id},${role?.code}`}>
                    {role?.name}
                  </option>
                ))}
              </select>
            )}
          />
          {errors.role && <span className="text-th-danger-medium">{t(errors.role.message)}</span>}
        </div>
        {/* Status select input */}
        {isUpdateMode && (
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
                  className="select-dropdown-icon-style w-full my-2 rounded-md border bg-th-grey-light py-2.5 md:py-3.5 lg:py-3 2xl:py-4 pl-2 leading-normal placeholder-th-secondary-light text-th-secondary-medium outline-none"
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
        )}
        {/* Actions Buttons */}
        <div className="flex space-x-4 mt-2 md:mt-4">
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

export default UserForm;
