import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import PerfilSidebar from "./components/common/PerfilSidebar";
import PerfilHeader from "./components/common/PerfilHeader";
import Dashboard from "./Dashboard";

import PersonalData from "./Information/PersonalData";
import Education from "./Ability/Education";
import Language from "./Ability/Language";
import Publication from "./Ability/Publication";
import Training from "./Ability/Training";
import WorkExperience from "./Ability/WorkExperience";
import WorkReference from "./Ability/WorkReference";

const Perfil = () => {
  return (
    <div className="flex h-[76vh]">
      <div className=" bg-slate-200 overflow-auto custom-scrollbar shadow-lg rounded-lg mt-1">
        <PerfilSidebar />
      </div>

      <div className="flex flex-col w-3/4  mt-1 ms-2 ">
        <PerfilHeader />
        <div className="flex-1  shadow-lg overflow-auto custom-scrollbar ">
          <Routes>
            <Route index element={<Dashboard />} />
            <Route path="datos-personales" element={<PersonalData />} />
            <Route path="educacion" element={<Education />} />
            <Route path="idiomas" element={<Language />} />
            <Route path="publicaciones" element={<Publication />} />
            <Route path="capacitaciones" element={<Training />} />
            <Route path="experiencia-laboral" element={<WorkExperience />} />
            <Route path="referencia-laboral" element={<WorkReference />} />

            {/* Redirección específica */}
            <Route path="asistencias" element={<Navigate to="/asistencia" replace />} />

            {/* Maneja rutas no definidas dentro de Perfil */}
            <Route path="*" element={<Navigate to="/404" replace />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default Perfil;




