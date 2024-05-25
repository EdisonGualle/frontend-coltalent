import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/common/layout/Sidebar";
import Header from "../components/common/layout/Header";
import AppWrapper from "../components/common/layout/AppWrapper";
import Breadcrumbs from "../components/common/layout/Breadcrumbs";

const LayoutAdmin = () => {
  return (
    <AppWrapper>
    <div className="min-h-screen grid grid-cols-1 xl:grid-cols-6">
      <Sidebar />
      <div className="xl:col-span-5">
        <Header />
        <div className="h-[90vh] px-4 overflow-auto">
          <Breadcrumbs />
          {/* poner shadow-lg si es necesario luego */}
          <div className="mt-3 pt-2 border-t-2  border-gray-300  rounded-lg px-2">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  </AppWrapper>
  );
};

export default LayoutAdmin;