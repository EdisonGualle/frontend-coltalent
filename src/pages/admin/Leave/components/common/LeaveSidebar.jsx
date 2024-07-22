import React, { useState, useEffect } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { FaClipboardList,FaFolderOpen } from "react-icons/fa";
import { getEmployee } from "../../../../../services/Employee/EmployeService1";

const LeaveSidebar = () => {
  const location = useLocation();
  const { id } = useParams(); // Permite obtener el id de la URL
  const [employeeName, setEmployeeName] = useState("");
  const [employeePhoto, setEmployeePhoto] = useState("");
  const [employeeEmail, setEmployeeEmail] = useState("");

  useEffect(() => {
    const fetchEmployeeData = async () => {
      try {
        const response = await getEmployee(id);
        if (response && response.data) {
          setEmployeeName(response.data.employee_name || "");
          setEmployeePhoto(response.data.photo || "");
          setEmployeeEmail(response.data.email || "");
        }
      } catch (error) {
        // Manejo de errores, si es necesario
      }
    };

    if (id) {
      fetchEmployeeData();
    }
  }, [id]);

  const renderAvatar = () => {
    if (employeePhoto) {
      return (
        <img
          src={`${import.meta.env.VITE_STORAGE_URL}/${employeePhoto}`}
          className="w-24 h-24 object-cover rounded-full border-2 border-gray-300 mb-2"
          alt="Profile"
        />
      );
    } else {
      const initial = employeeName.charAt(0).toUpperCase();
      return (
        <div className="w-24 h-24 flex items-center justify-center rounded-full border-2 border-gray-300 mb-2 bg-gray-500 text-white text-2xl">
          {initial}
        </div>
      );
    }
  };


  const isActive = (path) => location.pathname.includes(`/perfil/${id}${path}`);
  return (
    <div className="bg-slate-200 rounded-lg pt-6 px-6 w-64">
      <h5 className="text-gray-900 text-lg text-center font-bold mb-4 uppercase">Gestión de Permisos</h5>
      <div className="flex flex-col items-center mb-6 text-gray-700 hover:text-blue-500">
        {renderAvatar()}
        <span className="text-sm font-semibold">{employeeName}</span>
        <span className="text-xs text-gray-500">{employeeEmail}</span>
      </div>
      <hr className="mb-2 border-gray-300" />
      <div>
        <span className="block text-gray-600 text-sm font-semibold mb-1">Opciones</span>
        <div className="flex flex-col space-y-2">
        <Link
              to={`/permisos/${id}/solicitar`}
            className={`flex items-center text-gray-700 text-sm px-4 py-2 rounded-lg border border-slate-300 hover:bg-slate-300 ${isActive('/solicitar') ? 'bg-slate-300' : ''}`}
          >
            <FaFolderOpen className="mr-2" /> Solicitar
          </Link>
          <Link
              to={`/permisos/${id}/historial`}
            className={`flex items-center text-gray-700 text-sm px-4 py-2 rounded-lg border border-slate-300 hover:bg-slate-300 ${isActive('/historial') ? 'bg-slate-300' : ''}`}
          >
            <FaFolderOpen className="mr-2" /> Mis Permisos
          </Link>
          {/* <Link
            to="/permisos/reporte-mensual"
            className={`flex items-center text-gray-700 text-sm px-4 py-2 rounded-lg border border-slate-300 hover:bg-slate-300 ${isActive('/permisos/reporte-mensual') ? 'bg-slate-300' : ''}`}
          >
            <FaClipboardList className="mr-2" /> Reporte Mensual
          </Link> */}
        </div>
      </div>
    </div>
  );
};

export default LeaveSidebar;
