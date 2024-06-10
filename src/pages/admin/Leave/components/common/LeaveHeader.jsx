import React, { useState, useEffect } from "react";
import { FaRegClipboard } from "react-icons/fa";

const LeaveHeader = () => {
  const [totalPermissions, setTotalPermissions] = useState(0);
  const [approvedPermissions, setApprovedPermissions] = useState(0);
  const [disapprovedPermissions, setDisapprovedPermissions] = useState(0);

  useEffect(() => {
    // Simulating data fetching from backend
    const fetchData = async () => {
      // Simulated backend data
      const backendData = {
        totalPermissions: 15,
        approvedPermissions: 10,
        disapprovedPermissions: 2
      };

      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Set state with fetched data
      setTotalPermissions(backendData.totalPermissions || 0);
      setApprovedPermissions(backendData.approvedPermissions || 0);
      setDisapprovedPermissions(backendData.disapprovedPermissions || 0);
    };

    fetchData();
  }, []);

  return (
    <div className="flex items-center shadow rounded-t-lg p-4">
      <FaRegClipboard className="text-2xl text-gray-500 mr-2" />
      <span className="text-gray-600 text-lg font-semibold">Resumen de Permisos</span>
      <div className="flex ml-auto space-x-4">
        <div className="text-center">
          <span className="block text-xs text-gray-500">Permisos Totales</span>
          <span className="block bg-gray-100 text-gray-600 text-lg font-semibold px-4 py-0.5 rounded-full">
            {totalPermissions}
          </span>
        </div>
        <div className="text-center">
          <span className="block text-xs text-gray-500">Permisos Aprobados</span>
          <span className="block bg-green-100 text-green-600 text-lg font-semibold px-4 py-0.5 rounded-full">
            {approvedPermissions}
          </span>
        </div>
        <div className="text-center">
          <span className="block text-xs text-gray-500">Permisos Desaprobados</span>
          <span className="block bg-red-100 text-red-500 text-lg font-semibold px-4 py-0.5 rounded-full">
            {disapprovedPermissions}
          </span>
        </div>
      </div>
    </div>
  );
};

export default LeaveHeader;
