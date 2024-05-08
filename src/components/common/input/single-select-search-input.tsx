import { useState, ChangeEvent, useEffect } from "react";
import { FaX, FaPlus } from "react-icons/fa6";
import CustomInput from "@/components/common/input/custom-input";
import { useTranslations } from "next-intl";
import { USERS } from "@/common/constant/local.constant";
import axios from "@/common/util/api/axios-public-client";
import { toast } from "react-toastify";
import useLoading from "@/common/hook/loading";
import { useDebounce } from "use-debounce";
import CustomButton from "@/components/common/button/custom-button";
import { Loader } from "../placeholder/loader";

interface Option {
  id: string;
  name: string;
}

interface SingleSelectSearchInputProps {
  className?: string;
  onSelect: (selectedOptions: Option[]) => void;
  placeholder: string;
  selected?: Option[];
}

const SingleSelectSearchInput = ({ onSelect, placeholder, className, selected = [] }: SingleSelectSearchInputProps) => {
  const t = useTranslations("searchSelectInput");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isDropdownVisible, setIsDropdownVisible] = useState<boolean>(false);
  const [options, setOptions] = useState<Option[]>([]);
  const { loading, startLoading, stopLoading } = useLoading();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  // Use debounce
  const [debouncedSearchTerm] = useDebounce(searchTerm, 300);

  const handleSelect = (option: Option): void => {
    onSelect([...selected, option]);
    setSearchTerm("");
    setIsDropdownVisible(false);
  };

  const handleRemove = (option: Option): void => {
    const updatedOptions = selected?.filter((selectedOption) => selectedOption?.id !== option?.id);
    onSelect(updatedOptions);
    setSearchTerm("");
    setIsDropdownVisible(false);
  };

  const handleSearch = (e: ChangeEvent<HTMLInputElement>): void => {
    setSearchTerm(e.target.value);
  };
  const isInputDisabled = selected?.length > 0;

  // Handle Load More
  const handleLoadMore = async (): Promise<void> => {
    try {
      startLoading();
      const apiResponse = await axios.get(USERS, {
        params: { "role.name": "Collaborator", page: currentPage + 1, pageSize: 20, name: debouncedSearchTerm },
      });

      if (apiResponse?.data?.statusCode === 200) {
        const users = apiResponse?.data?.data?.users;
        const userObjects = users.map((user: any) => ({
          id: user?._id,
          name: user?.firstName + " " + user.lastName,
        }));
        const uniqueUserObjects = userObjects?.filter(
          (user: any) => !selected?.some((selectedOption) => selectedOption?.id === user?.id),
        );
        setOptions((prevOptions) => [...prevOptions, ...uniqueUserObjects?.filter(Boolean)]);
        setCurrentPage(currentPage + 1);
        setHasMore(users?.length === 20); // Default 20 is the pageSize
      } else {
        toast.error(apiResponse?.data?.message);
      }
    } catch (error: Error) {
      toast.error(error?.message || t("someThingWrong"));
    } finally {
      stopLoading();
    }
  };

  useEffect(() => {
    const fetchCollabrator = async (): Promise<void> => {
      try {
        startLoading();
        const apiResponse = await axios.get(USERS, {
          params: { "role.name": "Collaborator", page: 1, pageSize: 20, name: debouncedSearchTerm },
        });
        if (apiResponse?.data?.statusCode === 200) {
          const users = apiResponse?.data?.data?.users;
          const userObjects = users.map((user: any) => ({
            id: user?._id,
            name: user?.firstName + " " + user.lastName,
          }));
          const uniqueUserObjects = userObjects?.filter(
            (user: any) => !selected?.some((selectedOption) => selectedOption?.id === user?.id),
          );
          setOptions(uniqueUserObjects?.filter(Boolean)); // Filter out null or undefined values
          setCurrentPage(1);
          setHasMore(users?.length === 20);
          if (searchTerm?.length) setIsDropdownVisible(true);
        } else {
          toast.error(apiResponse?.data?.message);
        }
      } catch (error: Error) {
        toast.error(error?.message || t("someThingWrong"));
      } finally {
        stopLoading();
      }
    };
    if (debouncedSearchTerm?.length > 0) {
      fetchCollabrator();
    } else {
      setIsDropdownVisible(false);
      setSearchTerm("");
    }
  }, [debouncedSearchTerm]);
  return (
    <div className="relative">
      <CustomInput
        type="text"
        placeholder={isInputDisabled ? "" : placeholder}
        onChange={handleSearch}
        className={className}
        readOnly={isInputDisabled}
        value={searchTerm}
      />
      {isDropdownVisible && (
        <div className="absolute top-full left-0 w-full bg-th-background border rounded mt-1 z-10 max-h-40 overflow-y-auto">
          {loading ? (
            <div className="flex space-x-2 justify-center items-center mt-1 h-20">
              <Loader />
            </div>
          ) : (
            <>
              {options?.length === 0 ? (
                <div className="p-2 text-th-grey-hard bg-th-zinc-light">{t("noOption")}</div>
              ) : (
                options?.map((option, index) => (
                  <div key={option?.id}>
                    <span
                      className="flex items-center text-th-secondary-medium justify-between px-4 py-2 hover:bg-th-primary-medium cursor-pointer"
                      onClick={() => handleSelect(option)}
                    >
                      <span>{option?.name}</span>
                      <span>
                        <FaPlus />
                      </span>
                    </span>
                    <div className="px-4 flex items-center justify-center">
                      {index === options?.length - 1 && hasMore && (
                        <CustomButton
                          className="my-2 bg-th-primary-hard text-th-primary-light rounded-md py-1 px-2"
                          type="button"
                          onClick={handleLoadMore}
                          label={t("loadMore")}
                        />
                      )}
                    </div>
                  </div>
                ))
              )}
            </>
          )}
        </div>
      )}
      <div className="absolute top-2.5 md:top-3.5 lg:top-3 2xl:top-4 left-1">
        {selected?.map((option) => (
          <div key={option?.id} className="bg-th-zinc-light rounded-full px-4 py-1 m-1 flex items-center">
            <span>{option.name}</span>
            <span className="ml-2 cursor-pointer" onClick={() => handleRemove(option)}>
              <FaX className="text-th-grey-hard hover:text-th-danger-medium" />
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SingleSelectSearchInput;
