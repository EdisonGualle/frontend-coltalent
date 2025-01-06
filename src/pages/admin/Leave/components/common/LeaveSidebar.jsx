import React from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { FaClipboardList, FaFolderOpen } from "react-icons/fa";

const LeaveSidebar = ({ employeeData }) => {
  const location = useLocation();
  const { id } = useParams(); // Obtener ID de los parámetros

  const renderAvatar = () => {
    if (employeeData.photo) {
      return (
        <img
          src={`${import.meta.env.VITE_STORAGE_URL}/${employeeData.photo}`}
          className="w-24 h-24 object-cover rounded-full border-2 border-gray-300 mb-2"
          alt="Profile"
        />
      );
    }
    return (
      <div className="w-24 h-24 flex items-center justify-center rounded-full border-2 border-gray-300 mb-2 bg-gray-500 text-white text-2xl">
        {employeeData.name.charAt(0).toUpperCase()}
      </div>
    );
  };

  const isActive = (path) =>
    location.pathname.includes(`/permisos/${id}${path}`);

  return (
    <div className="bg-gray-200 rounded-lg pt-6 px-6 w-64">
      <h5 className="text-gray-900 text-lg text-center font-bold mb-4 uppercase">
        Gestión de Permisos
      </h5>
      <div className="flex flex-col items-center mb-6 text-gray-700 hover:text-blue-500">
        {renderAvatar()}
        <span className="text-sm font-semibold">{employeeData.name}</span>
        <span className="text-xs text-gray-500">{employeeData.email}</span>
      </div>
      <hr className="mb-2 border-gray-300" />
      <div>
        <span className="block text-gray-600 text-sm font-semibold mb-1">
          Opciones
        </span>
        <div className="flex flex-col space-y-2">
          <Link
            to={`/permisos/${id}/solicitar`}
            className={`flex items-center text-gray-700 text-sm px-4 py-2 rounded-lg border border-slate-300 hover:bg-slate-300 ${
              isActive("/solicitar") ? "bg-slate-300" : ""
            }`}
          >
            <FaFolderOpen className="mr-2" /> Solicitar
          </Link>
          <Link
            to={`/permisos/${id}/historial`}
            className={`flex items-center text-gray-700 text-sm px-4 py-2 rounded-lg border border-slate-300 hover:bg-slate-300 ${
              isActive("/historial") ? "bg-slate-300" : ""
            }`}
          >
            <FaFolderOpen className="mr-2" /> Mis Permisos
          </Link>
          <Link
            to={`/permisos/${id}/horario/`}
            className={`flex items-center text-gray-700 text-sm px-4 py-2 rounded-lg border border-slate-300 hover:bg-slate-300 ${
              isActive("/horario") ? "bg-slate-300" : ""
            }`}
          >
            <FaFolderOpen className="mr-2" /> Horario
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LeaveSidebar;
