import React, { useState, useEffect } from "react";
import { Routes, Route, useParams, Navigate } from "react-router-dom";
import LeaveHeader from "./components/common/LeaveHeader";
import LeaveSidebar from "./components/common/LeaveSidebar";
import LeaveRequest from "./LeaveRequest";
import RejectionReason from "./RejectionReason/RejectionReason";
import { getEmployee } from "../../../services/Employee/EmployeService1";
import History from "./History/History";
import Schedule from "../Attendance/Schedule/Schedule";

const LeaveIndex = () => {
  const { id } = useParams();
  const [isValidId, setIsValidId] = useState(null);

  useEffect(() => {
    const checkEmployeeId = async () => {
      try {
        const response = await getEmployee(id);
        if (response) {
          setIsValidId(true);
        } else {
          setIsValidId(false);
        }
      } catch (error) {
        setIsValidId(false);
      }
    };

    if (/^\d+$/.test(id)) {
      checkEmployeeId();
    } else {
      setIsValidId(false);
    }
  }, [id]);

  if (isValidId === null) {
    return (
      <div className="flex items-center justify-center mt-52">
        <div className="w-12 h-12 rounded-full animate-spin border-y-2 border-solid border-violet-200 border-t-transparent shadow-md"></div>
      </div>
    );
  }

  if (!isValidId) {
    return <Navigate to="/404" replace />;
  }

  return (
    <div className="flex h-[80vh]">
      <div className=" overflow-auto  shadow-lg rounded-lg mt-1 bg-gray-200">
        <LeaveSidebar />
      </div>
      <div className="flex flex-col w-3/4 mt-1 ms-2">
        <LeaveHeader />
        <div className="flex-1  overflow-auto custom-scrollbar">
          <Routes>
            <Route path="solicitar" element={<LeaveRequest />} />
            <Route path="historial" element={<History />} />
            <Route path="motivos-de-rechazo" element={<RejectionReason />} />
            <Route path="horario" element={<Schedule />} />           
            <Route path="*" element={<Navigate to="/404" replace />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default LeaveIndex;
