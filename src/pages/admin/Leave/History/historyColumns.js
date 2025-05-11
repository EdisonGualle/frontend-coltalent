import { renderRequestedPeriod } from "../Authorization/Table/requestedPeriod";

export const historyColumns = {
  pendientes: [
    { id: "created_at", label: "Fecha de solicitud", exportable: true,},
    { id: "leave_type.name", label: "Tipo de permiso", exportable: true,},
    {
      id: "requested_period",
      label: "Fecha Solicitada",
      render: renderRequestedPeriod, 
      exportable: true,
    },
    // { id: "duration", label: "Duración"},
    { id: "state.name", label: "Estado", exportable: true, },
  ],
  aprobados: [
    { id: "created_at", label: "Fecha de solicitud", exportable: true, },
    { id: "leave_type.name", label: "Tipo de permiso", exportable: true, },
    {
      id: "requested_period",
      label: "Fecha Solicitada",
      render: renderRequestedPeriod,
      exportable: true,
    },
    // { id: "duration", label: "Duración"},
    { id: "state.name", label: "Estado", exportable: true, },
  ],
  rechazados: [
    { id: "created_at", label: "Fecha de solicitud",exportable: true,  },
    { id: "leave_type.name", label: "Tipo de permiso", exportable: true, },
    {
      id: "requested_period",
      label: "Fecha Solicitada",
      render: renderRequestedPeriod, 
      exportable: true,
    },
    // { id: "duration", label: "Duración"},
    { id: "state.name", label: "Estado", exportable: true, },
  ],
  historial: [
    { id: "created_at", label: "Fecha de solicitud", exportable: true, },
    { id: "leave_type.name", label: "Tipo de permiso", exportable: true, },
    {
      id: "requested_period",
      label: "Fecha Solicitada",
      render: renderRequestedPeriod, 
      exportable: true,
    },
    // { id: "duration", label: "Duración"},
    { id: "state.name", label: "Estado", exportable: true, },
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
