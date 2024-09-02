import React, { useState } from 'react';
import { Button, Typography } from "@material-tailwind/react";
import { RiFileExcel2Line } from "react-icons/ri";

const ExportConfigForm = ({ onSubmit, onCancel }) => {
  const [status, setStatus] = useState('');
  const [withPersonalInfo, setWithPersonalInfo] = useState(false);
  const [withContactInfo, setWithContactInfo] = useState(false);
  const [withResidenceInfo, setWithResidenceInfo] = useState(false);
  const [withPositionInfo, setWithPositionInfo] = useState(false);

  const handleSubmit = () => {
    const params = {};
    if (status) params.status = status;
    if (withPersonalInfo) params.with_personal_info = true;
    if (withContactInfo) params.with_contact_info = true;
    if (withResidenceInfo) params.with_residence_info = true;
    if (withPositionInfo) params.with_position_info = true;

    onSubmit(params);
  };

  return (
    <div className="p-4">
      <div className="mb-4">
        <Typography variant="h6" className="mb-2">Estado:</Typography>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-full p-2 border rounded-md"
        >
          <option value="">Todos</option>
          <option value="activos">Activos</option>
          <option value="inactivos">Inactivos</option>
        </select>
      </div>

      <div className="mb-4">
        <div className="flex items-center mb-4">
          <label className="relative inline-block w-9 h-5">
            <input
              type="checkbox"
              className="peer invisible"
              checked={withPersonalInfo}
              onChange={() => setWithPersonalInfo(!withPersonalInfo)}
            />
            <span className="absolute top-0 left-0 w-full h-full cursor-pointer rounded-full bg-slate-200 border border-slate-300 transition-all duration-100 peer-checked:bg-sky-700"></span>
            <span className="absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full z-10 transition-all duration-100 peer-checked:translate-x-4"></span>
          </label>
          <Typography variant="subtitle1" className="ml-3">Información Personal</Typography>
        </div>

        <div className="flex items-center mb-4">
          <label className="relative inline-block w-9 h-5">
            <input
              type="checkbox"
              className="peer invisible"
              checked={withContactInfo}
              onChange={() => setWithContactInfo(!withContactInfo)}
            />
            <span className="absolute top-0 left-0 w-full h-full cursor-pointer rounded-full bg-slate-200 border border-slate-300 transition-all duration-100 peer-checked:bg-sky-700"></span>
            <span className="absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full z-10 transition-all duration-100 peer-checked:translate-x-4"></span>
          </label>
          <Typography variant="subtitle1" className="ml-3">Información de Contacto</Typography>
        </div>

        <div className="flex items-center mb-4">
          <label className="relative inline-block w-9 h-5">
            <input
              type="checkbox"
              className="peer invisible"
              checked={withResidenceInfo}
              onChange={() => setWithResidenceInfo(!withResidenceInfo)}
            />
            <span className="absolute top-0 left-0 w-full h-full cursor-pointer rounded-full bg-slate-200 border border-slate-300 transition-all duration-100 peer-checked:bg-sky-700"></span>
            <span className="absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full z-10 transition-all duration-100 peer-checked:translate-x-4"></span>
          </label>
          <Typography variant="subtitle1" className="ml-3">Información de Residencia</Typography>
        </div>

        <div className="flex items-center mb-4">
          <label className="relative inline-block w-9 h-5">
            <input
              type="checkbox"
              className="peer invisible"
              checked={withPositionInfo}
              onChange={() => setWithPositionInfo(!withPositionInfo)}
            />
            <span className="absolute top-0 left-0 w-full h-full cursor-pointer rounded-full bg-slate-200 border border-slate-300 transition-all duration-100 peer-checked:bg-sky-700"></span>
            <span className="absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full z-10 transition-all duration-100 peer-checked:translate-x-4"></span>
          </label>
          <Typography variant="subtitle1" className="ml-3">Información de Posición Laboral</Typography>
        </div>
      </div>

      <div className="flex justify-end gap-4 mt-4">
        <button
          type="submit"
          className="p-2 px-4 rounded-xl text-white w-full bg-green-500 border border-transparent transform transition-all duration-300 hover:scale-105 flex items-center justify-center"
          onClick={handleSubmit}
        >
          <RiFileExcel2Line className="w-6 h-6 mr-2 inline-block" />
          Exportar
        </button>
        <button
          type="button"
          className="p-2 rounded-xl bg-transparent border border-dashed border-gray-400 w-full outline-none transform transition-all duration-300 hover:scale-105 text-black"
          onClick={onCancel}
        >
          Cancelar
        </button>
      </div>

    </div>
  );
};

export default ExportConfigForm;
