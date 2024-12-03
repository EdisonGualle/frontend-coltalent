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
        <div className="xl:col-span-5 flex flex-col h-screen">
          {/* Header fijo */}
          <div className="sticky top-0 z-10">
            <Header />
          </div>
          {/* Contenedor desplazable: incluye Breadcrumbs y Outlet */}
          <div className="flex-1 overflow-y-auto px-4 pt-[10vh] bg-gray-100">
            <div className="">
              <Breadcrumbs />
            </div>
            <div className="mt-2 border-t-2 border-gray-100 rounded-lg px-2 pb-2 bg-gray-100">
              <Outlet />
            </div>
          </div>
        </div>
      </div>
    </AppWrapper>
  );
};

export default LayoutAdmin;
