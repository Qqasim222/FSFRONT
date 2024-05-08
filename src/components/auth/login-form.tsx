import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import CustomInput from "@/components/common/input/custom-input";
import CustomButton from "@/components/common/button/custom-button";
import { loginFormSchema } from "@/common/config/schema";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next-intl/client";
import { FaRegEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import { toast } from "react-toastify";
import { getCookie, setCookie } from "cookies-next";
import { signIn } from "next-auth/react";
import useLoading from "@/common/hook/loading";
import axios from "@/common/util/api/axios-public-client";
import { useDispatch } from "react-redux";
import { saveUserData } from "@/store/slices/authSlice";
import { USERS_PROFILE } from "@/common/constant/local.constant";
import Link from "next-intl/link";

// Define types for Login Form credentials
interface LoginFormTypes {
  email: string;
  password: string;
}

const LoginForm: React.FC = () => {
  const t = useTranslations("login");
  const dispatch = useDispatch();
  const { loading, startLoading, stopLoading } = useLoading();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const params = useSearchParams();
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<LoginFormTypes>({
    resolver: yupResolver(loginFormSchema),
    mode: "all",
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const onSubmit = async (credentials: LoginFormTypes) => {
    try {
      const url = params.get("callbackUrl") ? params.get("callbackUrl") : "/dashboard";
      startLoading();
      const res = await signIn("credentials", {
        username: credentials.email,
        password: credentials.password,
        redirect: false,
        callbackUrl: "/dashboard",
      });
      const sessionInfoData = await JSON.parse(getCookie("session-info"));
      if (res?.status === 200) {
        if (sessionInfoData?.statusCode === 200) {
          const userData = await axios.get(USERS_PROFILE);
          if (userData) {
            dispatch(saveUserData(userData?.data?.data));
            setCookie("NEXT_LOCALE", userData?.data?.data?.defaultLanguage);
          }
          reset();
          toast.success(sessionInfoData?.message);
          router.replace(url, { locale: userData?.data?.data?.defaultLanguage });
        }
      } else {
        toast.error(sessionInfoData?.message);
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
              autoComplete="username"
            />
          )}
        />
        {errors.email && <span className="text-th-danger-medium">{t(errors.email.message)}</span>}
        {/* Password input */}
        <Controller
          name="password"
          control={control}
          render={({ field }) => (
            <CustomInput
              className="w-full my-2 rounded md:rounded-md lg:rounded-md border bg-th-grey-light py-2 lg:py-2.5 2xl:py-4 pl-10 pr-3 leading-normal placeholder-th-secondary-light text-th-secondary-medium outline-none"
              icon={<FaLock className="text-th-secondary-medium text-sm" />}
              endIcon={
                showPassword ? (
                  <FaEye onClick={handleTogglePasswordVisibility} className="text-th-secondary-medium text-sm" />
                ) : (
                  <FaEyeSlash onClick={handleTogglePasswordVisibility} className="text-th-secondary-medium text-sm" />
                )
              }
              type={showPassword ? "text" : "password"}
              placeholder={t("enterYourPassword")}
              id="password"
              value={field.value}
              onChange={(e) => {
                const trimmedValue = e.target.value.trim();
                field.onChange(trimmedValue);
              }}
              autoComplete="current-password"
            />
          )}
        />
        {errors.password && <div className="text-th-danger-medium">{t(errors.password.message)}</div>}
        {/* Forgot password link */}
        <Link
          href="/forgotpassword"
          className="text-th-primary-hard font-Arimo underline hover:text-th-secondary-medium"
        >
          {t("forgotYourPassword")}?
        </Link>
        {/* Login button */}
        <CustomButton
          className={`w-full mt-8 rounded md:rounded-md bg-th-background-primary font-Arimo py-3 lg:py-3.5 px-6 2xl:py-4 text-xs lg:text-base font-bold uppercase text-white outline-none transition duration-150 ease-in-out hover:shadow-lg ${
            loading && "cursor-not-allowed"
          }`}
          type="submit"
          label={loading ? t("login") + "..." : t("login")}
          disabled={!isDirty || loading}
        />
      </form>
    </div>
  );
};

export default LoginForm;
