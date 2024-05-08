"use client";
import React, { useState } from "react";
import useLoading from "@/common/hook/loading";
import ProductListTable from "@/components/products/product-list-table";
import ProductSearchForm from "@/components/products/product-search-form";
import axios from "@/common/util/api/axios-public-client";
import { useTranslations } from "next-intl";
import { toast } from "react-toastify";
import { PRODUCTS } from "@/common/constant/local.constant";
import ProductAdvanceSearchForm from "@/components/products/advance-search/advance-search-form";

const ProductsPage = () => {
  const t = useTranslations("productsPage");
  const { loading, startLoading, stopLoading } = useLoading();
  const [productData, setProductData] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [selectedCheckBoxesKeys, setSelectedCheckBoxesKeys] = useState([
    "gtin",
    "info.brand.name",
    "info.brand.manufacturer.name",
    "info.importerDistributor",
    "name.default",
    "info.status.label",
  ]);
  const [selectedCheckBoxes, setSelectedCheckBoxes] = useState([
    "GTIN",
    "Brand Name",
    "Manufacturer Name",
    "Importer/Distributor",
    "Product Name",
    "Status",
  ]);

  // Handle Products Update
  const handleProductsUpdate = async (newPage: number = 1, filters: any) => {
    try {
      startLoading();
      const apiResponse = await axios.get(PRODUCTS, {
        params: { page: newPage, pageSize: 10, order: "desc", ...filters },
      });
      if (apiResponse?.data?.statusCode === 200) {
        setProductData(apiResponse?.data?.data?.products);
        setTotalCount(apiResponse?.data?.data?.totalCount);
      } else {
        toast.error(apiResponse?.data?.message);
      }
    } catch (error: Error) {
      toast.error(error?.message || t("someThingWrong"));
    } finally {
      stopLoading();
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <h3 className="text-xl text-th-primary-hard font-bold mb-4">{t("productList")}</h3>
        <div className="text-xl text-th-primary-hard mb-4"></div>
      </div>
      <>
        <ProductSearchForm
          onSearchSubmit={handleProductsUpdate}
          productData={productData}
          setSelectedCheckBoxesKeys={setSelectedCheckBoxesKeys}
          selectedCheckBoxesKeys={selectedCheckBoxesKeys}
          setSelectedCheckBoxes={setSelectedCheckBoxes}
          selectedCheckBoxes={selectedCheckBoxes}
        />
        <ProductAdvanceSearchForm onSearchSubmit={handleProductsUpdate} productData={productData} />
        <ProductListTable
          productData={productData}
          isLoading={loading}
          onProductListUpdate={handleProductsUpdate}
          totalCount={totalCount}
          selectedCheckBoxesKeys={selectedCheckBoxesKeys}
          selectedCheckBoxes={selectedCheckBoxes}
        />
      </>
    </div>
  );
};

export default ProductsPage;
