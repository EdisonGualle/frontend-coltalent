import React from 'react';
import { Link } from 'react-router-dom';

export function AvatarCell({ value, column, row }) {
  const baseUrl = import.meta.env.VITE_STORAGE_URL; // Obtener la URL base desde las variables de entorno
  const photoPath = row.original[column.imgAccessor]; // Obtener la ruta relativa de la imagen

  // Verificar si hay una ruta de imagen válida
  const hasPhoto = photoPath && photoPath.trim() !== '';

  // Construir la URL completa solo si hay una ruta de imagen válida
  const photoUrl = hasPhoto ? `${baseUrl}/${photoPath}` : '';

  return (
    <div className="flex items-center">
      <div className="flex-shrink-0 h-10 w-10">
      <img className="h-10 w-10 rounded-full" src={photoUrl} alt="" />
      </div>
      <div className="ml-4">
        <div className="text-sm font-medium text-gray-900">
        <Link to={`/perfil/${row.original.employee_id}`}>{value}</Link>
        </div>
        <div className="text-sm text-gray-500">
          {row.original[column.emailAccessor]}
        </div>
      </div>
    </div>
  );
}