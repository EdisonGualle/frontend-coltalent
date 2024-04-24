import React from 'react';
import { Card, CardBody, Avatar, Typography } from '@material-tailwind/react';
import OptionsColumn from '../Table/OptionsColumn';

const EmployeeCard = ({ employee }) => {
  const { id, name, title, imgUrl = null } = employee;

  return (
    <Card className="max-w-xs mx-auto bg-blue-50 rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-105 transform">
      <CardBody className="flex flex-col items-center gap-2 p-4 relative">
        <div className="relative">
          {imgUrl ? (
            <Avatar src={imgUrl} className="w-20 h-20 rounded-full border-2 border-blue-500 shadow-lg" />
          ) : (
            <div className="w-20 h-20 rounded-full border-2 border-blue-500 shadow-lg flex items-center justify-center bg-gray-200">
              <Typography variant="h2" className="text-gray-600">
                {name.charAt(0).toUpperCase()}
              </Typography>
            </div>
          )}
        </div>
        <div className="text-center">
          <Typography variant="h6" className=" text-gray-800 mb-1">
            {name}
          </Typography>
          <Typography color="blue-gray" className="text-base">
            {title}
          </Typography>
        </div>
        <div className="absolute top-2 right-2">
          <OptionsColumn employeeId={id} />
        </div>
      </CardBody>
    </Card>
  );
};

export default EmployeeCard;