import React from "react";
import { useTranslations } from "next-intl";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { resetPasswordSchema } from "@/common/config/schema";
import { FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import CustomButton from "@/components/common/button/custom-button";
import CustomInput from "@/components/common/input/custom-input";
import { useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
import useLoading from "@/common/hook/loading";
import axios from "@/common/util/api/axios-public-client";
import { deleteCookie } from "cookies-next";
import { RESET_PASSWORD } from "@/common/constant/local.constant";
import Link from "next-intl/link";
import { signOut } from "next-auth/react";

// Define types for Reset Form data
interface ResetFormTypes {
  password: string;
  confirmPassword: string;
}
const ResetPasswordForm: React.FC = () => {
  const t = useTranslations("resetPassword");
  const { loading, startLoading, stopLoading } = useLoading();
  const searchParams = useSearchParams();
  const token = searchParams?.get("token") || "";
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<ResetFormTypes>({
    resolver: yupResolver(resetPasswordSchema),
    mode: "all",
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });
  // Handle form submission
  const onSubmit = async (credentials: ResetFormTypes) => {
    try {
      startLoading();
      const { password } = credentials;
      const data = {
        password,
        token: token,
      };
      const apiResponse = await axios.post(RESET_PASSWORD, JSON.stringify(data));
      const { statusCode, message } = apiResponse?.data;
      if (apiResponse?.data) {
        signOut({
          redirect: false,
        });
        deleteCookie("session-info");
      }
      if (statusCode === 200) {
        reset();
        toast.success(message);
        if (typeof window !== undefined) window.location.href = "/login";
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
    <div className="w-full">
      {/* form */}
      <form className="h-full w-full" onSubmit={handleSubmit(onSubmit)}>
        {/* Password input */}
        <Controller
          name="password"
          control={control}
          render={({ field }) => (
            <CustomInput
              className="w-full my-2 rounded md:rounded-md lg:rounded-md border bg-th-grey-light py-2 lg:py-2.5 2xl:py-4 pl-10 pr-3 leading-normal placeholder-th-secondary-light text-th-secondary-medium outline-none"
              icon={<FaLock className="text-th-secondary-medium text-sm" />}
              endIcon={
                <span
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-th-secondary-medium text-sm cursor-pointer"
                >
                  {showPassword ? <FaEye /> : <FaEyeSlash />}
                </span>
              }
              type={showPassword ? "text" : "password"}
              placeholder={t("enterYourPassword")}
              id="password"
              value={field.value}
              onChange={(e) => {
                const trimmedValue = e.target.value.trim();
                field.onChange(trimmedValue);
              }}
              autoComplete="off"
            />
          )}
        />
        {errors.password && <span className="text-th-danger-medium">{t(errors.password.message)}</span>}
        {/* Confirmed Password input*/}
        <Controller
          name="confirmPassword"
          control={control}
          render={({ field }) => (
            <CustomInput
              className="w-full my-2 rounded md:rounded-md lg:rounded-md border bg-th-grey-light py-2 lg:py-2.5 2xl:py-4 pl-10 pr-3 leading-normal placeholder-th-secondary-light text-th-secondary-medium outline-none"
              icon={<FaLock className="text-th-secondary-medium text-sm" />}
              endIcon={
                <span
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="text-th-secondary-medium text-sm cursor-pointer"
                >
                  {showConfirmPassword ? <FaEye /> : <FaEyeSlash />}
                </span>
              }
              type={showConfirmPassword ? "text" : "password"}
              placeholder={t("confirmYourPassword")}
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
        {errors.confirmPassword && <div className="text-th-danger-medium">{t(errors.confirmPassword.message)}</div>}
        {/* login page link */}
        <Link href="/login" className="text-th-primary-hard font-Arimo underline hover:text-th-secondary-medium">
          {t("goBackToLogin")}
        </Link>
        {/* Reset Button */}
        <CustomButton
          className={`w-full mt-8 rounded md:rounded-md bg-th-background-primary font-Arimo py-3 lg:py-3.5 px-6 2xl:py-4 text-xs lg:text-base font-bold uppercase text-white outline-none transition duration-150 ease-in-out hover:shadow-lg ${
            loading && "cursor-not-allowed"
          }`}
          type="submit"
          label={loading ? t("reset") + "..." : t("reset")}
          disabled={!isDirty || loading}
        />
      </form>
    </div>
  );
};

export default ResetPasswordForm;
