import React from "react";
import Image from "next/image";
import LoadingIcon from "@assets/svg/loading-icon.svg";

interface LoaderProps {
  height?: string;
}
export const Loader: React.FC<LoaderProps> = ({ height = "h-10" }) => {
  return (
    <div className={`flex justify-center items-center ${height}`}>
      <Image src={LoadingIcon} height={10} width={10} alt="loading" className="w-10 h-10 animate-spin" />
    </div>
  );
};
