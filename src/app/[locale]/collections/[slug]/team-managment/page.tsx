import React from "react";
import MyTeamManagmentDetailPage from "./templete";
import DashboardLayout from "@/app/[locale]/dashboard/layout";

const MyTeamManagment = ({ params }: any) => {
  return (
    <DashboardLayout>
      <MyTeamManagmentDetailPage props={params} />
    </DashboardLayout>
  );
};

export default MyTeamManagment;
