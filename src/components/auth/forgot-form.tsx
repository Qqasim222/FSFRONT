import React from "react";
import { useForm, Controller } from "react-hook-form";
import { useTranslations } from "next-intl";
import { FaRegEnvelope } from "react-icons/fa";
import CustomButton from "@/components/common/button/custom-button";
import CustomInput from "@/components/common/input/custom-input";
import { yupResolver } from "@hookform/resolvers/yup";
import { forgotFormSchema } from "@/common/config/schema";
import { toast } from "react-toastify";
import Link from "next-intl/link";
import useLoading from "@/common/hook/loading";
import axios from "@/common/util/api/axios-public-client";
import { FORGOT_PASSWORD } from "@/common/constant/local.constant";

// Define types for ForgotForm data
interface ForgotFormTypes {
  email: string;
}
const ForgotPasswordForm: React.FC = () => {
  const t = useTranslations("forgotPassword");
  const { loading, startLoading, stopLoading } = useLoading();
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<ForgotFormTypes>({
    resolver: yupResolver(forgotFormSchema),
    mode: "all",
    defaultValues: {
      email: "",
    },
  });

  // Handle form submission
  const onSubmit = async (data: ForgotFormTypes) => {
    try {
      startLoading();
      const apiResponse = await axios.post(FORGOT_PASSWORD, JSON.stringify(data));
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
    <div className="w-full">
      {/* Form */}
      <form className="h-full w-full" onSubmit={handleSubmit(onSubmit)}>
        {/* Email input */}
        <Controller
          name="email"
          control={control}
          render={({ field }) => (
            <CustomInput
              className="w-full my-2 rounded md:rounded-md lg:rounded-md border bg-th-grey-light py-2 lg:py-2.5 2xl:py-4 pl-10 pr-3 leading-normal placeholder-th-secondary-light text-th-secondary-medium outline-none"
              icon={<FaRegEnvelope className="text-th-secondary-medium text-sm" />}
              type="email"
              placeholder={t("enterYourEmail")}
              id="username"
              value={field.value}
              onChange={field.onChange}
            />
          )}
        />
        {errors.email && <div className="text-th-danger-medium">{t(errors.email.message)}</div>}
        {/* login page link */}
        <Link href="/login" className="text-th-primary-hard font-Arimo underline hover:text-th-secondary-medium">
          {t("goBackToLogin")}
        </Link>
        {/* Forgot password button */}
        <CustomButton
          className={`w-full mt-8 rounded md:rounded-md bg-th-background-primary font-Arimo py-3 lg:py-3.5 px-6 2xl:py-4 text-xs lg:text-base font-bold uppercase text-white outline-none transition duration-150 ease-in-out hover:shadow-lg ${
            loading && "cursor-not-allowed"
          }`}
          type="submit"
          label={loading ? t("verify") + "..." : t("verify")}
          disabled={!isDirty || loading}
        />
      </form>
    </div>
  );
};

export default ForgotPasswordForm;
