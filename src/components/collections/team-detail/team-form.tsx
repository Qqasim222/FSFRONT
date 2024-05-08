import React from "react";
import { useTranslations } from "next-intl";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import CustomButton from "@/components/common/button/custom-button";
import { addTeamMemberFormSchema } from "@/common/config/schema";
import axios from "@/common/util/api/axios-public-client";
import { toast } from "react-toastify";
import useLoading from "@/common/hook/loading";
import { useSearchParams } from "next/navigation";
import { usePathname, useRouter } from "next-intl/client";
import { UPDATE_TEAM_USERS } from "@/common/constant/local.constant";
import MultiSelectSearchInput from "@/components/common/input/multi-select-search-input";

// Define types for multi-select team user Inputs
interface AddNewTeamMemberFormTypes {
  name: any[];
}

interface AddNewTeamMemberFormProps {
  onCancel: () => void;
  onTeamMembersListUpdate: any;
  collection: string;
}

const AddNewMemberToTeamForm: React.FC<AddNewTeamMemberFormProps> = ({
  onCancel,
  onTeamMembersListUpdate,
  collection,
}) => {
  const t = useTranslations("myTeamManagmentDetailPage.myTeamAddTeamMemberModal.addTeamMemberForm");
  const { loading, startLoading, stopLoading } = useLoading();
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);
  const pathname = usePathname();
  const { replace } = useRouter();

  const {
    control,
    handleSubmit,
    reset,
    formState: { isDirty },
  } = useForm<AddNewTeamMemberFormTypes>({
    resolver: yupResolver(addTeamMemberFormSchema),
    mode: "all",
    defaultValues: {
      name: [],
    },
  });

  // Handle Submit User
  const onSubmit = async (data: AddNewTeamMemberFormTypes) => {
    try {
      startLoading();
      const simplifiedData = {
        team: data?.name.map((selectedOption) => selectedOption.id),
        collectionId: collection,
      };
      const apiResponse = await axios.patch(UPDATE_TEAM_USERS, JSON.stringify(simplifiedData));
      if (apiResponse?.data?.statusCode === 200) {
        onCancel();
        reset();
        toast.success(apiResponse?.data?.message);
        if (onTeamMembersListUpdate) {
          onTeamMembersListUpdate(params.get("page") || 1);
          replace(`${pathname}`);
        }
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
    <div className="w-full">
      {/* Form */}
      <form className="h-full w-full" onSubmit={handleSubmit(onSubmit)}>
        {/* Name input */}
        <div className="flex flex-col mt-3 mb-3 sm:mt-0">
          <label htmlFor="name" className="text-th-secondary-medium font-semibold">
            {t("name")}
          </label>
          <Controller
            name="name"
            control={control}
            render={({ field, fieldState }) => (
              <div>
                <MultiSelectSearchInput
                  collection={collection}
                  className="w-full mt-2 placeholder-th-secondary-light text-th-secondary-medium rounded-md border bg-th-grey-light py-2 md:py-3 lg:py-2.5 2xl:py-3.5 pl-2 leading-normal outline-none"
                  onSelect={field.onChange} // Pass the onChange handler directly
                  selected={field.value}
                  placeholder={t("placeholder.name")}
                />
                {fieldState.error && <span className="text-th-danger-medium">{t(fieldState.error.message)}</span>}
              </div>
            )}
          />
        </div>

        {/* Actions Buttons */}
        <div className="flex space-x-4 mt-2 md:mt-4">
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
              onCancel();
              reset();
            }}
          />
        </div>
      </form>
    </div>
  );
};

export default AddNewMemberToTeamForm;
