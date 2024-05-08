import React, { useEffect, useState } from "react";
import ProductDetailTableSec from "./product-detail-table";
import { FaPencil, FaX } from "react-icons/fa6";
import { structureData } from "@/common/config/structure";
import GroupListTabSec from "./tabs/group-list";
import NutrientProfilingTabSec from "./tabs/nutrient-profiling";
import { useSelector } from "react-redux";
import { selectSessionInfo } from "@/store/slices/authSlice";
// Tabs Name List
const tabsListValues = [
  "Product",
  "Claim",
  "Ingredients and Allergens",
  "Nutrients",
  "Nutrient Profiling",
  "Backend",
  "Group",
];
const ProductTabsSec = ({ productData }: any) => {
  // const t = useTranslations("productDetailPage.productDetailTabsSec.productTabs");
  const sessionInfo = useSelector(selectSessionInfo);
  const tabsList = sessionInfo?.role?.permissions?.Product?.tabs
    ? sessionInfo?.role?.permissions?.Product?.tabs
    : tabsListValues;
  const [activeTab, setActiveTab] = useState(tabsList?.[0]);
  const [editMode, setEditMode] = useState(true);
  const [resetMode, setResetMode] = useState(false);

  const superAdminPermissions = sessionInfo?.role?.permissions === "*";
  let canUpdateProduct = false;
  if (superAdminPermissions) {
    canUpdateProduct = true;
  } else {
    const permissions = sessionInfo?.role?.permissions?.Product;
    if (permissions) {
      ({ ["can-update-product"]: canUpdateProduct } = permissions || {});
    }
  }

  useEffect(() => {
    if (canUpdateProduct === undefined) {
      setEditMode(false);
    }
  }, []);

  // Handle tabs
  const handleTabClick = (tabId: any) => {
    setActiveTab(tabId);
    setEditMode(true);
    setResetMode(false);
  };
  // Handle Edit View
  const handleEditClick = () => {
    setEditMode(!editMode);
    setResetMode(true);
  };
  const handleResetClick = () => {
    setEditMode(true);
    setResetMode(false);
  };

  const renderTabContent = (tabId: any) => {
    if (tabId === "Product") {
      return (
        <ProductDetailTableSec
          tabKey={tabId}
          productsData={productData}
          editMode={editMode}
          structureDummyData={structureData?.Product}
        />
      );
    } else if (tabId === "Claim") {
      return (
        <ProductDetailTableSec
          tabKey={tabId}
          productsData={productData}
          editMode={editMode}
          structureDummyData={structureData?.Claim}
        />
      );
    } else if (tabId === "Nutrients") {
      return (
        <ProductDetailTableSec
          tabKey={tabId}
          productsData={productData}
          editMode={editMode}
          structureDummyData={structureData?.Nutrients}
        />
      );
    } else if (tabId === "Nutrient Profiling") {
      return (
        <NutrientProfilingTabSec
          tabKey={tabId}
          productsData={productData}
          editMode={editMode}
          structureDummyData={structureData?.NutrientProfiling}
        />
      );
    } else if (tabId === "Ingredients and Allergens") {
      return (
        <ProductDetailTableSec
          tabKey={tabId}
          productsData={productData}
          editMode={editMode}
          structureDummyData={structureData?.Ingredients}
        />
      );
    } else if (tabId === "Backend") {
      return (
        <ProductDetailTableSec
          tabKey={tabId}
          productsData={productData}
          editMode={editMode}
          structureDummyData={structureData?.Backend}
        />
      );
    } else if (tabId === "Group") {
      return (
        <GroupListTabSec
          tabKey={tabId}
          productsData={productData}
          editMode={editMode}
          structureDummyData={structureData?.Group}
        />
      );
    } else {
      return null;
    }
  };

  return (
    <div className="flex flex-col gap-x-2">
      <div
        className="md:ml-5 overflow-x-auto overflow-y-hidden flex items-center justify-between lg:flex-row-reverse"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        <span>
          {resetMode ? (
            <FaX
              className={`cursor-pointer text-th-primary-hard hover:text-th-secondary-medium me-3 ${
                editMode ? "text-th-primary-hard" : ""
              }`}
              onClick={handleResetClick}
            />
          ) : (
            <FaPencil
              className={`hidden cursor-pointer text-th-primary-hard hover:text-th-secondary-medium me-3 ${
                editMode ? "text-th-secondary-medium" : ""
              }`}
              onClick={handleEditClick}
            />
          )}
        </span>
        <ul className="flex text-sm font-medium text-center text-th-secondary-medium">
          {tabsList?.map((tab: string) => (
            <li key={tab} className="me-1" role="presentation">
              <button
                className={`inline-block whitespace-nowrap text-sm font-normal xl:text-md rounded-t-lg py-2.5 ${
                  activeTab === tab
                    ? "font-normal bg-th-background text-th-primary-hard px-3 py-1 transition duration-300 border-t border-l border-r border-th-primary-hard"
                    : "hover:text-th-primary-hard hover:font-normal bg-th-primary-hard hover:bg-th-background text-th-background px-3 py-1 transition duration-300 border-t border-l border-r border-th-primary-hard hover:border-th-background"
                }`}
                id={`${tab}-tab`}
                type="button"
                role="tab"
                aria-controls={tab}
                aria-selected={activeTab === tab}
                onClick={() => handleTabClick(tab)}
              >
                {tab}
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div id="default-tab-content" className="overflow-x-auto">
        {renderTabContent(activeTab)}
      </div>
    </div>
  );
};

export default ProductTabsSec;
