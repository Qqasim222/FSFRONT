import React from "react";
import DashboardLayout from "../../dashboard/layout";
import CollectionDetailPage from "./templete";

const CollectionDetail = ({ params }: any) => {
  return (
    <DashboardLayout>
      <CollectionDetailPage props={params} />
    </DashboardLayout>
  );
};

export default CollectionDetail;
