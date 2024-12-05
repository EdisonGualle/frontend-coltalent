import React, { useState, useEffect } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { getEmployee } from "../../../../../services/Employee/EmployeService1";

import {
  FaUserCircle,
  FaBriefcase,
  FaSchool,
  FaBook,
  FaChalkboardTeacher,
  FaClipboardList,
  FaGlobe,
  FaUserTie,
  FaEnvelope,
  FaHome
} from 'react-icons/fa';

const PerfilSidebar = () => {
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

  const isActive = (path) => location.pathname.includes(`/perfil/${id}${path}`);

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

  return (
    <div className="bg-gray-200  rounded-lg p-4 w-64  mb-1">
      <h5 className="text-gray-900 text-lg text-center font-bold mb-4">PERFIL EMPLEADO</h5>
      <div className="flex flex-col items-center mb-6 text-gray-700 hover:text-blue-500">
        {renderAvatar()}
        <span className="text-sm font-semibold">{employeeName}</span>
        <span className="text-xs text-gray-500">{employeeEmail}</span>
      </div>
      <hr className="mb-4 border-gray-300" />
      <h6 className="text-gray-700 text-xs uppercase font-bold mb-2">Información del Empleado</h6>
      <ul className="space-y-2">
        <li>
          <Link
            className={`flex items-center text-sm ${isActive('/datos-personales') ? 'text-blue-500 font-bold' : 'text-gray-700'} hover:text-blue-500`}
            to={`/perfil/${id}/datos-personales`}
          >
            <FaUserCircle className="mr-2" /> Datos Personales
          </Link>
        </li>
        <li>
          <Link
            className={`flex items-center text-sm ${isActive('/datos-contacto') ? 'text-blue-500 font-bold' : 'text-gray-700'} hover:text-blue-500`}
            to={`/perfil/${id}/datos-contacto`}
          >
            <FaEnvelope className="mr-2" /> Datos de Contacto
          </Link>
        </li>
        <li>
          <Link
            className={`flex items-center text-sm ${isActive('/datos-residencia') ? 'text-blue-500 font-bold' : 'text-gray-700'} hover:text-blue-500`}
            to={`/perfil/${id}/datos-residencia`}
          >
            <FaHome className="mr-2" /> Datos de Residencia
          </Link>
        </li>
        <li>
          <Link
            className={`flex items-center text-sm ${isActive('/datos-laborales') ? 'text-blue-500 font-bold' : 'text-gray-700'} hover:text-blue-500`}
            to={`/perfil/${id}/datos-laborales`}
          >
            <FaBriefcase className="mr-2" /> Datos Laborales
          </Link>
        </li>
      </ul>

      <hr className="my-4 border-gray-300" />
      <h6 className="text-gray-700 text-xs uppercase font-bold mb-2">Formación y Habilidades</h6>
      <ul className="space-y-2">
        <li>
          <Link
            className={`flex items-center text-sm ${isActive('/educacion') ? 'text-blue-500 font-bold' : 'text-gray-700'} hover:text-blue-500`}
            to={`/perfil/${id}/educacion`}
          >
            <FaSchool className="mr-2" /> Educación
          </Link>
        </li>
        <li>
          <Link
            className={`flex items-center text-sm ${isActive('/idiomas') ? 'text-blue-500 font-bold' : 'text-gray-700'} hover:text-blue-500`}
            to={`/perfil/${id}/idiomas`}
          >
            <FaGlobe className="mr-2" /> Idiomas
          </Link>
        </li>
        <li>
          <Link
            className={`flex items-center text-sm ${isActive('/publicaciones') ? 'text-blue-500 font-bold' : 'text-gray-700'} hover:text-blue-500`}
            to={`/perfil/${id}/publicaciones`}
          >
            <FaBook className="mr-2" /> Publicaciones
          </Link>
        </li>
        
        <li>
          <Link
            className={`flex items-center text-sm ${isActive('/capacitaciones') ? 'text-blue-500 font-bold' : 'text-gray-700'} hover:text-blue-500`}
            to={`/perfil/${id}/capacitaciones`}
          >
            <FaChalkboardTeacher className="mr-2" /> Capacitaciones
          </Link>
        </li>
        <li>
          <Link
            className={`flex items-center text-sm ${isActive('/experiencia-laboral') ? 'text-blue-500 font-bold' : 'text-gray-700'} hover:text-blue-500`}
            to={`/perfil/${id}/experiencia-laboral`}
          >
            <FaBriefcase className="mr-2" /> Experiencia Laboral
          </Link>
        </li>
        <li>
          <Link
            className={`flex items-center text-sm ${isActive('/referencia-laboral') ? 'text-blue-500 font-bold' : 'text-gray-700'} hover:text-blue-500`}
            to={`/perfil/${id}/referencia-laboral`}
          >
            <FaUserTie className="mr-2" /> Referencia Laboral
          </Link>
        </li>
      </ul>

      <hr className="my-4 border-gray-300" />
      <h6 className="text-gray-700 text-xs uppercase font-bold mb-2">Actividades</h6>
      <ul className="space-y-2">
        <li>
          <Link
            className={`flex items-center text-sm ${isActive('/permisos') ? 'text-blue-500 font-bold' : 'text-gray-700'} hover:text-blue-500`}
            to={`/permisos/${id}/solicitar`}
          >
            <FaClipboardList className="mr-2" /> Permisos
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default PerfilSidebar;
