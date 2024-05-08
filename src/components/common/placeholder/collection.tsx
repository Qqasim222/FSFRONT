import React from "react";
import exclamationIcon from "@assets/images/exclamation.png";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next-intl/link";

const CollectionPlaceholder = () => {
  const t = useTranslations("placholders.collectionCountSection");

  return (
    <div className="mt-2 md:mt-4">
      <div className="flex flex-col justify-center items-center bg-th-warning-light border border-th-warning-medium gap-5 rounded-lg py-6 px-4">
        <Image src={exclamationIcon} height={72} width={72} alt="collections" />
        <p className="text-th-warning-hard text-center font-normal text-base">{t("yourCollection")}</p>
      </div>
      <div className="flex flex-col justify-center items-center">
        <Link
          href="/collections"
          className="mt-4 md:mt-8 rounded-md bg-th-background-primary font-Arimo py-3 px-4 text-sm font-normal text-white outline-none transition duration-150 ease-in-out hover:shadow-lg"
        >
          {t("manageYourCollections")}
        </Link>
      </div>
    </div>
  );
};

export default CollectionPlaceholder;
