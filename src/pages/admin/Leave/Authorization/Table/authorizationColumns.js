import { renderRequestedPeriod } from "./requestedPeriod";

export const adminColumns = {
  pendientes: [
    { id: "created_at", label: "Fecha de solicitud" },
    { id: "employee.identification", label: "Cédula" },
    { id: "employee.full_name", label: "Solicitante" },
    { id: "leave_type.name", label: "Tipo de permiso" },
    {
      id: "requested_period",
      label: "Fecha Solicitada",
      autoWidth: true,
      render: renderRequestedPeriod, // Render personalizado
    },
    { id: "state.name", label: "Estado" },
  ],
  aprobados: [
    { id: "created_at", label: "Fecha de solicitud" },
    { id: "employee.identification", label: "Cédula" },
    { id: "employee.full_name", label: "Solicitante" },
    { id: "leave_type.name", label: "Tipo de permiso" },
    {
      id: "requested_period",
      label: "Fecha Solicitada",
      autoWidth: true,
      render: renderRequestedPeriod, // Render personalizado
    },
    { id: "state.name", label: "Estado" },
  ],
  rechazados: [
    { id: "created_at", label: "Fecha de solicitud", autoWidth: true },
    { id: "employee.identification", label: "Cédula" },
    { id: "employee.full_name", label: "Solicitante" },
    { id: "leave_type.name", label: "Tipo de permiso" },
    {
      id: "requested_period",
      label: "Fecha Solicitada",
      autoWidth: true,
      render: renderRequestedPeriod, // Render personalizado
    },
    { id: "state.name", label: "Estado" },
  ],
  historial: [
    // { id: "created_at", label: "Fecha de solicitud", autoWidth: true },
    { id: "created_at", label: "Fecha de solicitud"},
    { id: "employee.identification", label: "Cédula" },
    { id: "employee.full_name", label: "Solicitante" },
    { id: "leave_type.name", label: "Tipo de permiso" },
    {
      id: "requested_period",
      label: "Fecha Solicitada",
      autoWidth: true,
      render: renderRequestedPeriod, // Render personalizado
    },
    { id: "state.name", label: "Estado" },
  ],
};

export const generalColumns = [
  {
    id: "employee.position_name",
    label: "Cargo",
    autoWidth: true,
  },
  {
    id: "employee.unit_name",
    label: "Unidad",
    autoWidth: true,
  },
  {
    id: "employee.direction_name",
    label: "Dirección",
    autoWidth: true,
  },
];


export const adminFilters = {
  pendientes: [
    { column: "leave_type.name", label: "Tipo de Permiso" }, // Solo el tipo de permiso
  ],
  aprobados: [
    { column: "leave_type.name", label: "Tipo de Permiso" }, // Solo el tipo de permiso
  ],
  rechazados: [
    { column: "leave_type.name", label: "Tipo de Permiso" }, // Solo el tipo de permiso
  ],
  historial: [
    { column: "leave_type.name", label: "Tipo de Permiso" }, // Tipo de permiso
    { column: "state.name", label: "Estado" },               // Estado
  ],
};



export const jefeDireccionColumns = {
  pendientes: [
    { id: "employee.identification", label: "Cédula" },
    { id: "employee.full_name", label: "Solicitante" },
    {
      id: "employee.position_name",
      label: "Datos Laborales",
      showIcon: true,
      modalTitle: "Datos Laborales",
      modalConfig: [
        { key: "employee.direction_name", label: "Dirección" },
        { key: "employee.unit_name", label: "Unidad" },
        { key: "employee.position_name", label: "Cargo" },
      ],
    },
    { id: "created_at", label: "Fecha de solicitud", autoWidth: true },
    { id: "leave_type.name", label: "Tipo de permiso" },
    { id: "requested_period", label: "Fecha Solicitada", autoWidth: true },
    { id: "duration", label: "Duración", autoWidth: true },
    { id: "state.name", label: "Estado" },
    {
      id: "reason",
      label: "Motivo",
      showIcon: true,
      modalConfig: [{ key: "reason", label: "Motivo" }],
    },
    {
      id: "attachment",
      label: "Archivo adjunto",
      showIcon: true,
    },
  ],
  aprobados: [
    { id: "employee.identification", label: "Cédula" },
    { id: "employee.full_name", label: "Solicitante" },
    {
      id: "employee.position_name",
      label: "Datos Laborales",
      showIcon: true,
      modalTitle: "Datos Laborales",
      modalConfig: [
        { key: "employee.direction_name", label: "Dirección" },
        { key: "employee.unit_name", label: "Unidad" },
        { key: "employee.position_name", label: "Cargo" },
      ],
    },
    { id: "created_at", label: "Fecha de solicitud", autoWidth: true },
    { id: "leave_type.name", label: "Tipo de permiso" },
    { id: "requested_period", label: "Fecha Solicitada", autoWidth: true },
    { id: "duration", label: "Duración", autoWidth: true },
    { id: "state.name", label: "Estado" },
    {
      id: "reason",
      label: "Motivo",
      showIcon: true,
      modalConfig: [{ key: "reason", label: "Motivo" }],
    },
    {
      id: "attachment",
      label: "Archivo adjunto",
      showIcon: true,
    },
    {
      id: "comentario_1.commented_by_name",
      label: "Detalles de evaluación",
      showIcon: true,
      modalTitle: "Detalles de evaluación",
      modalConfig: [
        { key: "comentario_1.commented_by_name", label: "Evaluador" },
        { key: "comentario_1.action", label: "Estado de evaluación" },
        { key: "comentario_1.comment", label: "Comentario" },
        { key: "comentario_1.interaction_date", label: "Fecha de evalución" },
      ],
    },
  ],
  rechazados: [
    { id: "employee.identification", label: "Cédula" },
    { id: "employee.full_name", label: "Solicitante" },
    {
      id: "employee.position_name",
      label: "Datos Laborales",
      showIcon: true,
      modalTitle: "Datos Laborales",
      modalConfig: [
        { key: "employee.direction_name", label: "Dirección" },
        { key: "employee.unit_name", label: "Unidad" },
        { key: "employee.position_name", label: "Cargo" },
      ],
    },
    { id: "created_at", label: "Fecha de solicitud", autoWidth: true },
    { id: "leave_type.name", label: "Tipo de permiso" },
    { id: "requested_period", label: "Fecha Solicitada", autoWidth: true },
    { id: "duration", label: "Duración", autoWidth: true },
    { id: "state.name", label: "Estado" },
    {
      id: "reason",
      label: "Motivo",
      showIcon: true,
      modalConfig: [{ key: "reason", label: "Motivo" }],
    },
    {
      id: "attachment",
      label: "Archivo adjunto",
      showIcon: true,
    },
    {
      id: "comentario_1.commented_by_name",
      label: "Detalles de evaluación",
      showIcon: true,
      modalTitle: "Detalles de evaluación",
      modalConfig: [
        { key: "comentario_1.commented_by_name", label: "Evaluador" },
        { key: "comentario_1.action", label: "Estado de evaluación" },
        { key: "comentario_1.rejection_reason", label: "Motivo de rechazo" },
        { key: "comentario_1.comment", label: "Comentario" },
        { key: "comentario_1.interaction_date", label: "Fecha de evalución" },
      ],
    },
  ],
  historial: [
    { id: "employee.identification", label: "Cédula" },
    { id: "employee.full_name", label: "Solicitante" },
    {
      id: "employee.position_name",
      label: "Datos Laborales",
      showIcon: true,
      modalConfig: [
        { key: "employee.direction_name", label: "Dirección" },
        { key: "employee.unit_name", label: "Unidad" },
        { key: "employee.position_name", label: "Cargo" },
      ],
    },
    { id: "created_at", label: "Fecha de solicitud", autoWidth: true },
    { id: "leave_type.name", label: "Tipo de permiso" },
    { id: "requested_period", label: "Fecha Solicitada", autoWidth: true },
    { id: "duration", label: "Duración", autoWidth: true },
    { id: "state.name", label: "Estado" },
    {
      id: "reason",
      label: "Motivo",
      showIcon: true,
      modalConfig: [{ key: "reason", label: "Motivo" }],
    },
    {
      id: "attachment",
      label: "Archivo adjunto",
      showIcon: true,
    },
    {
      id: "combined_evaluators",
      label: "Evaluadores",
      combineFields: [
        "comentario_1.commented_by_name",
        "comentario_2.commented_by_name",
      ],
    },
    {
      id: "evaluadores",
      label: "Detalles de Evaluación",
      showIcon: true,
      modalTitle: "Detalles de Evaluación",
      modalConfig: [
        [
          { key: "comentario_1.commented_by_name", label: "Evaluador" },
          { key: "comentario_1.commented_by_position", label: "Cargo" },
          { key: "comentario_1.action", label: "Estado de Evaluación" },
          { key: "comentario_1.rejection_reason", label: "Motivo de rechazo" },
          { key: "comentario_1.comment", label: "Comentario" },
          { key: "comentario_1.interaction_date", label: "Fecha de evalución" },
        ],
        [
          { key: "comentario_2.commented_by_name", label: "Evaluador" },
          { key: "comentario_2.commented_by_position", label: "Cargo" },
          { key: "comentario_2.action", label: "Estado de Evaluación" },
          { key: "comentario_2.rejection_reason", label: "Motivo de rechazo" },
          { key: "comentario_2.comment", label: "Comentario" },
          { key: "comentario_2.interaction_date", label: "Fecha de evalución" },
        ],
      ],
    },
  ],
};
