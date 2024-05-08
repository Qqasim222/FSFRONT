import Drawer from "@/components/layout/drawer/drawer";
import MobileCanvas from "@/components/layout/canvas/canvas";
import AppBar from "@/components/layout/appbar/appbar";
import React, { ReactNode } from "react";

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  return (
    <div className="flex h-screen overflow-hidden">
      <div className="hidden lg:flex">
        <Drawer />
      </div>
      <div className="flex flex-col flex-1 w-0 overflow-hidden">
        <div className="lg:hidden">
          <MobileCanvas />
        </div>
        <main className="flex-1 overflow-y-auto h-screen">
          <div className="hidden mx-5 rounded-b-lg lg:block top-0 left-0 right-0 bg-th-background shadow-lg">
            <AppBar />
          </div>
          <div className="min-h-screen h-auto p-5 m-5 border rounded-xl bg-th-primary-medium">{children}</div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
