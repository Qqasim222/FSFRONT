"use client";
import React, { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import ProductSourceTableSec from "@/components/products/product-detail/source-table";
import { FaAngleRight, FaAnglesRight, FaListUl } from "react-icons/fa6";
import ProductTabsSec from "@/components/products/product-detail/product-tabs";
import ProductImageGallerySec from "@/components/products/product-detail/image-gallery";
import CustomButton from "@/components/common/button/custom-button";
import ProductHistoryModal from "@/components/products/product-history/history-modal";
import useLoading from "@/common/hook/loading";
import axios from "@/common/util/api/axios-public-client";
import { toast } from "react-toastify";
import { GET_SINGLE_PRODUCT } from "@/common/constant/local.constant";
import { Loader } from "@/components/common/placeholder/loader";
import Link from "next-intl/link";

const ProductDetailPage = ({ slug }: any) => {
  const t = useTranslations("productDetailPage");
  const [expand, setExpend] = useState(false);
  const [isProductHistoryModalOpen, setProductHistoryModalOpen] = useState<boolean>(false);
  const { loading, startLoading, stopLoading } = useLoading();
  const [productData, setProductData] = useState([]);
  const toggleGallery = () => {
    setExpend(!expand);
  };
  // Modal handle
  const handleProductHistoryModal = () => {
    setProductHistoryModalOpen(true);
  };
  const handleCloseProductHistoryModal = () => {
    setProductHistoryModalOpen(false);
  };

  useEffect(() => {
    const getSingleProductDetail = async () => {
      try {
        startLoading();
        const apiResponse = await axios.get(GET_SINGLE_PRODUCT, {
          params: { slug: slug },
        });
        if (apiResponse?.data?.statusCode === 200) {
          setProductData(apiResponse?.data?.data);
        }
      } catch (error: Error) {
        toast.error(error?.message || t("someThingWrong"));
      } finally {
        stopLoading();
      }
    };
    getSingleProductDetail();
  }, []);

  return (
    <>
      {loading ? (
        <Loader height="h-screen" />
      ) : (
        <div className="flex flex-col gap-5 ">
          <div className="flex justify-between items-center">
            <h3 className="text-sm md:text-xl text-th-primary-hard font-bold mb-4 flex items-center gap-2">
              <FaListUl className="text-sm md:text-md" />{" "}
              <Link href="/products" className="cursor-pointer">
                {t("product")}
              </Link>
              <FaAngleRight className="text-sm md:text-md" />
              {productData?.name?.default?.length > 30
                ? productData?.name?.default + "..."
                : productData?.name?.default}
            </h3>
          </div>
          <div className="flex flex-col-reverse md:flex-row w-full gap-x-4 gap-y-5">
            <div className={`${expand ? "w-full" : "md:w-4/6"} flex flex-col gap-5`}>
              <ProductSourceTableSec productData={productData} />
              <ProductTabsSec productData={productData} />
            </div>
            <FaAnglesRight
              className={`hidden md:block cursor-pointer font-thin w-7 h-7 text-th-primary-hard border border-th-primary-hard rounded-full p-2 -ml-8 mt-5 z-10 ${
                expand && "rotate-180"
              }`}
              onClick={toggleGallery}
            />
            <div
              className={`${
                expand ? "hidden" : "block"
              } w-full md:w-2/6 flex flex-col items-center justify-start gap-5`}
            >
              <ProductImageGallerySec productImages={productData?.productImages} />
              <div className="min-w-fit relative flex justify-center items-center text-center">
                <CustomButton
                  className={
                    "w-full rounded-md bg-th-primary-hard py-2 px-4 pe-8 text-xs lg:text-base font-bold text-th-primary-light outline-none transition duration-150 ease-in-out hover:shadow-lg"
                  }
                  type="button"
                  label={t("productHistory")}
                  onClick={handleProductHistoryModal}
                />
                <span className="absolute inline-flex items-center text-xs justify-center ml-5 right-2 top-2 rounded-full bg-th-background w-4 h-4 lg:my-1 text-th-primary-hard leading-tight text-center">
                  5
                </span>
              </div>
              <ProductHistoryModal isOpen={isProductHistoryModalOpen} onCancel={handleCloseProductHistoryModal} />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProductDetailPage;
