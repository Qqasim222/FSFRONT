"use client";
import React, { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import MyTeamSection from "@/components/collections/collection-detail/my-team";
import axios from "@/common/util/api/axios-public-client";
import { GET_SINGLE_COLLECTION, GET_SINGLE_COLLECTION_PRODUCTS } from "@/common/constant/local.constant";
import { toast } from "react-toastify";
import useLoading from "@/common/hook/loading";
import { Loader } from "@/components/common/placeholder/loader";
import TeamPlaceholder from "@/components/common/placeholder/team";
import CollectionPlaceholder from "@/components/common/placeholder/collection";
import { useDispatch } from "react-redux";
import { setSingleCollection } from "@/store/slices/collectionSlice";
import ProductTableSection from "@/components/collections/collection-detail/products-table";
import Link from "next-intl/link";
import CollectionCountSection from "@/components/collections/collection-detail/collection";

const CollectionDetailPage = ({ props }: any) => {
  const t = useTranslations("collectionDetailPage");
  const [collection, setCollectionDate] = useState();
  const [productsData, setProductsData] = useState([]);
  const [productStatusStates, setProductStatusStates] = useState([]);
  const { loading, startLoading, stopLoading } = useLoading();
  const dispatch = useDispatch();

  // Get Single Collection
  useEffect(() => {
    const getSingleCollection = async () => {
      try {
        startLoading();
        const apiResponse = await axios.get(GET_SINGLE_COLLECTION, {
          params: { slug: props?.slug },
        });
        if (apiResponse?.data?.statusCode === 200) {
          setCollectionDate(apiResponse?.data?.data);
          dispatch(setSingleCollection(apiResponse?.data?.data));
          const apiResponseGetProduct = await axios.get(GET_SINGLE_COLLECTION_PRODUCTS, {
            params: { page: 1, pageSize: 5, order: "desc", slug: props?.slug },
          });
          setProductsData(apiResponseGetProduct?.data?.data?.products);
          setProductStatusStates(apiResponseGetProduct?.data?.data?.productStatusStats);
        } else {
          setProductsData([]);
          setProductStatusStates([]);
        }
      } catch (error: Error) {
        toast.error(error?.message || t("someThingWrong"));
      } finally {
        stopLoading();
      }
    };
    getSingleCollection();
  }, []);
  return (
    <>
      {loading ? (
        <Loader height="h-screen" />
      ) : (
        <div className="flex flex-col gap-5">
          <div className="flex flex-col md:flex-row w-full gap-4 md:gap-5">
            {/* Card 1 */}
            <div className="bg-th-background flex flex-col justify-between p-4 md:p-6 rounded-xl w-full md:w-3/5">
              <h3 className="text-xl text-th-primary-hard font-bold mb-4 capitalize">{collection?.name}</h3>
              {productStatusStates?.length > 0 ? (
                <CollectionCountSection statistics={productStatusStates} />
              ) : (
                <CollectionPlaceholder />
              )}
            </div>
            {/* Card 2 */}
            <div className="w-full md:w-2/5">
              <div className="bg-th-background flex flex-col justify-between p-4 md:p-6 rounded-xl">
                <h3 className="text-xl text-th-primary-hard font-bold mb-4">{t("myTeam")}</h3>
                {collection?.team?.length === 0 ? (
                  <TeamPlaceholder slug={props?.slug} />
                ) : (
                  <MyTeamSection slug={props?.slug} collection={collection} />
                )}
              </div>
            </div>
          </div>
          {/* card 3 */}
          <div className="flex flex-col md:flex-row w-full gap-4 md:gap-5">
            <div className="bg-th-background flex flex-col justify-between p-4 md:p-6 rounded-xl w-full">
              <span className="flex items-center justify-between mb-4">
                <h3 className="text-xl text-th-primary-hard font-bold">{t("products")}</h3>
                {productsData?.length > 0 && (
                  <Link
                    href={`/products`}
                    className="text-th-primary-hard flex space-x-1 items-center hover:text-th-secondary-medium hover:underline"
                  >
                    <h4>{t("viewAll")}</h4>
                  </Link>
                )}
              </span>
              <ProductTableSection productsData={productsData} />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CollectionDetailPage;
