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
import Link from "next-intl/link";
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

const Drawer: React.FC = () => {
  const t = useTranslations("sideBar");
  const [open, setOpen] = useState(true);
  const [openDropdowns, setOpenDropdowns] = useState<number[]>([]);
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

  const toggleDrawer = () => {
    setOpen(!open);
  };

  const handleMenuItem = (id: number) => {
    setOpenDropdowns((prevOpenDropdowns) => {
      if (prevOpenDropdowns.includes(id)) {
        return prevOpenDropdowns.filter((item) => item !== id);
      } else {
        return [...prevOpenDropdowns, id];
      }
    });
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
      setOpenDropdowns((prevOpenDropdowns) => [...prevOpenDropdowns, activeTab?.id]);
    }
  }, [pathname, menus, userPermissions, router, collectionPermissions]);

  const activePathName = pathname.split("/").filter(Boolean)[0];

  return (
    <div
      className={`${
        open ? "w-64" : "w-20"
      } bg-th-background h-full py-5 ps-6 pt-6 relative transition-transform ease-in-out duration-500 delay-150 shadow-xl`}
    >
      <FaAnglesLeft
        className={`absolute cursor-pointer -right-3 top-6 font-thin w-7 h-7 text-th-primary-hard border border-th-primary-medium rounded-full p-2 ${
          !open && "rotate-180"
        }`}
        onClick={toggleDrawer}
      />
      <div className="flex gap-x-4 items-center">
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
                    menu?.title.toLowerCase() === activePathName ? "border-r-2 rounded-none border-th-primary-hard" : ""
                  } `}
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
                          menu?.title.toLowerCase() === activePathName ? "brightness-50 saturate-200" : "brightness-100"
                        }`}
                      />
                    )}
                    <p
                      className={`${
                        !open && "hidden"
                      } origin-left text-sm font-normal transition-transform ease-in-out duration-500 delay-150 ${
                        menu?.title.toLowerCase() === activePathName ? "text-th-primary-hard" : ""
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
              } ${
                menu?.children
                  ?.filter((item) => item?.title.toLowerCase() === activePathName)
                  .map((item) => item.title)
                  .join(", ")
                  .toLowerCase() === activePathName
                  ? "rounded-none text-th-primary-hard"
                  : ""
              } `}
              onClick={() => {
                if (menu.children) {
                  toggleDropdown(menu?.id);
                } else {
                  handleMenuItem(menu?.id);
                }
              }}
            >
              <span className={`flex items-center text-base gap-2 cursor-context-menu relative`}>
                {menu?.icon && (
                  <Image
                    src={menu?.icon}
                    alt={menu?.title || "menu item"}
                    height={20}
                    width={20}
                    className={`filter ${
                      menu?.children
                        ?.filter((item) => item?.title.toLowerCase() === activePathName)
                        .map((item) => item.title)
                        .join(", ")
                        .toLowerCase() === activePathName
                        ? "brightness-50 saturate-200"
                        : "brightness-100"
                    }`}
                  />
                )}
                <p
                  className={`${
                    !open && "hidden"
                  } origin-left text-sm font-normal transition-transform ease-in-out duration-500 delay-150 ${
                    menu?.children
                      ?.filter((item) => item?.title.toLowerCase() === activePathName)
                      .map((item) => item.title)
                      .join(", ")
                      .toLowerCase() === activePathName
                      ? "text-th-primary-hard"
                      : ""
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
                          child?.title.toLocaleLowerCase() === activePathName
                            ? "text-th-info-hard border-r-2 border-th-primary-hard "
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
                            }  ml-7 w-full list-disc text-sm cursor-pointer hover:text-th-info-hard font-normal transition-transform ease-in-out duration-500 delay-150 border-l-2 pl-2 pr-10`}
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
  );
};

export default Drawer;
