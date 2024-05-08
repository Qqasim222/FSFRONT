import React, { useEffect, useState } from "react";
import NoResultFound from "@/components/common/placeholder/no-result-found";
import CustomButton from "@/components/common/button/custom-button";
import { useForm, Controller } from "react-hook-form";
import { useTranslations } from "next-intl";
import axios from "axios";
import useLoading from "@/common/hook/loading";
import { GET_PRODUCT_GROUP } from "@/common/constant/local.constant";
import { toast } from "react-toastify";
import GroupSearchDoubleInputField from "../generic-fields/group-search-input";
import RecursiveListSec from "../generic-fields/generic-recursive-list";
import { Loader } from "@/components/common/placeholder/loader";

// Product Group List Table Props
interface GroupListTabSecProps {
  productsData: any;
  editMode: boolean;
  tabKey: string;
  structureDummyData?: any;
}

const GroupListTabSec: React.FC<GroupListTabSecProps> = ({ productsData, editMode, tabKey, structureDummyData }) => {
  const t = useTranslations("productDetailPage.productDetailTabsSec.nutrationInfoPanel");
  const { loading, startLoading, stopLoading } = useLoading();
  const [groupData, setGroupData] = useState([]);
  const [searchValues, setSearchValues] = useState("");
  // Get Default Values Method
  const getDefaultValue = () => {
    const fields = structureDummyData ? Object?.keys(structureDummyData) : [];
    const defaultValues: any = {};
    fields?.map((element: any) => {
      const pathArray = element?.split(".");
      const arrayPath = pathArray?.map((key) => `['${key}']`);
      try {
        const result = arrayPath.join("");
        const valueFunction = new Function("data", "return data" + result);
        defaultValues[structureDummyData[element].field] = valueFunction(productsData);
      } catch (error) {
        defaultValues[element] = undefined;
      }
    });
    return defaultValues;
  };
  // Groups Meta Data Fetch
  const fetchProductGroups = async (params: any) => {
    try {
      startLoading();
      const apiResponse = await axios.get(GET_PRODUCT_GROUP, {
        params: params || {},
      });
      if (apiResponse?.data?.statusCode === 200) {
        setGroupData(apiResponse?.data?.data?.result);
      }
    } catch (error: Error) {
      toast.error(error?.message || t("someThingWrong"));
    } finally {
      stopLoading();
    }
  };

  useEffect(() => {
    fetchProductGroups(null);
    reset(getDefaultValue());
  }, [structureDummyData, tabKey]);
  const { control, handleSubmit, reset } = useForm({
    defaultValues: getDefaultValue(),
    // resolver: yupResolver(getCustomSchema(productsData)),
    mode: "all",
  });

  const onSubmit = async () => {
    if (searchValues) {
      fetchProductGroups({ gctName: searchValues?.split(",")[0], masterGroupCode: searchValues?.split(",")[1] });
    }
  };
  const handleDiscardChanges = () => {
    reset(getDefaultValue());
    fetchProductGroups(null);
    setSearchValues("");
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="bg-th-background p-2 rounded-xl">
        <div className="relative overflow-auto max-h-screen rounded-lg">
          {Object?.keys(structureDummyData)?.length > 0 ? (
            <table className="w-full text-sm text-left bg-th-primary-medium">
              <tbody className="bg-th-background border">
                {Object?.keys(structureDummyData)?.map((item, index) => (
                  <tr key={index} className="border-b font-medium text-th-secondary-medium hover:bg-th-primary-light">
                    <td
                      className="px-3 py-4 whitespace-nowrap 
                      text-th-primary-hard bg-th-primary-medium border-b border-th-primary-light"
                    >
                      {t(structureDummyData[item]?.field) || "N/A"}
                    </td>
                    <td className="px-3 py-0 whitespace-nowrap text-xs">
                      <Controller
                        name={structureDummyData[item]?.field}
                        control={control}
                        render={({ fieldState }) => {
                          return (
                            <div>
                              {structureDummyData[item]?.type === "DoubleInput" && (
                                <GroupSearchDoubleInputField
                                  onSelect={(values) => {
                                    setSearchValues(values);
                                  }}
                                  editMode={editMode}
                                  clearValues={searchValues}
                                />
                              )}
                              {fieldState?.error && (
                                <p className="text-th-danger-medium text-xs">{fieldState?.error?.message}</p>
                              )}
                            </div>
                          );
                        }}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <NoResultFound />
          )}
          <div className="w-full my-5">
            {loading ? (
              <Loader />
            ) : (
              <RecursiveListSec
                data={groupData}
                masterCode={productsData?.info?.groups?.masterFoodGroupCode}
                editMode={editMode}
              />
            )}
          </div>
          {/* Action buttons */}
          {editMode && (
            <div className="flex space-x-4 my-2">
              <CustomButton
                className={
                  "mt-4 rounded-md bg-th-primary-hard py-2 px-4 text-xs lg:text-base font-bold text-th-primary-light focus:outline focus:outline-th-primary-medium transition duration-150 ease-in-out hover:shadow-lg"
                }
                type="submit"
                label={t("Save")}
              />
              <CustomButton
                className="mt-4 rounded-md  border border-th-primary-medium py-2 px-4 text-xs lg:text-base font-bold text-th-grey-hard focus:outline focus:outline-th-primary-medium transition duration-150 ease-in-out hover:shadow-lg"
                type="button"
                label={t("Cancel")}
                onClick={handleDiscardChanges}
              />
            </div>
          )}
        </div>
      </div>
    </form>
  );
};

export default GroupListTabSec;
