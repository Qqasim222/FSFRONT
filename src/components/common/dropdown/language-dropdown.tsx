"use client";
import React, { useEffect, useRef, useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa6";
import { usePathname, useRouter } from "next-intl/client";
import { useParams } from "next/navigation";
import axios from "@/common/util/api/axios-public-client";
import { USERS_PROFILE } from "@/common/constant/local.constant";
import { getCookie, hasCookie } from "cookies-next";

// Define an array of languages
const languages = [
  { code: "en", label: "english", sublable: "en" },
  { code: "pt-br", label: "portuguese", sublable: "pt" },
  { code: "zh-cn", label: "chinese", sublable: "cn" },
];

const LanguageDropdown = () => {
  const [isDropdownOpen, setDropdownOpen] = useState<boolean>(false);
  const path = usePathname();
  const pathname = useParams();
  const router = useRouter();
  const [selectedLanguage, setSelectedLanguage] = React.useState(pathname.locale);
  const next_locale = getCookie("NEXT_LOCALE");
  const dropdownRef = useRef(null);
  // Access the session token
  const handleToggleDropdown = () => {
    setDropdownOpen((prev) => !prev);
  };

  const handleCloseDropdown = () => {
    setDropdownOpen(false);
  };
  useEffect(() => {
    setSelectedLanguage(pathname.locale);
  }, [pathname.locale, next_locale]);
  const handleLanguageSelect = async (code: string) => {
    setSelectedLanguage(code);
    router.replace(path, { locale: code });
    handleCloseDropdown();
    if (hasCookie("session-info")) {
      const sessionInfo = JSON.parse(getCookie("session-info"));
      if (sessionInfo?.data?.accessToken) {
        const simplefiedData = {
          defaultLanguage: code,
        };
        await axios.patch(USERS_PROFILE, JSON.stringify(simplefiedData));
      }
    }
  };
  // Handle dropdown close on outside click
  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        handleCloseDropdown();
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);
  return (
    <div className="flex items-center space-x-2 relative" ref={dropdownRef}>
      <button
        type="button"
        className={`flex items-center text-sm border border-th-grey-medium rounded-xl focus:outline focus:outline-th-primary-medium ${
          isDropdownOpen && "focus:ring-4 focus:ring-th-primary-medium"
        }`}
        id="user-menu-button"
        aria-expanded={isDropdownOpen}
        onClick={handleToggleDropdown}
      >
        <span className="sr-only">Open language select dropdown</span>
        <p className="px-3 py-1.5 text-th-primary-hard uppercase">
          {languages.find((lang) => lang?.code === selectedLanguage)?.sublable}
        </p>
        {isDropdownOpen ? (
          <FaChevronUp className="mr-2 text-th-grey-hard" />
        ) : (
          <FaChevronDown className="mr-2 text-th-grey-hard" />
        )}
      </button>
      {/* Dropdown content */}
      {isDropdownOpen && (
        <div className="absolute top-full right-0 mt-2 bg-th-grey-light border border-th-grey-medium shadow-xl rounded-md z-10">
          <ul className="py-2 text-th-secondary-medium font-normal text-sm text-start">
            {languages?.map((lang) => (
              <li
                key={lang.code}
                className="block px-6 py-2 hover:bg-th-primary-medium whitespace-nowrap cursor-pointer"
                onClick={() => handleLanguageSelect(lang?.code)}
              >
                <span className="capitalize">{lang?.label}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default LanguageDropdown;
