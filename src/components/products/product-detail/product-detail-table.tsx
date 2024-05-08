import React, { useEffect, useState } from "react";
import NoResultFound from "@/components/common/placeholder/no-result-found";
import CustomButton from "@/components/common/button/custom-button";
import { useForm, Controller } from "react-hook-form";
import { useTranslations } from "next-intl";
import MultiSelectSearchField from "./generic-fields/generic-multiselect-search";
import axios from "axios";
import { toast } from "react-toastify";
import useLoading from "@/common/hook/loading";
import {
  GET_PRODUCT_ALLERGEN,
  GET_PRODUCT_CLAIMS,
  GET_PRODUCT_RETAILER,
  UPDATE_SINGLE_PRODUCT,
} from "@/common/constant/local.constant";
import NutritionInfoTableSec from "./nutration-info-table";
import CustomGenericChildFieldsDataComponent from "./generic-fields/generic-child-fields-data";
import GenericChildFields from "./generic-fields/generic-child-fields";
import DatePicker from "react-datepicker";
import { FaCalendarDays } from "react-icons/fa6";

// Product Detail Table Props
interface ProductDetailTableSecProps {
  productsData: any;
  editMode: boolean;
  tabKey: string;
  structureDummyData?: any;
}

const ProductDetailTableSec: React.FC<ProductDetailTableSecProps> = ({
  productsData,
  editMode,
  tabKey,
  structureDummyData,
}) => {
  const t = useTranslations("productDetailPage.productDetailTabsSec.productTabs.productTabFields");
  const { startLoading, stopLoading } = useLoading();
  const [claimData, setClaimData] = useState([]);
  const [allergenData, setAllergenData] = useState([]);
  const [retailerData, setRetailerData] = useState([]);
  const [retailerDataTemp, setRetailerDataTemp] = useState([]);
  const [dataSourceTemp, setDataSourceTemp] = useState([]);
  const [claimsOnPackTemp, setClaimsOnPackTemp] = useState([]);
  const [claimsOnPackWithValuesTemp, setClaimsOnPackWithValuesTemp] = useState([]);
  const [retailerProductCodeTemp, setRetailerProductCodeTemp] = useState([]);
  const [preparationInstructionsTemp, setPreparationInstructionsTemp] = useState([]);
  const [genericFieldsMainObjects, setGenericFieldsMainObjects] = useState({
    retailer: {},
    dataSource: {},
    claimProduct: {},
    claimsOnPackWithValues: {},
    retailerProductCode: {},
    preparationInstructions: {},
  });
  // Handlers For Generic fields
  const handleGenericFields = (main: string, key: string, value = null) => {
    const tempObject = genericFieldsMainObjects;
    tempObject[main][key] = value;
    setGenericFieldsMainObjects(tempObject);
  };
  const handleRetailerDataTemp = (data) => {
    const tempState = [...retailerDataTemp];
    tempState.push(data);
    setRetailerDataTemp(tempState);
  };
  const handleDataSourceTemp = (data) => {
    const tempState = [...dataSourceTemp];
    tempState.push(data);
    setDataSourceTemp(tempState);
  };
  const handleClaimsOnPackTemp = (data) => {
    const tempState = [...claimsOnPackTemp];
    tempState.push(data);
    setClaimsOnPackTemp(tempState);
  };
  const handleClaimsOnPackWithValuesTemp = (data) => {
    const tempState = [...claimsOnPackWithValuesTemp];
    tempState.push(data);
    setClaimsOnPackWithValuesTemp(tempState);
  };
  const handleRetailerProductCodeTemp = (data) => {
    const tempState = [...retailerProductCodeTemp];
    tempState.push(data);
    setRetailerProductCodeTemp(tempState);
  };
  const handlePreparationInstructionsTemp = (data) => {
    const tempState = [...preparationInstructionsTemp];
    tempState.push(data);
    setPreparationInstructionsTemp(tempState);
  };
  useEffect(() => {
    setRetailerDataTemp(productsData?.retailers || []);
    setDataSourceTemp(productsData?.dataSource || []);
    setClaimsOnPackTemp(productsData?.claimProduct || []);
    setClaimsOnPackWithValuesTemp(productsData?.claimProduct || []);
    setRetailerProductCodeTemp(productsData?.retailerProductCode || []);
    setPreparationInstructionsTemp(productsData?.preparationInstructions || []);
  }, [productsData]);
  // Get Default Values Method
  const getDefaultValue = () => {
    const fields = structureDummyData ? Object?.keys(structureDummyData) : [];
    const defaultValues: any = {};
    fields?.map((element: any) => {
      const pathArray = element?.split(".");
      const arrayPath = pathArray?.map((key) => `['${key}']`);
      try {
        // Convert the string into a function
        const result = arrayPath.join("");
        const valueFunction = new Function("data", "return data" + result);
        defaultValues[structureDummyData[element]?.key] = valueFunction(productsData);
      } catch (error) {
        defaultValues[element] = undefined;
      }
    });
    return defaultValues;
  };
  // Meta Data Fetch
  useEffect(() => {
    const fetchProductClaim = async () => {
      try {
        startLoading();
        const apiResponse = await axios.get(GET_PRODUCT_CLAIMS);
        if (apiResponse?.data?.statusCode === 200) {
          setClaimData(apiResponse?.data?.data?.result);
        }
      } catch (error: Error) {
        toast.error(error?.message || t("someThingWrong"));
      } finally {
        stopLoading();
      }
    };
    const fetchProductAllergen = async () => {
      try {
        startLoading();
        const apiResponse = await axios.get(GET_PRODUCT_ALLERGEN);
        if (apiResponse?.data?.statusCode === 200) {
          setAllergenData(apiResponse?.data?.data?.result);
        }
      } catch (error: Error) {
        toast.error(error?.message || t("someThingWrong"));
      } finally {
        stopLoading();
      }
    };
    const fetchProductRetailer = async () => {
      try {
        startLoading();
        const apiResponse = await axios.get(GET_PRODUCT_RETAILER);
        if (apiResponse?.data?.statusCode === 200) {
          setRetailerData(apiResponse?.data?.data?.result);
        }
      } catch (error: Error) {
        toast.error(error?.message || t("someThingWrong"));
      } finally {
        stopLoading();
      }
    };
    fetchProductClaim();
    fetchProductAllergen();
    fetchProductRetailer();
    reset(getDefaultValue());
  }, [, structureDummyData, tabKey]);

  const { control, handleSubmit, reset } = useForm({
    defaultValues: getDefaultValue(),
    // resolver: yupResolver(getCustomSchema(productsData)),
    mode: "all",
  });

  const onSubmit = async (data: any) => {
    try {
      const simplifiedData = {
        productId: productsData?._id,
        data: data,
      };
      const apiResponse = await axios.patch(UPDATE_SINGLE_PRODUCT, JSON.stringify(simplifiedData));
      if (apiResponse?.data?.statusCode == 200) {
        toast.success(apiResponse?.data?.message);
      } else {
        toast.error(apiResponse?.data?.message);
      }
    } catch (error: Error) {
      toast.error(error?.message || t("someThingWrong"));
    }
  };
  const handleDiscardChanges = () => {
    reset(getDefaultValue());
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="bg-th-background p-2 rounded-xl">
        <div className="relative overflow-auto max-h-screen rounded-lg">
          {Object?.keys(structureDummyData)?.length > 0 ? (
            <table className="w-full text-sm text-left bg-th-primary-medium">
              <tbody className="bg-th-background border">
                {Object?.keys(structureDummyData)?.map((item, index) => (
                  <React.Fragment key={index}>
                    {structureDummyData[item].isParent && (
                      <tr
                        key={index}
                        className="border-b font-medium text-th-secondary-medium hover:bg-th-primary-light"
                      >
                        <td
                          className="px-3 py-4 whitespace-nowrap 
                      text-th-primary-hard bg-th-primary-medium border-b border-th-primary-light"
                        >
                          {structureDummyData[item]?.field || "N/A"}
                        </td>
                        <td className="px-3 py-0 whitespace-nowrap text-xs">
                          <Controller
                            name={structureDummyData[item]?.key}
                            control={control}
                            render={({ field, fieldState }) => {
                              return (
                                <div>
                                  {/* Normal fields */}
                                  {structureDummyData[item]?.type == "Text" && (
                                    <input
                                      {...field}
                                      className={`w-full my-2 rounded-md border bg-th-grey-light py-2 pl-2 leading-normal placeholder-th-secondary-light ${
                                        !editMode
                                          ? "text-th-neutral-light cursor-not-allowed outline-none"
                                          : "text-th-secondary-medium focus:outline focus:outline-th-primary-medium"
                                      }`}
                                      type="text"
                                      readOnly={!editMode || structureDummyData[item]?.rules?.isReadonly == true}
                                    />
                                  )}
                                  {structureDummyData[item]?.type == "Radio" && (
                                    <>
                                      {structureDummyData[item]?.data.map((radioValues, index) => {
                                        return (
                                          <label key={index + field?.value} className="flex items-center my-1">
                                            <input
                                              type="radio"
                                              {...field}
                                              className="form-radio accent-th-primary-hard focus:ring-th-primary-hard"
                                              disabled={!editMode}
                                              defaultChecked={field?.value == radioValues}
                                            />
                                            <span
                                              className={`ml-2 ${
                                                !editMode
                                                  ? "cursor-not-allowed text-th-neutral-light outline-none"
                                                  : "focus:outline focus:outline-th-primary-medium"
                                              }`}
                                            >
                                              {radioValues}
                                            </span>
                                          </label>
                                        );
                                      })}
                                    </>
                                  )}
                                  {structureDummyData[item]?.type === "Dropdown" && (
                                    <select
                                      {...field}
                                      className={`w-[200px] lg:w-full my-2 rounded-md border bg-th-grey-light py-2.5 pl-1 leading-normal placeholder-th-secondary-light text-th-secondary-medium ${
                                        !editMode
                                          ? "cursor-not-allowed outline-none"
                                          : "focus:outline focus:outline-th-primary-medium"
                                      }`}
                                      disabled={!editMode}
                                      onChange={(e) => field.onChange(e.currentTarget.value)}
                                    >
                                      <option disabled selected>
                                        Choose
                                      </option>
                                      {structureDummyData[item]?.data?.map((dropdownOptions) => (
                                        <option
                                          key={dropdownOptions}
                                          value={dropdownOptions}
                                          selected={field?.value === dropdownOptions}
                                        >
                                          {dropdownOptions}
                                        </option>
                                      ))}
                                    </select>
                                  )}
                                  {structureDummyData[item]?.type == "Date" && (
                                    <DatePicker
                                      showIcon
                                      toggleCalendarOnIconClick
                                      icon={
                                        <FaCalendarDays className="text-th-primary-hard mt-[12px] md:mt-[14px] lg:mt-[14px]" />
                                      }
                                      className="w-full	my-2 h-[36px] rounded-md border bg-th-grey-light px-2 leading-normal placeholder-th-secondary-light text-th-secondary-medium outline-none"
                                      readOnly={!editMode}
                                      selected={
                                        field?.value && new Date(field?.value).toString() !== "Invalid Date"
                                          ? new Date(field?.value)?.toISOString()?.split("T")[0]
                                          : ""
                                      }
                                      onChange={field?.onChange}
                                      placeholderText="mm/dd/yyyy"
                                    />
                                  )}
                                  {structureDummyData[item]?.type == "Checkbox" && (
                                    <label className="inline-flex items-center">
                                      <input
                                        type="checkbox"
                                        {...field}
                                        checked={field.value}
                                        className={`form-checkbox accent-th-primary-hard focus:ring-th-primary-hard ${
                                          !editMode
                                            ? "cursor-not-allowed text-th-neutral-light outline-none"
                                            : "focus:outline focus:outline-th-primary-medium"
                                        }`}
                                        disabled={!editMode}
                                      />
                                    </label>
                                  )}
                                  {structureDummyData[item]?.type == "Numeric" && (
                                    <input
                                      {...field}
                                      className={`w-full my-2 rounded-md border bg-th-grey-light py-2 pl-2 leading-normal placeholder-th-secondary-light ${
                                        !editMode
                                          ? "text-th-neutral-light cursor-not-allowed outline-none"
                                          : "text-th-secondary-medium focus:outline focus:outline-th-primary-medium"
                                      }`}
                                      type="number"
                                      readOnly={!editMode}
                                    />
                                  )}
                                  {/* Custom Generic Child Fields Components */}
                                  {structureDummyData[item]?.type === "GenericChildFields" && (
                                    <>
                                      <div className="flex">
                                        {structureDummyData[item]?.children?.map((subItem, innerIndex) => (
                                          <GenericChildFields
                                            key={innerIndex}
                                            structureDummyData={structureDummyData}
                                            subItem={subItem}
                                            innerIndex={innerIndex}
                                            editMode={editMode}
                                            genericHandler={handleGenericFields}
                                            mainObj={item}
                                            optionsData={
                                              structureDummyData[subItem]?.isApiCall === "claims"
                                                ? claimData
                                                : structureDummyData[subItem]?.isApiCall === "retailer"
                                                ? retailerData
                                                : structureDummyData[subItem]?.isApiCall === "allergen"
                                                ? allergenData
                                                : structureDummyData[subItem]?.data?.map((item, index) => ({
                                                    id: index,
                                                    name: item,
                                                  }))
                                            }
                                          />
                                        ))}
                                      </div>
                                      <CustomGenericChildFieldsDataComponent
                                        optionsData={
                                          structureDummyData[item]?.isApiCall === "claims"
                                            ? claimData
                                            : structureDummyData[item]?.isApiCall === "retailer"
                                            ? retailerData
                                            : structureDummyData[item]?.isApiCall === "allergen"
                                            ? allergenData
                                            : structureDummyData[item]?.data?.map((item, index) => ({
                                                id: index,
                                                name: item,
                                              }))
                                        }
                                        editMode={editMode}
                                        validationFields={
                                          genericFieldsMainObjects[
                                            item === "retailer"
                                              ? "retailer"
                                              : item === "dataSource"
                                              ? "dataSource"
                                              : item === "claimProduct"
                                              ? "claimProduct"
                                              : item === "claimsOnPackWithValues"
                                              ? "claimsOnPackWithValues"
                                              : item === "retailerProductCode"
                                              ? "retailerProductCode"
                                              : "preparationInstructions"
                                          ] || {}
                                        }
                                        productDefaultData={
                                          item === "retailer"
                                            ? retailerDataTemp
                                            : item === "dataSource"
                                            ? dataSourceTemp
                                            : item === "claimProduct"
                                            ? claimsOnPackTemp
                                            : item === "claimsOnPackWithValues"
                                            ? claimsOnPackWithValuesTemp
                                            : item === "retailerProductCode"
                                            ? retailerProductCodeTemp
                                            : item === "preparationInstructions"
                                            ? preparationInstructionsTemp
                                            : ""
                                        }
                                        setData={
                                          item === "retailer"
                                            ? handleRetailerDataTemp
                                            : item === "dataSource"
                                            ? handleDataSourceTemp
                                            : item === "claimProduct"
                                            ? handleClaimsOnPackTemp
                                            : item === "claimsOnPackWithValues"
                                            ? handleClaimsOnPackWithValuesTemp
                                            : item === "retailerProductCode"
                                            ? handleRetailerProductCodeTemp
                                            : item === "preparationInstructions"
                                            ? handlePreparationInstructionsTemp
                                            : ""
                                        }
                                      />
                                    </>
                                  )}
                                  {/* Multiple Select Search Fields */}
                                  {structureDummyData[item]?.type == "MultiSelect" && (
                                    <MultiSelectSearchField
                                      className={`w-full my-2 rounded-md border bg-th-grey-light py-2 pl-2 leading-normal placeholder-th-secondary-light ${
                                        !editMode
                                          ? "text-th-neutral-light cursor-not-allowed outline-none"
                                          : "text-th-secondary-medium focus:outline focus:outline-th-primary-medium"
                                      }`}
                                      onSelect={(values) => {
                                        const newValues = values.map((item) => item?.name);
                                        field.onChange(newValues.join(","));
                                      }}
                                      data={
                                        structureDummyData[item]?.isApiCall === "claims"
                                          ? claimData
                                          : structureDummyData[item]?.isApiCall === "allergen"
                                          ? allergenData
                                          : structureDummyData[item]?.data
                                          ? structureDummyData[item]?.data?.map((item, index) => ({
                                              id: index,
                                              name: item,
                                            }))
                                          : structureDummyData[item]?.key === "productLabelsAllocated"
                                          ? productsData?.productLabelsAllocated
                                              ?.flatMap((item) => item?.categoryLabelGroups)
                                              .map((item) => ({ name: item?.name, id: item?.name }))
                                          : productsData?.productLabelsAllocated?.flatMap((item) => ({
                                              name: item?.name,
                                              id: item?.name,
                                            }))
                                      }
                                      placeholder={`Search ${structureDummyData[item]?.field}`}
                                      readOnly={!editMode}
                                      multiSelect={true}
                                      selected={
                                        field?.value && typeof field?.value === "string"
                                          ? field?.value?.split(",")?.map((item) => ({ id: item, name: item }))
                                          : []
                                      }
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
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          ) : (
            <NoResultFound />
          )}
          {tabKey === "Nutrients" && <NutritionInfoTableSec nutritionData={productsData?.nips} editMode={editMode} />}
          {/* Action buttons */}
          {editMode && (
            <div className="flex space-x-4 my-2">
              <CustomButton
                className={
                  "mt-4 rounded-md bg-th-primary-hard py-2 px-4 text-xs lg:text-base font-bold text-th-primary-light focus:outline focus:outline-th-primary-medium transition duration-150 ease-in-out hover:shadow-lg"
                }
                type="submit"
                label="Save"
              />
              <CustomButton
                className="mt-4 rounded-md  border border-th-primary-medium py-2 px-4 text-xs lg:text-base font-bold text-th-grey-hard focus:outline focus:outline-th-primary-medium transition duration-150 ease-in-out hover:shadow-lg"
                type="button"
                label="Cancel"
                onClick={handleDiscardChanges}
              />
            </div>
          )}
        </div>
      </div>
    </form>
  );
};

export default ProductDetailTableSec;
