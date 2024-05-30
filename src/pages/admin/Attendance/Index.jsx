import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import AttendanceSidebar from "./components/common/Sidebar";
import AttendanceHeader from "./components/common/Header";
import AttendanceTable from "./WeeklyAttendance/AttendanceTable";

const Attendance = () => {
  return (
    <div className="flex h-[80vh] w-full overflow-auto ">
      <div className=" bg-slate-200 overflow-auto custom-scrollbar   rounded-lg mt-1">
        <AttendanceSidebar />
      </div>
      <div className="flex flex-col flex-1 mt-1 ms-2">
        <AttendanceHeader />
        <div className="flex-1 shadow-lg overflow-auto custom-scrollbar">
          <Routes>
            <Route index element={<AttendanceTable />} />
            {/* <Route path="datos-personales" element={<PersonalData />} /> */}
            {/* Maneja rutas no definidas dentro de Perfil */}
            <Route path="*" element={<Navigate to="/404" replace />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default Attendance;