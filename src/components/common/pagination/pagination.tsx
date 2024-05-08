import React from "react";
import { useSearchParams } from "next/navigation";
import { usePathname, useRouter } from "next-intl/client";
import { useTranslations } from "next-intl";

interface PaginationProps {
  count: number;
  onPaginationChange: (newPage: number, searchData: any) => void;
}

const Pagination: React.FC<PaginationProps> = ({ count, onPaginationChange }) => {
  const t = useTranslations("tablePagination");
  const searchParams = useSearchParams();
  const { replace } = useRouter();
  const pathname = usePathname();

  const page = parseInt(searchParams.get("page") || "1", 10);
  const params = new URLSearchParams(searchParams);
  const pageSize = 10;
  const totalPages = Math.ceil(count / pageSize);
  const range = 2; // Adjust range as needed

  const hasPrev = page > 1;
  const hasNext = page < totalPages;

  const handleChangePage = (newPage: number) => {
    const filters = params?.get("filters") || "";
    const searchData = filters ? JSON.parse(decodeURI(filters)) : {};
    onPaginationChange(newPage, searchData);
    params.set("page", newPage.toString());
    replace(`${pathname}?${params}`);
  };
  const renderPageNumbers = () => {
    const pageNumbers = [];
    const startPage = Math.max(1, page - range);
    const endPage = Math.min(totalPages, startPage + 2 * range);
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(
        <button
          key={i}
          className={`py-2 px-4 mx-1 text-th-secondary-medium ${
            i === page
              ? "bg-th-primary-medium rounded-full"
              : "hover:bg-th-primary-medium hover:text-th-primary-hard rounded-full"
          } ${i === page ? "cursor-not-allowed" : ""}`}
          disabled={i === page}
          onClick={() => handleChangePage(i)}
        >
          {i}
        </button>,
      );
    }
    return pageNumbers;
  };

  return (
    <div className="flex flex-col md:flex-row md:justify-between items-center pt-4">
      <div className="flex items-center my-2 md:py-0">
        <div className="mr-4 text-th-secondary-medium">
          {t("showingPage")} {page} {t("of")} {totalPages}
        </div>
      </div>
      <div>
        <button
          className={`py-2 px-4 mr-1  ${
            !hasPrev
              ? "cursor-not-allowed text-th-secondary-medium opacity-50"
              : "bg-th-primary-medium text-th-primary-hard rounded-full"
          }`}
          disabled={!hasPrev}
          onClick={() => handleChangePage(page - 1)}
        >
          {t("prev")}
        </button>
        {/* {hasPrev && "<<"} */}
        {renderPageNumbers()}
        {/* {hasNext && ">>"} */}
        <button
          className={`py-2 px-4 ml-1  ${
            !hasNext
              ? "cursor-not-allowed text-th-secondary-medium opacity-50"
              : "bg-th-primary-medium text-th-primary-hard rounded-full"
          }`}
          disabled={!hasNext}
          onClick={() => handleChangePage(page + 1)}
        >
          {t("next")}
        </button>
      </div>
    </div>
  );
};

export default Pagination;
