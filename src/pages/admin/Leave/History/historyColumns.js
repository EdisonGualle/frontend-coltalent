import { renderRequestedPeriod } from "../Authorization/Table/requestedPeriod";

export const historyColumns = {
  pendientes: [
    { id: "created_at", label: "Fecha de solicitud", },
    { id: "leave_type.name", label: "Tipo de permiso" },
    {
      id: "requested_period",
      label: "Fecha Solicitada",
      render: renderRequestedPeriod, 
    },
    // { id: "duration", label: "Duración"},
    { id: "state.name", label: "Estado" },
  ],
  aprobados: [
    { id: "created_at", label: "Fecha de solicitud",  },
    { id: "leave_type.name", label: "Tipo de permiso" },
    {
      id: "requested_period",
      label: "Fecha Solicitada",
      render: renderRequestedPeriod, 
    },
    // { id: "duration", label: "Duración"},
    { id: "state.name", label: "Estado" },
  ],
  rechazados: [
    { id: "created_at", label: "Fecha de solicitud",  },
    { id: "leave_type.name", label: "Tipo de permiso" },
    {
      id: "requested_period",
      label: "Fecha Solicitada",
      render: renderRequestedPeriod, 
    },
    // { id: "duration", label: "Duración"},
    { id: "state.name", label: "Estado" },
  ],
  historial: [
    { id: "created_at", label: "Fecha de solicitud",  },
    { id: "leave_type.name", label: "Tipo de permiso" },
    {
      id: "requested_period",
      label: "Fecha Solicitada",
      render: renderRequestedPeriod, 
    },
    // { id: "duration", label: "Duración"},
    { id: "state.name", label: "Estado" },
  ],
};

export const commonFilters = [
  { column: "leave_type.name", label: "Tipo de Permiso" },
];

export const historyFilters = {
  pendientes: [...commonFilters],
  aprobados: [...commonFilters],
  rechazados: [...commonFilters],
  historial: [...commonFilters],
};
