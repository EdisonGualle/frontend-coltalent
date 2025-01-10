import React, { useState, useEffect } from "react";
import { Routes, Route, useParams, Navigate } from "react-router-dom";
import LeaveHeader from "./components/common/LeaveHeader";
import LeaveSidebar from "./components/common/LeaveSidebar";
import LeaveRequest from "./LeaveRequest";
import RejectionReason from "./RejectionReason/RejectionReason";
import { getEmployee } from "../../../services/Employee/EmployeService1";
import History from "./History/History";
import Schedule from "../Attendance/Schedule/Schedule";
import LoadingIndicator from "../../../components/ui/LoadingIndicator";
import WeeklySchedule from "../Leave/Schedule/WeeklySchedule";

const LeaveIndex = () => {
  const { id } = useParams();
  const [isValidId, setIsValidId] = useState(null);
  const [employeeData, setEmployeeData] = useState(null); // Datos del empleado
  const [loading, setLoading] = useState(true); // Estado de carga global

  useEffect(() => {
    const fetchEmployeeData = async () => {
      try {
        if (!/^\d+$/.test(id)) {
          setIsValidId(false);
          setLoading(false);
          return;
        }

        const response = await getEmployee(id);
        if (response?.data) {
          setEmployeeData({
            name: response.data.employee_name || "",
            photo: response.data.photo || "",
            email: response.data.email || "",
          });
          setIsValidId(true);
        } else {
          setIsValidId(false);
        }
      } catch (error) {
        setIsValidId(false);
      } finally {
        setLoading(false); // Finaliza la carga
      }
    };

    fetchEmployeeData();
  }, [id]);

  if (loading) {
    return <LoadingIndicator />;
  }

  if (!isValidId) {
    return <Navigate to="/404" replace />;
  }

  return (
    <div className="flex h-[80vh]">
      <div className="overflow-auto shadow-lg rounded-lg mt-1 bg-gray-200">
        {/* Proveer datos del empleado al Sidebar */}
        <LeaveSidebar employeeData={employeeData} />
      </div>
      <div className="flex flex-col w-3/4 mt-1 ms-2">
        {/* Proveer datos del empleado al Header */}
        <LeaveHeader employeeData={employeeData} />
        <div className="flex-1 overflow-auto custom-scrollbar">
          <Routes>
            <Route path="solicitar" element={<LeaveRequest />} />
            <Route path="historial" element={<History />} />
            <Route path="motivos-de-rechazo" element={<RejectionReason />} />
            <Route path="horario" element={<WeeklySchedule />} />
            <Route path="*" element={<Navigate to="/404" replace />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default LeaveIndex;
