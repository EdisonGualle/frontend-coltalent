import React, { useEffect } from 'react';
import {
  RiCloseLine,
  RiUserLine,
  RiBuilding2Line,
  RiSuitcaseLine,
  RiMapPinLine,
  RiFilePaper2Line,
} from 'react-icons/ri';
import StatusBadge from './StatusBadge';
import ApprovalTimeline from './ApprovalTimeline';
import { formatRequestedPeriod } from './utils/formatRequestedPeriod';

const PermissionDetailModal = ({ data, onClose }) => {
  if (!data) return null;

  const {
    employee,
    leave_type,
    state,
    requested_period,
    reason,
    approval_steps,
    duration,
    attachment,
  } = data;

  const fileUrl = attachment
    ? `${import.meta.env.VITE_WEB_BASE_URL}/show/${attachment}`
    : null;

  const fileName = attachment ? attachment.split('/').pop() : null;

  const permissionTypeColor =
    leave_type.name === 'Pendiente'
      ? 'text-yellow-800'
      : leave_type.name === 'Aprobado'
        ? 'text-green-800'
        : 'text-red-800';

  // Manejo de cierre con tecla Escape
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30"
      onClick={onClose} // Cierra al hacer clic fuera del modal
    >
      <div
        className="bg-white rounded-lg shadow-lg max-w-4xl w-full p-6 relative max-h-[90vh] overflow-auto"
        onClick={(e) => e.stopPropagation()} // Evita que el clic dentro del modal cierre el modal
      >
        {/* Botón de cierre */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <RiCloseLine size={24} />
        </button>

        <div className="border border-gray-200 rounded-lg shadow-sm p-4">
          {/* Cabecera */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center">
              {employee.full_name}
              <StatusBadge status={state.name} />
            </h2>
            {/* Detalles del empleado */}
            <div className="bg-gray-50 py-4 rounded-lg mb-6">
              <ul className="space-y-3 text-sm text-gray-700">
                {employee.identification && (
                  <li className="flex items-center gap-2">
                    <RiUserLine className="text-gray-500" />
                    <span className="font-medium">Cédula:</span> {employee.identification}
                  </li>
                )}
                {employee.direction_name && (
                  <li className="flex items-center gap-2">
                    <RiBuilding2Line className="text-gray-500" />
                    <span className="font-medium">Dirección:</span> {employee.direction_name}
                  </li>
                )}
                {employee.unit_name && (
                  <li className="flex items-center gap-2">
                    <RiMapPinLine className="text-gray-500" />
                    <span className="font-medium">Unidad:</span> {employee.unit_name}
                  </li>
                )}
                {employee.position_name && (
                  <li className="flex items-center gap-2">
                    <RiSuitcaseLine className="text-gray-500" />
                    <span className="font-medium">Posición:</span> {employee.position_name}
                  </li>
                )}
              </ul>
            </div>
          </div>

          {/* Detalles del permiso */}
          <div className="grid grid-cols-2 gap-6 mb-6">
            {/* Columna izquierda */}
            <div>
              <p className="text-sm font-medium text-gray-600 mb-2">Periodo Solicitado</p>
              {formatRequestedPeriod(requested_period, duration, permissionTypeColor)}
            </div>

            {/* Columna derecha */}
            <div>
              <p className="text-sm font-medium text-gray-600 mb-2">Tipo de Permiso</p>
              <p className="ps-2 font-medium mb-4">{leave_type.name}</p>
              <p className="text-sm font-medium text-gray-600 mb-2">Motivo</p>
              <p className="ps-2 font-medium mb-4">{reason}</p>

              {/* Archivo adjunto */}
              {attachment && (
                <div className="mt-4">
                  <p className="text-sm font-medium text-gray-600 mb-2">Archivo Adjunto</p>
                  <div className="bg-gray-50 rounded-lg p-2 inline-block items-center gap-2 border border-gray-300">
                    <div className="flex gap-2">
                      <RiFilePaper2Line className="text-blue-500" size={20} />
                      <a
                        href={fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 text-sm hover:underline truncate"
                      >
                        {fileName}
                      </a>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          <hr className="mb-4" />
          {/* Línea de aprobación */}
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Línea de Aprobación</h3>
          <ApprovalTimeline steps={approval_steps} />
        </div>
      </div>
    </div>
  );
};

export default PermissionDetailModal;
