import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaRegClock, FaHistory, FaCalendarAlt, FaClipboardList } from "react-icons/fa";
import { useAuth } from "../../../../../hooks/useAuth";

const AttendanceSidebar = () => {
  const { user } = useAuth();
  const [currentTime, setCurrentTime] = useState("");

  // Function to get the current time in Ecuador timezone (GMT -5.0)
  const getCurrentTimeInEcuador = () => {
    const now = new Date();
    const options = { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false, timeZone: 'America/Guayaquil' };
    const timeString = new Intl.DateTimeFormat('en-US', options).format(now);
    const [hours, minutes, seconds] = timeString.split(':');
    return `${hours}h ${minutes}m ${seconds}s`;
  };

  useEffect(() => {
    const updateTime = () => {
      setCurrentTime(getCurrentTimeInEcuador());
    };

    updateTime(); // Initial call
    const timer = setInterval(updateTime, 1000); // Update every second

    // Clean up the interval on component unmount
    return () => clearInterval(timer);
  }, []);

  const handleMarkTime = () => {
    alert('Hora marcada!');
  };

  return (
    <div className="bg-slate-200 rounded-lg pt-6 px-6 w-64">
      <h5 className="text-gray-900 text-lg text-center font-bold mb-4 uppercase">Asistencia Laboral</h5>
      <Link className="flex flex-col items-center mb-6 text-gray-700 hover:text-blue-500" to="/perfil">
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
      <div className="text-center text-blue-500 text-xs font-medium mb-2 mt-4">
        Marcado: 27 de mayo a las 21:22
      </div>
      <div className="flex mb-4 bg-white rounded-lg py-2">
        <span className="text-base text-center font-semibold text-gray-700 mx-auto">{currentTime}</span>
        <button
          onClick={handleMarkTime}
          className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center focus:outline-none me-2"
        >
          <FaRegClock className="text-white text-sm" />
        </button>
      </div>
      <div className="mb-4">
        <span className="block text-gray-600 text-sm mb-1 font-semibold">Estado</span>
        <span className="bg-slate-100 text-green-600 text-sm font-semibold uppercase px-4 py-1 rounded-lg border border-gray-300">
          Presente
        </span>
      </div>
      <div>
        <span className="block text-gray-600 text-sm font-semibold mb-1">Opciones</span>
        <div className="flex flex-col space-y-2">
          <Link
            to="/historial-asistencia"
            className="flex items-center text-gray-700 text-sm px-4 py-2 rounded-lg border border-slate-300 hover:bg-slate-300"
          >
            <FaHistory className="mr-2" /> Historial de Asistencia
          </Link>
          <Link
            to="/horario-laboral"
            className="flex items-center text-gray-700 text-sm px-4 py-2 rounded-lg border border-slate-300 hover:bg-slate-300"
          >
            <FaCalendarAlt className="mr-2" /> Horario Laboral
          </Link>
          <Link
            to="/reporte-mensual"
            className="flex items-center text-gray-700 text-sm px-4 py-2 rounded-lg border border-slate-300 hover:bg-slate-300"
          >
            <FaClipboardList className="mr-2" /> Reporte Mensual
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AttendanceSidebar;
