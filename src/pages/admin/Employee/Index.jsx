import React, { useState } from 'react';
import { RiGalleryView2, RiUserAddLine, RiListView } from "react-icons/ri";
import { CardHeader, Typography, Button } from "@material-tailwind/react";
import EmployeeList from './components/Card/EmployeeList';
import EmployeeTable from './components/Table/EmployeTable'; // Asegúrate de importar correctamente el componente EmployeeTable

const EmployeeIndex = () => {
  const [showList, setShowList] = useState(true);

  const handleDelete = (employeeId) => {
    // Lógica para eliminar un empleado
    console.log('Eliminar empleado con ID:', employeeId);
  };

  const handleDisable = (employeeId) => {
    // Lógica para deshabilitar un empleado
    console.log('Deshabilitar empleado con ID:', employeeId);
  };

  const handleViewChange = (view) => {
    setShowList(view === 'list' || view === 'gallery');
  };

  return (
    <>
      <CardHeader floated={false} shadow={false} className="rounded-none mt-0">
        <div className="mb-2 flex items-center justify-between gap-8">
          <div>
            <Typography variant="h5" color="blue-gray" className="font-semibold">
              Lista de miembros
            </Typography>
            <Typography color="gray" className="mt-1">
              Ver información sobre todos los empleados
            </Typography>
          </div>
          <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
            <Button
              className="flex items-center bg-cyan-500 text-white hover:bg-cyan-600 transition-colors rounded-xl"
              size="sm"
              onClick={() => handleViewChange('gallery')}
            >
              <RiGalleryView2 className="h-5 w-5" />
            </Button>
            <Button
              className="flex items-center bg-teal-500 text-white hover:bg-teal-600 transition-colors rounded-xl"
              size="sm"
              onClick={() => handleViewChange('table')}
            >
              <RiListView className="h-5 w-5" />
            </Button>
            <Button
              className="flex items-center gap-3 bg-blue-500 text-white hover:bg-blue-600 transition-colors rounded-xl py-2 px-5"
              size="sm"
            >
              <RiUserAddLine className="h-5 w-5" />
              <span className="font-semibold">Nuevo Empleado</span>
            </Button>
          </div>
        </div>
      </CardHeader>
      {showList ? (
        <EmployeeList />
      ) : (
        <EmployeeTable onDelete={handleDelete} onDisable={handleDisable} />
      )}
    </>
  );
};

export default EmployeeIndex;
