import React from "react";
import { useTranslations } from "next-intl";
import CustomButton from "@/components/common/button/custom-button";
import CustomInput from "@/components/common/input/custom-input";
import { FaSistrix } from "react-icons/fa6";

const SearchFormSection: React.FC = () => {
  const t = useTranslations("collectionDetailPage.collectionSearchSec");
  return (
    <div className="bg-th-background p-4 md:p-6 rounded-xl">
      <h3 className="text-xl text-th-primary-hard font-bold mb-4">{t("searchHeading")}</h3>
      <p className="text-th-secondary-medium font-normal text-base">{t("loremIpsum")}</p>
      {/* Search Form */}
      <form>
        <div className="flex flex-col lg:flex-row justify-start items-center gap-5 mt-4">
          <CustomInput
            className="w-full rounded-md border border-th-info-medium bg-th-background py-3 px-4 pl-8 text-sm font-normal placeholder-th-secondary-light text-th-secondary-medium outline-none"
            icon={<FaSistrix className="text-th-secondary-medium text-sm" />}
            type="text"
            placeholder={t("enterKeyword")}
            id="search"
          />
          <CustomButton
            className="rounded-md bg-th-background-primary font-Arimo py-3 px-4 text-sm font-normal text-white outline-none transition duration-150 ease-in-out hover:shadow-lg whitespace-nowrap"
            type="submit"
            label={t("search")}
          />
        </div>
      </form>
    </div>
  );
};

export default SearchFormSection;
