import React, { useState } from 'react';
import Select from 'react-select';
import { FaUmbrellaBeach, FaBriefcaseMedical, FaHome, FaUserMd, FaUniversity, FaPlus } from 'react-icons/fa';

// Mapeo de nombres de iconos a componentes de iconos
const iconOptions = {
  FaUmbrellaBeach,
  FaBriefcaseMedical,
  FaHome,
  FaUserMd,
  FaUniversity,
  FaPlus // Icono por defecto
};

const options = Object.keys(iconOptions).map(key => ({
  value: key,
  label: (
    <div className="flex items-center">
      {React.createElement(iconOptions[key], { className: 'mr-2' })}
      <span>{key}</span>
    </div>
  ),
  icon: React.createElement(iconOptions[key])
}));

const NewLeaveForm = ({ setLeaves }) => {
  const [newLeave, setNewLeave] = useState({ type: '', icon: 'FaPlus' });

  const handleSubmit = (e) => {
    e.preventDefault();
    setLeaves((prevLeaves) => [...prevLeaves, newLeave]);
    setNewLeave({ type: '', icon: 'FaPlus' }); // Reset form
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md m-2">
      <h2 className="text-xl font-bold text-center text-green-700 mb-4">Añadir Nuevo Permiso</h2>
      <div className="mb-4">
        <label className="block text-green-600 mb-2">Tipo de Permiso:</label>
        <input
          type="text"
          className="border border-gray-300 rounded-lg p-2 w-full"
          value={newLeave.type}
          onChange={(e) => setNewLeave({ ...newLeave, type: e.target.value })}
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-green-600 mb-2">Icono:</label>
        <Select
          options={options}
          defaultValue={options.find(option => option.value === 'FaPlus')}
          onChange={(selectedOption) => setNewLeave({ ...newLeave, icon: selectedOption.value })}
          className="border border-gray-300 rounded-lg p-2 w-full"
        />
      </div>
      <button
        type="submit"
        className="bg-green-600 text-white p-2 rounded-lg hover:bg-green-700 transition duration-200 ease-in-out"
      >
        Añadir Permiso
      </button>
    </form>
  );
};

export default NewLeaveForm;
