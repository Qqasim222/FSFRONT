"use client";

import { useTranslations } from "next-intl";
import { useEffect } from "react";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const t = useTranslations("errorPage");
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex items-center justify-center h-screen bg-th-primary-medium">
      <div className="text-center">
        <h1 className="mb-4 text-4xl font-bold tracking-tight leading-none text-th-secondary-hard lg:mb-6 md:text-5xl xl:text-6xl">
          {t("someThingWentWrong")}
        </h1>
        <p className="mb-4 font-light text-th-secondary-medium md:text-lg xl:text-xl">{t("errorHeading")}</p>
        <button
          className="bg-th-primary-hard text-th-primary-light font-semibold px-4 py-2 rounded-md focus:outline-none"
          onClick={() => reset()}
        >
          {t("tryAgain")}
        </button>
      </div>
    </div>
  );
}
