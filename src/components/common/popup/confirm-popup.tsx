import { useTranslations } from "next-intl";
import React from "react";
import CustomButton from "@/components/common/button/custom-button";

interface CustomConfirmPopupProps {
  isOpen: boolean;
  onCancel: any;
  onConfirm: any;
  message: string;
}

const CustomConfirmPopup: React.FC<CustomConfirmPopupProps> = ({ isOpen, onCancel, onConfirm, message }) => {
  const t = useTranslations("popups");
  const messagekey = t(message);
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center z-50 bg-th-primary-medium p-5">
      <div className="bg-th-background text-white p-5 rounded-md">
        <p className="mb-8 text-th-primary-hard text-2xl font-semibold">{messagekey}</p>
        <div className="flex mt-10 text-lg gap-4">
          <CustomButton
            className="mt-4 rounded-md bg-th-primary-hard py-2 px-4 text-xs lg:text-base font-semibold text-th-primary-light outline-none transition duration-150 ease-in-out hover:shadow-lg"
            type="button"
            label={t("confirm")}
            onClick={onConfirm}
          />
          <CustomButton
            className="mt-4 rounded-md border border-th-primary-medium py-2 px-4 text-xs lg:text-base font-semibold text-th-grey-hard outline-none transition duration-150 ease-in-out hover:shadow-lg"
            type="button"
            label={t("cancel")}
            onClick={onCancel}
          />
        </div>
      </div>
    </div>
  );
};

export default CustomConfirmPopup;
