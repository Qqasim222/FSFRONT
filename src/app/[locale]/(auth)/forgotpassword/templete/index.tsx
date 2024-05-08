"use client";
import React from "react";
import Image from "next/image";
import logo from "@assets/images/logo.png";
import backgroundFrame from "@assets/images/frame.png";
import foodFrame from "@assets/images/frame_2.png";
import ForgotPasswordForm from "@/components/auth/forgot-form";
import { useTranslations } from "next-intl";
import LanguageDropdown from "@/components/common/dropdown/language-dropdown";

const ForgotPage = () => {
  const t = useTranslations("forgotPassword");
  return (
    <section className="h-screen w-full">
      <div className="container max-h-full max-w-full h-full">
        <div className="grid grid-cols-1 md:grid-cols-2 w-full h-full">
          {/* Right column container*/}
          <div
            className="hidden items-center px-5 bg-th-background-primary md:flex h-full"
            style={{ backgroundImage: `url(${backgroundFrame.src})` }}
          >
            <div className="mx-auto">
              <Image height={400} width={400} src={foodFrame} alt="logo" />
              <h4 className="uppercase text-center leading-10 text-white text-4xl lg:text-5xl -mt-8 font-Nunito font-semibold">
                {t("foodSwitch")}
              </h4>
            </div>
          </div>
          {/* Left column container*/}
          <div className="flex items-center justify-center h-full w-full bg-th-background px-3 md:px-0">
            <div className="fixed top-5 right-8">
              <LanguageDropdown />
            </div>
            <div className="w-full max-w-full shadow-lg md:shadow-none px-6 md:px-12 lg:px-24 xl:px-40 2xl:px-56 md:border-none border rounded-lg m-3 py-16 md:m-0 md:py-0">
              <Image className="mx-auto" height={100} width={100} src={logo} alt="logo" />
              <h2 className="text-xl text-center font-bold leading-3 my-7 text-th-primary-hard uppercase">
                {t("forgotPassword")}
              </h2>
              {/* Verify Email Form */}
              <ForgotPasswordForm />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ForgotPage;
