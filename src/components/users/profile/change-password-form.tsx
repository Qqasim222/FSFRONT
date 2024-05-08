import React from "react";
import { useTranslations } from "next-intl";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { changePasswordSchema } from "@/common/config/schema";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import CustomButton from "@/components/common/button/custom-button";
import CustomInput from "@/components/common/input/custom-input";
import { toast } from "react-toastify";
import useLoading from "@/common/hook/loading";
import axios from "@/common/util/api/axios-public-client";
import { CHANGE_PASSWORD } from "@/common/constant/local.constant";

// Define types for Reset Form data
interface ChangePasswordFormTypes {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}
const ChangePasswordForm: React.FC = () => {
  const t = useTranslations("editProfile.changePassword");
  const { loading, startLoading, stopLoading } = useLoading();
  const [showPassword, setShowPassword] = React.useState(false);
  const [showNewPassword, setShowNewPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<ChangePasswordFormTypes>({
    resolver: yupResolver(changePasswordSchema),
    mode: "all",
    defaultValues: {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });
  // Handle form submission
  const onSubmit = async (credentials: ChangePasswordFormTypes) => {
    try {
      startLoading();
      const simplifiedData = {
        oldPassword: credentials?.oldPassword,
        password: credentials?.newPassword,
      };
      const apiResponse = await axios.patch(CHANGE_PASSWORD, JSON.stringify(simplifiedData));
      const { statusCode, message } = apiResponse?.data;
      if (statusCode === 200) {
        reset();
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
          {/* Old Password input */}
          <div className="w-full">
            <label htmlFor="oldPassword" className="text-th-secondary-medium font-semibold">
              {t("oldPassword")}
              <span className="text-th-danger-medium ps-1">*</span>
            </label>
            <Controller
              name="oldPassword"
              control={control}
              render={({ field }) => (
                <CustomInput
                  className="w-full my-2 rounded-md border bg-th-grey-light py-2 lg:py-2.5 2xl:py-4  pl-2 leading-normal placeholder-th-secondary-light text-th-secondary-medium outline-none"
                  endIcon={
                    <span
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-th-secondary-medium text-sm cursor-pointer"
                    >
                      {showPassword ? <FaEye /> : <FaEyeSlash />}
                    </span>
                  }
                  type={showPassword ? "text" : "password"}
                  placeholder={t("placeholder.oldPassword")}
                  id="oldPassword"
                  value={field.value}
                  onChange={(e) => {
                    const trimmedValue = e.target.value.trim();
                    field.onChange(trimmedValue);
                  }}
                  autoComplete="off"
                />
              )}
            />
            {errors.oldPassword && <span className="text-th-danger-medium">{t(errors.oldPassword.message)}</span>}
          </div>
          {/* NewPassword input */}
          <div className="w-full mt-4 sm:mt-0">
            <label htmlFor="newPassword" className="text-th-secondary-medium font-semibold">
              {t("newPassword")}
              <span className="text-th-danger-medium ps-1">*</span>
            </label>
            <Controller
              name="newPassword"
              control={control}
              render={({ field }) => (
                <CustomInput
                  className="w-full my-2 rounded-md border bg-th-grey-light py-2 lg:py-2.5 2xl:py-4  pl-2 leading-normal placeholder-th-secondary-light text-th-secondary-medium outline-none"
                  endIcon={
                    <span
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="text-th-secondary-medium text-sm cursor-pointer"
                    >
                      {showNewPassword ? <FaEye /> : <FaEyeSlash />}
                    </span>
                  }
                  type={showNewPassword ? "text" : "password"}
                  placeholder={t("placeholder.newPassword")}
                  id="newPassword"
                  value={field.value}
                  onChange={(e) => {
                    const trimmedValue = e.target.value.trim();
                    field.onChange(trimmedValue);
                  }}
                  autoComplete="off"
                />
              )}
            />
            {errors.newPassword && <span className="text-th-danger-medium">{t(errors.newPassword.message)}</span>}
          </div>
          {/* Confirmed Password input */}
          <div className="w-full mt-4 sm:mt-0">
            <label htmlFor="confirmPassword" className="text-th-secondary-medium font-semibold">
              {t("confirmPassword")}
              <span className="text-th-danger-medium ps-1">*</span>
            </label>
            <Controller
              name="confirmPassword"
              control={control}
              render={({ field }) => (
                <CustomInput
                  className="w-full my-2 rounded-md border bg-th-grey-light py-2 lg:py-2.5 2xl:py-4  pl-2 leading-normal placeholder-th-secondary-light text-th-secondary-medium outline-none"
                  endIcon={
                    <span
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="text-th-secondary-medium text-sm cursor-pointer"
                    >
                      {showConfirmPassword ? <FaEye /> : <FaEyeSlash />}
                    </span>
                  }
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder={t("placeholder.confirmPassword")}
                  id="confirmPassword"
                  value={field.value}
                  onChange={(e) => {
                    const trimmedValue = e.target.value.trim();
                    field.onChange(trimmedValue);
                  }}
                  autoComplete="off"
                />
              )}
            />
            {errors.confirmPassword && (
              <span className="text-th-danger-medium">{t(errors.confirmPassword.message)}</span>
            )}
          </div>
        </div>
        {/* Actions Buttons */}
        <div className="flex w-fit flex-row space-x-4 mt-4">
          {/* Save button */}
          <CustomButton
            className={`w-fit mt-4 rounded-md bg-th-primary-hard py-2.5 px-6 text-xs lg:text-base font-bold text-th-primary-light outline-none transition duration-150 ease-in-out hover:shadow-lg ${
              loading && "cursor-not-allowed"
            }`}
            type="submit"
            label={loading ? t("save") + "..." : t("save")}
            disabled={!isDirty || loading}
          />
          {/* Cancel button */}
          <CustomButton
            className="w-fit mt-4 rounded-md border border-th-primary-medium py-2.5 px-6 text-xs lg:text-base font-semibold text-th-grey-hard outline-none transition duration-150 ease-in-out hover:shadow-lg"
            type="button"
            label={t("cancel")}
            onClick={() => {
              reset({
                oldPassword: "",
                newPassword: "",
                confirmPassword: "",
              });
            }}
          />
        </div>
      </form>
    </div>
  );
};

export default ChangePasswordForm;
