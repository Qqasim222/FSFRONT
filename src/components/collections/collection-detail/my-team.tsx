import React from "react";
import { useTranslations } from "next-intl";
import Link from "next-intl/link";

interface MyTeamSectionProps {
  slug: string;
  collection: any;
}

const MyTeamSection: React.FC<MyTeamSectionProps> = ({ slug, collection }) => {
  const teamData = collection?.team?.slice(0, 4);
  const t = useTranslations("collectionDetailPage.collectionMyTeamSec");

  return (
    <>
      <div className="flex flex-col gap-4 mt-2 overflow-x-auto">
        <table className="w-full">
          <tbody>
            {teamData?.map((item: any) => (
              <tr key={item._id} className="border-b">
                <td className="text-th-dark-medium font-medium text-base py-3 whitespace-nowrap pe-4">
                  {item?.firstName + " " + item.lastName}
                </td>
                <td className="text-th-grey-hard font-normal text-base py-3 whitespace-nowrap pe-4">
                  {item?.role?.name}
                </td>
                <td className="text-th-grey-hard font-normal text-base capitalize py-3 whitespace-nowrap ps-4">
                  {item?.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex flex-col justify-center items-center">
        <Link
          href={`/collections/${slug}/team-managment`}
          className="mt-8 rounded-md bg-th-background-primary font-Arimo py-3 px-4 text-sm font-normal text-white outline-none transition duration-150 ease-in-out hover:shadow-lg"
        >
          {t("manageTeam")}
        </Link>
      </div>
    </>
  );
};

export default MyTeamSection;
