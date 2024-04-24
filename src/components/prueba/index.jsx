import React from 'react';
import { Card, CardBody, CardFooter, Typography } from '@material-tailwind/react';
import { FaUserFriends, FaMapMarkerAlt } from 'react-icons/fa';

const departments = [
  {
    name: 'Ventas',
    description: 'Departamento encargado de las ventas y el marketing.',
    employees: 25,
    location: 'Ciudad de México',
  },
  {
    name: 'Finanzas',
    description: 'Departamento encargado de la contabilidad y las finanzas.',
    employees: 15,
    location: 'Monterrey',
  },
];

const DepartmentCard = ({ department }) => {
  return (
    <Card className="mt-6">
      <CardBody>
        <Typography variant="h5" className="mb-2">
          {department.name}
        </Typography>
        <Typography color="gray" className="font-normal mb-4">
          {department.description}
        </Typography>
      </CardBody>
      <CardFooter className="flex items-center justify-between">
        <div className="flex items-center">
          <FaUserFriends className="text-gray-700 mr-2" />
          <Typography color="gray" className="font-normal">
            {department.employees} empleados
          </Typography>
        </div>
        <div className="flex items-center">
          <FaMapMarkerAlt className="text-gray-700 mr-2" />
          <Typography color="gray" className="font-normal">
            {department.location}
          </Typography>
        </div>
      </CardFooter>
    </Card>
  );
};

const Department = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {departments.map((department, index) => (
        <DepartmentCard key={index} department={department} />
      ))}
    </div>
  );
};

export default Department;