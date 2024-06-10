import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import LeaveHeader from "./components/common/LeaveHeader";
import LeaveSidebar from "./components/common/LeaveSidebar";
import NewLeaveForm from "./NewLeaveForm";
import LeaveRequest from "./LeaveRequest";

const LeaveIndex = () => {
  return (
    <div className="flex h-[80vh] w-full overflow-auto ">
      <div className=" bg-slate-200 overflow-auto custom-scrollbar   rounded-lg mt-1">
        <LeaveSidebar />
      </div>
      <div className="flex flex-col flex-1 mt-1 ms-2 relative z-0">
        <LeaveHeader />
        <div className="flex-1 shadow-lg overflow-auto custom-scrollbar relative z-10">
          <Routes>
            <Route index element={< LeaveRequest/>} />
            <Route path="nuevo" element={<NewLeaveForm />} />
          </Routes>
        </div>
      </div>


    </div>
  );
};

export default LeaveIndex;