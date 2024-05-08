import React, { useState } from "react";
import EditProfileForm from "./edit-profile-form";
import ChangePasswordForm from "./change-password-form";
import { useTranslations } from "next-intl";

const ProfileTabs = () => {
  const t = useTranslations("editProfile.profileTabs");
  const [activeTab, setActiveTab] = useState("editprofile");

  const handleTabClick = (tabId: any) => {
    setActiveTab(tabId);
  };

  const renderTabContent = (tabId: any) => {
    switch (tabId) {
      case "editprofile":
        return <EditProfileForm />;
      case "changepassword":
        return <ChangePasswordForm />;
      default:
        return null;
    }
  };
  const tabs = [
    { id: "editprofile", label: t("editProfile") },
    { id: "changepassword", label: t("changePassword") },
  ];

  return (
    <div className="flex flex-col gap-4">
      <div className="mb-2 ml-5 overflow-x-auto overflow-y-hidden">
        <ul className="flex -mb-px text-sm font-medium text-center text-th-secondary-medium">
          {tabs.map((tab) => (
            <li key={tab?.id} className="me-4" role="presentation">
              <button
                className={`inline-block text-md whitespace-nowrap font-normal md:text-lg rounded-t-lg ${
                  activeTab === tab?.id
                    ? "border-b-2 border-th-primary-hard font-semibold text-th-primary-hard"
                    : "hover:text-th-primary-hard"
                }`}
                id={`${tab?.id}-tab`}
                type="button"
                role="tab"
                aria-controls={tab?.id}
                aria-selected={activeTab === tab?.id}
                onClick={() => handleTabClick(tab?.id)}
              >
                {tab?.label}
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div id="default-tab-content">{renderTabContent(activeTab)}</div>
    </div>
  );
};

export default ProfileTabs;
