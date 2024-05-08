import React from "react";
import NoResultFound from "@/components/common/placeholder/no-result-found";
import { useForm, Controller } from "react-hook-form";
// import { useTranslations } from "next-intl";

// Product Nutrient Profiling Table Props
interface NutrientProfilingTabSecProps {
  productsData: any;
  editMode: boolean;
  tabKey: string;
  structureDummyData?: any;
}

const NutrientProfilingTabSec: React.FC<NutrientProfilingTabSecProps> = ({
  productsData,
  editMode,
  tabKey,
  structureDummyData,
}) => {
  // const t = useTranslations("productDetailPage.productDetailTabsSec.productTabs.productTabFields");

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

  const { control, handleSubmit } = useForm({
    defaultValues: getDefaultValue(),
    // resolver: yupResolver(getCustomSchema(productsData)),
    mode: "all",
  });

  const onSubmit = async () => {
    console.log("tabKey", tabKey);
  };
  // data destructure
  const ttlkey = productsData?.info?.tll;
  const hsrkey = productsData?.info?.hsr;
  const HealthStarRatingReviewTable = [
    hsrkey?.score || 0,
    hsrkey?.tgiScore || 0,
    hsrkey?.points || 0,
    hsrkey?.fsPoints || 0,
  ];
  const NPVProxyUsedTable = [hsrkey?.NpvProxy || 0, productsData?.info?.tll?.NpvProxy || 0];
  const PlanetaryHealthRatingTable = [productsData?.info?.phr?.value || 0, productsData?.info?.phr?.Proxy || 0];
  const TrafficLightLabelTable = [
    {
      energry: [ttlkey?.energyServeKj || 0, ttlkey?.energyServeKcal || 0],
      fat: ttlkey?.fatServe || 0,
      saturatFat: ttlkey?.satFatServe || 0,
      sugar: ttlkey?.sugarsServe || 0,
      salt: ttlkey?.saltServe || 0,
      netcarbs: ttlkey?.netcarbsServe || 0,
      protein: ttlkey?.proteinServe || 0,
      fibre: ttlkey?.fibreServe || 0,
    },
    {
      energry: ttlkey?.energyDailyPercent || 0,
      fat: ttlkey?.fatDailyPercent || 0,
      saturatFat: ttlkey?.satFatDailyPercent || 0,
      sugar: ttlkey?.sugarDailyPercent || 0,
      salt: ttlkey?.saltDailyPercent || 0,
      netcarbs: ttlkey?.netcarbsDailyPercent || 0,
      protein: ttlkey?.proteinDailyPercent || 0,
      fibre: ttlkey?.fibreDailyPercent || 0,
    },
  ];
  const DiabetesDisplayLabelTable = [
    {
      energry: [ttlkey?.energy_100Kj || 0, ttlkey?.energy_100Kcal || 0],
      protein: ttlkey?.protein_100 || 0,
      saturatFat: ttlkey?.satFat_100 || 0,
      netCarbs: ttlkey?.netcarbs_100 || 0,
      fibre: ttlkey?.fibre_100 || 0,
      sodium: ttlkey?.sodium_100 || 0,
      salt: ttlkey?.salt_100 || 0,
    },
  ];
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
                      {structureDummyData[item]?.field || "N/A"}
                    </td>
                    <td className="px-3 py-0 whitespace-nowrap text-xs">
                      <Controller
                        name={structureDummyData[item]?.field}
                        control={control}
                        render={({ field, fieldState }) => {
                          return (
                            <div>
                              {structureDummyData[item]?.type == "Text" && (
                                <input
                                  {...field}
                                  className={
                                    "w-full my-2 rounded-md border bg-th-background text-th-secondary-medium py-2 pl-2 leading-normal placeholder-th-secondary-light cursor-not-allowed"
                                  }
                                  type="text"
                                  readOnly={!editMode || editMode}
                                />
                              )}
                              {structureDummyData[item]?.type == "Table" && (
                                <div className="w-full my-2 overflow-x-auto rounded-md">
                                  <table className="w-full border">
                                    <thead className="bg-th-primary-medium">
                                      <tr className="rounded-lg">
                                        {structureDummyData[item]?.dataHeading?.map((heading, index) => (
                                          <th
                                            key={index}
                                            className="py-2 px-4 text-th-primary-hard border-l border-th-primary-light"
                                          >
                                            <td>{heading}</td>
                                          </th>
                                        ))}
                                      </tr>
                                    </thead>
                                    <tbody>
                                      <tr>
                                        {structureDummyData[item]?.key == "info.HSR.review" &&
                                          HealthStarRatingReviewTable?.map((value, index) => (
                                            <td
                                              key={index}
                                              className={`px-4 py-2 text-th-secondary-medium text-sm border-l border-th-gray-light`}
                                            >
                                              {value == 0 ? "false" : value}
                                            </td>
                                          ))}
                                        {structureDummyData[item]?.key == "info.NPV.proxy.used" &&
                                          NPVProxyUsedTable?.map((value, index) => (
                                            <td
                                              key={index}
                                              className={`px-4 py-2 text-th-secondary-medium text-sm border-l border-th-gray-light`}
                                            >
                                              {value == 0 ? "false" : value == 1 ? "true" : value}
                                            </td>
                                          ))}
                                        {structureDummyData[item]?.key == "info.planetary.health.rating" &&
                                          PlanetaryHealthRatingTable?.map((value, index) => (
                                            <td
                                              key={index}
                                              className={`px-4 py-2 text-th-secondary-medium text-sm border-l border-th-gray-light`}
                                            >
                                              {value == 0 ? "false" : value == 1 ? "true" : value}
                                            </td>
                                          ))}
                                      </tr>
                                    </tbody>
                                  </table>
                                </div>
                              )}
                              {structureDummyData[item]?.type == "TLTable" && (
                                <div className="w-full my-2 overflow-x-auto rounded-md">
                                  <p className="p-1">{structureDummyData[item]?.legend}</p>
                                  <div className="w-full overflow-x-auto rounded-md">
                                    <table className="w-full border">
                                      <thead className="">
                                        <tr className="rounded-lg">
                                          {structureDummyData[item]?.dataHeading?.map((heading, index) => {
                                            const color =
                                              structureDummyData[item]?.dataheadingColor &&
                                              structureDummyData[item]?.dataheadingColor[index];
                                            const bgColor =
                                              structureDummyData[item]?.dataheadingBgColor &&
                                              structureDummyData[item]?.dataheadingBgColor[index];
                                            return (
                                              <th
                                                style={{ backgroundColor: bgColor, color: color }}
                                                key={index}
                                                className={
                                                  "py-2 px-4 text-th-primary-hard border-l border-b border-th-zinc-light"
                                                }
                                              >
                                                {heading}
                                              </th>
                                            );
                                          })}
                                        </tr>
                                      </thead>
                                      <tbody>
                                        {structureDummyData[item]?.key == "info.tll.label" &&
                                          TrafficLightLabelTable?.map((rowData, rowIndex) => (
                                            <tr key={rowIndex} className="border-b">
                                              {Object.values(rowData).map((value, colIndex) => (
                                                <td
                                                  key={colIndex}
                                                  className={
                                                    "px-4 py-2 text-th-secondary-medium text-sm border-l border-th-gray-light"
                                                  }
                                                >
                                                  {Array.isArray(value)
                                                    ? value.join(" KJ / KCL ")
                                                    : rowIndex === 0
                                                    ? value + " g"
                                                    : value + "%"}
                                                </td>
                                              ))}
                                            </tr>
                                          ))}
                                        {structureDummyData[item]?.key == "info.diabetes.display.label" &&
                                          DiabetesDisplayLabelTable?.map((rowData, rowIndex) => (
                                            <tr key={rowIndex} className="border-b">
                                              {Object.values(rowData).map((value, colIndex) => (
                                                <td
                                                  key={colIndex}
                                                  className={
                                                    "px-4 py-2 text-th-secondary-medium text-sm border-l border-th-gray-light"
                                                  }
                                                >
                                                  {Array.isArray(value)
                                                    ? value.join(" KJ / KCL ")
                                                    : rowIndex === 0
                                                    ? value + " g"
                                                    : value + "%"}
                                                </td>
                                              ))}
                                            </tr>
                                          ))}
                                      </tbody>
                                    </table>
                                  </div>
                                </div>
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
        </div>
      </div>
    </form>
  );
};

export default NutrientProfilingTabSec;
