import React from 'react';
import { classNames } from '../../assets/Utils';

export function StatusPill({ value }) {
  const estado = value ? value.toLowerCase() : "desconocido";
  return (
    <span
      className={classNames(
        "px-3 py-1 capitalize leading-wide font-bold text-xs rounded-lg shadow-sm",
        estado.startsWith("activo") ? "bg-green-100 text-green-700" : null,
        estado.startsWith("inactivo") ? "bg-yellow-100 text-yellow-700" : null,
        estado.startsWith("pendiente") ? "bg-blue-100 text-blue-700" : null
      )}
    >
      {estado}
    </span>
  );
}