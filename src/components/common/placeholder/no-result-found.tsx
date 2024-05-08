import React from "react";
import noResultFound from "@assets/images/noResultFound.png";
import Image from "next/image";
import { useTranslations } from "next-intl";

const NoResultFound = () => {
  const t = useTranslations("placholders.noResultFound");
  return (
    <div className="flex flex-col items-center justify-center h-64">
      <Image height={100} width={100} src={noResultFound} alt="logo" />
      <h2 className="text-xl font-bold text-th-grey-hard leading-10">{t("heading")}</h2>
      <p className="text-md leading-5 font-normal text-th-grey-hard">{t("paragaraph1")}</p>
      <p className="text-md leading-5 font-normal text-th-grey-hard">{t("paragaraph2")}</p>
    </div>
  );
};

export default NoResultFound;
