import React, { useEffect } from "react";
import { useParams } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";
import { FaRegClipboard } from "react-icons/fa";
import { fetchLeaveStatistics } from "../../../../../redux/Leave/leaveSince";

const LeaveHeader = () => {
  const { id: employeeId } = useParams(); // Obtener employeeId desde la ruta
  const dispatch = useDispatch();
  const { statistics, loading, error } = useSelector((state) => state.leave);

  useEffect(() => {
    if (employeeId) {
      dispatch(fetchLeaveStatistics(employeeId));
    }
  }, [dispatch, employeeId]);

  return (
    <div className="flex bg-white items-center shadow-sm rounded-lg p-4">
      <FaRegClipboard className="text-2xl text-gray-500 mr-2" />
      <span className="text-gray-600 text-lg font-semibold">Resumen de Permisos</span>
      <div className="flex ml-auto space-x-4">
        <div className="text-center">
          <span className="block text-xs text-gray-500">Permisos Aprobados</span>
          <span className="block bg-green-100 text-green-600 text-lg font-semibold px-4 py-0.5 rounded-full">
            {statistics?.approvedPermissions || 0}
          </span>
        </div>
        <div className="text-center">
          <span className="block text-xs text-gray-500">Permisos Desaprobados</span>
          <span className="block bg-red-100 text-red-500 text-lg font-semibold px-4 py-0.5 rounded-full">
            {statistics?.disapprovedPermissions || 0}
          </span>
        </div>
        <div className="text-center">
          <span className="block text-xs text-gray-500">Saldo de Vacaciones</span>
          <span className="block bg-blue-100 text-blue-500 text-lg font-semibold px-4 py-0.5 rounded-full">
            {statistics?.vacationBalance || 0}
          </span>
        </div>
      </div>
    </div>
  );
};

export default LeaveHeader;