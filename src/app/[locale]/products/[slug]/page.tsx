import React from "react";
import DashboardLayout from "../../dashboard/layout";
import ProductDetailPage from "./templete";

const ProductDetail = ({ params }: any) => {
  return (
    <DashboardLayout>
      <ProductDetailPage slug={params?.slug} />
    </DashboardLayout>
  );
};

export default ProductDetail;
