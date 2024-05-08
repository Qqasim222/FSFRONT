"use client";
import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import logo from "@assets/images/logo2.png";
import dashboardIcon from "@assets/svg/dashboard_icon.svg";
import collectionsIcon from "@assets/svg/collections_icon.svg";
import usersIcon from "@assets/svg/user_icon.svg";
import exportIcon from "@assets/svg/export-icon.svg";
import productsIcon from "@assets/svg/products-icon.svg";
import settingsIcon from "@assets/svg/setting_icon.svg";
import searchIcon from "@assets/svg/search_Icon.svg";
import { FaAnglesLeft, FaChevronDown } from "react-icons/fa6";
import { useTranslations } from "next-intl";
import CustomConfirmPopup from "@/components/common/popup/confirm-popup";
import { signOut } from "next-auth/react";
import { deleteCookie } from "cookies-next";
import { toast } from "react-toastify";
import Link from "next-intl/link";
import AppBar from "../appbar/appbar";
import { useSelector } from "react-redux";
import { selectSessionInfo } from "@/store/slices/authSlice";
import { usePathname, useRouter } from "next-intl/client";
interface MenuItem {
  id: number;
  title: string;
  url: string;
  icon: string;
  children?: MenuItem[];
  dropicon?: string;
  gap?: boolean;
}

const MobileCanvas: React.FC = () => {
  const t = useTranslations("sideBar");
  const [open, setOpen] = useState(false);
  const [activeMenuItem, setActiveMenuItem] = useState<{ id: number; subId?: number } | null>(null);
  const [openDropdowns, setOpenDropdowns] = useState<number[]>([]);
  const [isConfirmationOpen, setConfirmationOpen] = useState<boolean>(false);
  const router = useRouter();
  const pathname = usePathname();
  const sessionInfo = useSelector(selectSessionInfo);
  const superAdminPermissions = sessionInfo?.role?.permissions === "*";
  const userPermissions = sessionInfo?.role?.permissions?.User ? true : superAdminPermissions;
  const collectionPermissions = sessionInfo?.role?.permissions?.Collection ? true : superAdminPermissions;
  const menus: MenuItem[] = useMemo(
    () =>
      [
        { id: 1, title: t("dashboard"), url: "dashboard", icon: dashboardIcon },
        collectionPermissions && {
          id: 2,
          title: t("collections"),
          url: "collections",
          icon: collectionsIcon,
          // children: [{ id: 21, title: t("collections"), url: "collections", dropicon: collectionsIcon }],
        },
        userPermissions && {
          id: 3,
          // title: t("userManagement"),
          title: t("users"),
          url: "users",
          icon: usersIcon,
          // children: [{ id: 31, title: t("users"), url: "users", dropicon: usersIcon }],
        },
        {
          id: 4,
          title: t("products"),
          url: "products",
          icon: productsIcon,
        },
        {
          id: 5,
          title: t("exports"),
          url: "exports",
          icon: exportIcon,
        },
        {
          id: 6,
          title: t("settings"),
          url: "settings",
          icon: settingsIcon,
          gap: true,
        },
        { id: 7, title: t("search"), url: "search", icon: searchIcon, gap: true },
      ].filter(Boolean),
    [t, userPermissions, collectionPermissions],
  );

  const toggleCanvas = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleMenuItem = (id: number, subId?: number) => {
    if (subId) {
      setActiveMenuItem({ id, subId });
    } else {
      setActiveMenuItem({ id });
      setOpenDropdowns((prevOpenDropdowns) => {
        if (prevOpenDropdowns.includes(id)) {
          return prevOpenDropdowns.filter((item) => item !== id);
        } else {
          return [...prevOpenDropdowns, id];
        }
      });
    }
  };

  const toggleDropdown = (menuId: number) => {
    setOpenDropdowns((prevOpenDropdowns) => {
      if (prevOpenDropdowns.includes(menuId)) {
        return prevOpenDropdowns.filter((item) => item !== menuId);
      } else {
        return [...prevOpenDropdowns, menuId];
      }
    });
  };

  useEffect(() => {
    const currentPath = pathname;
    let activeTab: any = null;
    menus.forEach((menu) => {
      if (menu?.children) {
        menu?.children.forEach((subMenu) => {
          if (currentPath.includes(`/${subMenu.url}`)) {
            activeTab = {
              id: menu?.id,
              subId: subMenu?.id,
            };
          }
        });
      } else {
        if (currentPath.includes(`/${menu.url}`)) {
          activeTab = {
            id: menu?.id,
          };
        }
      }
    });
    if (activeTab) {
      setActiveMenuItem(activeTab);
      setOpenDropdowns((prevOpenDropdowns) => [...prevOpenDropdowns, activeTab?.id]);
    }
    // if (
    //   (!userPermissions && pathname.includes("/users")) ||
    //   (!collectionPermissions && pathname.includes("/collections"))
    // ) {
    //   router.replace("/dashboard");
    // }
  }, [pathname, setActiveMenuItem, menus, userPermissions, router, collectionPermissions]);

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
    setConfirmationOpen(false);
    router.replace("/login");
  };

  return (
    <div>
      <div className="bg-th-background shadow-lg rounded-b-xl">
        <AppBar toggleCanvas={toggleCanvas} open={open} />
      </div>
      {open && (
        <div className="fixed inset-0 z-50">
          <div className="bg-th-background w-64  h-full shadow-xl transform translate-x-0 transition-transform ease-in-out duration-500 delay-150">
            <div className="flex px-4 py-3">
              <FaAnglesLeft
                className={`absolute cursor-pointer right-3 top-6 font-thin w-7 h-7 text-th-primary-hard border border-th-primary-medium rounded-full p-2 ${
                  !open && "rotate-180"
                }`}
                onClick={toggleCanvas}
              />
            </div>
            <div className="flex gap-x-4 ps-4 items-center">
              <Image
                height={30}
                width={32}
                src={logo}
                alt="logo"
                className={`cursor-pointer transition-transform ease-in-out duration-500 delay-150 ${
                  open && "rotate-[360deg]"
                }`}
              />
              <h1
                className={`uppercase origin-left font-bold text-base transition-transform ease-in-out duration-500 delay-150 ${
                  !open && "scale-0"
                }`}
              >
                <span className="text-th-secondary-medium">{t("food")}</span>
                <span className="text-th-primary-hard">{t("switch")}</span>
              </h1>
            </div>
            <div className="ps-4">
              <ul className="py-6">
                {menus?.map((menu) =>
                  !menu?.children ? (
                    <React.Fragment key={menu?.id}>
                      <Link href={`/${menu?.url}`}>
                        <li
                          key={menu?.id}
                          className={`flex flex-col rounded-md py-2 text-th-secondary-light text-sm gap-x-2 hover:text-th-secondary-medium ${
                            menu?.gap ? "mt-6 relative" : "mt-3"
                          } ${
                            menu?.id === activeMenuItem?.id ? "border-r-2 rounded-none border-th-primary-hard" : ""
                          } ${openDropdowns.includes(menu?.id) ? "text-th-primary-hard" : ""}`}
                        >
                          {menu?.gap && (
                            <div className="absolute -top-3 left-0 right-6 bottom-10 opacity-40 border-t border-th-secondary-light mb-7 my-0"></div>
                          )}
                          <span className={`flex items-center text-base gap-2 relative`}>
                            {menu?.icon && (
                              <Image
                                src={menu?.icon}
                                alt={menu?.title || "menu item"}
                                height={20}
                                width={20}
                                className={`filter ${
                                  menu?.id === activeMenuItem?.id ? "brightness-50 saturate-200" : "brightness-100"
                                }`}
                              />
                            )}
                            <p
                              className={`${
                                !open && "hidden"
                              } origin-left text-sm font-normal transition-transform ease-in-out duration-500 delay-150 ${
                                menu?.id === activeMenuItem?.id ? "text-th-primary-hard" : ""
                              }`}
                            >
                              {menu?.title}
                            </p>
                          </span>
                        </li>
                      </Link>
                    </React.Fragment>
                  ) : (
                    <li
                      key={menu?.id}
                      className={`flex flex-col rounded-md py-2 text-th-secondary-light text-sm gap-x-2 hover:text-th-secondary-medium ${
                        menu?.gap ? "mt-6 relative" : "mt-3"
                      } ${menu?.id === activeMenuItem?.id ? "rounded-none" : ""} ${
                        openDropdowns.includes(menu?.id) ? "text-th-primary-hard" : ""
                      }`}
                      onClick={() => {
                        if (menu.children) {
                          toggleDropdown(menu?.id);
                        } else {
                          handleMenuItem(menu?.id);
                        }
                      }}
                    >
                      <span className={`flex items-center text-base cursor-context-menu gap-2 relative`}>
                        {menu?.icon && (
                          <Image
                            src={menu?.icon}
                            alt={menu?.title || "menu item"}
                            height={20}
                            width={20}
                            className={`filter ${
                              menu?.id === activeMenuItem?.id ? "brightness-50 saturate-200" : "brightness-100"
                            }`}
                          />
                        )}
                        <p
                          className={`${
                            !open && "hidden"
                          } origin-left text-sm font-normal transition-transform ease-in-out duration-500 delay-150 ${
                            menu?.id === activeMenuItem?.id ? "text-th-primary-hard" : ""
                          }`}
                        >
                          {menu?.title}
                        </p>
                        {menu?.children && (
                          <span
                            onClick={() => toggleDropdown(menu?.id)}
                            className={`${open && "rotate-0"} absolute top-1/2 right-0 transform -translate-y-1/2 `}
                          >
                            <FaChevronDown
                              onClick={() => toggleDropdown(menu?.id)}
                              className={`text-th-secondary-light mx-2 text-xs`}
                            />
                          </span>
                        )}
                      </span>
                      <span>
                        {menu?.children && (
                          <ul
                            className={`${
                              openDropdowns.includes(menu?.id) ? "block" : "hidden"
                            } transition-transform ease-in-out duration-500 delay-150 transform origin-top-left -translate-y-2`}
                          >
                            {menu?.children?.map((child) => (
                              <li
                                key={child?.id}
                                className={`${open && "flex items-center px-4 mt-4 pt-2 text-sm"} ${
                                  child?.id === activeMenuItem?.subId
                                    ? "text-th-info-hard border-r-2 border-th-primary-hard"
                                    : ""
                                } ${!open && "px-0.5"}`}
                                onClick={(event) => {
                                  event.stopPropagation();
                                  handleMenuItem(child?.id);
                                }}
                              >
                                <Link href={`/${child?.url}`}>
                                  <span
                                    className={`${
                                      !open && "hidden"
                                    }  ml-7 w-full list-disc text-sm cursor-pointer hover:text-th-info-hard font-normal transition-transform ease-in-out duration-500 delay-150 border-l-2 pl-2`}
                                  >
                                    {child?.title}
                                  </span>
                                </Link>
                              </li>
                            ))}
                          </ul>
                        )}
                      </span>
                    </li>
                  ),
                )}
              </ul>
            </div>
            <div className="flex fixed bottom-2">
              <button
                className="ml-5 py-1 px-2 text-th-primary-light border rounded-md bg-th-primary-hard"
                onClick={handleLogout}
              >
                {t("logout")}
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Logout Confirmation Popup */}
      <CustomConfirmPopup
        isOpen={isConfirmationOpen}
        onCancel={handleCancelLogout}
        onConfirm={handleConfirmLogout}
        message="confirmLogout"
      />
    </div>
  );
};

export default MobileCanvas;
