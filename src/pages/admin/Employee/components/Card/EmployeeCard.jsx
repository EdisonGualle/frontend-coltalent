import React, { memo } from 'react';
import { Card, CardBody, Avatar, Typography } from '@material-tailwind/react';
import OptionsColumn from '../Table/OptionsColumn';

const EmployeeCard = memo(({ employee, updateEmployees}) => {
  // Desestructuramos las propiedades del empleado
  const { id, full_name,identification, photo, position } = employee;
  // Construimos la URL de la foto del empleado
  const photoUrl = photo ? `${import.meta.env.VITE_STORAGE_URL}/${photo}` : null;

  return (
    <Card className="bg-gray-100 rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-105 transform">
      <CardBody className="flex flex-col items-center gap-2 p-4 relative">
        <div className="relative">
          {photoUrl ? (
            <Avatar src={photoUrl} className="w-16 h-16 rounded-full border-2 border-blue-500 shadow-lg" />
          ) : (
            <div className="w-16 h-16 rounded-full border-2 border-blue-500 shadow-lg flex items-center justify-center bg-gray-200">
              <Typography variant="h2" className="text-gray-600">
                {full_name && full_name.charAt(0).toUpperCase()}
              </Typography>
            </div>
          )}
        </div>
        <div className="text-center">
        <Typography color="blue-gray" className="text-sm">
            {position ? position.name : 'No hay posición asignada'}
          </Typography>
          <Typography variant="h6" className=" text-gray-800 mb-1">
            {full_name}
          </Typography>
          <Typography color="blue-gray" className="text-sm">
            {identification}
          </Typography>
        </div>
        <div className="absolute top-2 right-2">
          <OptionsColumn employee={employee} updateEmployees={updateEmployees} />
        </div>
      </CardBody>
    </Card>
  );
});

export default EmployeeCard;