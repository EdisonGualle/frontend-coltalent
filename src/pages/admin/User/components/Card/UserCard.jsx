import React from 'react';
import { Card, CardBody, Avatar, Typography } from '@material-tailwind/react';
import OptionsColumn from '../Table/OptionsColumn';

const UserCard = ({ user, updateUsers }) => {
  // Desestructuramos las propiedades del usuario
  const { id, name, email, photo = null } = user;
  // Construimos la URL de la foto del usuario
  const photoUrl = photo ? `${import.meta.env.VITE_STORAGE_URL}/${photo}` : null;

  return (
    <Card className="bg-gray-100 rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-105 transform">
      <CardBody className="flex flex-col items-center gap-2 p-4 relative">
        <div className="relative">
          {photoUrl ? (
            // Si el usuario tiene una foto, la mostramos
            <Avatar src={photoUrl} className="w-16 h-16 rounded-full border-2 border-blue-500 shadow-lg" />
          ) : (
            // Si no tiene foto, mostramos las iniciales del nombre
            <div className="w-16 h-16 rounded-full border-2 border-blue-500 shadow-lg flex items-center justify-center bg-gray-200">
              <Typography variant="h2" className="text-gray-600">
                {name.charAt(0).toUpperCase()}
              </Typography>
            </div>
          )}
        </div>
        <div className="text-center w-full">
          <Typography variant="h6" className="text-gray-800 mb-1 truncate">
            {name}
          </Typography>
          <Typography color="blue-gray" className="text-sm truncate">
            {email}
          </Typography>
        </div>
        <div className="absolute top-2 right-2">
          <OptionsColumn user={user} updateUsers={updateUsers} />
        </div>
      </CardBody>
    </Card>
  );
};

export default UserCard;