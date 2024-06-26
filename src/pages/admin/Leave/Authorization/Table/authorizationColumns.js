// Columnas para el Administrador en authorizationColumns.js

export const adminColumns = {
  default: [
    { id: 'employee.identification', label: 'Cédula' },
    { id: 'employee.name', label: 'Solicitante' },
    { id: 'employee.organization_details', label: 'Organización' },
    { id: 'employee.position_name', label: 'Cargo' },
    { id: 'created_at', label: 'Fecha de solicitud' },
    { id: 'leave_type.name', label: 'Tipo de permiso' },
    { id: 'requested_period', label: 'Fecha Solicitada' },
    { id: 'state.name', label: 'Estado' },
    { id: 'reason', label: 'Motivo' },
    { id: 'comentario_1.commented_by_full_name', label: 'Evaluador' },
    { id: 'comentario_1.action', label: 'Estado de evaluación' },
  ],
  pending: [
    // columnas específicas para el filtro 'pending' para el administrador
  ],
  approved: [
    // columnas específicas para el filtro 'approved' para el administrador
  ],
  // Agregar más filtros si es necesario
};
