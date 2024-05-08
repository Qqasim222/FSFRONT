import React from "react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import userIcon from "@assets/images/team.png";
import Link from "next-intl/link";

interface TeamPlaceholderProps {
  slug: string;
}

const TeamPlaceholder: React.FC<TeamPlaceholderProps> = ({ slug }) => {
  const t = useTranslations("placholders.myTeamSection");

  return (
    <div className="mt-2 md:mt-6">
      <div className="flex flex-col justify-center items-center bg-th-info-light border border-th-info-medium gap-5 rounded-lg py-6 px-4">
        <Image src={userIcon} height={72} width={72} alt="collections" />
        <p className="text-th-info-hard font-normal text-center text-base">{t("startCreating")}</p>
      </div>
      <div className="flex flex-col justify-center items-center">
        <Link
          href={slug === "undefined" ? "/users" : `/collections/${slug}/team-managment`}
          className="mt-4 md:mt-8 rounded-md bg-th-background-primary font-Arimo py-3 px-4 text-sm font-normal text-white outline-none transition duration-150 ease-in-out hover:shadow-lg"
        >
          {t("manageTeam")}
        </Link>
      </div>
    </div>
  );
};

export default TeamPlaceholder;
