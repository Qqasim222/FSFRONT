"use client";
import React, { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import TeamPlaceholder from "@/components/common/placeholder/team";
import CollectionPlaceholder from "@/components/common/placeholder/collection";
import axios from "@/common/util/api/axios-public-client";
import { toast } from "react-toastify";
import useLoading from "@/common/hook/loading";
import { Loader } from "@/components/common/placeholder/loader";
import MyTeamSection from "@/components/collections/collection-detail/my-team";
import {
  GET_LATEST_COLLECTION,
  GET_LATEST_COLLECTION_TEAM,
  GET_LATEST_PRODUCTS,
} from "@/common/constant/local.constant";
import ProductTableSection from "@/components/collections/collection-detail/products-table";
import Link from "next-intl/link";
import { setSingleCollection } from "@/store/slices/collectionSlice";
import { useDispatch } from "react-redux";
import CollectionCountSection from "@/components/collections/collection-detail/collection";
import { useSelector } from "react-redux";
import { selectSessionInfo } from "@/store/slices/authSlice";
const DashboardPage = () => {
  const t = useTranslations("dashBoard");
  const { loading, startLoading, stopLoading } = useLoading();
  const [latestCollectionData, setLatestCollectionData] = useState([]);
  const [productsData, setProductsData] = useState([]);
  const [productStatusStates, setProductStatusStates] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const dispatch = useDispatch();
  const sessionInfo = useSelector(selectSessionInfo);

  const superAdminPermissions = sessionInfo?.role?.permissions === "*";
  let canCreateUser = false;
  if (superAdminPermissions) {
    canCreateUser = true;
  } else {
    const permissions = sessionInfo?.role?.permissions?.User;
    if (permissions) {
      ({ ["can-create-user"]: canCreateUser } = permissions || {});
    }
  }

  // Get Latest Collection
  useEffect(() => {
    const fetcherLatestCollection = async () => {
      try {
        startLoading();
        const apiResponse = await axios.get(GET_LATEST_COLLECTION, {
          params: { page: 1, pageSize: 1, order: "desc" },
        });
        setTotalCount(apiResponse?.data?.data?.totalCount);
        dispatch(setSingleCollection(apiResponse?.data?.data?.collections[0]));
        if (apiResponse?.data?.statusCode === 200) {
          const apiResponseGetTeam = await axios.get(GET_LATEST_COLLECTION_TEAM, {
            params: { page: 1, pageSize: 10, slug: apiResponse?.data?.data?.collections[0]?._id },
          });
          const apiResponseGetProduct = await axios.get(GET_LATEST_PRODUCTS, {
            params: { page: 1, pageSize: 5, order: "desc", slug: apiResponse?.data?.data?.collections[0]?._id },
          });
          if (apiResponseGetTeam?.data?.statusCode === 200) {
            setLatestCollectionData(apiResponseGetTeam?.data?.data);
          } else {
            setLatestCollectionData([]);
          }
          if (apiResponseGetProduct?.data?.statusCode === 200) {
            setProductsData(apiResponseGetProduct?.data?.data?.products);
            setProductStatusStates(apiResponseGetProduct?.data?.data?.productStatusStats);
          } else {
            setProductsData([]);
          }
        } else {
          setLatestCollectionData([]);
          setProductsData([]);
          toast.error(apiResponse?.data?.message);
        }
      } catch (error: Error) {
        toast.error(error?.message || t("someThingWrong"));
      } finally {
        stopLoading();
      }
    };
    fetcherLatestCollection();
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
              <h3 className="text-xl text-th-primary-hard font-bold mb-4 capitalize">
                {totalCount === 0 ? "" : latestCollectionData?.name}
              </h3>
              {productStatusStates?.length > 0 ? (
                <CollectionCountSection statistics={productStatusStates} />
              ) : (
                <CollectionPlaceholder />
              )}
            </div>
            {/* Card 2 */}
            {canCreateUser && (
              <div className="w-full md:w-2/5">
                <div className="bg-th-background flex flex-col justify-between p-4 md:p-6 rounded-xl">
                  <h3 className="text-xl text-th-primary-hard font-bold mb-4">{t("myTeam")}</h3>
                  {totalCount === 0 || latestCollectionData?.team?.length === 0 ? (
                    <TeamPlaceholder slug={`${latestCollectionData?._id}`} />
                  ) : (
                    <MyTeamSection slug={`${latestCollectionData?._id}`} collection={latestCollectionData} />
                  )}
                </div>
              </div>
            )}
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

export default DashboardPage;
