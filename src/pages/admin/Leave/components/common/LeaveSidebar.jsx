import React from "react";
import { Link, useLocation } from "react-router-dom";
import { FaClipboardList,FaFolderOpen } from "react-icons/fa";
import { useAuth } from "../../../../../hooks/useAuth";

const LeaveSidebar = () => {
  const { user } = useAuth();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <div className="bg-slate-200 rounded-lg pt-6 px-6 w-64">
      <h5 className="text-gray-900 text-lg text-center font-bold mb-4 uppercase">Gestión de Permisos</h5>
      <Link className="flex flex-col items-center mb-6 text-gray-700 hover:text-blue-500" to="/solicitudes">
        <div className="flex flex-col items-center">
          <img
            src={`${import.meta.env.VITE_STORAGE_URL}/${user.photo}`}
            className="w-24 h-24 object-cover rounded-full border-2 border-gray-300 mb-2"
            alt="Profile"
          />
          <span className="text-sm font-semibold">{user.name}</span>
          <span className="text-xs text-gray-500">{user.email}</span>
        </div>
      </Link>
      <hr className="mb-2 border-gray-300" />
      <div>
        <span className="block text-gray-600 text-sm font-semibold mb-1">Opciones</span>
        <div className="flex flex-col space-y-2">
          <Link
            to="/solicitudes/historial"
            className={`flex items-center text-gray-700 text-sm px-4 py-2 rounded-lg border border-slate-300 hover:bg-slate-300 ${isActive('/permisos/historial') ? 'bg-slate-300' : ''}`}
          >
            <FaFolderOpen className="mr-2" /> Mis Permisos
          </Link>
          <Link
            to="/permisos/reporte-mensual"
            className={`flex items-center text-gray-700 text-sm px-4 py-2 rounded-lg border border-slate-300 hover:bg-slate-300 ${isActive('/permisos/reporte-mensual') ? 'bg-slate-300' : ''}`}
          >
            <FaClipboardList className="mr-2" /> Reporte Mensual
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LeaveSidebar;
