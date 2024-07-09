import React, { useState, useEffect } from "react";
import { Routes, Route, useParams, Navigate } from "react-router-dom";

import PerfilSidebar from "./components/common/PerfilSidebar";
import PerfilHeader from "./components/common/PerfilHeader";

import PersonalData from "./Information/PersonalData";
import Education from "./Ability/Education";
import Language from "./Ability/Language";
import Publication from "./Ability/Publication";
import Training from "./Ability/Training";
import WorkExperience from "./Ability/WorkExperience";
import WorkReference from "./Ability/WorkReference";
import { getEmployee } from "../../../services/Employee/EmployeService1";

const Perfil = () => {
  const { id } = useParams();
  const [isValidId, setIsValidId] = useState(null);

  useEffect(() => {
    const checkEmployeeId = async () => {
      try {
        const response = await getEmployee(id);
        if (response) {
          setIsValidId(true);
        } else {
          setIsValidId(false);
        }
      } catch (error) {
        setIsValidId(false);
      }
    };

    if (/^\d+$/.test(id)) {
      checkEmployeeId();
    } else {
      setIsValidId(false);
    }
  }, [id]);

  if (isValidId === null) {
    return (
      <div className="flex items-center justify-center mt-52 ">
        <div
          className="w-12 h-12 rounded-full animate-spin border-y-2 border-solid border-violet-200 border-t-transparent shadow-md">
        </div>
      </div>
    );
  }

  if (!isValidId) {
    return <Navigate to="/404" replace />;
  }

  return (
    <div className="flex h-[80vh] w-full">
      <div className="bg-slate-200 overflow-auto custom-scrollbar rounded-lg mt-1">
        <PerfilSidebar />
      </div>
      <div className="flex flex-col w-3/4 mt-1 ms-2">
        <PerfilHeader />
        <div className=" flex-1  overflow-auto custom-scrollbar">
          <Routes>
            <Route path="datos-personales" index element={<PersonalData />} />
            <Route path="educacion" element={<Education />} />
            <Route path="idiomas" element={<Language />} />
            <Route path="publicaciones" element={<Publication />} />
            <Route path="capacitaciones" element={<Training />} />
            <Route path="experiencia-laboral" element={<WorkExperience />} />
            <Route path="referencia-laboral" element={<WorkReference />} />
            <Route path="*" element={<Navigate to="/404" replace />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default Perfil;
