"use client";
import React, { useState, useRef, useEffect } from "react";
import { FaBars, FaCircleUser, FaXmark } from "react-icons/fa6";
import Link from "next-intl/link";
import { deleteCookie, getCookie } from "cookies-next";
import { toast } from "react-toastify";
import { useTranslations } from "next-intl";
import { signOut } from "next-auth/react";
import CustomConfirmPopup from "@/components/common/popup/confirm-popup";
import LanguageDropdown from "@/components/common/dropdown/language-dropdown";
import { useDispatch, useSelector } from "react-redux";
import { selectSessionInfo, saveUserData } from "@/store/slices/authSlice";
import axios from "@/common/util/api/axios-public-client";
import { usePathname, useRouter } from "next-intl/client";
import { logger } from "@/common/util/logger";
import { GET_USER_PROFILE } from "@/common/constant/server.constant";

const AppBar = ({ toggleCanvas, open }: any) => {
  const t = useTranslations("appBar");
  const sessionInfo = useSelector(selectSessionInfo);
  const [isDropdownOpen, setDropdownOpen] = useState<boolean>(false);
  const [isConfirmationOpen, setConfirmationOpen] = useState<boolean>(false);
  const dropdownRef = useRef(null);
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch();
  const handleToggleDropdown = () => {
    setDropdownOpen((prev) => !prev);
  };

  const handleCloseDropdown = () => {
    setDropdownOpen(false);
  };

  const handleProfileDropDown = () => {
    handleCloseDropdown();
  };

  const handleLogout = () => {
    setConfirmationOpen(true);
  };

  const handleCancelLogout = () => {
    setConfirmationOpen(false);
  };

  const handleConfirmLogout = () => {
    toast.success(t("logoutMessage"));
    signOut({
      redirect: false,
    });
    deleteCookie("session-info");
    handleCloseDropdown();
    setConfirmationOpen(false);
    router.replace("/login");
  };
  useEffect(() => {
    const sessionData = JSON.parse(getCookie("session-info"));
    const accessToken = sessionData?.data?.accessToken;
    const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;
    const fetchData = async () => {
      try {
        const apiResponse = await axios.get(`${baseURL}${GET_USER_PROFILE}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        });
        if (apiResponse?.data?.statusCode == 200) {
          dispatch(saveUserData(apiResponse?.data?.data));
        } else {
          logger("error", apiResponse?.data?.message);
        }
      } catch (error: Error) {
        toast.error(error?.message || t("someThingWrong"));
      }
    };
    if (!sessionInfo) {
      fetchData();
    }
  }, [sessionInfo]);
  // Handle dropdown close on outside click
  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);
  return (
    <div className="relative top-0 left-0 right-0">
      <div className="px-5 py-4 flex justify-between items-center">
        {/* Empty space on the left */}
        <div className="capitalize text-xl text-th-primary-hard font-bold">{t(pathname.split("/")[1])}</div>
        {/* User menu */}
        <div className="flex items-center space-x-2 relative" ref={dropdownRef}>
          <div className="flex text-sm text-end space-x-2 flex-col">
            <LanguageDropdown />
          </div>

          <button
            type="button"
            className="flex items-center text-sm border border-th-primary-medium rounded-full focus:ring-4 focus:ring-th-primary-medium"
            id="user-menu-button"
            aria-expanded={isDropdownOpen}
            onClick={handleToggleDropdown}
          >
            <span className="sr-only">Open user profile menu</span>
            <FaCircleUser className="w-8 h-8 text-th-primary-hard" />
          </button>
          <div className="flex text-sm text-start flex-col">
            <span>{sessionInfo?.firstName || ""}</span>
            <span className="text-xs tracking-wide text-th-grey-hard">
              {sessionInfo?.name?.length > 12 ? sessionInfo?.role?.name?.slice(0, 10) + "..." : sessionInfo?.role?.name}
            </span>
          </div>
          <div className="flex lg:hidden">
            {open ? (
              <FaXmark
                className={`cursor-pointer font-thin w-6 h-6 text-th-primary-hard py-px transition-transform ease-in-out duration-500 delay-150`}
                onClick={toggleCanvas}
              />
            ) : (
              <FaBars
                className={`cursor-pointer font-thin w-6 h-6 text-th-primary-hard py-px transition-transform ease-in-out duration-500 delay-150`}
                onClick={toggleCanvas}
              />
            )}
          </div>
          {/* Dropdown content */}
          {isDropdownOpen && (
            <div className="absolute top-full right-0 mt-2 bg-th-grey-light border border-th-grey-medium shadow-xl rounded-md z-10">
              <ul className="py-2 text-th-secondary-medium font-normal text-sm">
                <li>
                  <Link
                    href="/profile"
                    onClick={handleProfileDropDown}
                    className="block px-4 py-2 hover:bg-th-primary-medium whitespace-nowrap"
                  >
                    {t("profile")}
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    onClick={() => {
                      handleProfileDropDown();
                      handleLogout();
                    }}
                    className="block px-4 py-2 hover:bg-th-primary-medium cursor-pointer whitespace-nowrap"
                  >
                    {t("logout")}
                  </Link>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
      {/* Confirmation Dialog */}
      <CustomConfirmPopup
        isOpen={isConfirmationOpen}
        onCancel={handleCancelLogout}
        onConfirm={handleConfirmLogout}
        message="confirmLogout"
      />
    </div>
  );
};

export default AppBar;
