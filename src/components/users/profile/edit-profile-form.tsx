import React from "react";
import { useTranslations } from "next-intl";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import CustomInput from "@/components/common/input/custom-input";
import CustomButton from "@/components/common/button/custom-button";
import { editProfileFormSchema } from "@/common/config/schema";
import axios from "@/common/util/api/axios-public-client";
import { toast } from "react-toastify";
import useLoading from "@/common/hook/loading";
import CustomPhoneInput from "@/components/common/input/custom-phone-input";
import { useDispatch, useSelector } from "react-redux";
import { selectSessionInfo, saveUserData } from "@/store/slices/authSlice";
import { USERS_PROFILE } from "@/common/constant/local.constant";

// Define types for Edit Profile Inputs
interface EditProfileFormTypes {
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  role: string;
}

const phoneInputStyles: React.CSSProperties = {
  "--react-international-phone-border-radius": "0px",
  "--react-international-phone-border-color": "none",
  "--react-international-phone-dropdown-item-background-color": "white",
  "--react-international-phone-background-color": "transparent",
  "--react-international-phone-text-color": "var(--secondary-medium)",
  "--react-international-phone-font-size": "text-md",
  "--react-international-phone-selected-dropdown-item-background-color": "transparent",
  "--react-international-phone-selected-dropdown-zindex": "1",
  "--react-international-phone-height": "24px",
};
const EditProfileForm: React.FC = () => {
  const t = useTranslations("editProfile");
  const dispatch = useDispatch();
  const { loading, startLoading, stopLoading } = useLoading();
  const sessionInfo = useSelector(selectSessionInfo);
  // default values
  const defaultValues = {
    firstName: sessionInfo?.firstName || "",
    lastName: sessionInfo?.lastName || "",
    email: sessionInfo?.email || "",
    mobile: sessionInfo?.mobile || "",
    role: sessionInfo?.role?.name || "",
  };

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
    setValue,
  } = useForm<EditProfileFormTypes>({
    resolver: yupResolver(editProfileFormSchema),
    mode: "all",
    defaultValues,
  });

  // Handle form submission
  const onSubmit = async (data: EditProfileFormTypes) => {
    try {
      startLoading();
      const simplefiedData = {
        firstName: data?.firstName,
        lastName: data?.lastName,
        mobile: data?.mobile?.length > 5 ? data?.mobile : "",
      };
      const apiResponse = await axios.patch(USERS_PROFILE, JSON.stringify(simplefiedData));
      const { statusCode, message } = apiResponse?.data;
      if (statusCode === 200) {
        const updatedValuesResponse = await axios.get(USERS_PROFILE);
        if (updatedValuesResponse?.data?.data) {
          setValue("firstName", updatedValuesResponse?.data?.data?.firstName || "");
          setValue("lastName", updatedValuesResponse?.data?.data?.lastName || "");
          setValue("email", updatedValuesResponse?.data?.data?.email || "");
          setValue("mobile", updatedValuesResponse?.data?.data?.mobile || "");
          setValue("role", updatedValuesResponse?.data?.data?.role?.name || "");
          dispatch(saveUserData({ sessionInfo, ...updatedValuesResponse?.data?.data }));
        }
        toast.success(message);
      } else {
        toast.error(message);
      }
    } catch (error: Error) {
      toast.error(error?.message || t("someThingWrong"));
    } finally {
      stopLoading();
    }
  };
  return (
    <div className="w-full bg-th-background rounded-xl  flex flex-col p-5">
      {/* Form */}
      <form className="h-full w-full" onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col md:flex-row md:space-x-4">
          {/* First Name input */}
          <div className="w-full">
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
                  value={field.value}
                  onChange={(e) => {
                    const trimmedValue = e.target.value.trim();
                    field.onChange(trimmedValue);
                  }}
                />
              )}
            />
            {errors.firstName && <span className="text-th-danger-medium">{t(errors.firstName.message)}</span>}
          </div>
          {/* Last Name input */}
          <div className="w-full mt-4 sm:mt-0">
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
                  value={field.value}
                  onChange={(e) => {
                    const trimmedValue = e.target.value.trim();
                    field.onChange(trimmedValue);
                  }}
                />
              )}
            />
            {errors.lastName && <span className="text-th-danger-medium">{t(errors.lastName.message)}</span>}
          </div>
        </div>
        <div className="flex flex-col md:flex-row md:space-x-4 mt-2 md:mt-4">
          {/* Email Input */}
          <div className="w-full">
            <label htmlFor="email" className="text-th-secondary-medium font-semibold">
              {t("email")}
              {/* <span className="text-th-danger-medium ps-1">*</span> */}
            </label>
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <CustomInput
                  className="w-full my-2 rounded-md border bg-th-zinc-light py-2 md:py-3 lg:py-2.5 2xl:py-3.5 pl-2 leading-normal placeholder-th-secondary-light text-th-secondary-medium outline-none cursor-not-allowed"
                  type="email"
                  placeholder={t("placeholder.email")}
                  id="email"
                  value={field.value}
                  onChange={(e) => {
                    const trimmedValue = e.target.value.trim();
                    field.onChange(trimmedValue);
                  }}
                  readOnly={true}
                />
              )}
            />
            {errors.email && <span className="text-th-danger-medium">{t(errors.email.message)}</span>}
          </div>
          {/* Role input */}
          <div className="w-full mt-4 sm:mt-0">
            <label htmlFor="role" className="text-th-secondary-medium font-semibold">
              {t("role")}
              {/* <span className="text-th-danger-medium ps-1">*</span> */}
            </label>
            <Controller
              name="role"
              control={control}
              render={({ field }) => (
                <CustomInput
                  className="w-full my-2 rounded-md border bg-th-zinc-light py-2 md:py-3 lg:py-2.5 2xl:py-3.5 pl-2 leading-normal placeholder-th-secondary-light text-th-secondary-medium outline-none cursor-not-allowed"
                  type="role"
                  placeholder={t("placeholder.role")}
                  id="role"
                  value={field.value}
                  onChange={(e) => {
                    const trimmedValue = e.target.value.trim();
                    field.onChange(trimmedValue);
                  }}
                  readOnly={true}
                />
              )}
            />
            {errors.role && <span className="text-th-danger-medium">{t(errors.role.message)}</span>}
          </div>
        </div>
        <div className="flex flex-col md:flex-row md:space-x-4 mt-2 md:mt-4">
          {/* Mobile input */}
          <div className="w-full md:w-1/2">
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
        </div>
        {/* Actions Buttons */}
        <div className="flex space-x-4 mt-4">
          {/* Save button */}
          <CustomButton
            className={`mt-4 rounded-md bg-th-primary-hard py-2.5 px-6 text-xs lg:text-base font-bold text-th-primary-light outline-none transition duration-150 ease-in-out hover:shadow-lg ${
              loading && "cursor-not-allowed"
            }`}
            type="submit"
            label={loading ? t("save") + "..." : t("save")}
            disabled={!isDirty || loading}
          />
          {/* Cancel button */}
          <CustomButton
            className="mt-4 rounded-md border border-th-primary-medium  py-2.5 px-6 text-xs lg:text-base font-semibold text-th-grey-hard outline-none transition duration-150 ease-in-out hover:shadow-lg"
            type="button"
            label={t("cancel")}
            onClick={() => {
              reset();
            }}
          />
        </div>
      </form>
    </div>
  );
};

export default EditProfileForm;
