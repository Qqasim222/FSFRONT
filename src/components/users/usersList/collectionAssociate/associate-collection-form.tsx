import React, { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import useLoading from "@/common/hook/loading";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { AssociateCollectionFormSchema } from "@/common/config/schema";
import CustomButton from "@/components/common/button/custom-button";
import { toast } from "react-toastify";
import axios from "@/common/util/api/axios-public-client";
import Link from "next-intl/link";
import { COLLECTIONS } from "@/common/constant/local.constant";
import { Loader } from "@/components/common/placeholder/loader";

// Define types for Associate Collection Inputs
interface AssociateCollectionFormTypes {
  collection: string;
}
interface AssociateCollectionProps {
  onCancel: () => void;
  associatedUser: object;
}

const AssociateCollectionForm: React.FC<AssociateCollectionProps> = ({ onCancel, associatedUser }) => {
  const t = useTranslations("associateCollectionModle.form");
  const { loading, startLoading, stopLoading } = useLoading();
  const [collections, setCollections] = useState<{ id: string; name: string }[]>([]);
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<AssociateCollectionFormTypes>({
    resolver: yupResolver(AssociateCollectionFormSchema),
    mode: "all",
  });
  //   Handle Associate Collection Submit
  const onSubmit = async (data: AssociateCollectionFormTypes) => {
    try {
      startLoading();
      const simplefiedData = {
        id: data?.collection,
        collaborator: associatedUser?.id,
      };
      const apiResponse = await axios.patch(COLLECTIONS, JSON.stringify(simplefiedData));
      if (apiResponse?.data?.statusCode == 200) {
        toast.success(apiResponse?.data?.message);
        reset();
        onCancel();
      } else {
        toast.error(apiResponse?.data?.message);
      }
    } catch (error: ERROR) {
      toast.error(error?.message || t("someThingWrong"));
    } finally {
      stopLoading();
    }
  };
  // Fetch Not Associated Collection from the API and set them in state
  useEffect(() => {
    const fetchUnAssociateCollections = async () => {
      try {
        startLoading();
        const apiResponse = await axios.get(COLLECTIONS, { params: { exist: { collaborator: false } } });
        if (apiResponse?.data?.statusCode === 200) {
          const collections = apiResponse?.data?.data?.collections;
          const collectionObject = collections.map((collection: any) => ({
            id: collection?._id,
            name: collection?.name,
          }));
          const uniqueCollectionObject = Array.from(
            new Set(collectionObject.map((collection: any) => collection?.name)),
          ).map((name) => collectionObject.find((collection: any) => collection?.name === name));
          setCollections(uniqueCollectionObject?.filter(Boolean));
        } else {
          toast.error(apiResponse?.data?.message);
        }
      } catch (error: Error) {
        toast.error(error?.message || t("someThingWrong"));
      } finally {
        stopLoading();
      }
    };
    fetchUnAssociateCollections();
  }, []);
  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div className="w-full">
          {/* Form */}
          <form className="h-full w-full" onSubmit={handleSubmit(onSubmit)}>
            {/* First Name input */}
            <div className="flex flex-col mt-3 sm:m-0">
              {collections?.length > 0 ? (
                <>
                  <label htmlFor="collection" className="text-th-secondary-medium font-semibold">
                    {t("collection")}
                    <span className="text-th-danger-medium ps-1">*</span>
                  </label>
                  <Controller
                    name="collection"
                    defaultValue=""
                    control={control}
                    render={({ field }) => (
                      <select
                        {...field}
                        className="select-dropdown-icon-style w-full my-2 rounded-md border bg-th-grey-light py-2.5 md:py-3.5 lg:py-3 2xl:py-4 pl-2 leading-normal placeholder-th-secondary-light text-th-secondary-medium outline-none"
                      >
                        <option value="" disabled>
                          {t("choose")}
                        </option>
                        {collections.map((collection) => (
                          <option key={collection?.id} value={collection?.id}>
                            {collection?.name}
                          </option>
                        ))}
                      </select>
                    )}
                  />
                  {errors.collection && <span className="text-th-danger-medium">{t(errors.collection.message)}</span>}
                </>
              ) : (
                <div className="flex md:py-4 flex-col items-center justify-center">
                  <div
                    className="flex p-4 mb-4 text-sm text-th-primary-hard rounded-lg bg-th-primary-medium"
                    role="alert"
                  >
                    <p>{t("noCollectionsAvailable")}</p>
                  </div>
                  <Link
                    href={`/collections?user=${JSON.stringify(associatedUser)}`}
                    className="rounded-md bg-th-primary-hard py-3 lg:py-2.5 px-6 text-xs lg:text-base font-semibold text-th-primary-light outline-none transition duration-150 ease-in-out hover:shadow-lg"
                  >
                    {t("addNewCollection")}
                  </Link>
                </div>
              )}
            </div>
            {/* Actions Buttons */}
            <div className={`flex space-x-4 mt-2 md:mt-4 ${collections?.length === 0 ? "hidden" : "block"}`}>
              {/* Save button */}
              <CustomButton
                className={`mt-4 rounded-md bg-th-primary-hard py-3 lg:py-2.5 px-6 text-xs lg:text-base font-semibold text-th-primary-light outline-none transition duration-150 ease-in-out hover:shadow-lg ${
                  loading && "cursor-not-allowed"
                }`}
                type="submit"
                label={loading ? t("save") + "..." : t("save")}
                disabled={!isDirty || loading}
              />
              {/* Cancel button */}
              <CustomButton
                className="mt-4 rounded-md border border-th-primary-medium py-3 lg:py-2.5 px-6 text-xs lg:text-base font-semibold text-th-grey-hard outline-none transition duration-150 ease-in-out hover:shadow-lg"
                type="button"
                label={t("cancel")}
                onClick={() => {
                  reset();
                  onCancel();
                }}
              />
            </div>
          </form>
        </div>
      )}
    </>
  );
};

export default AssociateCollectionForm;
