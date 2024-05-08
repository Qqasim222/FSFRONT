"use client";
import useLoading from "@/common/hook/loading";
import { COLLECTIONS } from "@/common/constant/local.constant";
import CollectionListTable from "@/components/collections/collection-list-table";
import CollectionModal from "@/components/collections/collection-modal";
import CollectionSearchForm from "@/components/collections/collection-search-form";
import CustomButton from "@/components/common/button/custom-button";
import axios from "@/common/util/api/axios-public-client";
import { useTranslations } from "next-intl";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { selectSessionInfo } from "@/store/slices/authSlice";
import { useSearchParams } from "next/navigation";
import { GET_COUNTRY_LIST } from "@/common/constant/local.constant";

const CollectionPage = () => {
  const t = useTranslations("collectionPage");
  const [isAddCollectionModalOpen, setAddCollectionModalOpen] = useState<boolean>(false);
  const [totalCount, setTotalCount] = useState(0);
  const [countriesList, setCountriesList] = useState([]);
  const { loading, startLoading, stopLoading } = useLoading();
  const [collectionData, setCollectionData] = useState([]);

  const sessionInfo = useSelector(selectSessionInfo);
  const searchParams = useSearchParams();
  // Collection Permissions
  const superAdminPermissions = sessionInfo?.role?.permissions === "*";
  let canCreateCollection = false;
  let canReadCollection = false;
  let canUpdateCollection = false;
  let canDeleteCollection = false;
  if (superAdminPermissions) {
    canCreateCollection = true;
    canReadCollection = true;
    canUpdateCollection = true;
    canDeleteCollection = true;
  } else {
    const permissions = sessionInfo?.role?.permissions?.Collection;
    if (permissions) {
      ({
        ["can-create-collection"]: canCreateCollection,
        ["can-read-collection"]: canReadCollection,
        ["can-update-collection"]: canUpdateCollection,
        ["can-delete-collection"]: canDeleteCollection,
      } = permissions || {});
    }
  }
  // Modal handle
  const handleAddCollectionModal = () => {
    setAddCollectionModalOpen(true);
  };
  const handleCloseModal = () => {
    setAddCollectionModalOpen(false);
  };
  // Handle Collection Update
  const handleCollectionUpdate = async (newPage: number = 1, filters: any) => {
    try {
      startLoading();
      const apiResponse = await axios.get(COLLECTIONS, {
        params: { page: newPage, pageSize: 10, order: "desc", ...filters },
      });
      if (apiResponse?.data?.statusCode === 200) {
        setCollectionData(apiResponse?.data?.data?.collections);
        setTotalCount(apiResponse?.data?.data?.totalCount);
      } else {
        toast.error(apiResponse?.data?.message);
      }
    } catch (error: any) {
      toast.error(error?.message || t("someThingWrong"));
    } finally {
      stopLoading();
    }
  };
  //fetch countries list
  const fetchCountryData = async () => {
    try {
      const apiResponse = await axios.get(GET_COUNTRY_LIST);
      if (apiResponse?.data?.statusCode === 200) {
        setCountriesList(apiResponse?.data?.data?.countries);
      } else {
        toast.error(apiResponse?.data?.message);
      }
    } catch (error: any) {
      toast.error(error?.message || t("someThingWrong"));
    } finally {
    }
  };

  useEffect(() => {
    if (searchParams?.has("user")) {
      handleAddCollectionModal();
    }
    fetchCountryData();
  }, []);

  return (
    <section>
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <h3 className="text-xl text-th-primary-hard font-bold mb-4">{t("collections")}</h3>
          {canCreateCollection && (
            <div className="text-xl text-th-primary-hard mb-4">
              <CustomButton
                className="w-full rounded-md bg-th-primary-hard py-2 px-4 text-xs lg:text-base font-bold text-th-primary-light outline-none transition duration-150 ease-in-out hover:shadow-lg"
                type="button"
                label={t("addCollection")}
                onClick={handleAddCollectionModal}
              />
              <CollectionModal
                isOpen={isAddCollectionModalOpen}
                onCancel={handleCloseModal}
                onCollectionListUpdate={handleCollectionUpdate}
                countriesList={countriesList}
              />
            </div>
          )}
        </div>
        {canReadCollection && (
          <>
            <CollectionSearchForm
              onSearchSubmit={handleCollectionUpdate}
              collectionData={collectionData}
              countriesList={countriesList}
            />
            <CollectionListTable
              canUpdateCollection={canUpdateCollection}
              canDeleteCollection={canDeleteCollection}
              collectionData={collectionData}
              onCollectionListUpdate={handleCollectionUpdate}
              isLoading={loading}
              totalCount={totalCount}
              countriesList={countriesList}
            />
          </>
        )}
      </div>
    </section>
  );
};
export default CollectionPage;
