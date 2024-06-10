import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FaUserCircle,
  FaBriefcase,
  FaSchool,
  FaBook,
  FaChalkboardTeacher,
  FaClipboardList,
  FaFingerprint,
  FaMapMarked,
  FaTable,
  FaGlobe,
  FaUserTie
} from 'react-icons/fa';
import { useAuth } from "../../../../../hooks/useAuth";

const PerfilSidebar = () => {
  const { user } = useAuth();
  const location = useLocation();

  const isActive = (path) => location.pathname.includes(path);

  return (
    <div className="bg-slate-200 shadow-lg rounded-lg p-4 w-64">
      <h5 className="text-gray-900 text-lg text-center font-bold mb-4">PERFIL EMPLEADO</h5>
      <Link className="flex flex-col items-center mb-6 text-gray-700 hover:text-blue-500" to="">
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
      <hr className="mb-4 border-gray-300" />
      <h6 className="text-gray-700 text-xs uppercase font-bold mb-2">Información del Empleado</h6>
      <ul className="space-y-2">
        <li>
          <Link
            className={`flex items-center text-sm ${isActive('/perfil/datos-personales') ? 'text-blue-500 font-bold' : 'text-gray-700'} hover:text-blue-500`}
            to="/perfil/datos-personales"
          >
            <FaUserCircle className="mr-2" /> Datos Personales
          </Link>
        </li>
        <li>
          <Link
            className={`flex items-center text-sm ${isActive('/perfil/datos-laborales') ? 'text-blue-500 font-bold' : 'text-gray-700'} hover:text-blue-500`}
            to="/perfil/datos-laborales"
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
            className={`flex items-center text-sm ${isActive('/perfil/educacion') ? 'text-blue-500 font-bold' : 'text-gray-700'} hover:text-blue-500`}
            to="/perfil/educacion"
          >
            <FaSchool className="mr-2" /> Educación
          </Link>
        </li>
        <li>
          <Link
            className={`flex items-center text-sm ${isActive('/perfil/idiomas') ? 'text-blue-500 font-bold' : 'text-gray-700'} hover:text-blue-500`}
            to="/perfil/idiomas"
          >
            <FaGlobe className="mr-2" /> Idiomas
          </Link>
        </li>
        <li>
          <Link
            className={`flex items-center text-sm ${isActive('/perfil/publicaciones') ? 'text-blue-500 font-bold' : 'text-gray-700'} hover:text-blue-500`}
            to="/perfil/publicaciones"
          >
            <FaBook className="mr-2" /> Publicaciones
          </Link>
        </li>
        
        <li>
          <Link
            className={`flex items-center text-sm ${isActive('/perfil/capacitaciones') ? 'text-blue-500 font-bold' : 'text-gray-700'} hover:text-blue-500`}
            to="/perfil/capacitaciones"
          >
            <FaChalkboardTeacher className="mr-2" /> Capacitaciones
          </Link>
        </li>
        <li>
          <Link
            className={`flex items-center text-sm ${isActive('/perfil/experiencia-laboral') ? 'text-blue-500 font-bold' : 'text-gray-700'} hover:text-blue-500`}
            to="/perfil/experiencia-laboral"
          >
            <FaBriefcase className="mr-2" /> Experiencia Laboral
          </Link>
        </li>
        <li>
          <Link
            className={`flex items-center text-sm ${isActive('/perfil/referencia-laboral') ? 'text-blue-500 font-bold' : 'text-gray-700'} hover:text-blue-500`}
            to="/perfil/referencia-laboral"
          >
            <FaUserTie className="mr-2" /> Referencia Laboral
          </Link>
        </li>
      </ul>

      <hr className="my-4 border-gray-300" />
      <h6 className="text-gray-700 text-xs uppercase font-bold mb-2">Asistencia y Actividades</h6>
      <ul className="space-y-2">
        <li>
          <Link
            className={`flex items-center text-sm ${isActive('/perfil/asistencias') ? 'text-blue-500 font-bold' : 'text-gray-700'} hover:text-blue-500`}
            to="/perfil/asistencias"
          >
            <FaTable className="mr-2" /> Asistencias
          </Link>
        </li>
        <li>
          <Link
            className={`flex items-center text-sm ${isActive('/perfil/permisos') ? 'text-blue-500 font-bold' : 'text-gray-700'} hover:text-blue-500`}
            to="/perfil/permisos"
          >
            <FaClipboardList className="mr-2" /> Permisos
          </Link>
        </li>
        <li>
          <Link
            className={`flex items-center text-sm ${isActive('/perfil/salidas-a-campo') ? 'text-blue-500 font-bold' : 'text-gray-700'} hover:text-blue-500`}
            to="/perfil/salidas-a-campo"
          >
            <FaMapMarked className="mr-2" /> Salidas a Campo
          </Link>
        </li>
      </ul>

      <hr className="my-4 border-gray-300" />
      <h6 className="text-gray-700 text-xs uppercase font-bold mb-2">Configuración</h6>
      <ul className="space-y-2">
        <li>
          <Link
            className={`flex items-center text-sm ${isActive('/perfil/cambiar-contrasena') ? 'text-blue-500 font-bold' : 'text-gray-700'} hover:text-blue-500`}
            to="/perfil/cambiar-contrasena"
          >
            <FaFingerprint className="mr-2" /> Cambiar Contraseña
          </Link>
        </li>
        <li>
          <Link
            className={`flex items-center text-sm ${isActive('/perfil/notificaciones') ? 'text-blue-500 font-bold' : 'text-gray-700'} hover:text-blue-500`}
            to="/perfil/notificaciones"
          >
            <FaClipboardList className="mr-2" /> Notificaciones
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default PerfilSidebar;
