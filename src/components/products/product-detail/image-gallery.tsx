import React, { useState } from "react";
import { FaAngleLeft, FaAngleRight, FaArrowsSpin } from "react-icons/fa6";
import { FaSearchPlus, FaSearchMinus } from "react-icons/fa";
import Image from "next/image";
import CustomButton from "@/components/common/button/custom-button";
import noImageFoundPlacholder from "@assets/svg/No-Image-Placeholder.svg";

const ProductImageGallerySec = ({ productImages }: any) => {
  const data = productImages?.map((item: any) => ({ url: `/${item?.url}`, isMoved: item.isMoved }));
  const [activeIndex, setActiveIndex] = useState(0);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [visibleImages, setVisibleImages] = useState(10);
  const [imageError, setImageError] = useState(false);

  const handleImageClick = (index: any) => {
    setActiveIndex(index);
    setImageError(false);
  };
  const handlePrevClick = () => {
    setImageError(false);
    setActiveIndex((prevIndex) => (prevIndex === 0 ? data?.length - 1 : prevIndex - 1));
  };
  const handleNextClick = () => {
    setImageError(false);

    setActiveIndex((prevIndex) => (prevIndex === data?.length - 1 ? 0 : prevIndex + 1));
  };
  const handleZoomIn = () => {
    setZoomLevel((prevZoomLevel) => prevZoomLevel + 0.1);
  };
  const handleZoomOut = () => {
    setZoomLevel((prevZoomLevel) => Math.max(1, prevZoomLevel - 0.1));
  };
  const handleReset = () => {
    setZoomLevel(1);
    setActiveIndex(0);
    setVisibleImages(10);
  };
  const handleLoadMore = () => {
    setVisibleImages((prevVisibleImages) => prevVisibleImages + 10);
  };

  return (
    <>
      <div className="bg-th-background p-2 rounded-xl">
        <div className="grid gap-2">
          <div className="overflow-hidden rounded-lg">
            <Image
              onError={() => setImageError(true)}
              src={
                imageError
                  ? noImageFoundPlacholder
                  : data
                  ? `${
                      data[activeIndex]?.isMoved
                        ? "https://df55ejckx5h0p.cloudfront.net/production/au/tgicms_au"
                        : "https://cms-au.foodswitch.com/tgicms_au"
                    }${data[activeIndex]?.url}`
                  : ""
              }
              className="h-auto w-full max-w-full rounded-lg object-cover object-center md:h-[480px] -mb-12"
              alt={`gallery-image-${activeIndex + 1}`}
              style={{ transform: `scale(${zoomLevel})`, transition: "transform 0.2s ease-in-out" }}
              width={1000}
              height={1000}
            />
            <div className="flex justify-center space-x-6 bg-th-dark-medium text-th-primary-light opacity-60 rounded-b-lg py-3.5 text-lg">
              <button
                onClick={handlePrevClick}
                disabled={activeIndex === 0}
                className={`${
                  activeIndex === 0 ? "text-th-grey-hard cursor-not-allowed" : "hover:text-th-primary-hard"
                }`}
              >
                <FaAngleLeft />
              </button>
              <button
                onClick={handleZoomIn}
                disabled={zoomLevel > 5}
                className={`${zoomLevel > 5 ? "text-th-grey-hard cursor-not-allowed" : "hover:text-th-primary-hard"}`}
              >
                <FaSearchPlus />
              </button>

              <button
                onClick={handleZoomOut}
                disabled={zoomLevel === 1}
                className={`${zoomLevel === 1 ? "text-th-grey-hard cursor-not-allowed" : "hover:text-th-primary-hard"}`}
              >
                <FaSearchMinus />
              </button>
              <button
                onClick={handleReset}
                disabled={activeIndex === 0 && zoomLevel === 1}
                className={`${
                  zoomLevel === 1 && activeIndex === 0
                    ? "text-th-grey-hard cursor-not-allowed"
                    : "hover:text-th-primary-hard"
                }`}
              >
                <FaArrowsSpin />
              </button>
              <button
                onClick={handleNextClick}
                disabled={activeIndex === data?.length - 1}
                className={`${
                  activeIndex === data?.length - 1
                    ? "text-th-grey-hard cursor-not-allowed"
                    : "hover:text-th-primary-hard"
                }`}
              >
                <FaAngleRight />
              </button>
            </div>
          </div>
          <div
            className={`grid grid-cols-3 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-5 gap-2 md:gap-4 ${
              productImages?.length > 10 ? "h-40 overflow-auto" : ""
            }`}
          >
            {data?.slice(0, visibleImages)?.map((item, index) => (
              <div key={index}>
                <Image
                  onClick={() => handleImageClick(index)}
                  src={`${
                    item?.isMoved
                      ? "https://df55ejckx5h0p.cloudfront.net/production/au/tgicms_au"
                      : "https://cms-au.foodswitch.com/tgicms_au"
                  }${item?.url}`}
                  className={`h-16 max-w-full cursor-pointer rounded-lg object-cover object-center ${
                    index === activeIndex ? "border-2 border-th-primary-hard" : ""
                  }`}
                  alt={`gallery-image-${index + 1}`}
                  width={100}
                  height={100}
                />
              </div>
            ))}
          </div>
          <div className="w-full items-center justify-center flex">
            {visibleImages < data?.length && (
              <CustomButton
                className="rounded-md bg-th-primary-hard py-1.5 px-4 text-xs lg:text-base font-semibold text-th-primary-light focus:outline focus:outline-th-primary-medium transition duration-150 ease-in-out hover:shadow-lg"
                type="button"
                onClick={handleLoadMore}
                label="Load More"
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductImageGallerySec;
