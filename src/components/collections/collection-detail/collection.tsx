import React from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import Link from "next-intl/link";
import pendingIcon from "@assets/svg/unprocessed.svg";
import reviewIcon from "@assets/svg/review.svg";
import rejectedIcon from "@assets/svg/rejected.svg";
import approvedIcon from "@assets/svg/approved.svg";

// Import status icons
const statusIcons = {
  Pending: pendingIcon,
  Rejected: rejectedIcon,
  "Under Review": reviewIcon,
  Approved: approvedIcon,
};

const CollectionCountSection = ({ statistics }: any) => {
  const t = useTranslations("collectionDetailPage.collectionProjectsSec");
  // Create an array with all possible statuses
  const allStatuses = ["Pending", "Approved", "Under Review", "Rejected"];
  // Create a map to store count for each status
  const statusCountsMap: { [key: string]: number } = {};
  // Initialize counts for all statuses with 0
  allStatuses.forEach((status) => {
    statusCountsMap[status] = 0;
  });
  // Update counts from the API data
  statistics?.forEach((item: any) => {
    if (allStatuses?.includes(item?.status)) {
      statusCountsMap[item?.status] = item?.count;
    }
  });

  const renderStatusSection = (status: string) => {
    const iconPath = statusIcons[status];
    return (
      <div
        key={status}
        className="flex flex-col md:flex-row w-full items-center justify-start md:gap-4 border border-th-primary-medium p-2 md:p-4 rounded-lg"
      >
        <div>
          <Image src={iconPath} height={52} width={52} alt="collections" />
        </div>
        <div className="flex flex-col items-center lg:justify-center md:items-start">
          <p className="text-md font-bold text-th-dark-medium">{statusCountsMap[status]}</p>
          <p className={`text-sm font-normal ${getStatusColor(status)}`}>{t(status?.toLowerCase())}</p>
        </div>
      </div>
    );
  };
  // status colors
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pending":
        return "text-th-warning-medium";
      case "Under Review":
        return "text-th-primary-hard";
      case "Rejected":
        return "text-th-danger-hard";
      case "Approved":
        return "text-th-success-medium";
      default:
        return "";
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="grid lg:grid-cols-2 gap-4">
        {allStatuses?.map((status: string) => renderStatusSection(status))}
      </div>
      <div className="flex flex-col justify-center items-center">
        <Link
          href="/collections"
          className="mt-4 rounded-md bg-th-background-primary font-Arimo py-3 px-4 text-sm font-normal text-white outline-none transition duration-150 ease-in-out hover:shadow-lg"
        >
          {t("manageYourCollections")}
        </Link>
      </div>
    </div>
  );
};

export default CollectionCountSection;
