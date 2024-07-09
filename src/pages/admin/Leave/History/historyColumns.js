const historyColumns = {
  pendientes: [
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
  aprobados: [
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
          { key: "comentario_1.comment", label: "Comentario" },
          { key: "comentario_1.interaction_date", label: "Fecha de evalución" },
        ],
        [
          { key: "comentario_2.commented_by_name", label: "Evaluador" },
          { key: "comentario_2.commented_by_position", label: "Cargo" },
          { key: "comentario_2.action", label: "Estado de Evaluación" },
          { key: "comentario_2.comment", label: "Comentario" },
          { key: "comentario_2.interaction_date", label: "Fecha de evalución" },
        ],
      ],
    },
  ],
  rechazados: [
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
  historial: [
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

export default historyColumns;