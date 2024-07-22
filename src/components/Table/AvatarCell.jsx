import React from 'react';
import { Link } from 'react-router-dom';

export function AvatarCell({ value, column, row }) {
  const baseUrl = import.meta.env.VITE_STORAGE_URL; // Obtener la URL base desde las variables de entorno
  const manager = row.original.manager; // Obtener el manager del row.original

  // Verificar si hay un manager y una ruta de imagen válida
  const hasPhoto = manager && manager.photo && manager.photo.trim() !== '';

  // Construir la URL completa solo si hay una ruta de imagen válida
  const photoUrl = hasPhoto ? `${baseUrl}/${manager.photo}` : '';


  return (
    <div className="flex items-center">
      {hasPhoto && (
        <div className="flex-shrink-0 h-10 w-10">
          <img className="h-10 w-10 rounded-full" src={photoUrl} alt="" />
        </div>
      )}
      <div className="ml-4">
        <div className="text-sm font-medium text-gray-900">
          <Link to={`/perfil/${manager?.id}/datos-personales`}>{value}</Link>
        </div>
      </div>
    </div>
  );
}
