import React, { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import NoResultFound from "@/components/common/placeholder/no-result-found";
import { FaCirclePlus, FaLessThan } from "react-icons/fa6";
import { useForm } from "react-hook-form";
import axios from "axios";
import CustomButton from "@/components/common/button/custom-button";
import useLoading from "@/common/hook/loading";
import { toast } from "react-toastify";
import { GET_PRODUCT_NIPTYPE } from "@/common/constant/local.constant";
import { Loader } from "@/components/common/placeholder/loader";

interface NutritionInfoTableSecProps {
  nutritionData: any[];
  editMode: boolean;
}
const nutrationItem = {
  value1: "",
  value2: "",
  value3: "",
  value4: "",
  value5: "",
};
const NutritionInfoTableSec: React.FC<NutritionInfoTableSecProps> = ({ nutritionData, editMode }) => {
  const t = useTranslations("productDetailPage.productDetailTabsSec.nutrationInfoPanel");
  const { loading, startLoading, stopLoading } = useLoading();
  const [nipTypeData, setNipTypeData] = useState([]);
  const [productsNutritionData, setProductsNutritionData] = useState(new Array(2).fill(nutrationItem));
  const { handleSubmit } = useForm({
    // defaultValues: getDefaultValues(nutritionData),
  });
  // product section column
  const tableColumns = [
    t("tableColumns.name"),
    t("tableColumns.perGram"),
    t("tableColumns.perServe"),
    t("tableColumns.preparedGram"),
    t("tableColumns.preparedServe"),
  ];
  // Add a new item
  const handleAddNutrition = () => {
    const newItem = {};
    setProductsNutritionData((prevProductsData) => [...prevProductsData, newItem]);
  };
  // Set Data To State
  const setDataToState = () => {
    const newData = nutritionData?.map((item) => ({
      value1: item?.name,
      value2: item?.valuePer_100 || "0",
      value3: item?.valuePerServe || "0",
      value4: item?.ltPrepared || "0",
      value5: item?.ltPreparedServe || "0",
    }));
    setProductsNutritionData(newData?.slice(0, 10));
  };
  useEffect(() => {
    if (nutritionData) setDataToState();
  }, [nutritionData]);
  // Meta Data Fetch
  useEffect(() => {
    const fetchProductNipType = async () => {
      try {
        startLoading();
        const apiResponse = await axios.get(GET_PRODUCT_NIPTYPE);
        if (apiResponse?.data?.statusCode === 200) {
          setNipTypeData(apiResponse?.data?.data?.nipTypes);
        }
      } catch (error: Error) {
        toast.error(error?.message || t("someThingWrong"));
      } finally {
        stopLoading();
      }
    };
    fetchProductNipType();
  }, []);
  // on change value
  const onChangeValue = (field, value, index) => {
    const tempArray = [...productsNutritionData];
    tempArray[index][field] = value;
    setProductsNutritionData(tempArray);
  };
  // Handle Submit
  const onSubmit = () => {};
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="bg-th-background pt-5 rounded-xl">
        <h3 className="text-xl text-th-primary-hard font-bold flex items-center mb-3">{t("nutrationPanel")}</h3>
        <div className="relative overflow-x-auto rounded-lg">
          {productsNutritionData?.length > 0 ? (
            <>
              {loading ? (
                <Loader />
              ) : (
                <>
                  {" "}
                  <table className="w-full text-sm text-left bg-th-primary-medium">
                    <thead className="text-sm text-th-primary-hard capitalize ">
                      <tr>
                        {tableColumns?.map((column, index) => (
                          <th
                            key={index}
                            scope="col"
                            className="px-3 border border-th-primary-light py-4 whitespace-nowrap"
                          >
                            {column}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="bg-th-background border">
                      {productsNutritionData?.map((item, index) => {
                        return (
                          <tr
                            key={item?._id}
                            className="border-b font-medium text-th-secondary-medium hover:bg-th-primary-light"
                          >
                            <td className="px-3 py-0 whitespace-nowrap border w-full">
                              {/* <Controller
                          name={`value1`}
                          control={control}
                          defaultValue=""
                          render={({ field }) => ( */}
                              <span className="flex items-center gap-x-2">
                                <select
                                  // {...field}
                                  className={`w-[200px] my-2 rounded-md border bg-th-grey-light py-2 pl-2 leading-normal placeholder-th-secondary-light ${
                                    !editMode
                                      ? "text-th-neutral-light cursor-not-allowed outline-none"
                                      : "text-th-secondary-medium focus:outline focus:outline-th-primary-medium"
                                  }`}
                                  disabled={!editMode}
                                >
                                  {/* <option value={""} disabled selected>
                                  {t("choose")}
                                </option> */}
                                  {nipTypeData?.map((dropdownOptions: any) => (
                                    <option
                                      key={dropdownOptions?._id}
                                      value={dropdownOptions?.name}
                                      selected={dropdownOptions?.name == item?.value1}
                                    >
                                      {dropdownOptions?.name}
                                    </option>
                                  ))}
                                </select>
                              </span>
                              {/* )}
                        /> */}
                            </td>
                            <td className="px-3 py-0 whitespace-nowrap border">
                              {/* <Controller
                          name={"value2"}
                          control={control}
                          // defaultValue={""}
                          render={({ field }) => ( */}
                              <span className="flex items-center gap-x-2">
                                <span
                                  className={`bg-th-background shadow-md py-2 px-1 rounded-md ${
                                    !editMode
                                      ? "text-th-neutral-light bg-th-background cursor-not-allowed"
                                      : "bg-th-primary-hard text-th-primary-light"
                                  }`}
                                >
                                  <FaLessThan />
                                </span>
                                <input
                                  key={index}
                                  type="number"
                                  // {...field}
                                  value={item?.value2 || ""}
                                  onChange={(e) => onChangeValue("value2", e.currentTarget.value, index)}
                                  readOnly={!editMode}
                                  className={`w-full my-2 rounded-md border bg-th-grey-light py-1.5 pl-2 leading-normal placeholder-th-secondary-light ${
                                    !editMode
                                      ? "text-th-neutral-light cursor-not-allowed outline-none"
                                      : "text-th-secondary-medium focus:outline focus:outline-th-primary-medium"
                                  }`}
                                />
                              </span>
                              {/* )}
                        /> */}
                            </td>
                            <td className="px-3 py-0 whitespace-nowrap border">
                              {/* <Controller
                          name={`value3`}
                          control={control}
                          // defaultValue={""}
                          render={({ field }) => ( */}
                              <span className="flex items-center gap-x-2">
                                <span
                                  className={`bg-th-background shadow-md py-2 px-1 rounded-md ${
                                    !editMode
                                      ? "text-th-neutral-light bg-th-background cursor-not-allowed"
                                      : "bg-th-primary-hard text-th-primary-light"
                                  }`}
                                >
                                  <FaLessThan />
                                </span>
                                <input
                                  type="number"
                                  // {...field}
                                  value={item?.value3 || ""}
                                  onChange={(e) => onChangeValue("value3", e.currentTarget.value, index)}
                                  readOnly={!editMode}
                                  className={`w-full my-2 rounded-md border bg-th-grey-light py-1.5 pl-2 leading-normal placeholder-th-secondary-light ${
                                    !editMode
                                      ? "text-th-neutral-light cursor-not-allowed outline-none"
                                      : "text-th-secondary-medium focus:outline focus:outline-th-primary-medium"
                                  }`}
                                />
                              </span>
                              {/* )}
                        /> */}
                            </td>
                            <td className="px-3 py-0 whitespace-nowrap border">
                              {/* <Controller
                          name={`value4`}
                          control={control}
                          // defaultValue={""}
                          render={({ field }) => ( */}
                              <span className="flex items-center gap-x-2">
                                <span
                                  className={`bg-th-background shadow-md py-2 px-1 rounded-md ${
                                    !editMode
                                      ? "text-th-neutral-light bg-th-background cursor-not-allowed"
                                      : "bg-th-primary-hard text-th-primary-light"
                                  }`}
                                >
                                  <FaLessThan />
                                </span>
                                <input
                                  type="number"
                                  // {...field}
                                  value={item?.value4 || ""}
                                  onChange={(e) => onChangeValue("value4", e.currentTarget.value, index)}
                                  readOnly={!editMode}
                                  className={`w-full my-2 rounded-md border bg-th-grey-light py-1.5 pl-2 leading-normal placeholder-th-secondary-light ${
                                    !editMode
                                      ? "text-th-neutral-light cursor-not-allowed outline-none"
                                      : "text-th-secondary-medium focus:outline focus:outline-th-primary-medium"
                                  }`}
                                />
                              </span>
                              {/* )}
                        /> */}
                            </td>
                            <td className="px-3 py-0 whitespace-nowrap border">
                              {/* <Controller
                          name={`value5`}
                          control={control}
                          // defaultValue={ ""}
                          render={({ field }) => ( */}
                              <span className="flex items-center gap-x-2">
                                <span
                                  className={`bg-th-background shadow-md py-2 px-1 rounded-md ${
                                    !editMode
                                      ? "text-th-neutral-light bg-th-background cursor-not-allowed"
                                      : "bg-th-primary-hard text-th-primary-light"
                                  }`}
                                >
                                  <FaLessThan />
                                </span>
                                <input
                                  type="number"
                                  // {...field}
                                  value={item?.value5 || ""}
                                  onChange={(e) => onChangeValue("value5", e.currentTarget.value, index)}
                                  readOnly={!editMode}
                                  className={`w-full my-2 rounded-md border bg-th-grey-light py-1.5 pl-2 leading-normal placeholder-th-secondary-light ${
                                    !editMode
                                      ? "text-th-neutral-light cursor-not-allowed outline-none"
                                      : "text-th-secondary-medium focus:outline focus:outline-th-primary-medium"
                                  }`}
                                />
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                  <CustomButton
                    className={`relative  mt-4 flex items-center justify-center whitespace-nowrap rounded-md bg-th-primary-hard py-1.5 px-2 text-xs lg:text-base font-bold text-th-primary-light outline-none transition duration-150 ease-in-out hover:shadow-lg ${
                      !editMode && "cursor-not-allowed bg-th-secondary-light"
                    }`}
                    type="button"
                    label="Add Nutrition"
                    endIcon={<FaCirclePlus className="text-sm" />}
                    disabled={!editMode}
                    onClick={handleAddNutrition}
                  />
                </>
              )}
            </>
          ) : (
            <NoResultFound />
          )}
        </div>
        {/* Action buttons */}
        {/* {editMode && (
          <div className="flex space-x-4 my-2">
            <CustomButton
              className={
                "mt-4 rounded-md bg-th-primary-hard py-2 px-4 text-xs lg:text-base font-bold text-th-primary-light focus:outline focus:outline-th-primary-medium transition duration-150 ease-in-out hover:shadow-lg"
              }
              type="button"
              onClick={onSubmit}
              label="Save"
            />
            <CustomButton
              className="mt-4 rounded-md  border border-th-primary-medium py-2 px-4 text-xs lg:text-base font-bold text-th-grey-hard focus:outline focus:outline-th-primary-medium transition duration-150 ease-in-out hover:shadow-lg"
              type="button"
              label="Cancel"
            />
          </div>
        )} */}
      </div>
    </form>
  );
};

export default NutritionInfoTableSec;
